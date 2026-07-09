import { assignRoleToUser } from "../repositories/roleRepository.js";
import {
  createUser,
  findUserByEmail,
  findUserById,
  findUserByResetToken,
  findUserByVerificationToken,
  setPasswordReset,
  updatePassword,
  updateUserVerification,
} from "../repositories/userRepository.js";
import {
  createRefreshToken,
  findActiveRefreshToken,
  revokeRefreshToken,
} from "../repositories/tokenRepository.js";
import { notifyAnalyticsDashboardChanged } from "./analyticsService.js";
import { frontendUrl, isEmailConfigured, sendEmail } from "./emailService.js";
import { AppError } from "../utils/AppError.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import {
  hashToken,
  randomToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/tokens.js";

function roles(user) {
  return user.roles?.map((entry) => entry.role.name) ?? [];
}

function permissions(user) {
  return [
    ...new Set(
      user.roles?.flatMap((entry) =>
        entry.role.permissions.map((permissionEntry) => permissionEntry.permission.name),
      ) ?? [],
    ),
  ];
}

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
    active: user.active,
    status: user.status,
    roles: roles(user),
    permissions: permissions(user),
  };
}

async function tokenPair(user) {
  const payload = {
    sub: user.id,
    email: user.email,
    roles: roles(user),
    permissions: permissions(user),
  };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken({ sub: user.id });
  const decoded = verifyRefreshToken(refreshToken);

  await createRefreshToken({
    userId: user.id,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(decoded.exp * 1000),
  });

  return { accessToken, refreshToken };
}

export async function register(input) {
  const existing = await findUserByEmail(input.email);
  if (existing) throw new AppError("A user with this email already exists.", 409);

  const verificationToken = randomToken();
  const user = await createUser({
    email: input.email,
    username: input.username,
    password_hash: await hashPassword(input.password),
    role: "Customer",
    status: "PENDING_VERIFICATION",
    verification_token: verificationToken,
    cart: { create: {} },
  });

  await assignRoleToUser(user.id, "Customer");
  const fullUser = await findUserById(user.id);
  notifyAnalyticsDashboardChanged("user_registered", { userId: user.id }).catch(() => {});
  await sendEmail({
    to: fullUser.email,
    subject: "Welcome to Sunspot Electronic Online Shop",
    text: `Welcome ${fullUser.username}. Verify your email here: ${frontendUrl(`/account?verify=${verificationToken}`)}`,
    html: `<p>Welcome <strong>${fullUser.username}</strong>.</p><p>Verify your email here: <a href="${frontendUrl(`/account?verify=${verificationToken}`)}">Verify email</a></p>`,
  }).catch(() => {});

  return {
    user: publicUser(fullUser),
    ...(await tokenPair(fullUser)),
    ...(!isEmailConfigured() ? { emailVerificationToken: verificationToken } : {}),
  };
}

export async function login({ email, password }) {
  const user = await findUserByEmail(email);
  if (!user) throw new AppError("Invalid email or password.", 401);
  if (Number(user.active) !== 1 || user.status === "INACTIVE" || user.status === "SUSPENDED") {
    throw new AppError("This account is deactivated. Please contact an administrator.", 403);
  }

  const passwordHash = user.password_hash ?? user.password;
  const matches = user.password_hash
    ? await comparePassword(password, passwordHash)
    : password === passwordHash;

  if (!matches) throw new AppError("Invalid email or password.", 401);

  return { user: publicUser(user), ...(await tokenPair(user)) };
}

export async function logout(refreshToken) {
  if (!refreshToken) return { userId: null };
  const tokenHash = hashToken(refreshToken);
  const tokenRecord = await findActiveRefreshToken(tokenHash);
  await revokeRefreshToken(tokenHash);
  return { userId: tokenRecord?.user_id ?? null };
}

export async function refresh(refreshToken) {
  if (!refreshToken) throw new AppError("Refresh token is required.", 400);
  const decoded = verifyRefreshToken(refreshToken);
  const tokenRecord = await findActiveRefreshToken(hashToken(refreshToken));
  if (!tokenRecord) throw new AppError("Refresh token is invalid or expired.", 401);

  const user = await findUserById(decoded.sub);
  if (!user) throw new AppError("User was not found.", 401);

  await revokeRefreshToken(hashToken(refreshToken));
  return { user: publicUser(user), ...(await tokenPair(user)) };
}

export async function forgotPassword(email) {
  const user = await findUserByEmail(email);
  if (!user) return { message: "If the email exists, a reset link will be generated." };

  const token = randomToken();
  await setPasswordReset(user.id, token, new Date(Date.now() + 30 * 60 * 1000));
  await sendEmail({
    to: user.email,
    subject: "Reset your Sunspot password",
    text: `Reset your password here: ${frontendUrl(`/account?resetToken=${token}`)}`,
    html: `<p>Reset your password here: <a href="${frontendUrl(`/account?resetToken=${token}`)}">Reset password</a></p><p>This link expires in 30 minutes.</p>`,
  }).catch(() => {});
  return {
    message: isEmailConfigured()
      ? "If the email exists, a password reset link has been sent."
      : "Password reset token generated. SMTP is not configured, so the token is returned for local demo.",
    ...(!isEmailConfigured() ? { resetToken: token } : {}),
  };
}

export async function resetPassword({ token, password }) {
  const user = await findUserByResetToken(token);
  if (!user) throw new AppError("Reset token is invalid or expired.", 400);
  await updatePassword(user.id, await hashPassword(password));
  return { message: "Password reset successfully." };
}

export async function verifyEmail(token) {
  const user = await findUserByVerificationToken(token);
  if (!user) throw new AppError("Verification token is invalid.", 400);
  await updateUserVerification(user.id);
  return { message: "Email verified successfully." };
}

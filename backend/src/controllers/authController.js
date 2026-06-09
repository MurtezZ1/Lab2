import {
  forgotPassword,
  login,
  logout,
  refresh,
  register,
  resetPassword,
  verifyEmail,
} from "../services/authService.js";
import {
  AUDIT_ACTIONS,
  AUDIT_ENTITIES,
  recordAuditLogSafe,
} from "../services/auditLogService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getAuditRequestContext } from "../utils/auditContext.js";

export const registerController = asyncHandler(async (req, res) => {
  const data = await register(req.body);
  await recordAuditLogSafe({
    userId: data.user.id,
    action: AUDIT_ACTIONS.REGISTER,
    entity: AUDIT_ENTITIES.USER,
    entityId: data.user.id,
    newValue: data.user,
    ...getAuditRequestContext(req),
  });
  res.status(201).json({ success: true, data });
});

export const loginController = asyncHandler(async (req, res) => {
  const data = await login(req.body);
  await recordAuditLogSafe({
    userId: data.user.id,
    action: AUDIT_ACTIONS.LOGIN,
    entity: AUDIT_ENTITIES.AUTH,
    entityId: data.user.id,
    metadata: { email: data.user.email },
    ...getAuditRequestContext(req),
  });
  res.json({ success: true, data });
});

export const logoutController = asyncHandler(async (req, res) => {
  const result = await logout(req.body.refreshToken);
  await recordAuditLogSafe({
    userId: result.userId,
    action: AUDIT_ACTIONS.LOGOUT,
    entity: AUDIT_ENTITIES.AUTH,
    entityId: result.userId,
    ...getAuditRequestContext(req),
  });
  res.json({ success: true, message: "Logged out successfully." });
});

export const refreshController = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await refresh(req.body.refreshToken) });
});

export const forgotPasswordController = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await forgotPassword(req.body.email) });
});

export const resetPasswordController = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await resetPassword(req.body) });
});

export const verifyEmailController = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await verifyEmail(req.body.token) });
});

export const meController = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { user: req.user } });
});

import { findUserById } from "../repositories/userRepository.js";
import { AppError } from "../utils/AppError.js";
import { verifyAccessToken } from "../utils/tokens.js";

export async function authenticate(req, _res, next) {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) throw new AppError("Authentication token is required.", 401);

    const decoded = verifyAccessToken(token);
    const user = await findUserById(decoded.sub);
    if (!user) throw new AppError("Authenticated user was not found.", 401);

    req.user = {
      id: user.id,
      email: user.email,
      roles: decoded.roles ?? [],
      permissions: decoded.permissions ?? [],
    };

    next();
  } catch (error) {
    next(error instanceof AppError ? error : new AppError("Invalid authentication token.", 401));
  }
}

export async function optionalAuthenticate(req, _res, next) {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return next();

    const decoded = verifyAccessToken(token);
    const user = await findUserById(decoded.sub);
    if (user) {
      req.user = {
        id: user.id,
        email: user.email,
        roles: decoded.roles ?? [],
        permissions: decoded.permissions ?? [],
      };
    }
    next();
  } catch (_error) {
    next();
  }
}

export const authorizeRoles = (...roles) => (req, _res, next) => {
  const allowed = req.user?.roles?.some((role) => roles.includes(role));
  if (!allowed) return next(new AppError("Required role is missing.", 403));
  next();
};

export const authorizePermissions = (...permissions) => (req, _res, next) => {
  const allowed = req.user?.permissions?.some((permission) => permissions.includes(permission));
  if (!allowed) return next(new AppError("Required permission is missing.", 403));
  next();
};

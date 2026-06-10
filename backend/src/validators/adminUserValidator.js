import { AppError } from "../utils/AppError.js";

const allowedRoles = ["Admin", "Manager", "Customer"];

export function validateRoleUpdate(input = {}) {
  if (!allowedRoles.includes(input.role)) {
    throw new AppError("Role must be Admin, Manager, or Customer.", 400);
  }
}

export function validateStatusUpdate(input = {}) {
  if (typeof input.is_active !== "boolean") {
    throw new AppError("is_active must be true or false.", 400);
  }
}

export function validatePermissionUpdate(input = {}) {
  if (!input.permissionId || typeof input.permissionId !== "string") {
    throw new AppError("permissionId is required.", 400);
  }
}

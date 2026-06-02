import {
  forgotPassword,
  login,
  logout,
  refresh,
  register,
  resetPassword,
  verifyEmail,
} from "../services/authService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const registerController = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await register(req.body) });
});

export const loginController = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await login(req.body) });
});

export const logoutController = asyncHandler(async (req, res) => {
  await logout(req.body.refreshToken);
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

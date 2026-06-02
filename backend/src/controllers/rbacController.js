import { asyncHandler } from "../utils/asyncHandler.js";

export const adminCheckController = asyncHandler(async (_req, res) => {
  res.json({ success: true, message: "Admin role access confirmed." });
});

export const reportsCheckController = asyncHandler(async (_req, res) => {
  res.json({ success: true, message: "View Reports permission access confirmed." });
});

import { getLaunchReadiness } from "../services/launchReadinessService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getLaunchReadinessController = asyncHandler(async (_req, res) => {
  res.json({ success: true, data: await getLaunchReadiness() });
});

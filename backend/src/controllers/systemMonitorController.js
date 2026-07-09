import { getSystemMonitor } from "../services/systemMonitorService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getSystemMonitorController = asyncHandler(async (_req, res) => {
  res.json({ success: true, data: await getSystemMonitor() });
});

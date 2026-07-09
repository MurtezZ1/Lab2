import { seedDemoData } from "../services/demoDataService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const seedDemoDataController = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await seedDemoData(req.user.id) });
});

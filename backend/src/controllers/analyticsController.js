import {
  exportAnalyticsDashboard,
  getAnalyticsDashboard,
} from "../services/analyticsService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAnalyticsDashboardController = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await getAnalyticsDashboard(req.query) });
});

export const exportAnalyticsDashboardController = asyncHandler(async (req, res) => {
  const exported = await exportAnalyticsDashboard(req.query, req.params.format);
  res.setHeader("Content-Type", exported.contentType);
  res.setHeader("Content-Disposition", `attachment; filename=${exported.filename}`);
  res.send(exported.body);
});

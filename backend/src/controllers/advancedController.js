import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";
import { stringify } from "csv-stringify/sync";
import { asyncHandler } from "../utils/asyncHandler.js";
import { advancedSearch } from "../services/searchService.js";
import { getCmsContent, updateCmsContent } from "../services/cmsService.js";
import { getDashboardStats, getReports } from "../services/reportService.js";
import {
  AUDIT_ACTIONS,
  AUDIT_ENTITIES,
  recordAuditLogSafe,
} from "../services/auditLogService.js";
import {
  getFrequentlyBoughtTogether,
  getPersonalizedRecommendations,
  getSimilarProducts,
  trackProductView,
} from "../services/recommendationService.js";
import { emitDashboardUpdate, emitNotification, emitOrderUpdate } from "../config/socket.js";
import { getAuditRequestContext } from "../utils/auditContext.js";

export const searchController = asyncHandler(async (req, res) => {
  const results = await advancedSearch({ ...req.query, userId: req.user?.id ?? null });
  res.json({ success: true, data: results });
});

export const recommendationsController = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  res.json({
    success: true,
    data: {
      similarProducts: await getSimilarProducts(productId),
      frequentlyBoughtTogether: await getFrequentlyBoughtTogether(productId),
      personalized: await getPersonalizedRecommendations(req.user?.id ?? null),
    },
  });
});

export const trackProductViewController = asyncHandler(async (req, res) => {
  trackProductView({ userId: req.user?.id ?? "guest", ...req.body });
  res.json({ success: true });
});

export const reportsController = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await getReports(req.query) });
});

export const dashboardController = asyncHandler(async (_req, res) => {
  const stats = await getDashboardStats();
  emitDashboardUpdate(stats);
  res.json({ success: true, data: stats });
});

export const exportReportController = asyncHandler(async (req, res) => {
  const reports = await getReports(req.query);
  const format = req.params.format;
  const rows = Object.entries(reports).map(([name, value]) => ({ name, value: JSON.stringify(value) }));
  await recordAuditLogSafe({
    userId: req.user?.id ?? null,
    action: AUDIT_ACTIONS.REPORT_EXPORT,
    entity: AUDIT_ENTITIES.REPORT,
    entityId: format,
    metadata: { format, filters: req.query },
    ...getAuditRequestContext(req),
  });

  if (format === "csv") {
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=sunspot-report.csv");
    return res.send(stringify(rows, { header: true }));
  }

  if (format === "excel") {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Reports");
    sheet.columns = [{ header: "Report", key: "name" }, { header: "Value", key: "value" }];
    sheet.addRows(rows);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=sunspot-report.xlsx");
    await workbook.xlsx.write(res);
    return res.end();
  }

  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=sunspot-report.pdf");
  doc.pipe(res);
  doc.fontSize(18).text("Sunspot Reports");
  rows.forEach((row) => doc.moveDown().fontSize(12).text(`${row.name}: ${row.value}`));
  doc.end();
});

export const getCmsController = asyncHandler(async (_req, res) => {
  res.json({ success: true, data: await getCmsContent() });
});

export const updateCmsController = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: await updateCmsContent(req.body, req.user?.id ?? null, getAuditRequestContext(req)),
  });
});

export const uploadController = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { filename: req.file?.filename, path: req.file?.path } });
});

export const emitTestNotificationController = asyncHandler(async (req, res) => {
  emitNotification(req.body);
  res.json({ success: true });
});

export const emitTestOrderController = asyncHandler(async (req, res) => {
  emitOrderUpdate(req.body);
  res.json({ success: true });
});

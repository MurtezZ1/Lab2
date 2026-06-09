import {
  AUDIT_ACTIONS,
  AUDIT_ENTITIES,
  exportAuditLogs,
  getAuditLogs,
  recordAuditLogSafe,
} from "../services/auditLogService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getAuditRequestContext } from "../utils/auditContext.js";

export const listAuditLogsController = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await getAuditLogs(req.query) });
});

export const exportAuditLogsController = asyncHandler(async (req, res) => {
  const exported = await exportAuditLogs(req.query, req.params.format);
  await recordAuditLogSafe({
    userId: req.user.id,
    action: AUDIT_ACTIONS.REPORT_EXPORT,
    entity: AUDIT_ENTITIES.AUDIT_LOG,
    entityId: "audit-logs",
    metadata: { format: req.params.format, filters: req.query },
    ...getAuditRequestContext(req),
  });

  res.setHeader("Content-Type", exported.contentType);
  res.setHeader("Content-Disposition", `attachment; filename=${exported.filename}`);
  res.send(exported.body);
});

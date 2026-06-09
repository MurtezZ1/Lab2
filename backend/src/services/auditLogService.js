import ExcelJS from "exceljs";
import { stringify } from "csv-stringify/sync";
import {
  createAuditLog,
  findAuditLogs,
  findAuditLogsForExport,
} from "../repositories/auditLogRepository.js";
import { AppError } from "../utils/AppError.js";

export const AUDIT_ACTIONS = {
  LOGIN: "Login",
  LOGOUT: "Logout",
  REGISTER: "Register",
  PRODUCT_CREATE: "Product Create",
  PRODUCT_UPDATE: "Product Update",
  PRODUCT_DELETE: "Product Delete",
  ORDER_CREATE: "Order Create",
  ORDER_STATUS_CHANGE: "Order Status Change",
  USER_ROLE_CHANGE: "User Role Change",
  CMS_UPDATE: "CMS Update",
  REPORT_EXPORT: "Report Export",
};

export const AUDIT_ENTITIES = {
  AUTH: "Auth",
  USER: "User",
  PRODUCT: "Product",
  ORDER: "Order",
  CMS: "CMS",
  REPORT: "Report",
  AUDIT_LOG: "AuditLog",
};

const OLD_VALUE_KEYS = ["oldValue", "old_value", "previous", "before"];
const NEW_VALUE_KEYS = ["newValue", "new_value", "current", "after"];
const EXPORT_LIMIT = 5000;

export async function recordAuditLog(entry) {
  if (!entry.action) throw new AppError("Audit log action is required.", 400);
  if (!entry.entity) throw new AppError("Audit log entity is required.", 400);

  const metadata = buildMetadata(entry);
  return serializeAuditLog(
    await createAuditLog({
      userId: entry.userId,
      action: entry.action,
      entity: entry.entity,
      entityId: entry.entityId,
      ipAddress: entry.ipAddress,
      userAgent: entry.userAgent,
      ...(metadata !== undefined ? { metadata } : {}),
    }),
  );
}

export async function recordAuditLogSafe(entry) {
  try {
    return await recordAuditLog(entry);
  } catch (error) {
    console.error("Audit log write failed:", error);
    return null;
  }
}

export async function getAuditLogs(query = {}) {
  const page = Math.max(Number(query.page ?? 1), 1);
  const pageSize = Math.min(Math.max(Number(query.pageSize ?? 20), 1), 100);
  const sortOrder = normalizeSortOrder(query.sortOrder ?? query.order);
  const where = buildAuditWhere(query);
  const result = await findAuditLogs({ where, page, pageSize, sortOrder });

  return {
    ...result,
    items: result.items.map(serializeAuditLog),
    pageCount: Math.max(1, Math.ceil(result.total / result.pageSize)),
    actions: Object.values(AUDIT_ACTIONS),
    entities: Object.values(AUDIT_ENTITIES),
  };
}

export async function exportAuditLogs(query = {}, format = "csv") {
  if (!["csv", "excel"].includes(format)) {
    throw new AppError("Audit logs can only be exported as csv or excel.", 400);
  }

  const logs = await findAuditLogsForExport({
    where: buildAuditWhere(query),
    sortOrder: normalizeSortOrder(query.sortOrder ?? query.order),
    limit: EXPORT_LIMIT,
  });
  const rows = logs.map(serializeAuditLog).map(toExportRow);

  if (format === "csv") {
    return {
      body: stringify(rows, { header: true }),
      contentType: "text/csv",
      filename: "audit-logs.csv",
    };
  }

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Sunspot";
  const sheet = workbook.addWorksheet("Audit Logs");
  sheet.columns = [
    { header: "User", key: "user", width: 32 },
    { header: "Action", key: "action", width: 24 },
    { header: "Entity", key: "entity", width: 18 },
    { header: "Entity ID", key: "entityId", width: 28 },
    { header: "Old Value", key: "oldValue", width: 42 },
    { header: "New Value", key: "newValue", width: 42 },
    { header: "IP Address", key: "ipAddress", width: 22 },
    { header: "Timestamp", key: "timestamp", width: 26 },
  ];
  sheet.addRows(rows);
  sheet.getRow(1).font = { bold: true };

  return {
    body: await workbook.xlsx.writeBuffer(),
    contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    filename: "audit-logs.xlsx",
  };
}

function buildAuditWhere(query) {
  const and = [];
  const user = readString(query.user);
  const userId = readString(query.userId);
  const action = readString(query.action);
  const entity = readString(query.entity);
  const search = readString(query.search);
  const dateFrom = parseDate(query.dateFrom);
  const dateTo = parseDate(query.dateTo, true);

  if (userId) and.push({ user_id: userId });
  if (user) {
    and.push({
      OR: [
        { user_id: user },
        { user: { is: { email: { contains: user, mode: "insensitive" } } } },
        { user: { is: { username: { contains: user, mode: "insensitive" } } } },
      ],
    });
  }
  if (action) and.push({ action: { equals: action, mode: "insensitive" } });
  if (entity) and.push({ entity: { equals: entity, mode: "insensitive" } });
  if (dateFrom || dateTo) {
    and.push({
      created_at: {
        ...(dateFrom ? { gte: dateFrom } : {}),
        ...(dateTo ? { lte: dateTo } : {}),
      },
    });
  }
  if (search) {
    and.push({
      OR: [
        { action: { contains: search, mode: "insensitive" } },
        { entity: { contains: search, mode: "insensitive" } },
        { entity_id: { contains: search, mode: "insensitive" } },
        { ip_address: { contains: search, mode: "insensitive" } },
        { user_agent: { contains: search, mode: "insensitive" } },
        { user: { is: { email: { contains: search, mode: "insensitive" } } } },
        { user: { is: { username: { contains: search, mode: "insensitive" } } } },
      ],
    });
  }

  return and.length ? { AND: and } : {};
}

function serializeAuditLog(log) {
  const metadata = isRecord(log.metadata) ? log.metadata : {};
  return {
    id: log.id,
    user: log.user
      ? {
          id: log.user.id,
          email: log.user.email,
          username: log.user.username,
          role: log.user.role,
        }
      : null,
    userDisplay: log.user ? `${log.user.username} (${log.user.email})` : "System",
    action: log.action,
    entity: log.entity,
    entityId: log.entity_id,
    oldValue: pickMetadataValue(metadata, OLD_VALUE_KEYS),
    newValue: pickMetadataValue(metadata, NEW_VALUE_KEYS),
    ipAddress: log.ip_address,
    userAgent: log.user_agent,
    metadata,
    timestamp: log.created_at,
    createdAt: log.created_at,
  };
}

function toExportRow(log) {
  return {
    user: log.userDisplay,
    action: log.action,
    entity: log.entity,
    entityId: log.entityId ?? "",
    oldValue: stringifyCell(log.oldValue),
    newValue: stringifyCell(log.newValue),
    ipAddress: log.ipAddress ?? "",
    timestamp: log.timestamp instanceof Date ? log.timestamp.toISOString() : String(log.timestamp),
  };
}

function buildMetadata(entry) {
  const metadata = {
    ...(isRecord(entry.metadata) ? entry.metadata : {}),
    ...(entry.oldValue !== undefined ? { oldValue: entry.oldValue } : {}),
    ...(entry.newValue !== undefined ? { newValue: entry.newValue } : {}),
  };

  return Object.keys(metadata).length ? toJsonSafe(metadata) : undefined;
}

function pickMetadataValue(metadata, keys) {
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(metadata, key)) return metadata[key];
  }
  return null;
}

function parseDate(value, endOfDay = false) {
  const text = readString(value);
  if (!text) return null;
  const normalized = text.includes("T") ? text : `${text}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}`;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

function normalizeSortOrder(value) {
  return String(value ?? "desc").toLowerCase() === "asc" ? "asc" : "desc";
}

function readString(value) {
  return String(value ?? "").trim();
}

function stringifyCell(value) {
  if (value == null || value === "") return "";
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function toJsonSafe(value) {
  if (value === undefined) return undefined;
  try {
    return JSON.parse(
      JSON.stringify(value, (_key, nestedValue) =>
        typeof nestedValue === "bigint" ? nestedValue.toString() : nestedValue,
      ),
    );
  } catch (_error) {
    return String(value);
  }
}

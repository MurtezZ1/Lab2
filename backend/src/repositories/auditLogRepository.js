import { prisma } from "../config/prisma.js";

const includeUser = {
  user: {
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
    },
  },
};

export function createAuditLog(data) {
  return prisma.auditLog.create({
    data: {
      user_id: data.userId ?? null,
      action: data.action,
      entity: data.entity,
      entity_id: data.entityId ?? null,
      ip_address: data.ipAddress ?? null,
      user_agent: data.userAgent ?? null,
      ...(data.metadata !== undefined ? { metadata: data.metadata } : {}),
      created_by: data.userId ?? null,
      updated_by: data.userId ?? null,
    },
    include: includeUser,
  });
}

export async function findAuditLogs({ where, page, pageSize, sortOrder }) {
  const [items, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: includeUser,
      orderBy: { created_at: sortOrder },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return { items, total, page, pageSize };
}

export function findAuditLogsForExport({ where, sortOrder, limit }) {
  return prisma.auditLog.findMany({
    where,
    include: includeUser,
    orderBy: { created_at: sortOrder },
    take: limit,
  });
}

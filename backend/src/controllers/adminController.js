import { prisma } from "../config/prisma.js";
import {
  AUDIT_ACTIONS,
  AUDIT_ENTITIES,
  recordAuditLogSafe,
} from "../services/auditLogService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getAuditRequestContext } from "../utils/auditContext.js";

export const listUsersController = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page ?? 1), 1);
  const pageSize = Math.min(Math.max(Number(req.query.pageSize ?? 20), 1), 100);
  const search = String(req.query.search ?? "").trim();
  const where = search
    ? {
        OR: [
          { email: { contains: search, mode: "insensitive" } },
          { username: { contains: search, mode: "insensitive" } },
          { role: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};
  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: { id: true, email: true, username: true, role: true, active: true, status: true, created_at: true },
      orderBy: { created_at: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.user.count({ where }),
  ]);
  res.json({ success: true, data: { items, total, page, pageSize } });
});

export const updateUserController = asyncHandler(async (req, res) => {
  const previousUser = await prisma.user.findUnique({
    where: { id: req.params.id },
    select: { id: true, email: true, username: true, role: true },
  });
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: {
      ...(req.body.role ? { role: req.body.role } : {}),
      ...(req.body.status ? { status: req.body.status } : {}),
      ...(req.body.active != null ? { active: Number(req.body.active) } : {}),
      updated_by: req.user.id,
    },
    select: { id: true, email: true, username: true, role: true, active: true, status: true },
  });

  if (previousUser && req.body.role && previousUser.role !== user.role) {
    await recordAuditLogSafe({
      userId: req.user.id,
      action: AUDIT_ACTIONS.USER_ROLE_CHANGE,
      entity: AUDIT_ENTITIES.USER,
      entityId: user.id,
      oldValue: { role: previousUser.role },
      newValue: { role: user.role },
      metadata: { targetUser: { id: user.id, email: user.email, username: user.username } },
      ...getAuditRequestContext(req),
    });
  }

  res.json({ success: true, data: user });
});

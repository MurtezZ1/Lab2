import { prisma } from "../config/prisma.js";

const userSelect = {
  id: true,
  email: true,
  username: true,
  role: true,
  active: true,
  status: true,
  created_at: true,
  updated_at: true,
  roles: { include: { role: true } },
};

export async function listAdminUsers({ search = "", role = "", status = "", page = 1, pageSize = 20 }) {
  const where = {
    ...(search
      ? {
          OR: [
            { email: { contains: search, mode: "insensitive" } },
            { username: { contains: search, mode: "insensitive" } },
            { role: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(role ? { role } : {}),
    ...(status === "active" ? { active: 1 } : {}),
    ...(status === "inactive" ? { active: 0 } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: userSelect,
      orderBy: { created_at: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.user.count({ where }),
  ]);

  return { items, total, page, pageSize };
}

export function findAdminUserById(id) {
  return prisma.user.findUnique({ where: { id }, select: userSelect });
}

export function countActiveAdmins() {
  return prisma.user.count({ where: { role: "Admin", active: 1 } });
}

export function findRole(name) {
  return prisma.role.findUnique({ where: { name } });
}

export async function setUserRole({ userId, roleName, actorId }) {
  const role = await findRole(roleName);
  if (!role) return null;

  await prisma.userRole.deleteMany({ where: { user_id: userId } });
  await prisma.userRole.create({
    data: {
      user_id: userId,
      role_id: role.id,
      created_by: actorId,
      updated_by: actorId,
    },
  });

  return prisma.user.update({
    where: { id: userId },
    data: { role: roleName, updated_by: actorId },
    select: userSelect,
  });
}

export function setUserStatus({ userId, isActive, actorId }) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      active: isActive ? 1 : 0,
      status: isActive ? "ACTIVE" : "INACTIVE",
      updated_by: actorId,
    },
    select: userSelect,
  });
}

export function softDeleteUser({ userId, actorId }) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      active: 0,
      status: "SUSPENDED",
      updated_by: actorId,
    },
    select: userSelect,
  });
}

export function listRolesWithPermissions() {
  return prisma.role.findMany({
    include: {
      permissions: { include: { permission: true }, orderBy: { created_at: "asc" } },
      _count: { select: { users: true } },
    },
    orderBy: { name: "asc" },
  });
}

export function listPermissions() {
  return prisma.permission.findMany({ orderBy: { name: "asc" } });
}

export async function assignPermissionToRole({ roleId, permissionId, actorId }) {
  return prisma.rolePermission.upsert({
    where: { role_id_permission_id: { role_id: roleId, permission_id: permissionId } },
    update: { updated_by: actorId },
    create: { role_id: roleId, permission_id: permissionId, created_by: actorId, updated_by: actorId },
    include: { role: true, permission: true },
  });
}

export async function removePermissionFromRole({ roleId, permissionId }) {
  return prisma.rolePermission.delete({
    where: { role_id_permission_id: { role_id: roleId, permission_id: permissionId } },
    include: { role: true, permission: true },
  });
}

import { prisma } from "../config/prisma.js";

export const findRoleByName = (name) => prisma.role.findUnique({ where: { name } });

export async function assignRoleToUser(userId, roleName) {
  const role = await findRoleByName(roleName);
  if (!role) return null;

  return prisma.userRole.upsert({
    where: { user_id_role_id: { user_id: userId, role_id: role.id } },
    update: {},
    create: { user_id: userId, role_id: role.id, created_by: userId },
  });
}

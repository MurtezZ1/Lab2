import { prisma } from "../config/prisma.js";

const includeRoles = {
  roles: {
    include: {
      role: {
        include: {
          permissions: {
            include: { permission: true },
          },
        },
      },
    },
  },
};

export const findUserByEmail = (email) =>
  prisma.user.findUnique({ where: { email }, include: includeRoles });

export const findUserById = (id) => prisma.user.findUnique({ where: { id }, include: includeRoles });

export const createUser = (data) => prisma.user.create({ data, include: includeRoles });

export const updateUserVerification = (id) =>
  prisma.user.update({
    where: { id },
    data: { status: "ACTIVE", email_verified_at: new Date(), verification_token: null, active: 1 },
  });

export const setPasswordReset = (id, token, expires) =>
  prisma.user.update({
    where: { id },
    data: { password_reset_token: token, password_reset_expires: expires },
  });

export const findUserByResetToken = (token) =>
  prisma.user.findFirst({
    where: { password_reset_token: token, password_reset_expires: { gt: new Date() } },
  });

export const findUserByVerificationToken = (token) =>
  prisma.user.findFirst({ where: { verification_token: token } });

export const updatePassword = (id, passwordHash) =>
  prisma.user.update({
    where: { id },
    data: { password_hash: passwordHash, password: null, password_reset_token: null, password_reset_expires: null },
  });

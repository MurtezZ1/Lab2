import { prisma } from "../config/prisma.js";

export const createRefreshToken = ({ userId, tokenHash, expiresAt }) =>
  prisma.refreshToken.create({
    data: { user_id: userId, token_hash: tokenHash, expires_at: expiresAt },
  });

export const findActiveRefreshToken = (tokenHash) =>
  prisma.refreshToken.findFirst({
    where: { token_hash: tokenHash, revoked_at: null, expires_at: { gt: new Date() } },
  });

export const revokeRefreshToken = (tokenHash) =>
  prisma.refreshToken.updateMany({
    where: { token_hash: tokenHash, revoked_at: null },
    data: { revoked_at: new Date() },
  });

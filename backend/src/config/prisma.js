import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
});

export const connectDatabase = () => prisma.$connect();
export const disconnectDatabase = () => prisma.$disconnect();

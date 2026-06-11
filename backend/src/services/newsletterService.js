import { prisma } from "../config/prisma.js";

export async function subscribeToNewsletter(email) {
  const normalizedEmail = String(email ?? "").trim().toLowerCase();

  return prisma.newsletterSubscription.upsert({
    where: { email: normalizedEmail },
    update: { is_active: true },
    create: { email: normalizedEmail },
  });
}

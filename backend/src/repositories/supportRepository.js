import { prisma } from "../config/prisma.js";

const include = {
  user: { select: { id: true, username: true, email: true } },
  messages: {
    include: { user: { select: { id: true, username: true, email: true } } },
    orderBy: { created_at: "asc" },
  },
};

export async function createTicket(userId, data) {
  return prisma.supportTicket.create({
    data: {
      user_id: userId,
      subject: data.subject,
      priority: data.priority ?? "normal",
      created_by: userId,
      updated_by: userId,
      messages: data.message
        ? { create: { user_id: userId, message: data.message, created_by: userId, updated_by: userId } }
        : undefined,
    },
    include,
  });
}

export async function listTickets(userId, isAdmin = false) {
  return prisma.supportTicket.findMany({
    where: isAdmin ? {} : { user_id: userId },
    include,
    orderBy: { created_at: "desc" },
  });
}

export async function findTicket(id, userId, isAdmin = false) {
  return prisma.supportTicket.findFirst({
    where: { id, ...(isAdmin ? {} : { user_id: userId }) },
    include,
  });
}

export async function updateTicketStatus(id, status, userId) {
  return prisma.supportTicket.update({
    where: { id },
    data: { status, updated_by: userId },
    include,
  });
}

export async function addTicketMessage(id, userId, message) {
  return prisma.ticketMessage.create({
    data: { ticket_id: id, user_id: userId, message, created_by: userId, updated_by: userId },
    include: { user: { select: { id: true, username: true, email: true } } },
  });
}

import {
  addTicketMessage,
  createTicket,
  findTicket,
  listTickets,
  updateTicketStatus,
} from "../repositories/supportRepository.js";
import { AppError } from "../utils/AppError.js";

export async function submitTicket(userId, data) {
  if (!data.subject) throw new AppError("Ticket subject is required.", 400);
  return createTicket(userId, data);
}

export function getTickets(userId, isAdmin = false) {
  return listTickets(userId, isAdmin);
}

export async function getTicket(id, userId, isAdmin = false) {
  const ticket = await findTicket(id, userId, isAdmin);
  if (!ticket) throw new AppError("Support ticket not found.", 404);
  return ticket;
}

export function changeTicketStatus(id, status, userId) {
  return updateTicketStatus(id, status, userId);
}

export async function replyToTicket(id, userId, message) {
  if (!message) throw new AppError("Ticket message is required.", 400);
  return addTicketMessage(id, userId, message);
}

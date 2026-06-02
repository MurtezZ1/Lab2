import {
  changeTicketStatus,
  getTicket,
  getTickets,
  replyToTicket,
  submitTicket,
} from "../services/supportService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const isAdmin = (req) => req.user?.roles?.some((role) => ["Admin", "Manager"].includes(role));

export const createTicketController = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await submitTicket(req.user.id, req.body) });
});

export const listTicketsController = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await getTickets(req.user.id, isAdmin(req)) });
});

export const getTicketController = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await getTicket(req.params.id, req.user.id, isAdmin(req)) });
});

export const updateTicketStatusController = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await changeTicketStatus(req.params.id, req.body.status, req.user.id) });
});

export const addTicketMessageController = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await replyToTicket(req.params.id, req.user.id, req.body.message) });
});

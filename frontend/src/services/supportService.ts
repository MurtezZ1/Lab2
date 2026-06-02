import type { SupportTicket } from "@/types";
import { apiClient } from "@/services/apiClient";

export async function getSupportTickets() {
  const { data } = await apiClient.get("/support-tickets");
  return data.data.map((ticket: Record<string, unknown>) => ({
    id: String(ticket.id),
    subject: String(ticket.subject),
    status: ticket.status as SupportTicket["status"],
    createdAt: String(ticket.created_at ?? ticket.createdAt),
    messages: ticket.messages as SupportTicket["messages"],
  })) as SupportTicket[];
}

export async function createSupportTicket(input: { subject: string; message?: string }) {
  const { data } = await apiClient.post("/support-tickets", input);
  const ticket = data.data;
  return {
    id: String(ticket.id),
    subject: String(ticket.subject),
    status: ticket.status,
    createdAt: String(ticket.created_at),
    messages: ticket.messages,
  } as SupportTicket;
}

export async function addSupportTicketMessage(id: string, message: string) {
  const { data } = await apiClient.post(`/support-tickets/${id}/messages`, { message });
  return data.data;
}

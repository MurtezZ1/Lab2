import { apiClient } from "@/services/apiClient";

export type Invoice = {
  id: string;
  invoiceNumber: string;
  orderId: string;
  userId: string;
  orderNumber?: string;
  customerEmail?: string;
  paymentStatus: string;
  orderStatus?: string;
  total: number;
  pdfUrl?: string;
  generatedAt: string;
  createdAt: string;
};

export type InvoiceListResult = {
  items: Invoice[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

export type InvoiceQuery = {
  search?: string;
  paymentStatus?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
};

export async function listInvoices(query: InvoiceQuery = {}) {
  const { data } = await apiClient.get("/invoices", { params: cleanParams(query) });
  return data.data as InvoiceListResult;
}

export async function getInvoice(orderId: string) {
  const { data } = await apiClient.get(`/invoices/${orderId}`);
  return data.data as Invoice;
}

export async function generateInvoice(orderId: string) {
  const { data } = await apiClient.post(`/invoices/generate/${orderId}`);
  return data.data as Invoice;
}

export async function downloadInvoice(orderId: string, filename = "invoice.pdf") {
  const blob = await fetchInvoicePdf(orderId);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function viewInvoice(orderId: string) {
  const blob = await fetchInvoicePdf(orderId);
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener,noreferrer");
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

async function fetchInvoicePdf(orderId: string) {
  const response = await apiClient.get<Blob>(`/invoices/${orderId}/download`, {
    responseType: "blob",
  });
  return new Blob([response.data], { type: "application/pdf" });
}

function cleanParams(query: InvoiceQuery) {
  return Object.fromEntries(
    Object.entries(query).filter(([, value]) => value !== undefined && value !== null && value !== ""),
  );
}

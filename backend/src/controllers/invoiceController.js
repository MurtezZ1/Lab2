import {
  generateInvoice,
  getInvoice,
  getInvoicePdf,
  getInvoices,
} from "../services/invoiceService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listInvoicesController = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await getInvoices(req.query, req.user) });
});

export const getInvoiceController = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await getInvoice(req.params.orderId, req.user) });
});

export const generateInvoiceController = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await generateInvoice(req.params.orderId, req.user) });
});

export const downloadInvoiceController = asyncHandler(async (req, res) => {
  const { invoice, buffer } = await getInvoicePdf(req.params.orderId, req.user);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=${invoice.invoiceNumber}.pdf`);
  res.send(buffer);
});

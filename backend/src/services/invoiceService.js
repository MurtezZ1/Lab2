import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import { env } from "../config/env.js";
import {
  createInvoiceRecord,
  findInvoiceByOrderForUser,
  findInvoiceOrder,
  listInvoices,
  nextInvoiceSequence,
} from "../repositories/invoiceRepository.js";
import { AppError } from "../utils/AppError.js";

const isCompletedPayment = (payment) => payment?.status === "COMPLETED";

export function isAdminUser(user) {
  return user?.roles?.some((role) => ["Admin", "Manager", "admin", "manager"].includes(role));
}

export async function generateInvoice(orderId, user, { allowPending = false } = {}) {
  const admin = isAdminUser(user);
  const order = await findInvoiceOrder(orderId, user.id, admin);
  if (!order) throw new AppError("Order not found.", 404);

  const completedPayment = order.payments?.find(isCompletedPayment);
  if (!allowPending && order.status !== "PAID" && !completedPayment) {
    throw new AppError("Invoice can only be generated after successful payment.", 400);
  }

  if (order.invoices?.[0]) {
    const existing = await findInvoiceByOrderForUser(order.id, user.id, admin);
    if (existing) return serializeInvoice(existing);
  }

  const now = new Date();
  const sequence = await nextInvoiceSequence(now.getFullYear());
  const invoiceNumber = `INV-${now.getFullYear()}-${String(sequence).padStart(6, "0")}`;
  const invoice = await createInvoiceRecord(order, invoiceNumber, user.id);
  return serializeInvoice(invoice);
}

export async function getInvoice(orderId, user) {
  const invoice = await findInvoiceByOrderForUser(orderId, user.id, isAdminUser(user));
  if (!invoice) throw new AppError("Invoice not found.", 404);
  return serializeInvoice(invoice);
}

export async function getInvoicePdf(orderId, user) {
  let invoice = await findInvoiceByOrderForUser(orderId, user.id, isAdminUser(user));
  if (!invoice) {
    await generateInvoice(orderId, user);
    invoice = await findInvoiceByOrderForUser(orderId, user.id, isAdminUser(user));
  }
  if (!invoice) throw new AppError("Invoice not found.", 404);

  return {
    invoice: serializeInvoice(invoice),
    buffer: await renderInvoicePdf(invoice),
  };
}

export async function getInvoices(query, user) {
  const page = Math.max(Number(query.page ?? 1), 1);
  const pageSize = Math.min(Math.max(Number(query.pageSize ?? 20), 1), 100);
  const dateFrom = parseDate(query.dateFrom, false);
  const dateTo = parseDate(query.dateTo, true);
  const result = await listInvoices({
    isAdmin: isAdminUser(user),
    userId: user.id,
    search: String(query.search ?? ""),
    paymentStatus: query.paymentStatus ? String(query.paymentStatus) : "",
    dateFrom,
    dateTo,
    page,
    pageSize,
  });

  return {
    ...result,
    items: result.items.map(serializeInvoice),
  };
}

export async function renderInvoicePdf(invoice) {
  const doc = new PDFDocument({ size: "A4", margin: 42 });
  const chunks = [];
  doc.on("data", (chunk) => chunks.push(chunk));
  const done = new Promise((resolve) => doc.on("end", resolve));

  const order = invoice.order;
  const payment = order.payments?.find(isCompletedPayment) ?? order.payments?.[0];
  const customer = order.user;
  const address = order.address;
  const qrBuffer = await createQrBuffer(invoice);

  drawHeader(doc, invoice, order, payment);
  drawCustomerAndOrderInfo(doc, customer, address, order, payment);
  drawProductTable(doc, order);
  drawTotals(doc, order);
  drawFooter(doc, qrBuffer);

  doc.end();
  await done;
  return Buffer.concat(chunks);
}

function drawHeader(doc, invoice, order, payment) {
  doc
    .circle(60, 58, 18)
    .fill("#0A84FF")
    .fillColor("#ffffff")
    .fontSize(13)
    .font("Helvetica-Bold")
    .text("S", 55.5, 50);

  doc
    .fillColor("#111827")
    .fontSize(22)
    .font("Helvetica-Bold")
    .text("Sunspot", 88, 42)
    .fontSize(10)
    .font("Helvetica")
    .fillColor("#4b5563")
    .text("Electronic Online Shop", 88, 68);

  doc
    .fillColor("#111827")
    .fontSize(22)
    .font("Helvetica-Bold")
    .text("INVOICE", 420, 42, { align: "right" })
    .fontSize(10)
    .font("Helvetica")
    .fillColor("#4b5563")
    .text(`Invoice Number: ${invoice.invoice_number}`, 330, 72, { align: "right" })
    .text(`Order Number: ${order.order_number}`, 330, 88, { align: "right" })
    .text(`Invoice Date: ${formatDate(invoice.generated_at)}`, 330, 104, { align: "right" })
    .text(`Payment Status: ${payment?.status ?? "PENDING"}`, 330, 120, { align: "right" });

  doc.moveTo(42, 146).lineTo(553, 146).strokeColor("#e5e7eb").stroke();
}

function drawCustomerAndOrderInfo(doc, customer, address, order, payment) {
  sectionTitle(doc, "Customer Information", 42, 164);
  labelValue(doc, "Customer Name", customer?.username ?? address?.full_name ?? "Customer", 42, 188);
  labelValue(doc, "Email", customer?.email ?? "N/A", 42, 204);
  labelValue(doc, "Phone Number", address?.phone ?? "N/A", 42, 220);
  labelValue(doc, "Billing Address", formatAddress(address), 42, 236, 220);
  labelValue(doc, "Shipping Address", formatAddress(address), 42, 268, 220);

  sectionTitle(doc, "Order Information", 330, 164);
  labelValue(doc, "Order ID", order.id, 330, 188, 190);
  labelValue(doc, "Order Date", formatDate(order.created_at), 330, 204);
  labelValue(doc, "Order Status", order.status, 330, 220);
  labelValue(doc, "Payment Method", payment?.provider ?? "N/A", 330, 236);
}

function drawProductTable(doc, order) {
  const top = 326;
  const rows = order.items ?? [];
  const columns = [
    { label: "Product", x: 42, width: 210 },
    { label: "Qty", x: 270, width: 42 },
    { label: "Unit Price", x: 326, width: 72 },
    { label: "Discount", x: 412, width: 58 },
    { label: "Total", x: 486, width: 67 },
  ];

  doc.rect(42, top, 511, 24).fill("#0A84FF");
  doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(9);
  columns.forEach((column) => doc.text(column.label, column.x, top + 8, { width: column.width }));

  let y = top + 34;
  doc.font("Helvetica").fillColor("#111827");
  rows.forEach((item, index) => {
    const lineY = y + index * 28;
    const unitPrice = Number(item.unit_price ?? 0);
    const total = Number(item.total_price ?? unitPrice * item.quantity);
    doc.fillColor(index % 2 ? "#ffffff" : "#f9fafb").rect(42, lineY - 7, 511, 24).fill();
    doc.fillColor("#111827").fontSize(9);
    doc.text(item.product?.name ?? "Product", 42, lineY, { width: 210, ellipsis: true });
    doc.text(String(item.quantity), 270, lineY, { width: 42 });
    doc.text(formatCurrency(unitPrice), 326, lineY, { width: 72 });
    doc.text(formatCurrency(0), 412, lineY, { width: 58 });
    doc.text(formatCurrency(total), 486, lineY, { width: 67 });
  });

  doc.moveTo(42, y + rows.length * 28).lineTo(553, y + rows.length * 28).strokeColor("#e5e7eb").stroke();
}

function drawTotals(doc, order) {
  const startY = Math.max(440, 360 + (order.items?.length ?? 0) * 28);
  const rows = [
    ["Subtotal", order.subtotal],
    ["Discount", order.discount_total],
    ["Tax", order.tax_total],
    ["Shipping Cost", order.shipping_total],
    ["Grand Total", order.total],
    ["Currency", "USD"],
  ];

  rows.forEach(([label, value], index) => {
    const y = startY + index * 18;
    doc.font(index === 4 ? "Helvetica-Bold" : "Helvetica").fontSize(index === 4 ? 12 : 10).fillColor("#111827");
    doc.text(label, 370, y, { width: 90 });
    doc.text(label === "Currency" ? value : formatCurrency(value), 470, y, { width: 83, align: "right" });
  });
}

function drawFooter(doc, qrBuffer) {
  doc.moveTo(42, 704).lineTo(553, 704).strokeColor("#e5e7eb").stroke();
  doc.image(qrBuffer, 42, 720, { width: 72, height: 72 });
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor("#111827")
    .text("Thank you for shopping with Sunspot!", 130, 724)
    .font("Helvetica")
    .fontSize(9)
    .fillColor("#4b5563")
    .text("Store Contact: Prishtina, Kosovo", 130, 746)
    .text("Website: https://sunspot.example.com", 130, 762)
    .text("Support Email: support@sunspot.com", 130, 778);
}

function sectionTitle(doc, text, x, y) {
  doc.font("Helvetica-Bold").fontSize(11).fillColor("#0A84FF").text(text, x, y);
}

function labelValue(doc, label, value, x, y, width = 210) {
  doc.font("Helvetica-Bold").fontSize(8).fillColor("#6b7280").text(`${label}:`, x, y, { width });
  doc.font("Helvetica").fontSize(8).fillColor("#111827").text(String(value ?? "N/A"), x + 82, y, { width });
}

function formatAddress(address) {
  if (!address) return "N/A";
  return [address.address_line1, address.address_line2, address.city, address.state, address.postal_code, address.country]
    .filter(Boolean)
    .join(", ");
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(value));
}

function formatCurrency(value) {
  return `$${Number(value ?? 0).toFixed(2)}`;
}

async function createQrBuffer(invoice) {
  const verificationUrl = `${env.clientUrl}/orders?invoice=${encodeURIComponent(invoice.invoice_number)}`;
  const dataUrl = await QRCode.toDataURL(
    JSON.stringify({
      orderId: invoice.order_id,
      invoiceId: invoice.id,
      verificationUrl,
    }),
    { margin: 1, width: 180 },
  );
  return Buffer.from(dataUrl.split(",")[1], "base64");
}

function serializeInvoice(invoice) {
  const payment = invoice.order?.payments?.find(isCompletedPayment) ?? invoice.order?.payments?.[0];
  return {
    id: invoice.id,
    invoiceNumber: invoice.invoice_number,
    orderId: invoice.order_id,
    userId: invoice.user_id,
    orderNumber: invoice.order?.order_number,
    customerEmail: invoice.user?.email ?? invoice.order?.user?.email,
    paymentStatus: payment?.status ?? "PENDING",
    orderStatus: invoice.order?.status,
    total: Number(invoice.order?.total ?? 0),
    pdfUrl: invoice.pdf_url,
    generatedAt: invoice.generated_at,
    createdAt: invoice.created_at,
  };
}

function parseDate(value, end = false) {
  if (!value) return null;
  const text = String(value);
  const date = new Date(text.includes("T") ? text : `${text}T${end ? "23:59:59.999" : "00:00:00.000"}`);
  return Number.isNaN(date.getTime()) ? null : date;
}

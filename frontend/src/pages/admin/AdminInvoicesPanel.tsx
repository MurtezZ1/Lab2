import { FormEvent, useEffect, useState } from "react";
import { Download, Eye, FileText, Search } from "lucide-react";
import {
  downloadInvoice,
  listInvoices,
  type Invoice,
  type InvoiceQuery,
  viewInvoice,
} from "@/services/invoiceService";
import { formatPrice } from "@/utils/products";

export default function AdminInvoicesPanel() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filters, setFilters] = useState<InvoiceQuery>({ pageSize: 10 });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadInvoices = async (nextFilters = filters) => {
    setLoading(true);
    try {
      const result = await listInvoices(nextFilters);
      setInvoices(result.items);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadInvoices();
  }, []);

  const applyFilters = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void loadInvoices(filters);
  };

  const handleDownload = async (invoice: Invoice) => {
    await downloadInvoice(invoice.orderId, `${invoice.invoiceNumber}.pdf`);
    setMessage(`${invoice.invoiceNumber} downloaded.`);
  };

  return (
    <div className="glass-card rounded-2xl p-6 mt-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Invoices
        </h2>
        {message && <p className="text-sm text-green-300">{message}</p>}
      </div>

      <form onSubmit={applyFilters} className="mt-5 grid gap-3 lg:grid-cols-[1fr_160px_160px_180px_auto]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            value={filters.search ?? ""}
            onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
            placeholder="Search invoice, order, user"
            className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-primary"
          />
        </label>
        <input
          type="date"
          value={filters.dateFrom ?? ""}
          onChange={(event) => setFilters((current) => ({ ...current, dateFrom: event.target.value }))}
          className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-primary"
        />
        <input
          type="date"
          value={filters.dateTo ?? ""}
          onChange={(event) => setFilters((current) => ({ ...current, dateTo: event.target.value }))}
          className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-primary"
        />
        <select
          value={filters.paymentStatus ?? ""}
          onChange={(event) => setFilters((current) => ({ ...current, paymentStatus: event.target.value }))}
          className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-primary"
        >
          <option value="">All Payments</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
          <option value="FAILED">Failed</option>
          <option value="REFUNDED">Refunded</option>
        </select>
        <button type="submit" className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white">
          Search
        </button>
      </form>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="text-gray-500">
            <tr>
              <th className="py-3">Invoice</th>
              <th>Order</th>
              <th>User</th>
              <th>Payment</th>
              <th>Total</th>
              <th>Date</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {loading ? (
              <tr><td colSpan={7} className="py-6 text-center text-gray-400">Loading invoices...</td></tr>
            ) : invoices.length === 0 ? (
              <tr><td colSpan={7} className="py-6 text-center text-gray-400">No invoices found.</td></tr>
            ) : (
              invoices.map((invoice) => (
                <tr key={invoice.id} className="text-gray-300">
                  <td className="py-4 font-bold text-white">{invoice.invoiceNumber}</td>
                  <td>{invoice.orderNumber}</td>
                  <td>{invoice.customerEmail}</td>
                  <td>{invoice.paymentStatus}</td>
                  <td>{formatPrice(invoice.total)}</td>
                  <td>{new Date(invoice.generatedAt).toLocaleDateString()}</td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => void viewInvoice(invoice.orderId)}
                        className="rounded-lg border border-white/10 p-2 text-gray-200 hover:border-primary/40"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDownload(invoice)}
                        className="rounded-lg border border-white/10 p-2 text-gray-200 hover:border-primary/40"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

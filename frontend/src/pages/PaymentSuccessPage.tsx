import { CheckCircle, Download, Eye } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { downloadInvoice, generateInvoice, viewInvoice } from "@/services/invoiceService";

export default function PaymentSuccessPage() {
  const [params] = useSearchParams();
  const orderId = params.get("orderId");

  const handleInvoice = async (mode: "download" | "view") => {
    if (!orderId) return;
    const invoice = await generateInvoice(orderId).catch(() => null);
    const filename = invoice ? `${invoice.invoiceNumber}.pdf` : "invoice.pdf";
    if (mode === "download") await downloadInvoice(orderId, filename);
    else await viewInvoice(orderId);
  };

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="glass-card mx-auto max-w-xl rounded-3xl p-8 text-center">
        <CheckCircle className="mx-auto h-14 w-14 text-green-400" />
        <h1 className="mt-5 text-3xl font-bold text-white">Payment Successful</h1>
        <p className="mt-3 text-gray-300">Your order has been paid and is ready for processing.</p>
        {orderId && <p className="mt-3 text-xs text-gray-500">Order ID: {orderId}</p>}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {orderId && (
            <>
              <button
                type="button"
                onClick={() => void handleInvoice("download")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-bold text-white"
              >
                <Download className="h-4 w-4" />
                Download Invoice
              </button>
              <button
                type="button"
                onClick={() => void handleInvoice("view")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 font-bold text-white"
              >
                <Eye className="h-4 w-4" />
                View Invoice
              </button>
            </>
          )}
          <Link to="/orders" className="inline-flex justify-center rounded-xl border border-white/10 px-5 py-3 font-bold text-white">
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

import { CheckCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

export default function PaymentSuccessPage() {
  const [params] = useSearchParams();
  const orderId = params.get("orderId");

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="glass-card mx-auto max-w-xl rounded-3xl p-8 text-center">
        <CheckCircle className="mx-auto h-14 w-14 text-green-400" />
        <h1 className="mt-5 text-3xl font-bold text-white">Payment Successful</h1>
        <p className="mt-3 text-gray-300">Your order has been paid and is ready for processing.</p>
        {orderId && <p className="mt-3 text-xs text-gray-500">Order ID: {orderId}</p>}
        <Link to="/orders" className="mt-8 inline-flex rounded-xl bg-primary px-5 py-3 font-bold text-white">
          View Orders
        </Link>
      </div>
    </div>
  );
}


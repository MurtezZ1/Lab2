import { FormEvent, useState } from "react";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Lock, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { verifyPayment } from "@/services/paymentService";

type StripePaymentFormProps = {
  orderId: string;
  paymentIntentId: string;
};

export default function StripePaymentForm({ orderId, paymentIntentId }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitPayment = async (event: FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsSubmitting(true);
    setError("");

    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        return_url: `${window.location.origin}/payment-success?orderId=${orderId}`,
      },
    });

    if (result.error) {
      setError(result.error.message ?? "Payment failed.");
      setIsSubmitting(false);
      navigate(`/payment-failed?orderId=${orderId}`);
      return;
    }

    const intentId = result.paymentIntent?.id ?? paymentIntentId;
    const verification = await verifyPayment(intentId);
    if (verification.status === "COMPLETED") {
      navigate(`/payment-success?orderId=${orderId}`);
    } else {
      navigate(`/payment-failed?orderId=${orderId}`);
    }
  };

  return (
    <form onSubmit={submitPayment} className="mt-8 space-y-5">
      <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
        <PaymentElement />
      </div>
      {error && <p className="text-sm text-red-300">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || !elements || isSubmitting}
        className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary/90 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
        Pay Securely
      </button>
    </form>
  );
}


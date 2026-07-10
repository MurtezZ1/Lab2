import { CheckCircle2, Clock, FileText, PackageCheck, Truck } from "lucide-react";
import type { Order } from "@/types";

const steps = [
  { key: "created", label: "Order Created", icon: CheckCircle2 },
  { key: "payment-pending", label: "Payment Pending", icon: Clock },
  { key: "payment-completed", label: "Payment Completed", icon: CheckCircle2 },
  { key: "processing", label: "Processing", icon: PackageCheck },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
  { key: "invoice", label: "Invoice Generated", icon: FileText },
] as const;

export default function OrderTimeline({ order }: { order: Order }) {
  const completed = getCompletedSteps(order);

  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4">
      <div className="grid gap-3 md:grid-cols-7">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isDone = completed.has(step.key);
          const isCurrent = !isDone && index === completed.size;
          return (
            <div key={step.key} className="relative flex gap-3 md:flex-col md:gap-2">
              {index < steps.length - 1 && (
                <div className={`absolute left-5 top-9 h-[calc(100%-1rem)] w-px md:left-[calc(50%+1.25rem)] md:top-5 md:h-px md:w-[calc(100%-2.5rem)] ${isDone ? "bg-primary" : "bg-white/10"}`} />
              )}
              <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
                isDone ? "border-primary bg-primary text-white" : isCurrent ? "border-yellow-300 bg-yellow-400/10 text-yellow-200" : "border-white/10 bg-white/[0.03] text-gray-500"
              }`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 md:pr-2">
                <p className={`text-xs font-black uppercase leading-tight ${isDone ? "text-white" : isCurrent ? "text-yellow-100" : "text-gray-500"}`}>
                  {step.label}
                </p>
                <p className="mt-1 text-[11px] text-gray-500">{isDone ? "Completed" : isCurrent ? "Current step" : "Waiting"}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getCompletedSteps(order: Order) {
  const status = String(order.status).toUpperCase();
  const hasCompletedPayment = order.payments?.some((payment) => payment.status === "COMPLETED") || ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"].includes(status);
  const set = new Set<string>(["created"]);

  if (!hasCompletedPayment) set.add("payment-pending");
  if (hasCompletedPayment) {
    set.add("payment-pending");
    set.add("payment-completed");
  }
  if (["PROCESSING", "SHIPPED", "DELIVERED"].includes(status)) set.add("processing");
  if (["SHIPPED", "DELIVERED"].includes(status)) set.add("shipped");
  if (status === "DELIVERED") set.add("delivered");
  if (hasCompletedPayment) set.add("invoice");

  return set;
}


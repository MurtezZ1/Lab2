import { FileText, RotateCcw, ShieldCheck, Truck } from "lucide-react";

const trustItems = [
  { icon: ShieldCheck, label: "Secure payment" },
  { icon: Truck, label: "Fast delivery" },
  { icon: FileText, label: "Invoice included" },
  { icon: RotateCcw, label: "30-day returns" },
];

export default function TrustRow({ className = "" }: { className?: string }) {
  return (
    <div className={`grid gap-3 sm:grid-cols-2 xl:grid-cols-4 ${className}`}>
      {trustItems.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-bold text-gray-200">
            <Icon className="h-4 w-4 text-primary" />
            {item.label}
          </div>
        );
      })}
    </div>
  );
}


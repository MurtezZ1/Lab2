import { AlertTriangle, BadgePercent, Boxes, TrendingUp } from "lucide-react";
import type { Product } from "@/types";
import { calculateDemandForecast } from "@/utils/demandForecast";

type AlertItem = {
  id: string | number;
  title: string;
  message: string;
  tone: "danger" | "warning" | "success";
  icon: typeof AlertTriangle;
};

export default function SmartInventoryAlerts({ products }: { products: Product[] }) {
  const alerts = buildAlerts(products);

  return (
    <section className="glass-card mb-8 rounded-2xl p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-white">
            <Boxes className="h-5 w-5 text-primary" />
            Smart Inventory Alerts
          </h2>
          <p className="mt-1 text-sm text-gray-400">ML-assisted stock and promotion recommendations.</p>
        </div>
        <span className="w-fit rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-black text-primary">
          {alerts.length} active insights
        </span>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {alerts.length ? (
          alerts.map((alert) => <InventoryAlertCard key={alert.id} alert={alert} />)
        ) : (
          <div className="rounded-xl border border-green-400/20 bg-green-500/10 p-4 text-sm text-green-100">
            Inventory looks healthy. No urgent restock or discount action found.
          </div>
        )}
      </div>
    </section>
  );
}

function InventoryAlertCard({ alert }: { alert: AlertItem }) {
  const Icon = alert.icon;
  const tone =
    alert.tone === "danger"
      ? "border-red-400/30 bg-red-500/10 text-red-100"
      : alert.tone === "warning"
        ? "border-yellow-400/30 bg-yellow-500/10 text-yellow-100"
        : "border-green-400/30 bg-green-500/10 text-green-100";

  return (
    <div className={`rounded-xl border p-4 ${tone}`}>
      <Icon className="h-5 w-5" />
      <h3 className="mt-3 font-black text-white">{alert.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-300">{alert.message}</p>
    </div>
  );
}

function buildAlerts(products: Product[]) {
  const alerts: AlertItem[] = [];

  products.forEach((product) => {
    const forecast = calculateDemandForecast(product);
    const stock = Number(product.stock_quantity ?? 0);
    const productName = product.name;

    if (stock <= 5) {
      alerts.push({
        id: `${product.id}-low-stock`,
        title: "Low stock risk",
        message: `${productName} has only ${stock} units left. Restock before demand increases.`,
        tone: "danger",
        icon: AlertTriangle,
      });
    } else if (forecast.level === "High" && stock <= 12) {
      alerts.push({
        id: `${product.id}-high-demand`,
        title: "High demand product",
        message: `${productName} is predicted as high demand with ${forecast.confidence}% confidence. Prepare additional inventory.`,
        tone: "success",
        icon: TrendingUp,
      });
    } else if (forecast.level === "Low" && stock >= 25) {
      alerts.push({
        id: `${product.id}-discount`,
        title: "Suggested discount",
        message: `${productName} has low demand and high stock. Recommend 10-15% discount.`,
        tone: "warning",
        icon: BadgePercent,
      });
    }
  });

  return alerts.slice(0, 6);
}


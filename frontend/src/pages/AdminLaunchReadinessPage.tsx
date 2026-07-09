import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  Database,
  Gauge,
  ImageOff,
  Mail,
  PackageX,
  RefreshCw,
  Server,
  ShieldCheck,
  ShoppingBag,
  Users,
  XCircle,
} from "lucide-react";
import { getLaunchReadiness, type LaunchReadiness, type LaunchStatus } from "@/services/launchReadinessService";

const statusIcon = {
  ok: CheckCircle2,
  warning: AlertTriangle,
  critical: XCircle,
};

export default function AdminLaunchReadinessPage() {
  const [readiness, setReadiness] = useState<LaunchReadiness | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setReadiness(await getLaunchReadiness());
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Unable to load launch readiness.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const statusCards = useMemo(() => {
    if (!readiness) return [];
    return [
      { icon: Database, item: readiness.infrastructure.database },
      { icon: Server, item: readiness.infrastructure.mongo },
      { icon: Server, item: readiness.infrastructure.redis },
      { icon: ShieldCheck, item: readiness.infrastructure.api },
      { icon: CreditCard, item: readiness.payments.stripe },
      { icon: Mail, item: readiness.email },
      { icon: ImageOff, item: readiness.catalog.missingImages },
      { icon: ImageOff, item: readiness.catalog.duplicateImages },
      { icon: PackageX, item: readiness.catalog.withoutStock },
      { icon: ShoppingBag, item: readiness.orders.pending },
      { icon: CheckCircle2, item: readiness.invoices.coverage },
    ];
  }, [readiness]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
            <Gauge className="h-4 w-4" />
            Launch Readiness
          </div>
          <h1 className="text-3xl font-black text-white lg:text-5xl">Launch Mode Dashboard</h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-400">
            Presentation and production checks for infrastructure, payments, email, catalog quality, orders, invoices and API health.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-gray-200 transition-colors hover:border-primary/50 hover:text-white disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh Checks
        </button>
      </div>

      {error && <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-200">{error}</div>}
      {loading && !readiness && <div className="glass-card rounded-2xl p-8 text-gray-400">Loading launch readiness...</div>}

      {readiness && (
        <>
          <div className="grid gap-4 lg:grid-cols-[1.1fr_2fr]">
            <div className="glass-card rounded-3xl p-8">
              <p className="text-sm font-bold uppercase text-gray-500">Presentation Readiness Score</p>
              <div className="mt-5 flex items-end gap-2">
                <span className="text-6xl font-black text-white">{readiness.readinessScore}</span>
                <span className="mb-2 text-2xl font-black text-primary">%</span>
              </div>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full ${readiness.summary.blockingIssues ? "bg-red-400" : readiness.summary.warnings ? "bg-yellow-400" : "bg-green-400"}`}
                  style={{ width: `${readiness.readinessScore}%` }}
                />
              </div>
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs font-bold uppercase text-gray-500">Launch Mode</p>
                <p className={`mt-1 text-xl font-black ${readiness.launchMode === "production" ? "text-green-300" : "text-yellow-300"}`}>
                  {readiness.launchMode === "production" ? "Production" : "Demo / Presentation"}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">{readiness.summary.recommendation}</p>
                {typeof readiness.productionScore === "number" && (
                  <p className="mt-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs font-bold text-gray-300">
                    Production score: {readiness.productionScore}% because Stripe and SMTP require real keys.
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Metric icon={Users} label="Users Registered" value={readiness.users.total} />
              <Metric icon={ShoppingBag} label="Orders Total" value={readiness.orders.total} />
              <Metric icon={CreditCard} label="Demo Payments" value={readiness.payments.demoPayments} />
              <Metric icon={PackageX} label="Inactive Products" value={readiness.catalog.inactiveProducts} />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {statusCards.map(({ icon, item }) => (
              <StatusCard key={item.id} icon={icon} item={item} />
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <IssueList title="Products with Missing Images" status={readiness.catalog.missingImages} />
            <IssueList title="Repeated Product Images" status={readiness.catalog.duplicateImages} />
            <IssueList title="Products without Stock" status={readiness.catalog.withoutStock} />
            <IssueList title="Pending Orders" status={readiness.orders.pending} />
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white">Last Errors</h2>
              <div className="mt-4 space-y-3 text-sm text-gray-300">
                {readiness.recentErrors.failedPayments.length === 0 && readiness.recentErrors.failedPaymentLogs.length === 0 ? (
                  <p className="text-gray-400">No recent failed payments found.</p>
                ) : (
                  <>
                    {readiness.recentErrors.failedPayments.map((item) => (
                      <pre key={String(item.id)} className="overflow-auto rounded-xl border border-white/10 bg-black/30 p-3 text-xs">
                        {JSON.stringify(item, null, 2)}
                      </pre>
                    ))}
                    {readiness.recentErrors.failedPaymentLogs.map((item) => (
                      <pre key={String(item.id)} className="overflow-auto rounded-xl border border-white/10 bg-black/30 p-3 text-xs">
                        {JSON.stringify(item, null, 2)}
                      </pre>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: number | string }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <Icon className="h-6 w-6 text-primary" />
      <p className="mt-5 text-xs font-bold uppercase text-gray-500">{label}</p>
      <p className="mt-1 text-3xl font-black text-white">{value}</p>
    </div>
  );
}

function StatusCard({ icon: Icon, item }: { icon: typeof Users; item: LaunchStatus }) {
  const StatusIcon = statusIcon[item.severity] ?? CheckCircle2;
  const color =
    item.severity === "critical"
      ? "border-red-500/30 bg-red-500/10 text-red-200"
      : item.severity === "warning"
        ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-200"
        : "border-green-500/30 bg-green-500/10 text-green-200";

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-white">{item.title}</h2>
            <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">{item.mode || "status"}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-black uppercase ${color}`}>
          <StatusIcon className="h-3 w-3" />
          {item.severity}
        </span>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-gray-400">{item.message}</p>
      {item.value != null && <p className="mt-3 text-2xl font-black text-white">{item.value}</p>}
    </div>
  );
}

function IssueList({ title, status }: { title: string; status: LaunchStatus }) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <p className="mt-2 text-sm text-gray-400">{status.message}</p>
      <div className="mt-4 space-y-3">
        {status.items?.length ? (
          status.items.map((item, index) => (
            <div key={`${status.id}-${index}`} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm">
              <p className="font-bold text-white">{String(item.name ?? item.order_number ?? item.id)}</p>
              <p className="mt-1 text-xs text-gray-500">{JSON.stringify(item)}</p>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-200">No issues found.</div>
        )}
      </div>
    </div>
  );
}

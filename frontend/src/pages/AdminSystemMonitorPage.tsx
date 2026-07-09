import { useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, ClipboardList, Database, FileClock, RefreshCw, Server, ShieldCheck } from "lucide-react";
import { getSystemMonitor, type SystemMonitorResult, type SystemServiceStatus } from "@/services/systemMonitorService";

const statusClasses: Record<SystemServiceStatus["status"], string> = {
  online: "border-green-400/20 bg-green-400/10 text-green-300",
  fallback: "border-yellow-400/20 bg-yellow-400/10 text-yellow-300",
  offline: "border-red-400/20 bg-red-400/10 text-red-300",
};

export default function AdminSystemMonitorPage() {
  const [monitor, setMonitor] = useState<SystemMonitorResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const serviceItems = useMemo(() => Object.values(monitor?.services ?? {}), [monitor]);

  const loadMonitor = async () => {
    setLoading(true);
    setError("");
    try {
      setMonitor(await getSystemMonitor());
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "System monitor could not load.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMonitor();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-primary">Admin Operations</p>
          <h1 className="mt-2 text-3xl font-black text-white">System Monitor</h1>
          <p className="mt-2 text-gray-400">Live health checks, recent activity, catalog issues and payment/order alerts.</p>
        </div>
        <button onClick={loadMonitor} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-white hover:border-primary/40">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">{error}</div>}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {serviceItems.map((service) => (
          <ServiceCard key={service.name} service={service} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {Object.entries(monitor?.totals ?? {}).map(([key, value]) => (
          <MetricCard key={key} label={formatLabel(key)} value={value} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel icon={FileClock} title="Recent Activity Logs">
          <div className="space-y-3">
            {(monitor?.recentAuditLogs ?? []).map((log) => (
              <div key={log.id} className="rounded-xl border border-white/10 bg-black/20 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-white">{log.action}</p>
                  <span className="text-xs text-gray-500">{new Date(log.created_at).toLocaleString()}</span>
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  {log.entity}{log.entity_id ? ` #${log.entity_id}` : ""} by {log.user?.email ?? "system"}
                </p>
              </div>
            ))}
            {!monitor?.recentAuditLogs?.length && <p className="text-sm text-gray-400">No audit logs found.</p>}
          </div>
        </Panel>

        <Panel icon={AlertTriangle} title="Operational Issues">
          <IssueSummary label="Pending Orders" value={monitor?.orderIssues.pending ?? 0} />
          <IssueSummary label="Processing Orders" value={monitor?.orderIssues.processing ?? 0} />
          <IssueSummary label="Failed Payments" value={monitor?.paymentIssues.failedPayments.length ?? 0} />
          <IssueSummary label="Failed Payment Logs" value={monitor?.paymentIssues.recentFailedLogs.length ?? 0} />
          <IssueSummary label="Products Missing Images" value={monitor?.catalogIssues.missingImages.length ?? 0} />
          <IssueSummary label="Products Without Stock" value={monitor?.catalogIssues.withoutStock.length ?? 0} />
          <IssueSummary label="Repeated Product Images" value={monitor?.catalogIssues.duplicateImages.length ?? 0} />
        </Panel>
      </div>

      <Panel icon={ClipboardList} title="Catalog Image Cleanup">
        <div className="grid gap-4 lg:grid-cols-3">
          <IssueList title="Missing Images" items={monitor?.catalogIssues.missingImages ?? []} />
          <IssueList title="No Stock" items={monitor?.catalogIssues.withoutStock ?? []} />
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <p className="text-sm font-black text-white">Repeated Images</p>
            <div className="mt-3 space-y-3">
              {(monitor?.catalogIssues.duplicateImages ?? []).map((group) => (
                <div key={group.image} className="rounded-lg bg-white/[0.03] p-3 text-xs text-gray-400">
                  <p className="font-bold text-white">{group.count} products share one image</p>
                  <p className="mt-1 line-clamp-1">{group.items.map((item) => String(item.name)).join(", ")}</p>
                </div>
              ))}
              {!monitor?.catalogIssues.duplicateImages?.length && <p className="text-sm text-gray-400">No repeated product images detected.</p>}
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}

function ServiceCard({ service }: { service: SystemServiceStatus }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between gap-3">
        <Server className="h-6 w-6 text-primary" />
        <span className={`rounded-full border px-3 py-1 text-xs font-black uppercase ${statusClasses[service.status]}`}>
          {service.status}
        </span>
      </div>
      <h2 className="mt-5 text-lg font-black text-white">{service.name}</h2>
      <p className="mt-2 text-sm text-gray-400">{service.message}</p>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass-card rounded-2xl p-4">
      <Database className="h-5 w-5 text-primary" />
      <p className="mt-4 text-xs font-bold uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function Panel({ icon: Icon, title, children }: { icon: typeof Activity; title: string; children: React.ReactNode }) {
  return (
    <section className="glass-card rounded-2xl p-6">
      <div className="mb-5 flex items-center gap-3">
        <Icon className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-black text-white">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function IssueSummary({ label, value }: { label: string; value: number }) {
  const ok = value === 0;
  return (
    <div className="mb-3 flex items-center justify-between rounded-xl border border-white/10 bg-black/20 p-3">
      <span className="text-sm text-gray-300">{label}</span>
      <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black ${ok ? "bg-green-400/10 text-green-300" : "bg-yellow-400/10 text-yellow-300"}`}>
        {ok && <ShieldCheck className="h-3 w-3" />}
        {value}
      </span>
    </div>
  );
}

function IssueList({ title, items }: { title: string; items: Array<Record<string, unknown>> }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <p className="text-sm font-black text-white">{title}</p>
      <div className="mt-3 space-y-3">
        {items.map((item) => (
          <div key={String(item.id ?? item.legacy_id)} className="rounded-lg bg-white/[0.03] p-3 text-sm text-gray-400">
            <p className="font-bold text-white">{String(item.name ?? item.order_number ?? item.id)}</p>
            {item.legacy_id ? <p className="text-xs">Product ID: {String(item.legacy_id)}</p> : null}
          </div>
        ))}
        {!items.length && <p className="text-sm text-gray-400">No issues found.</p>}
      </div>
    </div>
  );
}

function formatLabel(value: string) {
  return value.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
}

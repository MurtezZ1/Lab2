import { Activity, ArrowRight, Clock } from "lucide-react";
import type { AuditLog } from "@/types";

export default function AuditActivityFeed({ logs }: { logs: AuditLog[] }) {
  return (
    <section className="glass-card mt-8 rounded-2xl p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-white">
            <Activity className="h-5 w-5 text-primary" />
            Visual Activity Feed
          </h2>
          <p className="mt-1 text-sm text-gray-400">Readable enterprise-style audit trail for recent system actions.</p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {logs.length ? (
          logs.slice(0, 6).map((log) => (
            <div key={log.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold leading-relaxed text-white">{humanizeAuditLog(log)}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                <Clock className="h-3.5 w-3.5" />
                <span>{formatDate(log.timestamp)}</span>
                <ArrowRight className="h-3.5 w-3.5" />
                <span>{log.entity}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-gray-400">
            No activity has been recorded yet.
          </div>
        )}
      </div>
    </section>
  );
}

function humanizeAuditLog(log: AuditLog) {
  const actor = log.userDisplay || log.user?.username || log.user?.email || "System";
  const action = log.action.toLowerCase().replaceAll("_", " ");
  const entity = log.entity.toLowerCase();
  const oldValue = formatAuditValue(log.oldValue);
  const newValue = formatAuditValue(log.newValue);

  if (oldValue !== "-" && newValue !== "-") {
    return `${actor} ${action} ${entity} from ${oldValue} to ${newValue}.`;
  }

  if (newValue !== "-") {
    return `${actor} ${action} ${entity}: ${newValue}.`;
  }

  return `${actor} ${action} ${entity}${log.entityId ? ` (${log.entityId})` : ""}.`;
}

function formatAuditValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    const importantKey = ["name", "email", "status", "role", "price", "stock_quantity"].find((key) => key in record);
    if (importantKey) return `${importantKey}: ${String(record[importantKey])}`;
  }
  try {
    return JSON.stringify(value);
  } catch (_error) {
    return String(value);
  }
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(date);
}


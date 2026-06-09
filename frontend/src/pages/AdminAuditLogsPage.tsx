import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Download,
  FileSpreadsheet,
  RefreshCw,
  Search,
  ShieldCheck,
} from "lucide-react";
import {
  downloadAdminAuditLogs,
  getAdminAuditLogs,
} from "@/services/adminService";
import type { AuditLogListResult, AuditLogQuery } from "@/types";

const initialResult: AuditLogListResult = {
  items: [],
  total: 0,
  page: 1,
  pageSize: 10,
  pageCount: 1,
  actions: [],
  entities: [],
};

const fallbackActions = [
  "Login",
  "Logout",
  "Register",
  "Product Create",
  "Product Update",
  "Product Delete",
  "Order Create",
  "Order Status Change",
  "User Role Change",
  "CMS Update",
  "Report Export",
];

const fallbackEntities = ["Auth", "User", "Product", "Order", "CMS", "Report", "AuditLog"];

export default function AdminAuditLogsPage() {
  const [filters, setFilters] = useState<AuditLogQuery>({ page: 1, pageSize: 10, sortOrder: "desc" });
  const [result, setResult] = useState<AuditLogListResult>(initialResult);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState<"csv" | "excel" | null>(null);
  const [error, setError] = useState("");

  const loadLogs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setResult(await getAdminAuditLogs(filters));
    } catch (_error) {
      setError("Audit logs could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void loadLogs();
  }, [loadLogs]);

  const actions = result.actions.length ? result.actions : fallbackActions;
  const entities = useMemo(
    () => (result.entities.length ? result.entities : fallbackEntities),
    [result.entities],
  );
  const page = result.page || filters.page || 1;
  const pageCount = result.pageCount || 1;
  const sortOrder = filters.sortOrder ?? "desc";

  const applyFilter = (updates: AuditLogQuery) => {
    setFilters((current) => ({ ...current, ...updates, page: 1 }));
  };

  const goToPage = (nextPage: number) => {
    setFilters((current) => ({
      ...current,
      page: Math.min(Math.max(nextPage, 1), pageCount),
    }));
  };

  const exportLogs = async (format: "csv" | "excel") => {
    setExporting(format);
    setError("");
    try {
      await downloadAdminAuditLogs(format, filters);
    } catch (_error) {
      setError("Audit logs export failed.");
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Link to="/admin" className="text-sm font-semibold text-accent hover:text-white">
            Back to Admin
          </Link>
          <h1 className="mt-3 flex items-center gap-3 text-3xl font-bold text-white">
            <ShieldCheck className="h-8 w-8 text-primary" />
            Audit Logs
          </h1>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void loadLogs()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => void exportLogs("csv")}
            disabled={exporting !== null}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Download className="h-4 w-4" />
            CSV
          </button>
          <button
            type="button"
            onClick={() => void exportLogs("excel")}
            disabled={exporting !== null}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Excel
          </button>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-5">
        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr]">
          <label className="relative block">
            <span className="sr-only">Search audit logs</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              value={filters.search ?? ""}
              onChange={(event) => applyFilter({ search: event.target.value })}
              placeholder="Search"
              className="h-11 w-full rounded-xl border border-white/10 bg-black/40 pl-10 pr-4 text-sm text-white outline-none focus:border-primary"
            />
          </label>

          <input
            value={filters.user ?? ""}
            onChange={(event) => applyFilter({ user: event.target.value })}
            placeholder="User"
            className="h-11 rounded-xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none focus:border-primary"
          />

          <select
            value={filters.action ?? ""}
            onChange={(event) => applyFilter({ action: event.target.value })}
            className="h-11 rounded-xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none focus:border-primary"
          >
            <option value="">All actions</option>
            {actions.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>

          <select
            value={filters.entity ?? ""}
            onChange={(event) => applyFilter({ entity: event.target.value })}
            className="h-11 rounded-xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none focus:border-primary"
          >
            <option value="">All entities</option>
            {entities.map((entity) => (
              <option key={entity} value={entity}>
                {entity}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={filters.dateFrom ?? ""}
            onChange={(event) => applyFilter({ dateFrom: event.target.value })}
            className="h-11 rounded-xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none focus:border-primary"
          />

          <input
            type="date"
            value={filters.dateTo ?? ""}
            onChange={(event) => applyFilter({ dateTo: event.target.value })}
            className="h-11 rounded-xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none focus:border-primary"
          />
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}
      </div>

      <div className="glass-card mt-8 overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full text-left text-sm">
            <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase text-gray-400">
              <tr>
                <th className="px-5 py-4 font-semibold">User</th>
                <th className="px-5 py-4 font-semibold">Action</th>
                <th className="px-5 py-4 font-semibold">Entity</th>
                <th className="px-5 py-4 font-semibold">Old Value</th>
                <th className="px-5 py-4 font-semibold">New Value</th>
                <th className="px-5 py-4 font-semibold">IP Address</th>
                <th className="px-5 py-4 font-semibold">
                  <button
                    type="button"
                    onClick={() => applyFilter({ sortOrder: sortOrder === "desc" ? "asc" : "desc" })}
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-gray-300 hover:text-white"
                  >
                    Timestamp
                    {sortOrder === "desc" ? <ArrowDown className="h-3.5 w-3.5" /> : <ArrowUp className="h-3.5 w-3.5" />}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td className="px-5 py-8 text-center text-gray-400" colSpan={7}>
                    Loading audit logs...
                  </td>
                </tr>
              ) : result.items.length ? (
                result.items.map((log) => {
                  const oldValue = formatAuditValue(log.oldValue);
                  const newValue = formatAuditValue(log.newValue);
                  return (
                    <tr key={log.id} className="text-gray-300 hover:bg-white/[0.03]">
                      <td className="px-5 py-4 align-top">
                        <div className="max-w-[14rem] truncate font-semibold text-white" title={log.userDisplay}>
                          {log.userDisplay}
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <span className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <div className="font-semibold text-white">{log.entity}</div>
                        {log.entityId && <div className="mt-1 max-w-[12rem] truncate text-xs text-gray-500">{log.entityId}</div>}
                      </td>
                      <td className="px-5 py-4 align-top">
                        <div className="max-w-[18rem] truncate text-gray-400" title={oldValue}>
                          {oldValue}
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <div className="max-w-[18rem] truncate text-gray-200" title={newValue}>
                          {newValue}
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top text-gray-400">{log.ipAddress ?? "-"}</td>
                      <td className="px-5 py-4 align-top text-gray-300">{formatDate(log.timestamp)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="px-5 py-8 text-center text-gray-400" colSpan={7}>
                    No audit logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 px-5 py-4 text-sm text-gray-300 md:flex-row md:items-center md:justify-between">
          <div>
            Showing {result.items.length} of {result.total} logs
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={filters.pageSize ?? 10}
              onChange={(event) => applyFilter({ pageSize: Number(event.target.value) })}
              className="h-10 rounded-xl border border-white/10 bg-black/40 px-3 text-sm text-white outline-none"
            >
              {[10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size} / page
                </option>
              ))}
            </select>
            <span>
              Page {page} of {pageCount}
            </span>
            <button
              type="button"
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1 || loading}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => goToPage(page + 1)}
              disabled={page >= pageCount || loading}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatAuditValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  try {
    return JSON.stringify(value);
  } catch (_error) {
    return String(value);
  }
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

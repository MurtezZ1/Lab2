import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  BarChart3,
  CalendarDays,
  CreditCard,
  DollarSign,
  Download,
  FileSpreadsheet,
  Package,
  PieChart,
  RefreshCw,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import {
  downloadAdminAnalyticsDashboard,
  getAdminAnalyticsDashboard,
  type AnalyticsDashboard,
  type AnalyticsFilters,
  type AnalyticsKpi,
  type BarPoint,
  type MonthPoint,
  type StatusPoint,
} from "@/services/adminAnalyticsService";
import { connectSocket, socket } from "@/services/socketService";

const ranges: Array<{ label: string; value: AnalyticsFilters["range"] }> = [
  { label: "Today", value: "today" },
  { label: "Last 7 Days", value: "last7Days" },
  { label: "Last 30 Days", value: "last30Days" },
  { label: "Last 90 Days", value: "last90Days" },
  { label: "This Year", value: "thisYear" },
  { label: "Custom", value: "custom" },
];

const kpiIcons = {
  totalUsers: Users,
  totalOrders: ShoppingBag,
  totalRevenue: DollarSign,
  totalProducts: Package,
  newUsersThisMonth: UserPlus,
  revenueThisMonth: CreditCard,
  averageOrderValue: BarChart3,
  activeCustomers: Activity,
};

export default function AdminAnalyticsDashboardPage() {
  const [filters, setFilters] = useState<AnalyticsFilters>({ range: "last30Days" });
  const [dashboard, setDashboard] = useState<AnalyticsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState<"pdf" | "excel" | "csv" | null>(null);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setDashboard(await getAdminAnalyticsDashboard(filters));
    } catch (_error) {
      setError("Analytics dashboard could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    connectSocket();
    const refreshDashboard = () => void loadDashboard();
    socket.on("dashboard:update", refreshDashboard);
    socket.on("order:update", refreshDashboard);
    return () => {
      socket.off("dashboard:update", refreshDashboard);
      socket.off("order:update", refreshDashboard);
    };
  }, [loadDashboard]);

  const exportDashboard = async (format: "pdf" | "excel" | "csv") => {
    setExporting(format);
    setError("");
    try {
      await downloadAdminAnalyticsDashboard(format, filters);
    } catch (_error) {
      setError("Dashboard export failed.");
    } finally {
      setExporting(null);
    }
  };

  const updateFilter = (updates: Partial<AnalyticsFilters>) => {
    setFilters((current) => ({ ...current, ...updates }));
  };

  const generatedAt = useMemo(() => {
    if (!dashboard?.generatedAt) return "";
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(
      new Date(dashboard.generatedAt),
    );
  }, [dashboard?.generatedAt]);

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Link to="/admin" className="text-sm font-semibold text-accent hover:text-white">
            Back to Admin
          </Link>
          <h1 className="mt-3 flex items-center gap-3 text-3xl font-bold text-white">
            <BarChart3 className="h-8 w-8 text-primary" />
            Analytics Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            {dashboard ? `${dashboard.filters.label} • Updated ${generatedAt}` : "Live business analytics"}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void loadDashboard()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <ExportButton label="PDF" icon={Download} disabled={exporting !== null} onClick={() => void exportDashboard("pdf")} />
          <ExportButton label="Excel" icon={FileSpreadsheet} disabled={exporting !== null} onClick={() => void exportDashboard("excel")} />
          <ExportButton label="CSV" icon={Download} disabled={exporting !== null} onClick={() => void exportDashboard("csv")} />
        </div>
      </div>

      <div className="glass-card mb-8 rounded-2xl p-5">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div className="flex flex-wrap gap-2">
            {ranges.map((range) => (
              <button
                key={range.value}
                type="button"
                onClick={() => updateFilter({ range: range.value })}
                className={`rounded-xl px-3 py-2 text-sm font-bold transition-colors ${
                  filters.range === range.value
                    ? "bg-primary text-white"
                    : "border border-white/10 text-gray-300 hover:border-primary/40 hover:text-white"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          <DateInput
            label="From"
            value={filters.dateFrom ?? ""}
            disabled={filters.range !== "custom"}
            onChange={(value) => updateFilter({ range: "custom", dateFrom: value })}
          />
          <DateInput
            label="To"
            value={filters.dateTo ?? ""}
            disabled={filters.range !== "custom"}
            onChange={(value) => updateFilter({ range: "custom", dateTo: value })}
          />
        </div>
        {dashboard?.cache && (
          <p className="mt-4 text-xs text-gray-500">
            Redis cache: {dashboard.cache.hit ? "hit" : "miss"} • TTL {dashboard.cache.ttlSeconds}s
          </p>
        )}
      </div>

      {error && <div className="mb-8 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {(dashboard?.kpis ?? Array.from({ length: 8 })).map((item, index) =>
          item ? <KpiCard key={item.id} kpi={item as AnalyticsKpi} /> : <KpiSkeleton key={index} />,
        )}
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-2">
        <ChartPanel title="Orders Per Month" icon={CalendarDays}>
          <LineChart data={dashboard?.charts.ordersPerMonth ?? []} loading={loading} valuePrefix="" />
        </ChartPanel>
        <ChartPanel title="Revenue Per Month" icon={DollarSign}>
          <LineChart data={dashboard?.charts.revenuePerMonth ?? []} loading={loading} valuePrefix="$" />
        </ChartPanel>
        <ChartPanel title="User Growth" icon={Users}>
          <LineChart data={dashboard?.charts.userGrowth ?? []} loading={loading} valuePrefix="" />
        </ChartPanel>
        <ChartPanel title="Top Selling Products" icon={BarChart3}>
          <BarChart data={dashboard?.charts.topSellingProducts ?? []} loading={loading} valueKey="units" />
        </ChartPanel>
        <ChartPanel title="Top Categories" icon={BarChart3}>
          <BarChart data={dashboard?.charts.topCategories ?? []} loading={loading} valueKey="revenue" valuePrefix="$" />
        </ChartPanel>
        <ChartPanel title="Orders By Status" icon={PieChart}>
          <PieStatusChart data={dashboard?.charts.ordersByStatus ?? []} loading={loading} />
        </ChartPanel>
      </div>

      <div className="glass-card mt-8 rounded-2xl p-5">
        <h2 className="text-lg font-bold text-white">MongoDB Engagement</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <MiniMetric label="Product Views" value={dashboard?.engagement.productViews ?? 0} />
          <MiniMetric label="User Activities" value={dashboard?.engagement.userActivities ?? 0} />
          <MiniMetric label="Active Mongo Users" value={dashboard?.engagement.activeMongoUsers ?? 0} />
        </div>
      </div>
    </div>
  );
}

function ExportButton({ label, icon: Icon, disabled, onClick }: { label: string; icon: typeof Download; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function DateInput({ label, value, disabled, onChange }: { label: string; value: string; disabled: boolean; onChange: (value: string) => void }) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 px-3 py-2">
      <span className="text-xs font-bold uppercase text-gray-500">{label}</span>
      <input
        type="date"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-50"
      />
    </label>
  );
}

function KpiCard({ kpi }: { kpi: AnalyticsKpi }) {
  const Icon = kpiIcons[kpi.id as keyof typeof kpiIcons] ?? Activity;
  const TrendIcon = kpi.trend.direction === "down" ? TrendingDown : TrendingUp;
  const trendColor = kpi.trend.direction === "down" ? "text-red-300" : kpi.trend.direction === "up" ? "text-green-300" : "text-gray-400";

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-xl bg-primary/15 p-3">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div className={`inline-flex items-center gap-1 text-sm font-bold ${trendColor}`}>
          <TrendIcon className="h-4 w-4" />
          {kpi.trend.direction === "neutral" ? "0%" : `${kpi.trend.direction === "down" ? "-" : "+"}${kpi.trend.value}%`}
        </div>
      </div>
      <p className="mt-5 text-sm text-gray-400">{kpi.title}</p>
      <h2 className="mt-2 text-3xl font-black text-white">{formatKpiValue(kpi)}</h2>
    </div>
  );
}

function KpiSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="h-12 w-12 animate-pulse rounded-xl bg-white/10" />
      <div className="mt-5 h-4 w-28 animate-pulse rounded bg-white/10" />
      <div className="mt-3 h-8 w-24 animate-pulse rounded bg-white/10" />
    </div>
  );
}

function ChartPanel({ title, icon: Icon, children }: { title: string; icon: typeof BarChart3; children: React.ReactNode }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <h2 className="flex items-center gap-2 text-lg font-bold text-white">
        <Icon className="h-5 w-5 text-primary" />
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function LineChart({ data, loading, valuePrefix }: { data: MonthPoint[]; loading: boolean; valuePrefix: string }) {
  if (loading) return <ChartSkeleton />;
  if (!data.length) return <EmptyChart />;

  const width = 520;
  const height = 220;
  const padding = 28;
  const max = Math.max(...data.map((item) => item.value), 1);
  const points = data.map((item, index) => {
    const x = padding + (index / Math.max(data.length - 1, 1)) * (width - padding * 2);
    const y = height - padding - (item.value / max) * (height - padding * 2);
    return { ...item, x, y };
  });
  const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-64 min-w-[32rem] w-full">
        <path d={path} fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" />
        {points.map((point) => (
          <g key={point.month}>
            <circle cx={point.x} cy={point.y} r="4" fill="var(--accent)" />
            <text x={point.x} y={height - 6} textAnchor="middle" className="fill-gray-400 text-[10px]">
              {point.month.slice(5)}
            </text>
            <text x={point.x} y={Math.max(point.y - 10, 12)} textAnchor="middle" className="fill-gray-300 text-[10px]">
              {valuePrefix}{formatCompact(point.value)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function BarChart({ data, loading, valueKey, valuePrefix = "" }: { data: BarPoint[]; loading: boolean; valueKey: "units" | "revenue"; valuePrefix?: string }) {
  if (loading) return <ChartSkeleton />;
  if (!data.length) return <EmptyChart />;
  const max = Math.max(...data.map((item) => Number(item[valueKey] ?? 0)), 1);

  return (
    <div className="space-y-4">
      {data.slice(0, 6).map((item) => {
        const value = Number(item[valueKey] ?? 0);
        return (
          <div key={item.name}>
            <div className="mb-1 flex items-center justify-between gap-4 text-sm">
              <span className="max-w-[70%] truncate text-gray-300">{item.name}</span>
              <span className="font-bold text-white">{valuePrefix}{formatCompact(value)}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max((value / max) * 100, 4)}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PieStatusChart({ data, loading }: { data: StatusPoint[]; loading: boolean }) {
  if (loading) return <ChartSkeleton />;
  if (!data.length) return <EmptyChart />;
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  let cumulative = 0;
  const colors = ["#0A84FF", "#00F0FF", "#22c55e", "#f59e0b", "#ef4444", "#a855f7", "#64748b"];

  return (
    <div className="grid gap-6 md:grid-cols-[220px_1fr] md:items-center">
      <svg viewBox="0 0 120 120" className="mx-auto h-56 w-56">
        {data.map((item, index) => {
          const start = cumulative / total;
          cumulative += item.value;
          const end = cumulative / total;
          return <path key={item.status} d={piePath(60, 60, 48, start, end)} fill={colors[index % colors.length]} />;
        })}
        <circle cx="60" cy="60" r="28" fill="var(--background)" />
      </svg>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={item.status} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-gray-300">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
              {item.status}
            </span>
            <span className="font-bold text-white">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm text-gray-400">{label}</p>
      <h3 className="mt-2 text-2xl font-black text-white">{formatCompact(value)}</h3>
    </div>
  );
}

function ChartSkeleton() {
  return <div className="h-64 animate-pulse rounded-xl bg-white/10" />;
}

function EmptyChart() {
  return <div className="flex h-64 items-center justify-center rounded-xl border border-white/10 text-sm text-gray-400">No data for this range.</div>;
}

function formatKpiValue(kpi: AnalyticsKpi) {
  if (kpi.format === "currency") return `$${formatCompact(kpi.value)}`;
  return formatCompact(kpi.value);
}

function formatCompact(value: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: value >= 1000 ? 1 : 2, notation: value >= 10000 ? "compact" : "standard" }).format(value);
}

function piePath(cx: number, cy: number, radius: number, start: number, end: number) {
  const startAngle = start * Math.PI * 2 - Math.PI / 2;
  const endAngle = end * Math.PI * 2 - Math.PI / 2;
  const x1 = cx + Math.cos(startAngle) * radius;
  const y1 = cy + Math.sin(startAngle) * radius;
  const x2 = cx + Math.cos(endAngle) * radius;
  const y2 = cy + Math.sin(endAngle) * radius;
  const largeArc = end - start > 0.5 ? 1 : 0;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}

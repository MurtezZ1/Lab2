import { apiClient } from "@/services/apiClient";

export type AnalyticsRange = "today" | "last7Days" | "last30Days" | "last90Days" | "thisYear" | "custom";

export type AnalyticsFilters = {
  range: AnalyticsRange;
  dateFrom?: string;
  dateTo?: string;
};

export type AnalyticsKpi = {
  id: string;
  title: string;
  value: number;
  format: "currency" | "users" | "orders" | "products";
  trend: {
    value: number;
    direction: "up" | "down" | "neutral";
  };
};

export type MonthPoint = {
  month: string;
  label: string;
  value: number;
};

export type BarPoint = {
  name: string;
  units: number;
  revenue: number;
};

export type StatusPoint = {
  status: string;
  value: number;
};

export type AnalyticsDashboard = {
  filters: {
    range: AnalyticsRange;
    label: string;
    dateFrom: string;
    dateTo: string;
  };
  kpis: AnalyticsKpi[];
  charts: {
    ordersPerMonth: MonthPoint[];
    revenuePerMonth: MonthPoint[];
    userGrowth: MonthPoint[];
    demandForecast: MonthPoint[];
    topSellingProducts: BarPoint[];
    topCategories: BarPoint[];
    ordersByStatus: StatusPoint[];
  };
  engagement: {
    productViews: number;
    userActivities: number;
    activeMongoUsers: number;
  };
  cache: {
    hit: boolean;
    key: string;
    ttlSeconds: number;
  };
  generatedAt: string;
};

export async function getAdminAnalyticsDashboard(filters: AnalyticsFilters) {
  const { data } = await apiClient.get("/admin/analytics/dashboard", { params: cleanParams(filters) });
  return data.data as AnalyticsDashboard;
}

export async function downloadAdminAnalyticsDashboard(format: "pdf" | "excel" | "csv", filters: AnalyticsFilters) {
  const response = await apiClient.get<Blob>(`/admin/analytics/dashboard/export/${format}`, {
    params: cleanParams(filters),
    responseType: "blob",
  });
  const contentType = response.headers["content-type"];
  const extension = format === "excel" ? "xlsx" : format;
  const blob = new Blob([response.data], {
    type: typeof contentType === "string" ? contentType : "application/octet-stream",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `admin-analytics-dashboard.${extension}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function cleanParams(filters: AnalyticsFilters) {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== undefined && value !== null && value !== ""),
  );
}

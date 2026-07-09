import { apiClient } from "@/services/apiClient";

export type LaunchStatus = {
  id: string;
  title: string;
  ok: boolean;
  severity: "ok" | "warning" | "critical";
  mode: string;
  message: string;
  value?: number | string | null;
  items?: Array<Record<string, unknown>>;
};

export type LaunchReadiness = {
  generatedAt: string;
  launchMode: "production" | "demo";
  readinessScore: number;
  productionScore?: number;
  summary: {
    readyChecks: number;
    totalChecks: number;
    warnings: number;
    blockingIssues: number;
    recommendation: string;
  };
  infrastructure: {
    database: LaunchStatus;
    mongo: LaunchStatus;
    redis: LaunchStatus;
    api: LaunchStatus;
  };
  payments: {
    stripe: LaunchStatus;
    demoPayments: number;
  };
  email: LaunchStatus;
  catalog: {
    totalProducts: number;
    inactiveProducts: number;
    missingImages: LaunchStatus;
    duplicateImages: LaunchStatus;
    withoutStock: LaunchStatus;
  };
  orders: {
    total: number;
    pending: LaunchStatus;
  };
  users: {
    total: number;
    active: number;
    admins: number;
  };
  invoices: {
    paidOrders: number;
    totalInvoices: number;
    coverage: LaunchStatus;
  };
  recentErrors: {
    failedPayments: Array<Record<string, unknown>>;
    failedPaymentLogs: Array<Record<string, unknown>>;
  };
  checklist: LaunchStatus[];
};

export async function getLaunchReadiness() {
  const { data } = await apiClient.get("/admin/launch-readiness");
  return data.data as LaunchReadiness;
}

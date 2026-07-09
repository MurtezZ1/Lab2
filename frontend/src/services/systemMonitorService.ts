import { apiClient } from "@/services/apiClient";

export type SystemServiceStatus = {
  name: string;
  status: "online" | "offline" | "fallback";
  ok: boolean;
  message: string;
};

export type SystemMonitorResult = {
  generatedAt: string;
  services: Record<string, SystemServiceStatus>;
  totals: {
    users: number;
    products: number;
    orders: number;
    payments: number;
    auditLogs: number;
    invoices: number;
  };
  recentAuditLogs: Array<{
    id: string;
    action: string;
    entity: string;
    entity_id?: string | null;
    created_at: string;
    user?: { email: string; username: string; role: string } | null;
  }>;
  paymentIssues: {
    failedPayments: Array<Record<string, unknown>>;
    recentFailedLogs: Array<Record<string, unknown>>;
  };
  orderIssues: {
    pending: number;
    processing: number;
    recent: Array<Record<string, unknown>>;
  };
  catalogIssues: {
    missingImages: Array<Record<string, unknown>>;
    withoutStock: Array<Record<string, unknown>>;
    duplicateImages: Array<{ image: string; count: number; items: Array<Record<string, unknown>> }>;
  };
};

export async function getSystemMonitor() {
  const { data } = await apiClient.get("/admin/system-monitor");
  return data.data as SystemMonitorResult;
}

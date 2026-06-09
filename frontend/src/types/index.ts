export type Product = {
  id: number | string;
  uuid?: string;
  name: string;
  manufacturer: string;
  model: string;
  type: string;
  year: number | null;
  price: number;
  processor: string | null;
  ram_size: string | null;
  storage: string | null;
  display: string | null;
  os: string | null;
  battery: string | null;
  weight: string | null;
  dimensions: string | null;
  keyboard: string | null;
  ports: string | null;
  connectivity: string | null;
  camera: string | null;
  additional_features: string | null;
  image: string;
  description: string | null;
  rating_average?: number;
  similarityScore?: number;
  recommendationScore?: number;
};

export type User = {
  id: number | string;
  email: string;
  username: string;
  password?: string;
  role: string;
  active: number;
  roles?: string[];
  permissions?: string[];
  accessToken?: string;
  refreshToken?: string;
};

export type CartItem = {
  id?: string;
  productId: number | string;
  productUuid?: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  subtotal: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  status: "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURNED" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  total: number;
  subtotal?: number;
  taxTotal?: number;
  shippingTotal?: number;
  discountTotal?: number;
  createdAt: string;
  items: CartItem[];
  payments?: Array<{
    id: string;
    provider: string;
    transaction_id?: string;
    amount: number;
    status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  }>;
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  unread: boolean;
  createdAt: string;
};

export type SupportTicket = {
  id: string;
  subject: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED" | "Open" | "In Progress" | "Resolved";
  createdAt: string;
  messages?: Array<{ id: string; message: string; created_at?: string }>;
};

export type AuditLog = {
  id: string;
  user: {
    id: string;
    email: string;
    username: string;
    role: string;
  } | null;
  userDisplay: string;
  action: string;
  entity: string;
  entityId?: string | null;
  oldValue?: unknown;
  newValue?: unknown;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, unknown>;
  timestamp: string;
  createdAt: string;
};

export type AuditLogQuery = {
  page?: number;
  pageSize?: number;
  search?: string;
  user?: string;
  action?: string;
  entity?: string;
  dateFrom?: string;
  dateTo?: string;
  sortOrder?: "asc" | "desc";
};

export type AuditLogListResult = {
  items: AuditLog[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  actions: string[];
  entities: string[];
};

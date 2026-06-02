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
  createdAt: string;
  items: CartItem[];
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

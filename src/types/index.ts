export type Product = {
  id: number;
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
  id: number;
  email: string;
  username: string;
  password: string;
  role: string;
  active: number;
};

export type CartItem = {
  productId: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  subtotal: number;
};

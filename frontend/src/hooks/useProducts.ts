import { useEffect, useState } from "react";
import { getProducts } from "@/services/productService";
import type { Product } from "@/types";

export function useProducts(options?: { take?: number }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getProducts(options)
      .then((items) => {
        if (active) setProducts(items);
      })
      .catch((err: Error) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [options?.take]);

  return { products, loading, error };
}

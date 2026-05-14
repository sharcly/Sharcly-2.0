import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";

export function useFeaturedProducts() {
  const [data, setData] = useState<{ products: any[] }>({ products: [] });
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    async function fetchProducts() {
      setIsFetching(true);
      try {
        const response = await apiClient.get("/products?featured=true");
        setData({ products: response.data.products || [] });
      } catch (err) {
        console.error("Failed to fetch featured products:", err);
        setError(err);
      } finally {
        setIsFetching(false);
      }
    }

    fetchProducts();
  }, []);

  return { data, isFetching, error };
}

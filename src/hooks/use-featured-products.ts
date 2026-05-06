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
        const response = await apiClient.get("/products?limit=100");
        // Ensure we have an array of products
        const allProducts = Array.isArray(response.data.products) ? response.data.products : [];
        
        // Filter by "featured" tag
        const featured = allProducts.filter((p: any) => 
          p.tags?.some((t: any) => t.name.toLowerCase() === "featured")
        ).slice(0, 8);

        setData({ products: featured });
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

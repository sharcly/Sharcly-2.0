"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { apiClient } from "@/lib/api-client";
import { motion } from "framer-motion";
import { Sparkles, Percent } from "lucide-react";

export default function SalePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get("/products");
        // For demonstration, we'll just take some products for sale
        setProducts(response.data.products?.slice(2, 6) || []);
      } catch (error) {
        console.error("Failed to fetch sale products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#fffcfc] text-[#0d2719] selection:bg-[#0d2719] selection:text-white">
      <Navbar />
      
      <main className="pt-32 pb-40">
        <section className="container mx-auto px-6 mb-24">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 mb-8"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Exclusive Archive Access</span>
              <div className="h-px w-12 bg-[#0d2719]/10" />
              <Percent className="size-4 opacity-40" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl lg:text-9xl font-black tracking-tighter leading-[0.8] mb-12"
            >
              LIMITED <br />
              <span className="italic font-serif opacity-30">OFFERS.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl lg:text-2xl text-[#0d2719]/50 font-medium max-w-2xl leading-relaxed"
            >
              Opportunities to elevate your routine with exclusive pricing on our premium botanical sequences.
            </motion.p>
          </div>
        </section>

        <section className="container mx-auto px-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[5/6] bg-neutral-100 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

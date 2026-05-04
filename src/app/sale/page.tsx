"use client";

import { useEffect, useState, useRef } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { apiClient } from "@/lib/api-client";
import { motion, useScroll, useTransform } from "framer-motion";
import { Percent, ArrowDown, Clock, Zap, Shield, Tag } from "lucide-react";

export default function SalePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get("/products");
        setProducts(response.data.products?.slice(2, 6) || []);
      } catch (error) {
        console.error("Failed to fetch sale products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const perks = [
    { icon: Zap, title: "Flash Deals", desc: "Limited-time pricing on select formulas" },
    { icon: Shield, title: "Same Quality", desc: "Full-potency, lab-verified products" },
    { icon: Clock, title: "While Stocks Last", desc: "Once they're gone, they're gone" },
  ];

  return (
    <div className="min-h-screen antialiased" style={{ background: '#040e07', color: '#eff8ee' }}>
      <Navbar />

      {/* ═══════════════ HERO ═══════════════ */}
      <section ref={heroRef} className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Layered background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(232,197,71,0.08) 0%, transparent 70%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(175deg, #040e07 0%, #082f1d 40%, #040e07 100%)' }} />
          {/* Animated gold line accents */}
          <div className="absolute top-1/4 left-0 w-full h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(232,197,71,0.15) 30%, rgba(232,197,71,0.15) 70%, transparent 100%)' }} />
          <div className="absolute top-[calc(25%+2px)] left-0 w-full h-px" style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(232,197,71,0.06) 40%, rgba(232,197,71,0.06) 60%, transparent 90%)' }} />
          <div className="absolute bottom-1/4 left-0 w-full h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(232,197,71,0.1) 50%, transparent 100%)' }} />
        </div>

        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          {/* Overline badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full mb-10"
            style={{ backgroundColor: 'rgba(232,197,71,0.1)', border: '1px solid rgba(232,197,71,0.2)' }}
          >
            <Tag className="size-3.5" style={{ color: '#E8C547' }} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: '#E8C547' }}>
              Exclusive Archive Access
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-7xl sm:text-8xl lg:text-[10rem] font-black tracking-[-0.04em] leading-[0.85] mb-8"
          >
            <span style={{ color: '#eff8ee', textShadow: '0 0 80px rgba(232,197,71,0.15)' }}>SALE</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg sm:text-xl lg:text-2xl font-medium max-w-2xl mx-auto leading-relaxed mb-6"
            style={{ color: 'rgba(239,248,238,0.55)' }}
          >
            Elevated botanicals at reduced pricing. Same lab-verified potency, 
            same premium formulation — exclusively priced.
          </motion.p>

          {/* Discount highlight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl mb-14"
            style={{ backgroundColor: 'rgba(232,197,71,0.08)', border: '1px solid rgba(232,197,71,0.12)' }}
          >
            <Percent className="size-5" style={{ color: '#E8C547' }} />
            <span className="text-sm font-bold" style={{ color: '#E8C547' }}>Up to 30% off select products</span>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col items-center gap-3"
          >
            <span className="text-[9px] font-bold uppercase tracking-[0.3em]" style={{ color: 'rgba(239,248,238,0.3)' }}>
              Explore Deals
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            >
              <ArrowDown className="size-4" style={{ color: 'rgba(239,248,238,0.25)' }} />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════ PERKS BAR ═══════════════ */}
      <section className="relative z-10 border-y" style={{ borderColor: 'rgba(239,248,238,0.06)', backgroundColor: 'rgba(4,14,7,0.8)', backdropFilter: 'blur(20px)' }}>
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x" style={{ divideColor: 'rgba(239,248,238,0.06)' }}>
            {perks.map((perk, idx) => (
              <motion.div
                key={perk.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="flex items-center gap-5 py-8 md:py-10 px-2 md:px-8 first:pl-0 last:pr-0"
              >
                <div className="size-12 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(232,197,71,0.08)', border: '1px solid rgba(232,197,71,0.12)' }}>
                  <perk.icon className="size-5" style={{ color: '#E8C547' }} />
                </div>
                <div>
                  <h3 className="text-sm font-bold mb-1" style={{ color: '#eff8ee' }}>{perk.title}</h3>
                  <p className="text-xs font-medium" style={{ color: 'rgba(239,248,238,0.45)' }}>{perk.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ PRODUCTS ═══════════════ */}
      <section className="py-20 md:py-28" style={{ background: 'linear-gradient(180deg, #040e07 0%, #082f1d 50%, #040e07 100%)' }}>
        <div className="container mx-auto px-6 md:px-12">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14"
          >
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] block mb-3" style={{ color: '#E8C547' }}>
                Curated Selection
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight" style={{ color: '#eff8ee' }}>
                Current Offers
              </h2>
            </div>
            <p className="text-sm font-medium max-w-sm" style={{ color: 'rgba(239,248,238,0.45)' }}>
              Hand-picked products from our archive, available at exclusive pricing for a limited time.
            </p>
          </motion.div>

          {/* Divider */}
          <div className="h-px w-full mb-14" style={{ background: 'linear-gradient(90deg, rgba(232,197,71,0.2) 0%, rgba(232,197,71,0.05) 50%, transparent 100%)' }} />

          {/* Product grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="animate-pulse"
                >
                  <div className="aspect-[4/5] rounded-[20px]" style={{ background: 'linear-gradient(to bottom, rgba(239,248,238,0.03), rgba(239,248,238,0.06))' }} />
                </motion.div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-32 flex flex-col items-center text-center"
            >
              <div className="size-16 rounded-2xl flex items-center justify-center mb-5 rotate-3" style={{ backgroundColor: 'rgba(232,197,71,0.08)' }}>
                <Tag className="size-7 -rotate-3" style={{ color: 'rgba(232,197,71,0.3)' }} />
              </div>
              <h3 className="text-lg font-black tracking-tight mb-1.5" style={{ color: '#eff8ee' }}>No active deals</h3>
              <p className="text-sm mb-6 max-w-xs font-medium" style={{ color: 'rgba(239,248,238,0.5)' }}>
                Check back soon — new offers drop regularly.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {products.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════ BOTTOM CTA ═══════════════ */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(232,197,71,0.06), transparent 70%)' }} />
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight mb-4" style={{ color: '#eff8ee' }}>
              Don&apos;t miss out
            </h3>
            <p className="text-sm font-medium mb-8" style={{ color: 'rgba(239,248,238,0.45)' }}>
              Subscribe to be the first to know when new deals drop and get exclusive access to members-only pricing.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full sm:flex-1 h-12 px-5 rounded-xl text-sm font-medium outline-none transition-all border"
                style={{ 
                  backgroundColor: 'rgba(239,248,238,0.04)', 
                  borderColor: 'rgba(239,248,238,0.08)', 
                  color: '#eff8ee' 
                }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(232,197,71,0.3)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(239,248,238,0.08)'; }}
              />
              <button className="w-full sm:w-auto h-12 px-8 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 hover:shadow-[0_4px_24px_rgba(232,197,71,0.25)]" style={{ backgroundColor: '#E8C547', color: '#040e07' }}>
                Notify Me
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

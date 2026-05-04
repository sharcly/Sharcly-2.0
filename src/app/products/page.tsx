"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  SlidersHorizontal,
  X,
  ChevronDown,
  Grid3X3,
  LayoutGrid,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ProductCard } from "@/components/product-card";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSeo } from "@/hooks/use-seo";

const FALLBACK_PRODUCTS = [
  { id: "f1", name: "Chill Series Gummies", slug: "chill-series-gummies", price: 45, description: "Advanced relaxation formula for slow evenings and deep rest.", category: { name: "Chill Series" }, images: ["https://i.postimg.cc/T3qHks4z/Sharcly-Chill-Collection.jpg"] },
  { id: "f2", name: "Lift Series Vapes", slug: "lift-series-vapes", price: 65, description: "Precision energy boost for focused creative sessions.", category: { name: "Lift Series" }, images: ["https://i.postimg.cc/9F7Kz7H4/Sharcly-Lift-Series.jpg"] },
  { id: "f3", name: "Sleep Series Tincture", slug: "sleep-series-tincture", price: 55, description: "Natural sleep induction system with targeted terpene profile.", category: { name: "Sleep Series" }, images: ["https://i.postimg.cc/vHgY9D41/Daytime-Clarity.jpg"] },
  { id: "f4", name: "Balance Series Softgels", slug: "balance-series-softgels", price: 60, description: "Daily reset for consistent internal rhythm and clarity.", category: { name: "Balance Series" }, images: ["https://i.postimg.cc/K8nwpV4T/Premium-Hemp-Essentials-Sharcly.jpg"] },
  { id: "f5", name: "Chill Series Oil", slug: "chill-series-oil", price: 75, description: "Full-spectrum relaxation delivered with botanical precision.", category: { name: "Chill Series" }, images: ["https://i.postimg.cc/T3qHks4z/Sharcly-Chill-Collection.jpg"] },
  { id: "f6", name: "Lift Series Gummies", slug: "lift-series-gummies", price: 40, description: "Fast-acting energy hits for the modern rhythm.", category: { name: "Lift Series" }, images: ["https://i.postimg.cc/9F7Kz7H4/Sharcly-Lift-Series.jpg"] }
];

const SERIES_TABS = [
  { id: "all", name: "All" },
  { id: "chill", name: "Chill" },
  { id: "lift", name: "Lift" },
  { id: "sleep", name: "Sleep" },
  { id: "balance", name: "Balance" },
];

const SORT_OPTIONS = [
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price ↑" },
  { id: "price-desc", label: "Price ↓" }
];

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: '#040e07' }} />}>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const seriesParam = searchParams.get("series");
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSeries, setSelectedSeries] = useState(seriesParam || "all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const [gridCols, setGridCols] = useState<2 | 3>(3);

  useSeo("products");

  useEffect(() => {
    if (seriesParam) setSelectedSeries(seriesParam);
  }, [seriesParam]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      params.append("sort", sortOrder);
      const response = await apiClient.get(`/products?${params.toString()}`);
      const fetched = response.data.products || [];
      let final = fetched.length > 0 ? fetched : FALLBACK_PRODUCTS;
      if (selectedSeries !== "all") {
        final = final.filter((p: any) => 
          p.category?.name?.toLowerCase().includes(selectedSeries) ||
          p.name?.toLowerCase().includes(selectedSeries)
        );
      }
      setProducts(final);
    } catch (error: any) {
      setProducts(FALLBACK_PRODUCTS.filter((p: any) => 
        selectedSeries === "all" || p.category.name.toLowerCase().includes(selectedSeries)
      ));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 400);
    return () => clearTimeout(timer);
  }, [search, selectedSeries, sortOrder]);

  const activeSort = SORT_OPTIONS.find(s => s.id === sortOrder);

  return (
    <div className="min-h-screen antialiased" style={{ background: 'linear-gradient(175deg, #040e07 0%, #082f1d 50%, #040e07 100%)', color: '#eff8ee' }}>
      <Navbar />

      <div className="pt-28" />

      {/* ═══ STICKY TAB BAR ═══ */}
      <div className="sticky top-[64px] z-30 backdrop-blur-2xl" style={{ backgroundColor: 'rgba(4,14,7,0.85)', borderBottom: '1px solid rgba(239,248,238,0.06)' }}>
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between gap-4 py-3">
            {/* Series Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar -mx-1 px-1">
              {SERIES_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedSeries(tab.id)}
                  className={cn(
                    "relative px-4 py-2 text-[11px] font-bold uppercase tracking-[0.08em] transition-all duration-300 whitespace-nowrap rounded-lg",
                    selectedSeries === tab.id 
                      ? "text-[#E8C547]" 
                      : "text-[#eff8ee]/80 hover:text-[#eff8ee]"
                  )}
                >
                  {tab.name}
                  {selectedSeries === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-lg -z-10"
                      style={{ backgroundColor: 'rgba(232,197,71,0.08)', border: '1px solid rgba(232,197,71,0.15)' }}
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Search */}
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5" style={{ color: 'rgba(239,248,238,0.8)' }} />
                <input 
                  placeholder="Search..."
                  className="w-40 focus:w-56 h-9 pl-9 pr-3 rounded-lg transition-all text-[11px] font-semibold outline-none border"
                  style={{ backgroundColor: 'rgba(239,248,238,0.05)', borderColor: 'transparent', color: '#eff8ee', }}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(232,197,71,0.2)'; e.target.style.backgroundColor = 'rgba(239,248,238,0.08)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'transparent'; e.target.style.backgroundColor = 'rgba(239,248,238,0.05)'; }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 size-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(239,248,238,0.15)' }}>
                    <X className="size-2.5 text-[#eff8ee]" />
                  </button>
                )}
              </div>

              {/* Sort */}
              <div className="relative">
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className="h-9 px-3.5 rounded-lg transition-all flex items-center gap-1.5 text-[11px] font-bold"
                  style={{ backgroundColor: 'rgba(239,248,238,0.05)', color: 'rgba(239,248,238,0.9)' }}
                >
                  {activeSort?.label} <ChevronDown className={cn("size-3 transition-transform duration-200", sortOpen && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {sortOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setSortOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        className="absolute right-0 top-11 w-44 rounded-xl p-1.5 z-50"
                        style={{ backgroundColor: '#0d2518', border: '1px solid rgba(232,197,71,0.15)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
                      >
                        {SORT_OPTIONS.map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => { setSortOrder(opt.id); setSortOpen(false); }}
                            className={cn(
                              "w-full text-left px-3 py-2 rounded-lg text-[11px] font-bold transition-all",
                              sortOrder === opt.id ? "bg-[#E8C547] text-[#082f1d]" : "text-[#eff8ee]/80 hover:text-[#eff8ee] hover:bg-[#eff8ee]/10"
                            )}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile filter */}
              <Sheet>
                <SheetTrigger asChild>
                  <button className="sm:hidden h-9 px-3 rounded-lg transition-all flex items-center gap-1.5 text-[11px] font-bold" style={{ backgroundColor: 'rgba(239,248,238,0.05)', color: 'rgba(239,248,238,0.9)' }}>
                    <SlidersHorizontal className="size-3.5" />
                  </button>
                </SheetTrigger>
                <SheetContent side="bottom" className="rounded-t-3xl p-8 max-h-[70vh]" style={{ backgroundColor: '#082f1d', borderColor: 'rgba(232,197,71,0.1)' }}>
                  <SheetHeader className="mb-8">
                    <SheetTitle className="text-left text-lg font-black tracking-tight" style={{ color: '#eff8ee' }}>Filter & Sort</SheetTitle>
                  </SheetHeader>
                  <div className="relative mb-6">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4" style={{ color: 'rgba(239,248,238,0.8)' }} />
                    <input placeholder="Search products..." className="w-full h-12 pl-11 pr-4 rounded-xl text-sm font-semibold outline-none" style={{ backgroundColor: 'rgba(239,248,238,0.06)', color: '#eff8ee' }} value={search} onChange={(e) => setSearch(e.target.value)} />
                  </div>
                  <div className="space-y-3 mb-8">
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(239,248,238,0.8)' }}>Series</span>
                    <div className="flex flex-wrap gap-2">
                      {SERIES_TABS.map(tab => (
                        <button key={tab.id} onClick={() => setSelectedSeries(tab.id)} className={cn("px-4 py-2.5 rounded-xl text-xs font-bold transition-all", selectedSeries === tab.id ? "bg-[#E8C547] text-[#082f1d]" : "text-[#eff8ee]/80")} style={selectedSeries !== tab.id ? { backgroundColor: 'rgba(239,248,238,0.06)' } : {}}>
                          {tab.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(239,248,238,0.8)' }}>Sort</span>
                    <div className="flex flex-wrap gap-2">
                      {SORT_OPTIONS.map(opt => (
                        <button key={opt.id} onClick={() => setSortOrder(opt.id)} className={cn("px-4 py-2.5 rounded-xl text-xs font-bold transition-all", sortOrder === opt.id ? "bg-[#E8C547] text-[#082f1d]" : "text-[#eff8ee]/80")} style={sortOrder !== opt.id ? { backgroundColor: 'rgba(239,248,238,0.06)' } : {}}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ ACTIVE FILTER CHIPS ═══ */}
      {(selectedSeries !== "all" || search) && (
        <div className="container mx-auto px-6 md:px-12 pt-5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-widest mr-1" style={{ color: 'rgba(239,248,238,0.8)' }}>Active:</span>
            {selectedSeries !== "all" && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setSelectedSeries("all")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide transition-colors"
                style={{ backgroundColor: 'rgba(232,197,71,0.15)', color: '#E8C547', border: '1px solid rgba(232,197,71,0.25)' }}
              >
                {SERIES_TABS.find(t => t.id === selectedSeries)?.name} Series
                <X className="size-3" />
              </motion.button>
            )}
            {search && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setSearch("")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wide transition-colors"
                style={{ backgroundColor: 'rgba(239,248,238,0.08)', color: 'rgba(239,248,238,0.6)' }}
              >
                &ldquo;{search}&rdquo; <X className="size-3" />
              </motion.button>
            )}
            <button onClick={() => { setSearch(""); setSelectedSeries("all"); }} className="text-[10px] font-bold transition-colors ml-2 underline underline-offset-2" style={{ color: 'rgba(239,248,238,0.8)' }}>
              Clear all
            </button>
          </div>
        </div>
      )}

      {/* ═══ PRODUCT GRID ═══ */}
      <main className="container mx-auto px-6 md:px-12 py-10 md:py-14">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className={cn("grid gap-6 md:gap-8", gridCols === 3 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-2")}>
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div key={`skel-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="animate-pulse">
                  <div className="aspect-[4/5] rounded-[20px]" style={{ background: 'linear-gradient(to bottom, rgba(239,248,238,0.03), rgba(239,248,238,0.06))' }} />
                </motion.div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-32 flex flex-col items-center text-center">
              <div className="size-16 rounded-2xl flex items-center justify-center mb-5 rotate-6" style={{ backgroundColor: 'rgba(239,248,238,0.05)' }}>
                <Search className="size-7 -rotate-6" style={{ color: 'rgba(239,248,238,0.1)' }} />
              </div>
              <h3 className="text-lg font-black tracking-tight mb-1.5" style={{ color: '#eff8ee' }}>Nothing here.</h3>
              <p className="text-[12px] mb-6 max-w-xs font-medium" style={{ color: 'rgba(239,248,238,0.8)' }}>No products match your current filters.</p>
              <button onClick={() => { setSearch(""); setSelectedSeries("all"); }} className="px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all" style={{ backgroundColor: '#E8C547', color: '#082f1d' }}>
                Reset Filters
              </button>
            </motion.div>
          ) : (
            <motion.div layout className={cn("grid gap-6 md:gap-8", gridCols === 3 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-2")}>
              {products.map((product, idx) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.45, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

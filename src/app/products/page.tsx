"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  ArrowRight,
  SlidersHorizontal,
  X,
  ChevronDown,
  Grid3X3,
  LayoutGrid,
  Sparkles
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
import Link from "next/link";

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
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
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
    <div className="min-h-screen bg-[#FAFAF8] text-[#062D1B] selection:bg-[#062D1B] selection:text-white antialiased">
      <Navbar />

      {/* ═══ PAGE TITLE — scrolls away ═══ */}
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex items-end justify-between pt-28 pb-6">
          <div className="flex items-baseline gap-4">
            <h1 className="text-[clamp(28px,3.5vw,42px)] font-black tracking-[-0.04em] leading-none">
              Products
            </h1>
            <span className="text-[11px] font-mono font-bold text-[#062D1B]/20 tabular-nums tracking-tight">
              ({loading ? "···" : products.length})
            </span>
          </div>
          {/* Grid toggle — desktop only */}
          <div className="hidden lg:flex items-center gap-1 bg-black/[0.03] rounded-lg p-0.5">
            <button onClick={() => setGridCols(3)} className={cn("p-2 rounded-md transition-all", gridCols === 3 ? "bg-white shadow-sm text-[#062D1B]" : "text-[#062D1B]/20 hover:text-[#062D1B]/40")}>
              <Grid3X3 className="size-3.5" />
            </button>
            <button onClick={() => setGridCols(2)} className={cn("p-2 rounded-md transition-all", gridCols === 2 ? "bg-white shadow-sm text-[#062D1B]" : "text-[#062D1B]/20 hover:text-[#062D1B]/40")}>
              <LayoutGrid className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ═══ STICKY TAB BAR — stays pinned on scroll ═══ */}
      <div className="sticky top-[64px] z-30 bg-[#FAFAF8]/90 backdrop-blur-2xl border-b border-black/[0.04]">
        <div className="container mx-auto px-6 md:px-12">
          {/* Tabs + controls */}
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
                      ? "text-[#062D1B]" 
                      : "text-[#062D1B]/25 hover:text-[#062D1B]/50"
                  )}
                >
                  {tab.name}
                  {selectedSeries === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-[#062D1B]/[0.05] rounded-lg -z-10"
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
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#062D1B]/15" />
                <input 
                  placeholder="Search..."
                  className="w-40 focus:w-56 h-9 pl-9 pr-3 rounded-lg bg-black/[0.03] hover:bg-black/[0.05] focus:bg-white focus:shadow-sm transition-all text-[11px] font-semibold placeholder:text-[#062D1B]/20 outline-none border border-transparent focus:border-black/[0.06]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 size-4 rounded-full bg-black/10 flex items-center justify-center hover:bg-black/20 transition-colors">
                    <X className="size-2.5 text-white" />
                  </button>
                )}
              </div>

              {/* Sort */}
              <div className="relative">
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className="h-9 px-3.5 rounded-lg bg-black/[0.03] hover:bg-black/[0.05] transition-all flex items-center gap-1.5 text-[11px] font-bold text-[#062D1B]/40"
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
                        className="absolute right-0 top-11 w-44 bg-white rounded-xl border border-black/[0.06] shadow-xl shadow-black/[0.06] p-1.5 z-50"
                      >
                        {SORT_OPTIONS.map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => { setSortOrder(opt.id); setSortOpen(false); }}
                            className={cn(
                              "w-full text-left px-3 py-2 rounded-lg text-[11px] font-bold transition-all",
                              sortOrder === opt.id ? "bg-[#062D1B] text-white" : "text-[#062D1B]/40 hover:bg-black/[0.03] hover:text-[#062D1B]"
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
                  <button className="sm:hidden h-9 px-3 rounded-lg bg-black/[0.03] hover:bg-black/[0.05] transition-all flex items-center gap-1.5 text-[11px] font-bold text-[#062D1B]/40">
                    <SlidersHorizontal className="size-3.5" />
                  </button>
                </SheetTrigger>
                <SheetContent side="bottom" className="rounded-t-3xl p-8 max-h-[70vh]">
                  <SheetHeader className="mb-8">
                    <SheetTitle className="text-left text-lg font-black tracking-tight">Filter & Sort</SheetTitle>
                  </SheetHeader>
                  {/* Mobile search */}
                  <div className="relative mb-6">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#062D1B]/15" />
                    <input placeholder="Search products..." className="w-full h-12 pl-11 pr-4 rounded-xl bg-black/[0.03] text-sm font-semibold placeholder:text-[#062D1B]/20 outline-none" value={search} onChange={(e) => setSearch(e.target.value)} />
                  </div>
                  {/* Mobile series */}
                  <div className="space-y-3 mb-8">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#062D1B]/25">Series</span>
                    <div className="flex flex-wrap gap-2">
                      {SERIES_TABS.map(tab => (
                        <button key={tab.id} onClick={() => setSelectedSeries(tab.id)} className={cn("px-4 py-2.5 rounded-xl text-xs font-bold transition-all", selectedSeries === tab.id ? "bg-[#062D1B] text-white" : "bg-black/[0.03] text-[#062D1B]/40")}>
                          {tab.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Mobile sort */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#062D1B]/25">Sort</span>
                    <div className="flex flex-wrap gap-2">
                      {SORT_OPTIONS.map(opt => (
                        <button key={opt.id} onClick={() => setSortOrder(opt.id)} className={cn("px-4 py-2.5 rounded-xl text-xs font-bold transition-all", sortOrder === opt.id ? "bg-[#062D1B] text-white" : "bg-black/[0.03] text-[#062D1B]/40")}>
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
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#062D1B]/15 mr-1">Active:</span>
            {selectedSeries !== "all" && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setSelectedSeries("all")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#062D1B] text-white text-[10px] font-bold uppercase tracking-wide hover:bg-[#062D1B]/80 transition-colors"
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#062D1B]/10 text-[#062D1B] text-[10px] font-bold tracking-wide hover:bg-[#062D1B]/20 transition-colors"
              >
                &ldquo;{search}&rdquo; <X className="size-3" />
              </motion.button>
            )}
            <button onClick={() => { setSearch(""); setSelectedSeries("all"); }} className="text-[10px] font-bold text-[#062D1B]/15 hover:text-[#062D1B]/40 transition-colors ml-2 underline underline-offset-2">
              Clear all
            </button>
          </div>
        </div>
      )}

      {/* ═══ PRODUCT GRID ═══ */}
      <main className="container mx-auto px-6 md:px-12 py-10 md:py-14">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className={cn("grid gap-5 md:gap-6", gridCols === 3 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3" : "grid-cols-1 sm:grid-cols-2")}>
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div key={`skel-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="animate-pulse">
                  <div className="aspect-[4/5] bg-gradient-to-b from-black/[0.02] to-black/[0.05] rounded-2xl" />
                  <div className="pt-4 space-y-2 px-1">
                    <div className="h-3 bg-black/[0.04] rounded-full w-2/3" />
                    <div className="h-2.5 bg-black/[0.02] rounded-full w-1/3" />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-32 flex flex-col items-center text-center">
              <div className="size-16 rounded-2xl bg-black/[0.03] flex items-center justify-center mb-5 rotate-6">
                <Search className="size-7 text-[#062D1B]/10 -rotate-6" />
              </div>
              <h3 className="text-lg font-black tracking-tight mb-1.5">Nothing here.</h3>
              <p className="text-[12px] text-[#062D1B]/30 mb-6 max-w-xs font-medium">No products match your current filters. Try something different.</p>
              <Button onClick={() => { setSearch(""); setSelectedSeries("all"); }} variant="outline" className="rounded-full px-6 h-10 border-black/[0.06] text-[10px] font-bold uppercase tracking-widest hover:bg-[#062D1B] hover:text-white hover:border-[#062D1B] transition-all">
                Reset Filters
              </Button>
            </motion.div>
          ) : (
            <motion.div layout className={cn("grid gap-5 md:gap-6", gridCols === 3 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3" : "grid-cols-1 sm:grid-cols-2")}>
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

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
      let final = fetched;
      if (selectedSeries !== "all") {
        final = final.filter((p: any) => 
          p.category?.name?.toLowerCase().includes(selectedSeries) ||
          p.name?.toLowerCase().includes(selectedSeries)
        );
      }
      setProducts(final);
    } catch (error: any) {
      setProducts([]);
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

      {/* ═══ STICKY TAB BAR (MOBILE ONLY) ═══ */}
      <div className="lg:hidden sticky top-[64px] z-30 backdrop-blur-2xl" style={{ backgroundColor: 'rgba(4,14,7,0.85)', borderBottom: '1px solid rgba(239,248,238,0.06)' }}>
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

      <div className="container mx-auto px-6 md:px-12 py-10 md:py-14 flex flex-col lg:flex-row gap-12 lg:gap-16">
        
        {/* ═══ LEFT SIDEBAR (DESKTOP) ═══ */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-32 space-y-12">
            
            {/* Search */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(239,248,238,0.5)' }}>Search</h3>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4" style={{ color: 'rgba(239,248,238,0.6)' }} />
                <input 
                  placeholder="Find products..."
                  className="w-full h-12 pl-12 pr-4 rounded-xl transition-all text-sm font-semibold outline-none border"
                  style={{ backgroundColor: 'rgba(239,248,238,0.03)', borderColor: 'rgba(239,248,238,0.08)', color: '#eff8ee', }}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(232,197,71,0.3)'; e.target.style.backgroundColor = 'rgba(239,248,238,0.06)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(239,248,238,0.08)'; e.target.style.backgroundColor = 'rgba(239,248,238,0.03)'; }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 size-5 rounded-full flex items-center justify-center transition-colors hover:bg-[#eff8ee]/20" style={{ backgroundColor: 'rgba(239,248,238,0.1)' }}>
                    <X className="size-3 text-[#eff8ee]" />
                  </button>
                )}
              </div>
            </div>

            {/* Series / Categories */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(239,248,238,0.5)' }}>Collections</h3>
              <div className="flex flex-col gap-1.5">
                {SERIES_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedSeries(tab.id)}
                    className={cn(
                      "relative px-4 py-3 text-xs font-bold tracking-wide transition-all duration-300 rounded-xl text-left flex items-center justify-between group",
                      selectedSeries === tab.id 
                        ? "text-[#E8C547]" 
                        : "text-[#eff8ee]/70 hover:text-[#eff8ee] hover:bg-[#eff8ee]/5"
                    )}
                  >
                    <span className="relative z-10">{tab.name}</span>
                    {selectedSeries === tab.id && (
                      <motion.div
                        layoutId="activeSidebarTab"
                        className="absolute inset-0 rounded-xl -z-10"
                        style={{ backgroundColor: 'rgba(232,197,71,0.08)', border: '1px solid rgba(232,197,71,0.15)' }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    {selectedSeries === tab.id && (
                      <div className="size-1.5 rounded-full bg-[#E8C547] shadow-[0_0_8px_rgba(232,197,71,0.8)] relative z-10" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(239,248,238,0.5)' }}>Sort By</h3>
              <div className="flex flex-col gap-1.5">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSortOrder(opt.id)}
                    className={cn(
                      "px-4 py-2.5 text-xs font-semibold transition-all duration-300 rounded-lg text-left flex items-center gap-3",
                      sortOrder === opt.id 
                        ? "text-[#eff8ee] bg-[#eff8ee]/10" 
                        : "text-[#eff8ee]/50 hover:text-[#eff8ee]/90 hover:bg-[#eff8ee]/5"
                    )}
                  >
                    <div className={cn("size-3 rounded-full border flex items-center justify-center", sortOrder === opt.id ? "border-[#eff8ee]" : "border-[#eff8ee]/30")}>
                      {sortOrder === opt.id && <div className="size-1.5 rounded-full bg-[#eff8ee]" />}
                    </div>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </aside>

        {/* ═══ MAIN CONTENT ═══ */}
        <main className="flex-1 min-w-0">
          {/* ═══ ACTIVE FILTER CHIPS ═══ */}
          {(selectedSeries !== "all" || search) && (
            <div className="mb-8 flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-widest mr-1" style={{ color: 'rgba(239,248,238,0.8)' }}>Active Filters:</span>
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
                  style={{ backgroundColor: 'rgba(239,248,238,0.08)', color: 'rgba(239,248,238,0.8)' }}
                >
                  &ldquo;{search}&rdquo; <X className="size-3" />
                </motion.button>
              )}
              <button onClick={() => { setSearch(""); setSelectedSeries("all"); }} className="text-[10px] font-bold transition-colors ml-2 underline underline-offset-4" style={{ color: 'rgba(239,248,238,0.5)' }}>
                Clear all
              </button>
            </div>
          )}

          {/* ═══ PRODUCT GRID ═══ */}
          <AnimatePresence mode="popLayout">
            {loading ? (
              <div className="grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
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
              <motion.div layout className="grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
      </div>

      <Footer />
    </div>
  );
}

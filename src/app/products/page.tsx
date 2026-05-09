"use client";

import { useEffect, useState, Suspense, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { apiClient } from "@/lib/api-client";
import {
  Search,
  X,
  ChevronDown,
  LayoutGrid,
  List,
  Filter,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton, ProductCardSkeleton } from "@/components/ui/skeletons";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSeo } from "@/hooks/use-seo";

const SERIES_TABS = [
  { id: "all", name: "All Products", color: "var(--gold)" },
  { id: "chill", name: "Chill Series", color: "rgba(220,38,38,0.85)" },
  { id: "lift", name: "Lift Series", color: "rgba(124,58,237,0.85)" },
  { id: "sleep", name: "Sleep Series", color: "rgba(30,64,175,0.85)" },
  { id: "balance", name: "Balance Series", color: "rgba(217,119,6,0.85)" },
  { id: "entourage", name: "Entourage Series", color: "rgba(234,88,12,0.85)" },
  { id: "vape", name: "Vape Series", color: "rgba(15,23,42,0.9)" },
];

const SORT_OPTIONS = [
  { id: "newest", label: "Newest First" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "best-selling", label: "Best Selling" },
  { id: "top-rated", label: "Top Rated" },
];

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#040e07]" />}>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const seriesParam = searchParams.get("series");

  const [products, setProducts] = useState<any[]>([]);
  const [flavours, setFlavours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedSeries, setSelectedSeries] = useState(seriesParam || "all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedFlavour, setSelectedFlavour] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useSeo("products");

  useEffect(() => {
    if (seriesParam) setSelectedSeries(seriesParam);
    
    // Fetch flavours
    apiClient.get("/products/flavours")
      .then(res => setFlavours(res.data.flavours || []))
      .catch(() => setFlavours([]));
  }, [seriesParam]);

  const fetchProducts = async (pageNum = 1, isLoadMore = false) => {
    if (isLoadMore) setLoadingMore(true);
    else {
      setLoading(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      params.append("sort", sortOrder);
      params.append("page", pageNum.toString());
      if (selectedSeries !== "all") params.append("category", selectedSeries);
      if (selectedFlavour !== "all") params.append("flavour", selectedFlavour);

      const response = await apiClient.get(`/products?${params.toString()}`);
      const newProducts = response.data.products || [];
      const pagination = response.data.pagination;

      if (isLoadMore) {
        setProducts(prev => [...prev, ...newProducts]);
      } else {
        setProducts(newProducts);
      }

      setHasMore(pagination ? pageNum < pagination.pages : newProducts.length >= 12);
      setPage(pageNum);
    } catch (error: any) {
      if (!isLoadMore) setProducts([]);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchProducts(1, false), 400);
    return () => clearTimeout(timer);
  }, [search, selectedSeries, sortOrder, selectedFlavour]);

  const observerTarget = useRef(null);

  useEffect(() => {
    if (loading || loadingMore || !hasMore) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore) {
          fetchProducts(page + 1, true);
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loading, loadingMore, hasMore, page, search, selectedSeries, sortOrder]);

  const FilterSheetContent = () => (
    <div className="space-y-10 pb-12">
      {/* Search */}
      <div className="relative group">
        <Search className="absolute left-[12px] top-1/2 -translate-y-1/2 size-[15px] text-[#eff8ee]/30" />
        <input
          type="text"
          placeholder="Search products..."
          className="w-full bg-[rgba(239,248,238,0.05)] border border-[var(--border)] rounded-[16px] pl-[38px] pr-[14px] py-[14px] text-[15px] text-[#eff8ee] outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Series */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#eff8ee]/30">Collections</h4>
        <div className="grid grid-cols-2 gap-2">
          {SERIES_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedSeries(tab.id)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-[12px] border text-xs font-bold transition-all",
                selectedSeries === tab.id ? "bg-[var(--gold)]/10 border-[var(--gold)]/30 text-[var(--gold)]" : "bg-white/5 border-transparent text-[#eff8ee]/60"
              )}
            >
              <div className="size-2 rounded-full" style={{ backgroundColor: tab.color }} />
              {tab.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#eff8ee]/30">Sort By</h4>
        <div className="space-y-2">
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => setSortOrder(opt.id)}
              className={cn(
                "w-full flex items-center justify-between p-4 rounded-[16px] border text-sm font-bold transition-all",
                sortOrder === opt.id ? "bg-[var(--gold)]/10 border-[var(--gold)]/30 text-[var(--gold)]" : "bg-white/5 border-transparent text-[#eff8ee]/50"
              )}
            >
              {opt.label}
              {sortOrder === opt.id && <div className="size-2 rounded-full bg-[var(--gold)]" />}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => setIsFilterOpen(false)}
        className="w-full py-5 bg-[var(--gold)] text-[#082f1d] rounded-2xl text-sm font-bold uppercase tracking-widest shadow-xl active:scale-95 transition-transform"
      >
        Apply Filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#040e07] text-[#eff8ee] selection:bg-[#E8C547]/20 selection:text-[#E8C547]">
      <Navbar />

      {/* ═══ PAGE HEADER ═══ */}
      <header className="relative pt-[120px] pb-[40px] px-8 md:px-[64px] border-b border-[var(--border)] overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[radial-gradient(ellipse_at_top,rgba(232,197,71,0.08),transparent_70%)] pointer-events-none" />

        <div className="relative z-10 max-w-[1400px] mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-bold text-[#E8C547]/75 uppercase tracking-[0.22em]">
              • Sharcly Collection •
            </span>
          </div>
          <h1 className="font-serif font-bold text-[clamp(36px,4.5vw,64px)] leading-[1.1] mb-4">
            Shop <span className="italic text-[var(--gold)]">All</span> Series.
          </h1>
          <p className="text-[14px] text-[var(--muted)] max-w-[480px] leading-relaxed">
            Six curated lines. Every mood, every moment. Lab-tested, organically grown, and crafted for people who take their wellness seriously.
          </p>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-screen">

        {/* ═══ SIDEBAR ═══ */}
        <aside className="hidden lg:block w-[280px] sticky top-0 h-screen bg-[rgba(4,14,7,0.6)] backdrop-blur-[8px] border-r border-[var(--border)] px-[28px] py-[36px] overflow-y-auto no-scrollbar">
          <div className="space-y-12">

            {/* Search */}
            <section className="space-y-4">
              <label className="block text-[9px] font-bold uppercase tracking-[0.22em] text-[#eff8ee]/30 pb-[10px] border-b border-[var(--border)] relative after:content-[''] after:absolute after:bottom-[-1px] after:left-0 after:w-1/2 after:h-[1px] after:bg-gradient-to-r after:from-[var(--gold)]/30 after:to-transparent">
                Search
              </label>
              <div className="relative group">
                <Search className="absolute left-[12px] top-1/2 -translate-y-1/2 size-[15px] text-[#eff8ee]/30 transition-colors group-focus-within:text-[var(--gold)]/50" />
                <input
                  type="text"
                  placeholder="Find products..."
                  className="w-full bg-[rgba(239,248,238,0.035)] border border-[var(--border)] rounded-[12px] pl-[38px] pr-[14px] py-[11px] text-[13px] text-[#eff8ee] placeholder:text-[#eff8ee]/25 outline-none transition-all focus:border-[var(--gold)]/35 focus:ring-[3px] focus:ring-[var(--gold)]/10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </section>

            {/* Collections */}
            <section className="space-y-4">
              <label className="block text-[9px] font-bold uppercase tracking-[0.22em] text-[#eff8ee]/30 pb-[10px] border-b border-[var(--border)] relative after:content-[''] after:absolute after:bottom-[-1px] after:left-0 after:w-1/2 after:h-[1px] after:bg-gradient-to-r after:from-[var(--gold)]/30 after:to-transparent">
                Collections
              </label>
              <div className="space-y-1">
                {SERIES_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedSeries(tab.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-[14px] py-[10px] rounded-[10px] border border-transparent text-[13px] font-medium transition-all duration-300",
                      selectedSeries === tab.id
                        ? "bg-[rgba(232,197,71,0.08)] border-[var(--gold)]/25 text-[var(--gold)] font-semibold"
                        : "text-[#eff8ee]/55 hover:bg-[rgba(239,248,238,0.04)] hover:text-[#eff8ee] hover:border-[var(--border)]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-2 rounded-full" style={{ backgroundColor: tab.color, boxShadow: selectedSeries === tab.id ? `0 0 8px ${tab.color}` : 'none' }} />
                      {tab.name}
                    </div>
                    {selectedSeries === tab.id ? (
                      <div className="size-1.5 rounded-full bg-[var(--gold)] shadow-[0_0_8px_var(--gold)]" />
                    ) : (
                      <span className="text-[10px] bg-[rgba(239,248,238,0.035)] px-2 py-0.5 rounded-full opacity-50">12</span>
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* Sort By */}
            <section className="space-y-4">
              <label className="block text-[9px] font-bold uppercase tracking-[0.22em] text-[#eff8ee]/30 pb-[10px] border-b border-[var(--border)] relative after:content-[''] after:absolute after:bottom-[-1px] after:left-0 after:w-1/2 after:h-[1px] after:bg-gradient-to-r after:from-[var(--gold)]/30 after:to-transparent">
                Sort By
              </label>
              <div className="space-y-1">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSortOrder(opt.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-[14px] py-[9px] rounded-[10px] text-[13px] transition-all",
                      sortOrder === opt.id ? "text-[#eff8ee]" : "text-[#eff8ee]/50"
                    )}
                  >
                    <div className={cn(
                      "size-4 rounded-full border-[1.5px] flex items-center justify-center transition-all",
                      sortOrder === opt.id ? "border-[var(--gold)] bg-[var(--gold)]/10" : "border-[#eff8ee]/20"
                    )}>
                      {sortOrder === opt.id && <div className="size-1.5 rounded-full bg-[var(--gold)]" />}
                    </div>
                    {opt.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Flavours */}
            <section className="space-y-4">
              <label className="block text-[9px] font-bold uppercase tracking-[0.22em] text-[#eff8ee]/30 pb-[10px] border-b border-[var(--border)] relative after:content-[''] after:absolute after:bottom-[-1px] after:left-0 after:w-1/2 after:h-[1px] after:bg-gradient-to-r after:from-[var(--gold)]/30 after:to-transparent">
                Flavour
              </label>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedFlavour("all")}
                  className={cn(
                    "w-full flex items-center gap-3 px-[14px] py-[9px] rounded-[10px] text-[13px] transition-all",
                    selectedFlavour === "all" ? "text-[#eff8ee]" : "text-[#eff8ee]/50"
                  )}
                >
                  <div className={cn(
                    "size-4 rounded-full border-[1.5px] flex items-center justify-center transition-all",
                    selectedFlavour === "all" ? "border-[var(--gold)] bg-[var(--gold)]/10" : "border-[#eff8ee]/20"
                  )}>
                    {selectedFlavour === "all" && <div className="size-1.5 rounded-full bg-[var(--gold)]" />}
                  </div>
                  All Flavours
                </button>
                {flavours.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedFlavour(opt.slug)}
                    className={cn(
                      "w-full flex items-center gap-3 px-[14px] py-[9px] rounded-[10px] text-[13px] transition-all",
                      selectedFlavour === opt.slug ? "text-[#eff8ee]" : "text-[#eff8ee]/50"
                    )}
                  >
                    <div className={cn(
                      "size-4 rounded-full border-[1.5px] flex items-center justify-center transition-all",
                      selectedFlavour === opt.slug ? "border-[var(--gold)] bg-[var(--gold)]/10" : "border-[#eff8ee]/20"
                    )}>
                      {selectedFlavour === opt.slug && <div className="size-1.5 rounded-full bg-[var(--gold)]" />}
                    </div>
                    {opt.name}
                  </button>
                ))}
              </div>
            </section>
          </div>
        </aside>

        {/* ═══ GRID AREA ═══ */}
        <main className="flex-1 p-8 md:p-[48px] pt-[28px]">

          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 pb-5 border-b border-[var(--border)]">
            <div className="text-[12px] text-[#eff8ee]/50 font-medium">
              <strong className="text-[#eff8ee]">{products.length}</strong> products found
            </div>

            {/* Active Chips */}
            <div className="flex flex-wrap items-center gap-2">
              <AnimatePresence>
                {selectedSeries !== "all" && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() => setSelectedSeries("all")}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/25 text-[11px] font-bold text-[var(--gold)] uppercase tracking-wider"
                  >
                    × {SERIES_TABS.find(s => s.id === selectedSeries)?.name}
                  </motion.button>
                )}
                {search && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() => setSearch("")}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#eff8ee]/5 border border-[#eff8ee]/10 text-[11px] font-medium text-[#eff8ee]/70"
                  >
                    × &ldquo;{search}&rdquo;
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "size-[34px] flex items-center justify-center rounded-[8px] transition-all",
                  viewMode === "grid" ? "bg-[var(--gold)]/15 text-[var(--gold)]" : "bg-[rgba(239,248,238,0.035)] text-[#eff8ee]/40"
                )}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "size-[34px] flex items-center justify-center rounded-[8px] transition-all",
                  viewMode === "list" ? "bg-[var(--gold)]/15 text-[var(--gold)]" : "bg-[rgba(239,248,238,0.035)] text-[#eff8ee]/40"
                )}
              >
                <List size={18} />
              </button>

              {/* Mobile Filter Trigger Icon */}
              <button
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden size-[34px] flex items-center justify-center rounded-[8px] bg-[rgba(239,248,238,0.035)] text-[#eff8ee]/40 hover:text-[var(--gold)] transition-all"
              >
                <Filter size={18} />
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <AnimatePresence mode="popLayout">
            {loading ? (
              <ProductGridSkeleton count={9} viewMode={viewMode} />
            ) : products.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-24 text-center"
              >
                <h3 className="text-xl font-serif text-[#eff8ee]/50 mb-4">No products found.</h3>
                <button
                  onClick={() => { setSelectedSeries("all"); setSearch(""); }}
                  className="px-6 py-3 bg-[var(--gold)] text-[#082f1d] rounded-full text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105 active:scale-95"
                >
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                layout
                className={cn(
                  "grid gap-8",
                  viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
                )}
              >
                {products.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <ProductCard product={product} viewMode={viewMode} />
                  </motion.div>
                ))}

                {/* Loading More Skeletons — Appended to the same grid */}
                {loadingMore && Array.from({ length: viewMode === "grid" ? 3 : 1 }).map((_, i) => (
                  <div key={`skeleton-${i}`} className="animate-in fade-in duration-500">
                    <ProductCardSkeleton viewMode={viewMode} />
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Infinite Scroll Sentinel */}
          <div ref={observerTarget} className="h-[100px] w-full flex items-center justify-center">
            {!hasMore && products.length > 0 && (
              <div className="flex flex-col items-center gap-4 py-12">
                <div className="h-px w-12 bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#eff8ee]/20">
                  End of Collection
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Filter Drawer (Shared Sheet) */}
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetContent side="left" className="bg-[#040e07] border-r border-[var(--border)] p-8 w-[300px] overflow-y-auto no-scrollbar">
          <SheetHeader className="mb-8 flex flex-row items-center justify-between">
            <SheetTitle className="text-left font-serif text-2xl text-[#eff8ee]">Filters</SheetTitle>
            <button onClick={() => setIsFilterOpen(false)} className="size-8 flex items-center justify-center rounded-full bg-white/5 text-[#eff8ee]/50 hover:text-[#eff8ee]">
              <X size={16} />
            </button>
          </SheetHeader>
          <FilterSheetContent />
        </SheetContent>
      </Sheet>

      {/* Mobile Floating Filters */}
      {/* <div className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="px-6 py-3 bg-[var(--gold)] text-[#082f1d] rounded-full text-xs font-bold uppercase tracking-widest shadow-2xl flex items-center gap-2 active:scale-95 transition-transform"
        >
          <Filter size={14} /> Filters1
        </button>
      </div> */}

      <Footer />
    </div>
  );
}

"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { apiClient } from "@/lib/api-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  ArrowRight,
  Filter,
  X,
  ChevronDown,
  SlidersHorizontal
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
  { id: "all", name: "All Expressions" },
  { id: "chill", name: "Chill Series" },
  { id: "lift", name: "Lift Series" },
  { id: "sleep", name: "Sleep Series" },
  { id: "balance", name: "Balance Series" },
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

  useSeo("products");

  // Sync state if URL param changes after mount
  useEffect(() => {
    if (seriesParam) {
      setSelectedSeries(seriesParam);
    }
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

  const FilterSidebar = () => (
    <aside className="space-y-12">
      <div className="space-y-4">
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#062D1B]/40">Search Collection</label>
        <div className="relative">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-3.5 text-[#062D1B]/20" />
           <input 
             placeholder="Search archive..."
             className="w-full h-11 pl-12 pr-4 rounded-full bg-neutral-50 focus:bg-neutral-100 transition-all text-xs font-bold placeholder:text-[#062D1B]/20 outline-none border-none"
             value={search}
             onChange={(e) => setSearch(e.target.value)}
           />
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#062D1B]/40">Categories</label>
        <div className="flex flex-col gap-1.5">
           {SERIES_TABS.map((tab) => (
             <button
               key={tab.id}
               onClick={() => setSelectedSeries(tab.id)}
               className={cn(
                 "text-left py-2 px-4 rounded-full text-xs font-bold transition-all",
                 selectedSeries === tab.id 
                  ? "bg-[#062D1B] text-white" 
                  : "text-[#062D1B]/40 hover:text-[#062D1B] hover:bg-neutral-50"
               )}
             >
               {tab.name}
             </button>
           ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#062D1B]/40">Sort By</label>
        <div className="flex flex-col gap-1.5">
           {[
             { id: "newest", label: "Newest Arrivals" },
             { id: "price-asc", label: "Price: Low to High" },
             { id: "price-desc", label: "Price: High to Low" }
           ].map((opt) => (
             <button
               key={opt.id}
               onClick={() => setSortOrder(opt.id)}
               className={cn(
                 "text-left py-2 px-4 rounded-full text-xs font-bold transition-all",
                 sortOrder === opt.id 
                  ? "bg-neutral-100 text-[#062D1B]" 
                  : "text-[#062D1B]/40 hover:text-[#062D1B]"
               )}
             >
               {opt.label}
             </button>
           ))}
        </div>
      </div>

      <div className="pt-8 border-t border-gray-50">
         <button 
           onClick={() => {setSearch(""); setSelectedSeries("all");}}
           className="text-[10px] font-bold uppercase tracking-widest text-[#062D1B]/20 hover:text-[#062D1B] transition-colors"
         >
            Reset Filters
         </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-white text-[#062D1B] selection:bg-[#062D1B] selection:text-white antialiased">
      <Navbar />
      
      <main className="pt-40">
        <div className="container mx-auto px-6 md:px-12">
          {/* Catalog Header */}
          <div className="mb-20 space-y-4 border-b border-gray-50 pb-12">
             <h1 className="text-4xl md:text-6xl font-medium tracking-tighter">The Shop.</h1>
             <p className="text-sm text-[#062D1B]/40">Curated essentials from the Sharcly archive.</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-20">
            
            {/* Desktop Sidebar Filter (Sticky) */}
            <div className="hidden lg:block w-64 shrink-0 h-fit sticky top-40">
               <FilterSidebar />
            </div>

            {/* Mobile Filter Trigger */}
            <div className="lg:hidden mb-8">
               <Sheet>
                  <SheetTrigger asChild>
                     <Button variant="outline" className="w-full h-12 rounded-full border-gray-100 gap-3 text-xs font-bold uppercase tracking-widest">
                        <SlidersHorizontal className="size-4" /> Refine Discovery
                     </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] p-8 border-r border-gray-100">
                     <SheetHeader className="mb-10">
                        <SheetTitle className="text-left text-2xl font-medium tracking-tighter">Refine.</SheetTitle>
                     </SheetHeader>
                     <FilterSidebar />
                  </SheetContent>
               </Sheet>
            </div>

            {/* Grid Area */}
            <div className="flex-1">
               <AnimatePresence mode="popLayout">
                 {loading ? (
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-y-20">
                     {Array.from({ length: 6 }).map((_, i) => (
                       <div key={i} className="space-y-6 animate-pulse">
                         <div className="aspect-[5/6] bg-neutral-50 rounded-xl" />
                         <div className="h-4 bg-neutral-50 rounded-full w-2/3" />
                       </div>
                     ))}
                   </div>
                 ) : (
                    <motion.div 
                      layout
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-x-8 lg:gap-y-20"
                    >
                      {products.map((product) => (
                        <div key={product.id}>
                          <ProductCard product={product} />
                        </div>
                      ))}
                    </motion.div>
                 )}
               </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { 
  Search, 
  X, 
  Package, 
  FileText, 
  ArrowRight,
  Loader2,
  TrendingUp,
  History,
  Command,
  Sparkles
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface SearchResult {
  products: any[];
  blogs: any[];
}

export function UniversalSearch({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults(null);
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.get(`/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.data.success) {
        setResults(response.data.results);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) handleSearch(query);
      else setResults(null);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  // Focus input when open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [open]);

  // Close search when path changes
  useEffect(() => {
    setOpen(false);
    setQuery("");
    setResults(null);
  }, [pathname, setOpen]);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* backdrop blur overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-[32px] z-[100]"
          />
          
          {/* Main search modal */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-4xl z-[101] px-6"
          >
            <div className="bg-white rounded-[3rem] shadow-[0_32px_128px_-32px_rgba(0,0,0,0.1)] border border-black/5 overflow-hidden flex flex-col">
              {/* Header / Input area */}
              <div className="p-8 pb-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-black/[0.02] rounded-[1.5rem] blur-2xl group-focus-within:bg-primary/5 transition-all duration-700" />
                  <div className="relative flex items-center h-20 px-8 bg-neutral-50/80 rounded-[1.5rem] border border-black/5 group-focus-within:border-primary/20 transition-all duration-500">
                    <Search className="size-6 text-[#062D1B]/20 group-focus-within:text-primary transition-colors" />
                    <Input
                      ref={inputRef}
                      placeholder="Search high-precision products or clinical journals..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="flex-1 h-full bg-transparent border-none text-2xl font-medium focus-visible:ring-0 placeholder:text-black/10 pl-6"
                    />
                    <div className="flex items-center gap-4">
                       {loading ? (
                          <Loader2 className="size-5 animate-spin text-black/20" />
                       ) : query ? (
                          <button onClick={() => setQuery("")} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                            <X className="size-5 text-black/20" />
                          </button>
                       ) : (
                          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white border border-black/5 rounded-full shadow-sm">
                            <Command className="size-3 text-black/40" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-black/30">AI Search</span>
                          </div>
                       )}
                       <div className="h-8 w-px bg-black/5 hidden sm:block" />
                       <button onClick={() => setOpen(false)} className="text-[10px] font-black uppercase tracking-wider text-black/40 hover:text-black transition-colors px-2">Exit</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto max-h-[65vh] p-8 pt-4 custom-scrollbar min-h-[400px]">
                {!query && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-8 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 text-amber-500">
                        <Sparkles className="size-4" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Curated Tags</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {["Elite Series", "Clinical Tincture", "Sleep Science", "Relaxation", "New Archives"].map((tag) => (
                          <button 
                            key={tag}
                            onClick={() => setQuery(tag)}
                            className="px-6 py-2.5 rounded-full border border-black/5 bg-black/[0.02] text-xs font-bold hover:bg-black hover:text-white transition-all duration-300"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 text-[#062D1B]/40">
                        <History className="size-4" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Quick Discovery</h4>
                      </div>
                      <div className="grid gap-3">
                         <Link href="/products" className="group flex items-center justify-between p-5 rounded-2xl bg-neutral-50 hover:bg-black transition-all duration-500">
                            <span className="text-sm font-bold group-hover:text-white">Shop Latest Release</span>
                            <ArrowRight className="size-4 text-black/20 group-hover:text-white" />
                         </Link>
                         <Link href="/blog" className="group flex items-center justify-between p-5 rounded-2xl bg-neutral-50 hover:bg-black transition-all duration-500">
                            <span className="text-sm font-bold group-hover:text-white">Read Clinical Journal</span>
                            <ArrowRight className="size-4 text-black/20 group-hover:text-white" />
                         </Link>
                      </div>
                    </div>
                  </div>
                )}

                {results && (
                  <div className="space-y-16 py-4">
                    {results.products.length > 0 && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                           <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30">Matching Products</h4>
                           <div className="h-px flex-1 bg-black/5" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {results.products.map((product) => (
                            <Link 
                              key={product.id} 
                              href={`/products/${product.slug}`}
                              className="flex items-center gap-6 p-4 rounded-3xl group bg-neutral-50/50 hover:bg-white border border-transparent hover:border-black/5 transition-all duration-500 hover:shadow-2xl hover:shadow-black/5"
                            >
                              <div className="size-20 rounded-2xl bg-white border border-black/5 overflow-hidden shrink-0 transition-transform group-hover:scale-105 duration-500">
                                {product.images?.[0] ? (
                                  <img 
                                    src={product.images[0].url || `http://localhost:8181/api/images/${product.images[0].id}`} 
                                    alt={product.name}
                                    className="size-full object-cover"
                                  />
                                ) : (
                                  <div className="size-full flex items-center justify-center opacity-10">
                                    <Package className="size-8" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-lg tracking-tight truncate leading-tight">{product.name}</p>
                                <p className="text-xs font-black uppercase tracking-widest text-[#062D1B]/40 mt-1">${Number(product.price).toFixed(2)}</p>
                              </div>
                              <ArrowRight className="size-5 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {results.blogs.length > 0 && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                           <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30">Clinical Journal Entries</h4>
                           <div className="h-px flex-1 bg-black/5" />
                        </div>
                        <div className="grid gap-3">
                          {results.blogs.map((blog) => (
                            <Link 
                              key={blog.id} 
                              href={`/blog/${blog.slug}`}
                              className="flex items-center gap-6 p-6 rounded-3xl hover:bg-black hover:text-white transition-all duration-500 group bg-neutral-50/50"
                            >
                              <div className="size-16 rounded-2xl bg-white flex items-center justify-center border border-black/5 shrink-0 group-hover:bg-neutral-900 transition-colors">
                                {blog.featuredImage ? (
                                  <img src={blog.featuredImage} alt={blog.title} className="size-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                ) : (
                                  <FileText className="size-6 text-black/10" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-lg tracking-tight leading-tight">{blog.title}</p>
                                <div className="flex items-center gap-3 mt-1.5 opacity-40">
                                   <span className="text-[10px] font-black uppercase tracking-widest italic">Research Piece</span>
                                </div>
                              </div>
                              <ArrowRight className="size-5 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {results.products.length === 0 && results.blogs.length === 0 && query && (
                      <div className="py-20 text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="size-20 rounded-full bg-neutral-50 flex items-center justify-center mx-auto mb-4 border border-black/5">
                           <Search className="size-8 text-black/10" />
                        </div>
                        <p className="text-xl font-bold text-black/40 italic">"No artifacts matched your neural query."</p>
                        <Button variant="outline" onClick={() => setQuery("")} className="rounded-full px-10 h-12 border-black/5 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white">Retry Analysis</Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Footer instruction bar */}
              <div className="px-12 py-4 bg-neutral-50 border-t border-black/5 flex items-center justify-between">
                <div className="flex gap-8">
                  <div className="flex items-center gap-2">
                    <kbd className="px-1.5 py-0.5 rounded border border-black/10 bg-white text-[9px] font-bold shadow-sm">ESC</kbd>
                    <span className="text-[9px] font-black uppercase tracking-widest text-black/30">to Dismiss</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary">
                    <kbd className="px-1.5 py-0.5 rounded border border-black/10 bg-white text-[9px] font-bold shadow-sm">TAB</kbd>
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-60">to Navigate</span>
                  </div>
                </div>
                <p className="text-[9px] font-black uppercase tracking-widest text-[#062D1B]/30">Sharcly Universal Catalog Engine v2.0</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { 
  Search, 
  X, 
  Package, 
  FileText, 
  ArrowRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api-client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getImageUrl } from "@/lib/image-utils";

interface SearchResult {
  products: any[];
  blogs: any[];
}

export function MiniSearch({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
      if (query.trim().length >= 2) {
        handleSearch(query);
      } else {
        setResults(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  // Focus input when open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  // Close search when path changes
  useEffect(() => {
    setOpen(false);
    setQuery("");
    setResults(null);
  }, [pathname, setOpen]);

  // Close on Outside Click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div 
          ref={containerRef}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="fixed left-4 right-4 top-[80px] sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-3 w-auto sm:w-[350px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/5 rounded-3xl shadow-2xl z-[100] overflow-hidden flex flex-col origin-top sm:origin-top-right"
          style={{ height: "300px" }}
        >
          {/* Search Input Area */}
          <div className="p-3 border-b border-black/5 dark:border-white/5">
            <div className="relative flex items-center bg-neutral-50 dark:bg-white/5 rounded-xl px-3 py-2 border border-transparent focus-within:border-primary/20 transition-all">
              <Search className="size-3.5 text-black/20 dark:text-white/20" />
              <Input
                ref={inputRef}
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 h-6 bg-transparent border-none text-xs text-black dark:text-white focus-visible:ring-0 placeholder:text-black/20 pl-2 pr-2"
              />
              {query && (
                <button onClick={() => setQuery("")}>
                  <X className="size-3 text-black/20 hover:text-black transition-colors" />
                </button>
              )}
            </div>
          </div>

          {/* Results Area (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-black/10 dark:[&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
            {loading ? (
              <div className="space-y-4 p-2">
                <div className="space-y-1">
                   <Skeleton className="h-2 w-12 ml-2 mb-2" />
                   {[1, 2, 3].map((i) => (
                     <div key={i} className="flex items-center gap-3 p-2">
                       <Skeleton className="size-8 rounded-lg shrink-0" />
                       <div className="flex-1 space-y-1.5">
                         <Skeleton className="h-3 w-3/4 rounded-md" />
                         <Skeleton className="h-2 w-1/4 rounded-md" />
                       </div>
                     </div>
                   ))}
                </div>
              </div>
            ) : !query || query.trim().length < 2 ? (
               <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <div className="size-8 rounded-full bg-neutral-50 dark:bg-white/5 flex items-center justify-center mb-2">
                    <Search className="size-4 text-black/10 dark:text-white/10" />
                  </div>
                  <p className="text-[10px] font-medium text-black/40 dark:text-white/40">Start typing to search...</p>
               </div>
            ) : results ? (
              <div className="space-y-4">
                {results.products.length > 0 && (
                  <div className="space-y-1">
                    <p className="px-2 text-[9px] font-black uppercase tracking-widest text-black/30 dark:text-white/30">Products</p>
                    <div className="grid gap-1">
                      {results.products.map((product) => {
                        const imageUrl = getImageUrl(product.imageUrls?.[0] || product.images?.[0]);
                        return (
                          <Link 
                            key={product.id} 
                            href={`/products/${product.slug}`}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors group"
                          >
                            <div className="size-8 rounded-lg bg-white border border-black/5 overflow-hidden shrink-0">
                              {imageUrl ? (
                                <img src={imageUrl} alt="" className="size-full object-cover" />
                              ) : (
                                <div className="size-full flex items-center justify-center opacity-10"><Package className="size-4" /></div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-bold truncate leading-none text-black dark:text-white">{product.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-[11px] font-bold text-black dark:text-white">${Number(product.price).toFixed(2)}</p>
                                {product.actualPrice && Number(product.actualPrice) > Number(product.price) && (
                                  <p className="text-[10px] text-black/40 dark:text-white/40 line-through">${Number(product.actualPrice).toFixed(2)}</p>
                                )}
                              </div>
                            </div>
                            <ArrowRight className="size-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {results.blogs.length > 0 && (
                  <div className="space-y-1">
                    <p className="px-2 text-[9px] font-black uppercase tracking-widest text-black/30 dark:text-white/30">Journal</p>
                    <div className="grid gap-1">
                      {results.blogs.map((blog) => {
                        const blogImageUrl = getImageUrl(blog.featuredImage);
                        return (
                          <Link 
                            key={blog.id} 
                            href={`/blog/${blog.slug}`}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors group"
                          >
                            <div className="size-8 rounded-lg bg-white flex items-center justify-center border border-black/5 shrink-0 overflow-hidden">
                              {blogImageUrl ? (
                                 <img src={blogImageUrl} alt="" className="size-full object-cover" />
                              ) : (
                                 <FileText className="size-3.5 text-black/10" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-bold truncate leading-none text-black dark:text-white">{blog.title}</p>
                              <p className="text-[9px] text-black/40 dark:text-white/40 mt-0.5 uppercase tracking-tighter">Article</p>
                            </div>
                            <ArrowRight className="size-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {results.products.length === 0 && results.blogs.length === 0 && (
                   <div className="py-8 text-center">
                    <p className="text-[10px] font-bold text-black/40 dark:text-white/40">No results found</p>
                   </div>
                )}
              </div>
            ) : null}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

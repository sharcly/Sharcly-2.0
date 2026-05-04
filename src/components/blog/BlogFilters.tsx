"use client";

import { Search, Grid, List, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface BlogFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  categories: string[];
  allTags: string[];
}

export function BlogFilters({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  selectedTags,
  setSelectedTags,
  viewMode,
  setViewMode,
  categories,
  allTags,
}: BlogFiltersProps) {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Search and View Toggle */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:max-w-xl group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-4 transition-colors" style={{ color: 'rgba(239,248,238,0.3)' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="w-full h-13 pl-13 pr-12 rounded-xl text-sm font-medium outline-none transition-all border"
            style={{ 
              backgroundColor: 'rgba(239,248,238,0.04)', 
              borderColor: 'rgba(239,248,238,0.08)', 
              color: '#eff8ee',
              height: '52px',
              paddingLeft: '48px'
            }}
            onFocus={(e) => { e.target.style.borderColor = 'rgba(232,197,71,0.3)'; e.target.style.backgroundColor = 'rgba(239,248,238,0.06)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'rgba(239,248,238,0.08)'; e.target.style.backgroundColor = 'rgba(239,248,238,0.04)'; }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 size-6 rounded-full flex items-center justify-center transition-colors hover:bg-[#eff8ee]/10"
              style={{ backgroundColor: 'rgba(239,248,238,0.06)' }}
            >
              <X className="size-3" style={{ color: '#eff8ee' }} />
            </button>
          )}
        </div>

        <div className="flex rounded-xl p-1 self-end lg:self-center" style={{ backgroundColor: 'rgba(239,248,238,0.04)', border: '1px solid rgba(239,248,238,0.06)' }}>
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "p-2.5 rounded-lg transition-all duration-300",
              viewMode === "grid"
                ? "shadow-md"
                : ""
            )}
            style={viewMode === "grid" 
              ? { backgroundColor: '#E8C547', color: '#040e07' } 
              : { color: 'rgba(239,248,238,0.4)' }
            }
          >
            <Grid className="size-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "p-2.5 rounded-lg transition-all duration-300",
              viewMode === "list"
                ? "shadow-md"
                : ""
            )}
            style={viewMode === "list" 
              ? { backgroundColor: '#E8C547', color: '#040e07' } 
              : { color: 'rgba(239,248,238,0.4)' }
            }
          >
            <List className="size-4" />
          </button>
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="space-y-3">
          <p className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: 'rgba(239,248,238,0.3)' }}>Categories</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("")}
              className={cn(
                "px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-300"
              )}
              style={selectedCategory === "" 
                ? { backgroundColor: '#E8C547', color: '#040e07' } 
                : { backgroundColor: 'rgba(239,248,238,0.04)', color: 'rgba(239,248,238,0.6)', border: '1px solid rgba(239,248,238,0.06)' }
              }
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-300"
                style={selectedCategory === cat 
                  ? { backgroundColor: '#E8C547', color: '#040e07' } 
                  : { backgroundColor: 'rgba(239,248,238,0.04)', color: 'rgba(239,248,238,0.6)', border: '1px solid rgba(239,248,238,0.06)' }
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {allTags.length > 0 && (
        <div className="space-y-3">
          <p className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: 'rgba(239,248,238,0.3)' }}>Tags</p>
          <div className="flex flex-wrap gap-2 items-center">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className="px-3.5 py-2 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all duration-300"
                style={selectedTags.includes(tag) 
                  ? { backgroundColor: 'rgba(232,197,71,0.15)', color: '#E8C547', border: '1px solid rgba(232,197,71,0.25)' } 
                  : { backgroundColor: 'transparent', color: 'rgba(239,248,238,0.35)', border: '1px solid rgba(239,248,238,0.08)' }
                }
              >
                #{tag}
              </button>
            ))}
            <AnimatePresence>
              {selectedTags.length > 0 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSelectedTags([])}
                  className="text-[9px] font-black uppercase tracking-widest ml-3 underline underline-offset-4 transition-colors"
                  style={{ color: 'rgba(239,248,238,0.4)' }}
                >
                  Clear tags
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}

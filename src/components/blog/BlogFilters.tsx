"use client";

import { Search, Grid, List, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
        <div className="relative w-full lg:max-w-2xl group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-[#0d2719]/20 group-focus-within:text-[#0d2719] transition-colors" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search our botanical archive..."
            className="h-14 pl-14 pr-6 rounded-full border-[#0d2719]/5 bg-white shadow-sm focus:ring-8 focus:ring-[#0d2719]/5 text-sm font-medium transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-1 hover:bg-[#0d2719]/5 rounded-full transition-colors"
            >
              <X className="size-4 opacity-40" />
            </button>
          )}
        </div>

        <div className="flex bg-white rounded-full p-1 border border-[#0d2719]/5 shadow-sm self-end lg:self-center">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "p-3 rounded-full transition-all duration-300",
              viewMode === "grid"
                ? "bg-[#0d2719] text-white shadow-lg"
                : "text-[#0d2719]/40 hover:text-[#0d2719]"
            )}
          >
            <Grid className="size-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "p-3 rounded-full transition-all duration-300",
              viewMode === "list"
                ? "bg-[#0d2719] text-white shadow-lg"
                : "text-[#0d2719]/40 hover:text-[#0d2719]"
            )}
          >
            <List className="size-5" />
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0d2719]/30 ml-2">Browse by Category</p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategory("")}
            className={cn(
              "px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 border",
              selectedCategory === ""
                ? "bg-[#0d2719] text-white border-transparent shadow-lg"
                : "bg-white text-[#0d2719] border-[#0d2719]/5 hover:border-[#0d2719]/20"
            )}
          >
            All Narratives
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 border",
                selectedCategory === cat
                  ? "bg-[#0d2719] text-white border-transparent shadow-lg"
                  : "bg-white text-[#0d2719] border-[#0d2719]/5 hover:border-[#0d2719]/20"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-4">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0d2719]/30 ml-2">Filter by Tags</p>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              onClick={() => toggleTag(tag)}
              className={cn(
                "cursor-pointer px-4 py-2 rounded-full border-[#0d2719]/10 text-[10px] font-bold uppercase tracking-widest transition-all",
                selectedTags.includes(tag)
                  ? "bg-[#0d2719]/10 text-[#0d2719] border-[#0d2719]/30"
                  : "bg-transparent text-[#0d2719]/40 hover:text-[#0d2719] hover:border-[#0d2719]/30"
              )}
            >
              #{tag}
            </Badge>
          ))}
          <AnimatePresence>
            {selectedTags.length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setSelectedTags([])}
                className="text-[10px] font-black uppercase tracking-widest text-[#0d2719]/60 hover:text-[#0d2719] ml-4 transition-colors"
              >
                Clear all tags
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

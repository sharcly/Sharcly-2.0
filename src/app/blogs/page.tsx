"use client";

import { useEffect, useState, useMemo } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogFilters } from "@/components/blog/BlogFilters";
import { BlogSkeleton } from "@/components/blog/BlogSkeleton";
import { apiClient } from "@/lib/api-client";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Filters
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Derived metadata
  const [categories, setCategories] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get("/blogs", {
          params: {
            status: "PUBLISHED",
            search: search,
            category: selectedCategory,
            tags: selectedTags.length > 0 ? selectedTags.join(",") : undefined,
          },
        });
        setBlogs(response.data.blogs || []);
        
        // Extract categories and tags if not already set (initial load)
        if (categories.length === 0 && response.data.blogs?.length > 0) {
          const cats = new Set<string>();
          const tags = new Set<string>();
          response.data.blogs.forEach((blog: any) => {
            if (blog.category) cats.add(blog.category);
            if (blog.tags) blog.tags.forEach((t: string) => tags.add(t));
          });
          setCategories(Array.from(cats));
          setAllTags(Array.from(tags));
        }
      } catch (error) {
        console.error("Failed to fetch narratives");
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchBlogs();
    }, 300); // Debounce search

    return () => clearTimeout(timer);
  }, [search, selectedCategory, selectedTags]);

  return (
    <div className="min-h-screen bg-[#f0f9f0] text-[#0d2719] selection:bg-[#0d2719] selection:text-white">
      <Navbar />

      <main className="pt-32 pb-40">
        {/* Hero Section */}
        <section className="container mx-auto px-6 mb-24">
          <div className="max-w-4xl space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">The Sharcly Journal</span>
              <div className="h-px w-12 bg-[#0d2719]/10" />
              <Sparkles className="size-4 opacity-40" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl lg:text-9xl font-black tracking-tighter leading-[0.8] text-[#0d2719]"
            >
              BOTANICAL <br />
              <span className="italic font-serif opacity-30">ARCHIVES.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl lg:text-2xl text-[#0d2719]/50 font-medium max-w-2xl leading-relaxed"
            >
              Deep investigations into hemp science, lifestyle protocols, and the latest synthesis from our botanical labs.
            </motion.p>
          </div>
        </section>

        {/* Filters Section */}
        <section className="container mx-auto px-6 mb-20">
          <BlogFilters
            search={search}
            setSearch={setSearch}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            viewMode={viewMode}
            setViewMode={setViewMode}
            categories={categories}
            allTags={allTags}
          />
        </section>

        {/* Blog Listing */}
        <section className="container mx-auto px-6">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <BlogSkeleton viewMode={viewMode} />
              </motion.div>
            ) : blogs.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-40 text-center space-y-8 bg-white/50 rounded-[4rem] border border-[#0d2719]/5"
              >
                <div className="size-24 rounded-full bg-white flex items-center justify-center mx-auto shadow-sm">
                  <BookOpen className="size-10 opacity-20" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-4xl font-bold tracking-tighter italic font-serif">No stories matched the sequence.</h3>
                  <p className="text-[#0d2719]/40 font-medium">Try adjusting your filters or search terms to find what you're looking for.</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("");
                    setSelectedTags([]);
                  }}
                  className="rounded-full px-10 h-14 border-[#0d2719]/10 font-bold text-xs uppercase tracking-widest hover:bg-[#0d2719] hover:text-white transition-all"
                >
                  Clear Archive Filters
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10" : "flex flex-col gap-10"}
              >
                {blogs.map((blog, i) => (
                  <BlogCard key={blog.id} blog={blog} viewMode={viewMode} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Newsletter / CTA Section */}
        <section className="container mx-auto px-6 mt-40">
          <div className="bg-[#0d2719] rounded-[4rem] p-12 lg:p-24 relative overflow-hidden group">
            <div className="absolute top-0 right-0 size-[600px] bg-white/[0.03] rounded-full -mr-[300px] -mt-[300px] blur-3xl" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-10 text-white">
                <h2 className="text-6xl lg:text-8xl font-black tracking-tighter italic font-serif leading-[0.8]">
                  Join the <br /> <span className="not-italic">Circle.</span>
                </h2>
                <p className="text-xl text-white/40 font-medium max-w-sm leading-relaxed">
                  Receive immediate transmission of new research, narratives, and limited botanical drops.
                </p>
              </div>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Botanical Identity (Email)"
                  className="w-full h-24 bg-white/5 border border-white/10 rounded-[2.5rem] px-10 font-bold text-lg text-white outline-none focus:ring-8 focus:ring-white/[0.02] transition-all placeholder:text-white/10"
                />
                <Button className="absolute right-4 top-4 h-16 px-10 bg-white text-[#0d2719] font-black uppercase tracking-widest text-[10px] rounded-[1.8rem] hover:bg-white/90 shadow-2xl transition-all hover:scale-105 active:scale-95">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

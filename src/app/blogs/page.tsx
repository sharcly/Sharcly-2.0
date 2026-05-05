"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogSkeleton } from "@/components/blog/BlogSkeleton";
import { apiClient } from "@/lib/api-client";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Sparkles, ArrowRight, Calendar, Clock, Search, X, Grid, List } from "lucide-react";
import Link from "next/link";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [categories, setCategories] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get("/blogs", {
          params: {
            status: "PUBLISHED",
            search,
            category: selectedCategory,
            tags: selectedTags.length > 0 ? selectedTags.join(",") : undefined,
          },
        });
        setBlogs(response.data.blogs || []);

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
        console.error("Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchBlogs, 300);
    return () => clearTimeout(timer);
  }, [search, selectedCategory, selectedTags]);

  const isFiltering = !!(search || selectedCategory || selectedTags.length > 0);
  const featuredBlog = !isFiltering ? blogs[0] : null;
  const gridBlogs = featuredBlog ? blogs.slice(1) : blogs;

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  return (
    <div className="min-h-screen antialiased" style={{ background: '#040e07', color: '#eff8ee' }}>
      <Navbar />

      {/* ═══════════════════════════════════════════
          HERO — Centered editorial masthead
      ═══════════════════════════════════════════ */}
      <section className="relative pt-36 pb-14 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(175deg, #040e07 0%, #0a2a17 40%, #040e07 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 40% at 50% 30%, rgba(232,197,71,0.05) 0%, transparent 70%)' }} />
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full mb-8"
            style={{ backgroundColor: 'rgba(232,197,71,0.08)', border: '1px solid rgba(232,197,71,0.15)' }}>
            <Sparkles className="size-3.5" style={{ color: '#E8C547' }} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: '#E8C547' }}>The Sharcly Journal</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-[-0.03em] leading-[0.9] mb-6"
          >
            <span style={{ color: '#eff8ee' }}>Botanical</span><br />
            <span className="italic font-serif" style={{ color: 'rgba(239,248,238,0.18)' }}>Archives</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-base font-medium leading-relaxed max-w-lg mx-auto mb-10"
            style={{ color: 'rgba(239,248,238,0.45)' }}>
            Hemp science, wellness protocols, and the latest from our labs — curated for the curious mind.
          </motion.p>

          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="relative max-w-xl mx-auto">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 size-5" style={{ color: 'rgba(239,248,238,0.25)' }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="w-full h-14 pl-[52px] pr-14 rounded-2xl text-sm font-medium outline-none transition-all border"
              style={{ backgroundColor: 'rgba(239,248,238,0.04)', borderColor: 'rgba(239,248,238,0.08)', color: '#eff8ee' }}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(232,197,71,0.3)'; e.target.style.boxShadow = '0 0 30px rgba(232,197,71,0.05)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(239,248,238,0.08)'; e.target.style.boxShadow = 'none'; }}
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-5 top-1/2 -translate-y-1/2 size-7 rounded-full flex items-center justify-center hover:bg-[#eff8ee]/10" style={{ backgroundColor: 'rgba(239,248,238,0.06)' }}>
                <X className="size-3.5" style={{ color: '#eff8ee' }} />
              </button>
            )}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURED ARTICLE — Full-width hero card
      ═══════════════════════════════════════════ */}
      {!loading && featuredBlog && (
        <section className="container mx-auto px-6 md:px-12 mb-20">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
            <Link href={`/blogs/${featuredBlog.slug}`} className="group block">
              <div className="relative rounded-[24px] overflow-hidden" style={{ border: '1px solid rgba(239,248,238,0.06)', boxShadow: '0 40px 80px rgba(0,0,0,0.4)' }}>
                {/* Full-bleed image */}
                <div className="relative aspect-[21/9] sm:aspect-[2.4/1]">
                  <img
                    src={featuredBlog.featuredImage || "https://images.unsplash.com/photo-1544022613-e87ce71c8e4d?auto=format&fit=crop&q=80"}
                    alt={featuredBlog.title}
                    className="w-full h-full object-cover transition-transform duration-[1.4s] ease-[0.22,1,0.36,1] group-hover:scale-105"
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(4,14,7,0.9) 0%, rgba(4,14,7,0.4) 40%, rgba(4,14,7,0.2) 100%)' }} />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: 'radial-gradient(circle at 50% 70%, rgba(232,197,71,0.06), transparent 60%)' }} />

                  {/* Content overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 lg:p-16">
                    <div className="max-w-2xl">
                      {/* Badge + meta */}
                      <div className="flex flex-wrap items-center gap-3 mb-5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[8px] font-black uppercase tracking-[0.2em]" style={{ backgroundColor: '#E8C547', color: '#040e07', borderRadius: '2px' }}>
                          <Sparkles className="size-3" />Featured
                        </span>
                        {featuredBlog.category && (
                          <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'rgba(239,248,238,0.5)' }}>{featuredBlog.category}</span>
                        )}
                        <span className="text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5" style={{ color: 'rgba(239,248,238,0.35)' }}>
                          <Calendar className="size-3" />
                          {new Date(featuredBlog.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                        </span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight leading-[1.05] mb-4 transition-colors duration-300 group-hover:text-[#E8C547]" style={{ color: '#eff8ee' }}>
                        {featuredBlog.title}
                      </h2>

                      {featuredBlog.excerpt && (
                        <p className="text-sm lg:text-base font-medium leading-relaxed line-clamp-2 mb-6 max-w-xl" style={{ color: 'rgba(239,248,238,0.55)' }}>
                          {featuredBlog.excerpt}
                        </p>
                      )}

                      <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 group-hover:gap-4" style={{ color: '#E8C547' }}>
                        Read Full Article <ArrowRight className="size-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </section>
      )}

      <main className="pb-32">
        {/* ═══════════════════════════════════════════
            FILTER BAR — Categories + View Toggle
        ═══════════════════════════════════════════ */}
        <section className="container mx-auto px-6 md:px-12 mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            {/* Categories as minimal text tabs */}
            <div className="flex flex-wrap items-center gap-1">
              <button
                onClick={() => setSelectedCategory("")}
                className="px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200"
                style={!selectedCategory
                  ? { backgroundColor: 'rgba(232,197,71,0.1)', color: '#E8C547', border: '1px solid rgba(232,197,71,0.15)' }
                  : { color: 'rgba(239,248,238,0.5)', backgroundColor: 'transparent' }
                }
              >All</button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200"
                  style={selectedCategory === cat
                    ? { backgroundColor: 'rgba(232,197,71,0.1)', color: '#E8C547', border: '1px solid rgba(232,197,71,0.15)' }
                    : { color: 'rgba(239,248,238,0.5)', backgroundColor: 'transparent' }
                  }
                >{cat}</button>
              ))}
            </div>

            {/* View toggle + count */}
            <div className="flex items-center gap-4">
              {!loading && (
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(239,248,238,0.2)' }}>
                  {blogs.length} article{blogs.length !== 1 ? 's' : ''}
                </span>
              )}
              <div className="flex rounded-lg p-0.5" style={{ backgroundColor: 'rgba(239,248,238,0.04)', border: '1px solid rgba(239,248,238,0.06)' }}>
                <button onClick={() => setViewMode("grid")} className="p-2 rounded-md transition-all"
                  style={viewMode === "grid" ? { backgroundColor: '#E8C547', color: '#040e07' } : { color: 'rgba(239,248,238,0.35)' }}>
                  <Grid className="size-3.5" />
                </button>
                <button onClick={() => setViewMode("list")} className="p-2 rounded-md transition-all"
                  style={viewMode === "list" ? { backgroundColor: '#E8C547', color: '#040e07' } : { color: 'rgba(239,248,238,0.35)' }}>
                  <List className="size-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Tags row */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-5">
              {allTags.map(tag => (
                <button key={tag} onClick={() => toggleTag(tag)}
                  className="px-3 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all duration-200"
                  style={selectedTags.includes(tag)
                    ? { backgroundColor: 'rgba(232,197,71,0.12)', color: '#E8C547', border: '1px solid rgba(232,197,71,0.2)' }
                    : { color: 'rgba(239,248,238,0.3)', border: '1px solid rgba(239,248,238,0.06)' }
                  }>#{tag}</button>
              ))}
              {selectedTags.length > 0 && (
                <button onClick={() => setSelectedTags([])} className="text-[9px] font-black uppercase tracking-widest ml-2 underline underline-offset-4" style={{ color: 'rgba(239,248,238,0.35)' }}>Clear</button>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="mt-6 h-px" style={{ background: 'linear-gradient(90deg, rgba(232,197,71,0.15) 0%, rgba(232,197,71,0.04) 50%, transparent 100%)' }} />
        </section>

        {/* ═══════════════════════════════════════════
            BLOG GRID
        ═══════════════════════════════════════════ */}
        <section className="container mx-auto px-6 md:px-12" style={{ minHeight: '40vh' }}>
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <BlogSkeleton viewMode={viewMode} />
              </motion.div>
            ) : blogs.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="py-28 text-center">
                <div className="max-w-md mx-auto space-y-6">
                  <div className="size-16 rounded-2xl flex items-center justify-center mx-auto" style={{ backgroundColor: 'rgba(232,197,71,0.06)' }}>
                    <BookOpen className="size-7" style={{ color: 'rgba(232,197,71,0.25)' }} />
                  </div>
                  <h3 className="text-xl font-black tracking-tight" style={{ color: '#eff8ee' }}>No articles found</h3>
                  <p className="text-sm font-medium" style={{ color: 'rgba(239,248,238,0.4)' }}>Try adjusting your filters or search terms.</p>
                  <button
                    onClick={() => { setSearch(""); setSelectedCategory(""); setSelectedTags([]); }}
                    className="text-[10px] font-black uppercase tracking-widest underline underline-offset-4"
                    style={{ color: '#E8C547' }}>
                    Clear All Filters
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7" : "flex flex-col gap-6"}>
                {gridBlogs.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} viewMode={viewMode} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </section>


      </main>

      <Footer />
    </div>
  );
}

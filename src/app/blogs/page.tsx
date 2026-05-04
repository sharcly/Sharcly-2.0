"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogFilters } from "@/components/blog/BlogFilters";
import { BlogSkeleton } from "@/components/blog/BlogSkeleton";
import { apiClient } from "@/lib/api-client";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Sparkles, ArrowRight, Calendar, Clock } from "lucide-react";
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
            search: search,
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
        console.error("Failed to fetch narratives");
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchBlogs, 300);
    return () => clearTimeout(timer);
  }, [search, selectedCategory, selectedTags]);

  const featuredBlog = blogs[0];
  const remainingBlogs = blogs.slice(1);

  return (
    <div className="min-h-screen antialiased" style={{ background: '#040e07', color: '#eff8ee' }}>
      <Navbar />

      {/* ═══════════════ HERO HEADER ═══════════════ */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Ambient layers */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(175deg, #040e07 0%, #0a2a17 35%, #040e07 100%)' }} />
          <div className="absolute top-0 right-0 w-[600px] h-[600px]" style={{ background: 'radial-gradient(circle, rgba(232,197,71,0.04) 0%, transparent 60%)' }} />
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          {/* Overline */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="size-1.5 rounded-full" style={{ backgroundColor: '#E8C547' }} />
            <span className="text-[10px] font-black uppercase tracking-[0.35em]" style={{ color: '#E8C547' }}>The Sharcly Journal</span>
          </motion.div>

          {/* Two-column hero */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-20">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl sm:text-6xl lg:text-8xl xl:text-[7rem] font-black tracking-[-0.03em] leading-[0.88]"
              style={{ color: '#eff8ee' }}
            >
              Botanical<br />
              <span className="italic font-serif" style={{ color: 'rgba(239,248,238,0.15)' }}>Archives</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-base lg:text-lg font-medium max-w-md leading-relaxed lg:pb-3"
              style={{ color: 'rgba(239,248,238,0.45)' }}
            >
              Deep investigations into hemp science, wellness protocols, and the latest from our botanical labs.
            </motion.p>
          </div>

          {/* Gold divider */}
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-14 h-px origin-left"
            style={{ background: 'linear-gradient(90deg, rgba(232,197,71,0.4) 0%, rgba(232,197,71,0.08) 60%, transparent 100%)' }}
          />
        </div>
      </section>

      {/* ═══════════════ FEATURED ARTICLE ═══════════════ */}
      {!loading && featuredBlog && !search && !selectedCategory && selectedTags.length === 0 && (
        <section className="container mx-auto px-6 md:px-12 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Link href={`/blogs/${featuredBlog.slug}`} className="group block">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-[24px] overflow-hidden" style={{ backgroundColor: 'rgba(239,248,238,0.03)', border: '1px solid rgba(239,248,238,0.06)' }}>
                {/* Image */}
                <div className="relative aspect-[16/10] lg:aspect-auto overflow-hidden">
                  <img
                    src={featuredBlog.featuredImage || "https://images.unsplash.com/photo-1544022613-e87ce71c8e4d?auto=format&fit=crop&q=80"}
                    alt={featuredBlog.title}
                    className="w-full h-full object-cover transition-transform duration-[1.2s] ease-[0.22,1,0.36,1] group-hover:scale-105"
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(4,14,7,0.3) 0%, rgba(4,14,7,0.1) 100%)' }} />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: 'radial-gradient(circle at center, rgba(232,197,71,0.06), transparent 70%)' }} />
                  
                  {/* Featured badge */}
                  <div className="absolute top-6 left-6">
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 text-[9px] font-black uppercase tracking-[0.2em]"
                      style={{ backgroundColor: '#E8C547', color: '#040e07', borderRadius: '2px' }}>
                      <Sparkles className="size-3" />
                      Featured
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 md:p-12 lg:p-14 flex flex-col justify-center">
                  <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest mb-6" style={{ color: 'rgba(239,248,238,0.35)' }}>
                    {featuredBlog.category && (
                      <>
                        <span style={{ color: '#E8C547' }}>{featuredBlog.category}</span>
                        <span className="size-1 rounded-full" style={{ backgroundColor: 'rgba(239,248,238,0.15)' }} />
                      </>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Calendar className="size-3" />
                      {new Date(featuredBlog.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                  
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-[1.1] mb-5 transition-colors duration-300 group-hover:text-[#E8C547]" style={{ color: '#eff8ee' }}>
                    {featuredBlog.title}
                  </h2>
                  
                  {featuredBlog.excerpt && (
                    <p className="text-sm lg:text-base font-medium leading-relaxed mb-8 line-clamp-3" style={{ color: 'rgba(239,248,238,0.45)' }}>
                      {featuredBlog.excerpt}
                    </p>
                  )}

                  <div className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 group-hover:gap-4" style={{ color: '#E8C547' }}>
                    Read Full Article <ArrowRight className="size-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </section>
      )}

      <main className="pb-32">
        {/* ═══════════════ FILTERS ═══════════════ */}
        <section className="container mx-auto px-6 md:px-12 mb-14">
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

        {/* ═══════════════ SECTION HEADER ═══════════════ */}
        <section className="container mx-auto px-6 md:px-12 mb-10">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] block mb-2" style={{ color: '#E8C547' }}>Latest</span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: '#eff8ee' }}>
                All Articles
              </h2>
            </div>
            {!loading && (
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(239,248,238,0.3)' }}>
                {blogs.length} {blogs.length === 1 ? 'article' : 'articles'}
              </span>
            )}
          </div>
          <div className="mt-6 h-px" style={{ background: 'linear-gradient(90deg, rgba(239,248,238,0.1) 0%, rgba(239,248,238,0.03) 60%, transparent 100%)' }} />
        </section>

        {/* ═══════════════ BLOG LISTING ═══════════════ */}
        <section className="container mx-auto px-6 md:px-12" style={{ minHeight: '40vh' }}>
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <BlogSkeleton viewMode={viewMode} />
              </motion.div>
            ) : blogs.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-28 text-center"
              >
                <div className="max-w-md mx-auto space-y-6">
                  <div className="size-20 rounded-2xl flex items-center justify-center mx-auto rotate-3" style={{ backgroundColor: 'rgba(232,197,71,0.08)', border: '1px solid rgba(232,197,71,0.1)' }}>
                    <BookOpen className="size-8 -rotate-3" style={{ color: 'rgba(232,197,71,0.3)' }} />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight" style={{ color: '#eff8ee' }}>No stories found</h3>
                  <p className="text-sm font-medium" style={{ color: 'rgba(239,248,238,0.45)' }}>
                    Try adjusting your filters or search terms.
                  </p>
                  <button 
                    onClick={() => { setSearch(""); setSelectedCategory(""); setSelectedTags([]); }}
                    className="inline-flex items-center px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 hover:shadow-[0_4px_20px_rgba(232,197,71,0.2)]"
                    style={{ backgroundColor: '#E8C547', color: '#040e07' }}
                  >
                    Clear Filters
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={
                  viewMode === "grid" 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7" 
                    : "flex flex-col gap-6"
                }
              >
                {/* Show remaining if featured is visible, otherwise all */}
                {(!search && !selectedCategory && selectedTags.length === 0 ? remainingBlogs : blogs).map((blog) => (
                  <BlogCard key={blog.id} blog={blog} viewMode={viewMode} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ═══════════════ NEWSLETTER CTA ═══════════════ */}
        <section className="container mx-auto px-6 md:px-12 mt-32">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-[24px] overflow-hidden"
            style={{ border: '1px solid rgba(232,197,71,0.1)' }}
          >
            {/* Background layers */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(232,197,71,0.05) 0%, rgba(4,14,7,0.95) 50%, rgba(232,197,71,0.03) 100%)' }} />
            <div className="absolute top-0 left-0 w-[400px] h-[400px]" style={{ background: 'radial-gradient(circle, rgba(232,197,71,0.08) 0%, transparent 60%)' }} />
            <div className="absolute bottom-0 right-0 w-[300px] h-[300px]" style={{ background: 'radial-gradient(circle, rgba(232,197,71,0.05) 0%, transparent 60%)' }} />
            
            <div className="relative z-10 py-16 px-8 md:py-20 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] block mb-4" style={{ color: '#E8C547' }}>Stay Informed</span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[0.9] mb-5" style={{ color: '#eff8ee' }}>
                  Join the<br />
                  <span className="italic font-serif" style={{ color: 'rgba(239,248,238,0.2)' }}>Inner Circle.</span>
                </h2>
                <p className="text-sm font-medium max-w-sm leading-relaxed" style={{ color: 'rgba(239,248,238,0.4)' }}>
                  Be the first to receive new research, exclusive narratives, and limited botanical drops.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 h-14 px-6 rounded-xl text-sm font-medium outline-none transition-all border"
                    style={{ backgroundColor: 'rgba(239,248,238,0.04)', borderColor: 'rgba(239,248,238,0.08)', color: '#eff8ee' }}
                    onFocus={(e) => { e.target.style.borderColor = 'rgba(232,197,71,0.3)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'rgba(239,248,238,0.08)'; }}
                  />
                  <button className="h-14 px-10 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 hover:shadow-[0_4px_24px_rgba(232,197,71,0.25)] whitespace-nowrap" style={{ backgroundColor: '#E8C547', color: '#040e07' }}>
                    Subscribe
                  </button>
                </div>
                <p className="text-[10px] font-medium tracking-wider px-1" style={{ color: 'rgba(239,248,238,0.2)' }}>
                  No spam. Just science. Unsubscribe anytime.
                </p>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

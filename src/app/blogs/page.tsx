"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Footer } from "@/components/footer";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogSkeleton } from "@/components/blog/BlogSkeleton";
import { apiClient } from "@/lib/api-client";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Sparkles, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
            search,
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
    <div className="min-h-screen bg-[#040e07] text-[#eff8ee] selection:bg-[#E8C547] selection:text-[#040e07] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#040e07] via-[#082f1d] to-[#040e07] pointer-events-none" />
      <div 
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-radial-gradient from-[rgba(232,197,71,0.08)] to-transparent opacity-50 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(232,197,71,0.1) 0%, transparent 70%)"
        }}
      />

      <div className="relative z-10">
        <AnnouncementBar />
        <Navbar />

      <main className="pb-24">
        {/* Dark Header Banner */}
        <section className="bg-[#062D1B] py-20 mb-12">
          <div className="container mx-auto px-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-[#E8C547] text-[10px] font-black uppercase tracking-[0.4em]">
                <div className="h-px w-8 bg-[#E8C547]" />
                Insights & Guides
              </div>
              <h2 className="text-white text-xl lg:text-3xl font-medium max-w-3xl leading-relaxed">
                Explore the science of state-based wellness. From cannabinoid breakthroughs to daily routine optimization.
              </h2>
            </div>
          </div>
        </section>
      )}

        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Left Sidebar */}
            <aside className="lg:col-span-3 space-y-12 relative">
              {/* Search */}
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 size-4 text-[#eff8ee]/20 group-focus-within:text-[#E8C547] transition-colors" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search stories..."
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 text-xs font-bold text-[#eff8ee] focus:border-[#E8C547]/30 outline-none transition-all placeholder:text-[#eff8ee]/20"
                />
              </div>

              {/* Categories */}
              <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#eff8ee]/30 px-4">Collections</h3>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => setSelectedCategory("")}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all",
                      selectedCategory === ""
                        ? "bg-[#E8C547] text-[#040e07]"
                        : "text-[#eff8ee]/60 hover:bg-white/5 hover:text-[#eff8ee]"
                    )}
                  >
                    <span>All Posts</span>
                    <span className="opacity-40">{blogs.length}</span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={cn(
                        "flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all uppercase tracking-widest",
                        selectedCategory === cat
                          ? "bg-[#E8C547] text-[#040e07]"
                          : "text-[#eff8ee]/60 hover:bg-white/5 hover:text-[#eff8ee]"
                      )}
                    >
                      <span>{cat}</span>
                      <span className="opacity-40">{blogs.filter(b => b.category === cat).length}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Latest Insight List */}
              <div className="space-y-8 pt-8 border-t border-white/5">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#eff8ee]/30 px-4">Latest Insights</h3>
                <div className="space-y-8">
                  {blogs.slice(0, 3).map((blog) => (
                    <Link key={blog.id} href={`/blogs/${blog.slug}`} className="flex gap-4 group">
                      <div className="size-16 rounded-xl overflow-hidden flex-shrink-0 border border-white/5">
                        <img
                          src={blog.featuredImage || "https://images.unsplash.com/photo-1544022613-e87ce71c8e4d?auto=format&fit=crop&q=80"}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-[11px] font-bold text-[#eff8ee] leading-tight line-clamp-2 group-hover:text-[#E8C547] transition-colors">{blog.title}</h4>
                        <p className="text-[9px] font-medium text-[#eff8ee]/30 uppercase tracking-widest">
                          {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="lg:col-span-9 space-y-20">
              {/* Featured Post (only if not searching or filtering) */}
              {!search && !selectedCategory && blogs[0] && (
                <section>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-xl border border-white/10">
                      <img
                        src={blogs[0].featuredImage || "https://images.unsplash.com/photo-1544022613-e87ce71c8e4d?auto=format&fit=crop&q=80"}
                        alt={blogs[0].title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-8">
                      <div className="flex items-center gap-4">
                        <Badge className="bg-[#E8C547] text-[#040e07] border-none font-black text-[9px] uppercase tracking-[0.2em] px-4 py-1.5 rounded-[0.8rem]">Featured</Badge>
                        <span className="text-xs text-[#eff8ee]/40 font-medium">
                          {new Date(blogs[0].createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                      <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter leading-[0.95] text-white">
                        {blogs[0].title}
                      </h1>
                      <p className="text-[#eff8ee]/60 text-lg leading-relaxed max-w-xl">
                        {blogs[0].excerpt}
                      </p>
                      <Link
                        href={`/blogs/${blogs[0].slug}`}
                        className="inline-flex items-center gap-3 text-sm font-bold text-[#E8C547] hover:gap-4 transition-all"
                      >
                        Read full story <ArrowRight className="size-5" />
                      </Link>
                    </div>
                  </div>
                </section>
              )}

                {/* Latest Insights Header */}
                <div className="space-y-12">
                  <h3 className="text-sm font-bold text-[#eff8ee] border-b border-white/10 pb-4">Latest Insights</h3>
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <BlogSkeleton viewMode="grid" />
                      </motion.div>
                    ) : blogs.length === 0 ? (
                      <motion.div key="empty" className="py-20 text-center space-y-6">
                        <div className="size-20 rounded-full bg-white/5 flex items-center justify-center mx-auto shadow-sm">
                          <BookOpen className="size-8 text-[#E8C547] opacity-50" />
                        </div>
                        <h3 className="text-2xl font-bold">No stories matched the sequence.</h3>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                      >
                        {(search || selectedCategory ? blogs : blogs.slice(1)).map((blog) => (
                          <BlogCard key={blog.id} blog={blog} viewMode="grid" />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

        {/* Elevated Ritual CTA Section */}
        <section className="container mx-auto px-6 mt-32">
          <div className="bg-[#0b2112] rounded-[4rem] p-12 lg:p-24 relative overflow-hidden text-center space-y-10">
            <div className="space-y-6 relative z-10">
              <h2 className="text-white text-5xl lg:text-7xl font-bold tracking-tight italic font-serif leading-tight">
                Elevate Your Ritual
              </h2>
              <p className="text-white/60 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
                Experience the science of state-based wellness. From potent tinctures to bio-available gummies, discover your ideal state.
              </p>
            </div>
            <div className="relative z-10">
              <Button asChild className="rounded-full h-16 px-12 bg-[#B39371] text-white font-bold uppercase tracking-widest text-xs hover:bg-[#B39371]/90 shadow-2xl transition-all hover:scale-105">
                <Link href="/products">Shop the Collection</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Join the Circle Newsletter Section */}
        {/* <section className="container mx-auto px-6 mt-32">
          <div className="bg-[#0d2719] rounded-[4rem] p-12 lg:p-20 relative overflow-hidden group border border-white/5">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-6 text-white">
                <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
                  Join the Sharcly Circle
                </h2>
                <p className="text-lg text-white/40 font-medium max-w-sm leading-relaxed">
                  Stay updated on new drops and exclusive wellness insights.
                </p>
              </div>
              <div className="relative flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 h-16 bg-white rounded-full px-8 font-medium text-black outline-none transition-all placeholder:text-black/30"
                />
                <Button className="h-16 px-10 bg-[#E8C547] text-black font-black uppercase tracking-widest text-[10px] rounded-full hover:bg-[#E8C547]/90 shadow-2xl transition-all">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </section> */}
      </main>

      <Footer />
    </div>
  </div>
);
}

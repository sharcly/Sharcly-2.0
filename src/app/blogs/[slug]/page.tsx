"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Share2,
  BookOpen,
  Sparkles,
  ShoppingBag,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { sanitizeHtml } from "@/lib/sanitize";
import { BlogStatus } from "@prisma/client";
import { apiClient } from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, useScroll, useSpring } from "framer-motion";
import { RelatedPosts } from "@/components/blog/RelatedPosts";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await apiClient.get(`/blogs/${slug}`);
        setBlog(response.data.blog);
        
        // Fetch related posts
        const relatedRes = await apiClient.get(`/blogs`, {
          params: { 
            category: response.data.blog.category,
            status: "PUBLISHED",
            limit: 5 
          }
        });
        setRelatedPosts(relatedRes.data.blogs.filter((p: any) => p.id !== response.data.blog.id).slice(0, 3));

        // Fetch products
        const productsRes = await apiClient.get(`/products`, { params: { limit: 2 } });
        setProducts(productsRes.data.products || []);
      } catch (error) {
        console.error("Narrative not found in registry");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f9f0]">
        <Navbar />
        <div className="container mx-auto px-6 py-40 space-y-12">
          <Skeleton className="h-4 w-24 rounded-full" />
          <Skeleton className="h-32 w-3/4 rounded-3xl" />
          <Skeleton className="h-[60vh] w-full rounded-[4rem]" />
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#f0f9f0] flex flex-col items-center justify-center p-8">
        <Navbar />
        <h2 className="text-6xl font-black tracking-tighter mb-8 italic font-serif">Narrative Missing.</h2>
        <p className="text-[#0d2719]/40 mb-12 text-lg font-medium">This story could not be found in the botanical archives.</p>
        <Button asChild className="rounded-full px-12 h-16 bg-[#0d2719] text-white shadow-2xl hover:scale-105 transition-transform">
          <Link href="/blogs">Return to Archives</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040e07] text-[#eff8ee] selection:bg-[#E8C547] selection:text-[#040e07] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#040e07] via-[#082f1d] to-[#040e07] pointer-events-none" />
      <div 
        className="absolute inset-0 opacity-[0.1] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div 
        className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-radial-gradient from-[rgba(232,197,71,0.05)] to-transparent opacity-50 pointer-events-none -translate-y-1/2 translate-x-1/4"
        style={{
          background: "radial-gradient(circle, rgba(232,197,71,0.08) 0%, transparent 70%)"
        }}
      />

      <div className="relative z-10">
        <AnnouncementBar />
        <Navbar />

      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-[#0d2719] z-[100] origin-left"
        style={{ scaleX }}
      />

      <main className="pt-32 pb-24">

        {/* Featured Image Section (Optional/Top-level) */}
        {blog.featuredImage && (
          <section className="px-6 lg:container lg:mx-auto mb-16">
            <div className="relative aspect-[21/9] rounded-[4rem] overflow-hidden shadow-2xl border border-[#0d2719]/5">
              <img
                src={blog.featuredImage}
                alt={blog.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0d2719]/20" />
            </div>
          </section>
        )}

        {/* 2-Column Layout: Article + Sidebar */}
        <section>
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              {/* Left Column (col-8): Header, Paragraphs */}
              <div className="lg:col-span-8 space-y-12">
                {/* Article Header */}
                <div className="space-y-6">
                  <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#eff8ee]/40 hover:text-[#E8C547] transition-colors"
                  >
                    <ArrowLeft className="size-3" /> Back to Registry
                  </button>
                  <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white leading-[0.9]">
                    {blog.title}
                  </h1>
                  <div className="flex items-center gap-3 text-xs font-medium text-[#eff8ee]/40">
                    <span className="text-[#E8C547] font-bold">{blog.author?.name || "Dr. Rachel Kim"}</span>
                    <span>|</span>
                    <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
                {/* Excerpt/Intro */}
                {blog.excerpt && (
                  <div className="mb-10 relative">
                    <div className="absolute -left-10 top-0 text-[100px] font-serif italic text-white/5 leading-none">"</div>
                    <p className="text-2xl lg:text-3xl font-bold italic font-serif leading-tight text-[#eff8ee]/70 relative z-10">
                      {blog.excerpt}
                    </p>
                    <div className="h-px w-20 bg-[#E8C547] mt-6" />
                  </div>
                )}

                {/* Main Content */}
                <div
                  className="prose prose-lg prose-sharcly max-w-none 
                  prose-headings:font-serif prose-headings:italic prose-headings:tracking-tighter prose-headings:text-white
                  prose-p:text-lg prose-p:leading-relaxed prose-p:font-medium prose-p:text-[#eff8ee]/70
                  prose-strong:text-white prose-strong:font-black
                  prose-blockquote:border-l-4 prose-blockquote:border-[#E8C547] prose-blockquote:pl-10 prose-blockquote:italic
                  prose-img:rounded-[3rem] prose-img:shadow-2xl"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(blog.content) }}
                />

                {/* Tags & Social Share */}
                <div className="mt-20 pt-16 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex flex-wrap gap-3">
                    {blog.tags?.map((tag: string) => (
                      <Badge key={tag} variant="outline" className="px-6 py-2.5 rounded-full border-white/10 text-[10px] font-black uppercase tracking-widest text-[#eff8ee]/40 hover:text-[#E8C547] hover:border-[#E8C547]/30 transition-all cursor-pointer">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-20">Share Narrative</span>
                    <Button variant="outline" className="rounded-full size-14 p-0 border-white/10 hover:bg-white/5 hover:text-[#E8C547] transition-all shadow-sm">
                      <Share2 className="size-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Column: Sidebar */}
              <aside className="lg:col-span-4 space-y-16">
                {/* Recommended Reading */}
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold tracking-tight text-white">Recommended Reading</h3>
                    <div className="h-0.5 w-12 bg-[#E8C547]" />
                  </div>
                  <div className="space-y-8">
                    {relatedPosts.map((post) => (
                      <Link key={post.id} href={`/blogs/${post.slug}`} className="block group space-y-2">
                        <h4 className="text-lg font-bold text-[#eff8ee] group-hover:text-[#E8C547] transition-colors leading-tight">
                          {post.title}
                        </h4>
                        <p className="text-[11px] font-medium text-[#eff8ee]/30 uppercase tracking-widest">
                          {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • 5 min read
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Popular Products */}
                <div className="space-y-8 pt-16 border-t border-white/5">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold tracking-tight text-white">Popular Products</h3>
                    <div className="h-0.5 w-12 bg-[#E8C547]" />
                  </div>
                  <div className="space-y-8">
                    {products.map((product) => (
                      <Link key={product.id} href={`/products/${product.slug}`} className="flex items-center gap-6 group">
                        <div className="size-24 rounded-2xl bg-white/5 border border-white/5 p-2 flex-shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
                          <img 
                            src={product.images?.[0]?.url || "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&q=80"} 
                            alt={product.name} 
                            className="w-full h-full object-contain" 
                          />
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-sm font-bold text-[#eff8ee] leading-tight line-clamp-2">
                            {product.name}
                          </h4>
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E8C547] opacity-60 group-hover:opacity-100 transition-opacity">
                            Experience &raquo;
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Small CTA Card */}
                <div className="bg-white/5 rounded-[2.5rem] p-10 text-white space-y-6 border border-white/5 backdrop-blur-xl">
                  <div className="size-12 rounded-xl bg-[#E8C547] flex items-center justify-center text-[#040e07]">
                    <ShoppingBag className="size-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">The Botanical Collection</h3>
                    <p className="text-white/40 text-sm font-medium leading-relaxed">
                      Explore our full range of state-based formulas and botanical syntheses.
                    </p>
                  </div>
                  <Button asChild className="w-full h-14 bg-[#E8C547] text-[#040e07] font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-[#E8C547]/90 shadow-xl transition-all">
                    <Link href="/products">Shop All Products</Link>
                  </Button>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Related Posts Section */}
        <section className="py-32 border-t border-white/5">
          <div className="container mx-auto px-6">
            <RelatedPosts
              currentBlogId={blog.id}
              category={blog.category}
              tags={blog.tags}
            />
          </div>
        </section>


      </main>

      <Footer />

      <style dangerouslySetInnerHTML={{
        __html: sanitizeHtml(`
        .prose-sharcly h2 {
          font-size: 2.5rem;
          line-height: 1.1;
          margin-top: 3.5rem;
          margin-bottom: 1.5rem;
        }
        .prose-sharcly h3 {
          font-size: 1.75rem;
          line-height: 1.2;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
        }
        .prose-sharcly p {
          margin-bottom: 1.5rem;
        }
        .prose-sharcly ul, .prose-sharcly ol {
          margin-bottom: 2rem;
          padding-left: 1.5rem;
        }
        .prose-sharcly li {
          margin-bottom: 0.75rem;
          font-size: 1.125rem;
          font-weight: 500;
          color: rgba(239, 248, 238, 0.6);
        }
        .prose-sharcly img {
          border-radius: 3rem;
          margin: 4rem auto;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.05);
          max-height: 70vh;
          width: auto;
          display: block;
        }
      `)
      }} />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
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
import { apiClient } from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, useScroll, useSpring } from "framer-motion";
import { RelatedPosts } from "@/components/blog/RelatedPosts";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
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
    <div className="min-h-screen bg-[#f0f9f0] text-[#0d2719] selection:bg-[#0d2719] selection:text-white">
      <Navbar />
      
      {/* Reading Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1.5 bg-[#0d2719] z-[100] origin-left" 
        style={{ scaleX }} 
      />

      <main>
        {/* Hero Section */}
        <section className="pt-40 pb-20 lg:pt-56 lg:pb-32 overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-6 mb-12"
              >
                <button 
                  onClick={() => router.back()} 
                  className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#0d2719]/40 hover:text-[#0d2719] transition-colors"
                >
                  <div className="size-10 rounded-full border border-[#0d2719]/10 flex items-center justify-center group-hover:bg-[#0d2719] group-hover:text-white transition-all">
                    <ArrowLeft className="size-4" />
                  </div>
                  Back to Registry
                </button>
                <div className="h-px w-12 bg-[#0d2719]/10" />
                <Badge className="bg-[#0d2719]/5 text-[#0d2719] border-none font-black text-[10px] uppercase tracking-[0.2em] px-6 py-2.5 rounded-full flex items-center gap-2">
                  <Sparkles className="size-3" /> Botanical Piece
                </Badge>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-6xl lg:text-[7rem] font-black tracking-tighter leading-[0.9] mb-16 italic font-serif"
              >
                {blog.title}
              </motion.h1>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center gap-12 py-10 border-y border-[#0d2719]/10"
              >
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-full bg-white flex items-center justify-center shadow-sm"><User className="size-5 opacity-40" /></div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30">Authored By</p>
                    <p className="text-sm font-bold">{blog.author?.name || "Sharcly Botanical"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-full bg-white flex items-center justify-center shadow-sm"><Calendar className="size-5 opacity-40" /></div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30">Log Date</p>
                    <p className="text-sm font-bold">{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-full bg-white flex items-center justify-center shadow-sm"><Clock className="size-5 opacity-40" /></div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30">Read Time</p>
                    <p className="text-sm font-bold">5 Min Sequence</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Featured Image */}
        {blog.featuredImage && (
          <motion.section 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="px-6 lg:container lg:mx-auto"
          >
            <div className="relative aspect-[21/9] rounded-[4rem] overflow-hidden shadow-2xl border border-[#0d2719]/5">
              <img 
                src={blog.featuredImage} 
                alt={blog.title} 
                className="absolute inset-0 w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0d2719]/20" />
            </div>
          </motion.section>
        )}

        {/* Content Section */}
        <section className="py-32 lg:py-48">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              {/* Excerpt/Intro */}
              {blog.excerpt && (
                <div className="mb-24 relative">
                  <div className="absolute -left-10 top-0 text-[120px] font-serif italic text-[#0d2719]/5 leading-none">"</div>
                  <p className="text-3xl lg:text-4xl font-bold italic font-serif leading-tight text-[#0d2719]/70 relative z-10">
                    {blog.excerpt}
                  </p>
                  <div className="h-px w-32 bg-[#0d2719] mt-16" />
                </div>
              )}

              {/* Main Content */}
              <div 
                className="prose prose-xl prose-sharcly max-w-none 
                prose-headings:font-serif prose-headings:italic prose-headings:tracking-tighter prose-headings:text-[#0d2719]
                prose-p:text-xl prose-p:leading-[1.8] prose-p:font-medium prose-p:text-[#0d2719]/80
                prose-strong:text-[#0d2719] prose-strong:font-black
                prose-blockquote:border-l-4 prose-blockquote:border-[#0d2719] prose-blockquote:pl-10 prose-blockquote:italic
                prose-img:rounded-[3rem] prose-img:shadow-2xl"
                dangerouslySetInnerHTML={{ 
                  __html: blog.content 
                }}
              />

              {/* Tags & Social Share */}
              <div className="mt-32 pt-20 border-t border-[#0d2719]/10 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="flex flex-wrap gap-3">
                  {blog.tags?.map((tag: string) => (
                    <Badge key={tag} variant="outline" className="px-6 py-2.5 rounded-full border-[#0d2719]/10 text-[10px] font-black uppercase tracking-widest text-[#0d2719]/50 hover:text-[#0d2719] hover:border-[#0d2719]/30 transition-all cursor-pointer">
                      #{tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Share Narrative</span>
                  <Button variant="outline" className="rounded-full size-14 p-0 border-[#0d2719]/10 hover:bg-[#0d2719] hover:text-white transition-all shadow-sm">
                    <Share2 className="size-5" />
                  </Button>
                </div>
              </div>

              {/* CTA Section */}
              <div className="mt-32 p-12 lg:p-20 rounded-[4rem] bg-white border border-[#0d2719]/5 shadow-xl flex flex-col lg:flex-row items-center gap-12 justify-between">
                <div className="space-y-6 text-center lg:text-left">
                  <h3 className="text-4xl font-bold tracking-tight">Experience the Synthesis.</h3>
                  <p className="text-[#0d2719]/50 font-medium max-w-md">Discover the botanical products featured in this exploration.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                  <Button asChild className="rounded-full h-16 px-10 bg-[#0d2719] text-white shadow-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-transform gap-3">
                    <Link href="/products"><ShoppingBag className="size-4" /> Explore Products</Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-full h-16 px-10 border-[#0d2719]/10 font-black uppercase tracking-widest text-[10px] hover:bg-[#0d2719]/5 transition-all">
                    <Link href="/blogs">Back to Registry</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Posts Section (LIST VIEW as requested) */}
        <section className="py-32 bg-[#f9fff9] border-t border-[#0d2719]/5">
          <div className="container mx-auto px-6">
            <RelatedPosts 
              currentBlogId={blog.id} 
              category={blog.category} 
              tags={blog.tags} 
            />
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-40 bg-[#0d2719] text-white relative overflow-hidden">
          <div className="container mx-auto px-6 relative z-10 text-center space-y-16">
            <BookOpen className="size-20 mx-auto opacity-10 mb-8" />
            <div className="space-y-6">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30">Immediate Transmission</p>
              <h2 className="text-6xl lg:text-8xl font-black tracking-tighter italic font-serif leading-[0.8]">
                Stay in the <br /> <span className="not-italic">Knowledge.</span>
              </h2>
            </div>
            <div className="max-w-2xl mx-auto relative group">
              <input
                type="email"
                placeholder="Botanical Identity (Email)"
                className="w-full h-24 bg-white/5 border border-white/10 rounded-[2.5rem] px-10 font-bold text-lg text-white outline-none focus:ring-8 focus:ring-white/[0.02] transition-all placeholder:text-white/10"
              />
              <Button className="absolute right-4 top-4 h-16 px-12 bg-white text-[#0d2719] font-black uppercase tracking-widest text-[10px] rounded-[1.8rem] hover:bg-white/90 shadow-2xl">
                Join Archive
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style dangerouslySetInnerHTML={{ __html: `
        .prose-sharcly h2 {
          font-size: 3rem;
          line-height: 1;
          margin-top: 6rem;
          margin-bottom: 3rem;
        }
        .prose-sharcly h3 {
          font-size: 2.25rem;
          line-height: 1.1;
          margin-top: 4rem;
          margin-bottom: 2rem;
        }
        .prose-sharcly p {
          margin-bottom: 2.5rem;
        }
        .prose-sharcly ul, .prose-sharcly ol {
          margin-bottom: 3rem;
          padding-left: 2rem;
        }
        .prose-sharcly li {
          margin-bottom: 1rem;
          font-size: 1.25rem;
          font-weight: 500;
          color: rgba(13, 39, 25, 0.7);
        }
      `}} />
    </div>
  );
}

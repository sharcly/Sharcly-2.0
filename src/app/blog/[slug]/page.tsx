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
  ChevronRight,
  Sparkles,
  BookOpen
} from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function BlogPostDetail() {
  const { slug } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
      <div className="min-h-screen bg-[#FDFCFA]">
        <Navbar />
        <div className="container mx-auto px-6 py-32 space-y-12">
          <Skeleton className="h-4 w-24 rounded-full" />
          <Skeleton className="h-20 w-3/4 rounded-3xl" />
          <Skeleton className="h-96 w-full rounded-[3rem]" />
          <div className="space-y-4 max-w-3xl mx-auto">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#FDFCFA] flex flex-col items-center justify-center p-8">
        <Navbar />
        <h2 className="text-4xl font-black tracking-tighter mb-4 italic font-serif">Narrative Missing.</h2>
        <p className="text-muted-foreground mb-10">This story could not be found in the botanical archives.</p>
        <Button asChild className="rounded-full px-12 h-16 bg-[#062D1B] text-white"><Link href="/blog">Back to Registry</Link></Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFA] text-[#062D1B] selection:bg-[#062D1B] selection:text-white">
      <Navbar />
      
      <main>
        {/* Progress Bar (Desktop) */}
        <div className="fixed top-0 left-0 w-full h-1 bg-black/5 z-[60]">
           <motion.div 
             className="h-full bg-[#062D1B]" 
             initial={{ scaleX: 0 }} 
             animate={{ scaleX: 1 }} 
             transition={{ duration: 1 }}
           />
        </div>

        {/* Hero Section */}
        <section className="pt-32 pb-16 lg:pt-48 lg:pb-24 overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl">
              <div className="flex items-center gap-4 mb-8">
                 <button onClick={() => router.back()} className="size-10 rounded-full border border-black/5 flex items-center justify-center hover:bg-[#062D1B] hover:text-white transition-all">
                    <ArrowLeft className="size-4" />
                 </button>
                 <div className="h-px w-12 bg-black/10" />
                 <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-black text-[10px] uppercase tracking-[0.2em] px-4 py-1.5 flex items-center gap-2">
                    <Sparkles className="size-3" /> Editorial Piece
                 </Badge>
              </div>

              <h1 className="text-5xl lg:text-8xl font-black tracking-tighter leading-[0.95] mb-12 italic font-serif">
                 {blog.title}
              </h1>

              <div className="flex flex-wrap items-center gap-8 py-8 border-y border-black/[0.03]">
                 <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-neutral-100 flex items-center justify-center"><User className="size-4 opacity-30" /></div>
                    <div className="space-y-0.5">
                       <p className="text-[9px] font-black uppercase tracking-widest opacity-30">Authored By</p>
                       <p className="text-sm font-bold">{blog.author?.name || "Sharcly Botanical"}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-neutral-100 flex items-center justify-center"><Calendar className="size-4 opacity-30" /></div>
                    <div className="space-y-0.5">
                       <p className="text-[9px] font-black uppercase tracking-widest opacity-30">Log Date</p>
                       <p className="text-sm font-bold">{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-neutral-100 flex items-center justify-center"><Clock className="size-4 opacity-30" /></div>
                    <div className="space-y-0.5">
                       <p className="text-[9px] font-black uppercase tracking-widest opacity-30">Reading Time</p>
                       <p className="text-sm font-bold">8 Min Sequence</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Image */}
        {blog.featuredImage && (
          <section className="px-6 lg:container lg:mx-auto">
            <div className="relative aspect-[21/9] rounded-[3.5rem] overflow-hidden shadow-2xl border border-black/[0.03]">
               <img 
                 src={blog.featuredImage} 
                 alt={blog.title} 
                 className="absolute inset-0 w-full h-full object-cover transition-transform duration-[20s] hover:scale-110" 
               />
               <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
            </div>
          </section>
        )}

        {/* Content Section */}
        <section className="py-24 lg:py-32">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              {/* Excerpt/Intro */}
              {blog.excerpt && (
                <div className="mb-20">
                  <p className="text-2xl lg:text-3xl font-bold italic font-serif leading-relaxed opacity-60">
                    "{blog.excerpt}"
                  </p>
                  <div className="h-px w-24 bg-[#062D1B] mt-10" />
                </div>
              )}

              {/* Main Content */}
              <div 
                className="prose prose-lg prose-sharcly max-w-none prose-headings:font-serif prose-headings:italic prose-headings:tracking-tighter prose-p:text-lg prose-p:leading-relaxed prose-p:font-medium prose-p:text-[#062D1B]/80"
                dangerouslySetInnerHTML={{ 
                  __html: sanitizeHtml(blog.content.replace(/\n/g, '<br/>')) 
                }}
              />

              {/* Footer Registry Info */}
              <div className="mt-32 p-12 rounded-[3.5rem] bg-white border border-black/[0.03] shadow-sharcly flex flex-col md:flex-row items-center justify-between gap-8">
                 <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20">Archive Metadata</p>
                    <h4 className="text-xl font-bold tracking-tight">Finalized Transmission</h4>
                 </div>
                 <div className="flex gap-4">
                    <Button variant="outline" className="rounded-full h-14 px-8 border-black/5 hover:bg-black/5 gap-3 font-bold text-xs">
                       <Share2 className="size-4" /> Share Protocol
                    </Button>
                    <Button asChild className="rounded-full h-14 px-10 bg-[#062D1B] text-white shadow-xl font-bold text-xs">
                       <Link href="/blog">Return to Registry</Link>
                    </Button>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Next Read Suggestion */}
        <section className="py-32 bg-[#062D1B] text-white rounded-t-[5rem] overflow-hidden relative">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />
           <div className="container mx-auto px-6 relative z-10 text-center space-y-12">
              <BookOpen className="size-16 mx-auto opacity-10 mb-8" />
              <div className="space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30">Next Synthesis</p>
                 <h2 className="text-5xl lg:text-7xl font-bold tracking-tighter italic font-serif">Continue the <br /> <span className="not-italic">Exploration.</span></h2>
              </div>
              <Button asChild className="rounded-full h-20 px-16 bg-white text-[#062D1B] hover:bg-white/90 text-sm font-bold uppercase tracking-widest shadow-2xl">
                 <Link href="/blog">Browse More Stories</Link>
              </Button>
           </div>
        </section>
      </main>

      <Footer />

      <style dangerouslySetInnerHTML={{ __html: `
        .prose-sharcly h1, .prose-sharcly h2, .prose-sharcly h3 {
          margin-top: 4rem;
          margin-bottom: 2rem;
          color: #062D1B;
        }
        .prose-sharcly p {
          margin-bottom: 2rem;
        }
        .prose-sharcly b, .prose-sharcly strong {
          color: #062D1B;
          font-weight: 800;
        }
      `}} />
    </div>
  );
}

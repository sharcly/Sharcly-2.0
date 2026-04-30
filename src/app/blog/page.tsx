"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, User, Clock, Search, Book } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await apiClient.get(`/blogs?status=PUBLISHED&search=${search}`);
        setBlogs(response.data.blogs || []);
      } catch (error) {
        console.error("Failed to fetch narratives");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [search]);

  return (
    <div className="min-h-screen bg-[#FDFCFA] text-[#062D1B]">
      <Navbar />
      <main className="flex-1">
        
        {/* Cinematic Banner */}
        <section className="relative pt-32 pb-24 lg:pt-56 lg:pb-40 overflow-hidden">
           <div className="container mx-auto px-6">
              <div className="max-w-4xl space-y-10">
                <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left duration-700">
                   <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-black text-[10px] uppercase tracking-[0.4em] px-5 py-2">The Sharcly Journal</Badge>
                   <div className="h-px w-12 bg-black/10" />
                   <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Archive Registry</span>
                </div>
                
                <h1 className="text-6xl lg:text-9xl font-black tracking-tighter leading-[0.8] animate-in fade-in slide-in-from-bottom duration-1000">
                  BOTANICAL <br/>
                  <span className="italic font-serif text-[#062D1B]/40">KNOWLEDGE.</span>
                </h1>
                
                <div className="flex flex-col md:flex-row md:items-center gap-10">
                   <p className="text-lg lg:text-xl text-black/50 font-medium max-w-xl leading-relaxed">
                     Deep dives into hemp science, lifestyle protocols, and the latest synthesis from our botanical labs.
                   </p>
                   <div className="relative flex-1 max-w-sm group">
                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 size-4 text-black/20 group-focus-within:text-[#062D1B] transition-colors" />
                      <input 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search the archive..." 
                        className="w-full h-16 rounded-full bg-white border border-black/5 px-14 font-bold text-xs shadow-xl shadow-black/[0.02] focus:ring-4 focus:ring-[#062D1B]/5 transition-all outline-none"
                      />
                   </div>
                </div>
              </div>
           </div>

           {/* Decorative floating icon */}
           <div className="absolute top-1/2 right-0 -translate-y-1/2 size-[600px] bg-[#062D1B]/[0.01] rounded-full blur-3xl -mr-[300px] pointer-events-none" />
        </section>

        {/* Blog Grid */}
        <section className="pb-32 lg:pb-48">
           <div className="container mx-auto px-6">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-20">
                   {[1, 2, 3].map((i) => (
                      <div key={i} className="space-y-8">
                         <Skeleton className="aspect-[16/10] rounded-[3rem]" />
                         <Skeleton className="h-4 w-24 rounded-full" />
                         <Skeleton className="h-12 w-full rounded-2xl" />
                      </div>
                   ))}
                </div>
              ) : blogs.length === 0 ? (
                <div className="py-32 text-center space-y-6">
                   <div className="size-20 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-10"><Book className="size-8 opacity-20" /></div>
                   <h3 className="text-3xl font-black italic font-serif tracking-tighter">No stories matched the sequence.</h3>
                   <Button variant="link" onClick={() => setSearch("")} className="font-bold text-xs uppercase tracking-widest text-[#062D1B]">Clear Archive Filters</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-x-20 lg:gap-y-32">
                   {blogs.map((blog, i) => (
                      <motion.article 
                        key={blog.id} 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group flex flex-col h-full"
                      >
                         <Link href={`/blog/${blog.slug}`} className="block relative aspect-[4/5] lg:aspect-[16/20] rounded-[3.5rem] overflow-hidden mb-10 shadow-sharcly border border-black/[0.03]">
                            <img 
                              src={blog.featuredImage || "https://images.unsplash.com/photo-1512100353917-7027ee1b277c?auto=format&fit=crop&q=80"} 
                              alt={blog.title} 
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute bottom-10 left-10 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                               <Button variant="outline" className="rounded-full bg-white border-none text-[10px] font-black uppercase tracking-widest px-8 h-12 shadow-2xl">Visual Archive</Button>
                            </div>
                         </Link>

                         <div className="space-y-6 flex-1 flex flex-col px-4">
                            <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-black/30">
                               <span className="flex items-center gap-2 italic"><Calendar className="size-3" /> {new Date(blog.createdAt).toLocaleDateString()}</span>
                               <span className="size-1 rounded-full bg-black/10" />
                               <span className="flex items-center gap-2"><Clock className="size-3" /> 8 min</span>
                            </div>
                            
                            <h2 className="text-3xl font-black tracking-tighter leading-[1.1] text-[#062D1B] group-hover:italic transition-all duration-300">
                               <Link href={`/blog/${blog.slug}`}>
                                  {blog.title}
                               </Link>
                            </h2>
                            
                            <p className="text-sm font-medium text-black/40 line-clamp-3 leading-relaxed">
                               {blog.excerpt || "A deep investigation into the botanical properties of our latest synthesis collections."}
                            </p>

                            <div className="pt-6 mt-auto">
                               <Button asChild variant="link" className="p-0 h-auto text-[10px] font-black uppercase tracking-widest text-[#062D1B] hover:text-emerald-700 transition-colors no-underline group-hover:translate-x-2 duration-300">
                                  <Link href={`/blog/${blog.slug}`}>
                                     Examine Narrative <ArrowRight className="ml-3 size-3" />
                                  </Link>
                               </Button>
                            </div>
                         </div>
                      </motion.article>
                   ))}
                </div>
              )}
           </div>
        </section>

        {/* Global Dispatch Invite [Newsletter] */}
        <section className="py-40 bg-[#062D1B] text-white relative overflow-hidden">
           <div className="container mx-auto px-6 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                 <div className="space-y-10">
                    <h2 className="text-6xl lg:text-8xl font-black tracking-tighter italic font-serif leading-[0.8]">Join the <br /> <span className="not-italic">Circle.</span></h2>
                    <p className="text-xl text-white/40 font-medium max-w-sm">Receive immediate transmission of new research, narratives, and limited botanical drops.</p>
                 </div>
                 <div className="relative group">
                    <input 
                      type="email" 
                      placeholder="Botanical Identity (Email)" 
                      className="w-full h-24 bg-white/5 border border-white/10 rounded-[2.5rem] px-10 font-bold text-lg text-white outline-none focus:ring-8 focus:ring-white/[0.02] transition-all placeholder:text-white/10"
                    />
                    <Button className="absolute right-4 top-4 h-16 px-10 bg-white text-[#062D1B] font-black uppercase tracking-widest text-[10px] rounded-[1.8rem] hover:bg-white/90">
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

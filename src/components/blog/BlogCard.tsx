"use client";

import { motion } from "framer-motion";
import { Calendar, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

interface BlogCardProps {
  blog: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    featuredImage?: string;
    category?: string;
    createdAt: string;
    tags?: string[];
  };
  viewMode: "grid" | "list";
}

export function BlogCard({ blog, viewMode }: BlogCardProps) {
  const date = new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const fallbackImg = "https://images.unsplash.com/photo-1544022613-e87ce71c8e4d?auto=format&fit=crop&q=80";

  if (viewMode === "list") {
    return (
      <motion.article initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="group">
        <Link href={`/blogs/${blog.slug}`} className="block">
          <div className="flex flex-col md:flex-row rounded-[18px] overflow-hidden transition-all duration-500 hover:-translate-y-0.5"
            style={{ backgroundColor: 'rgba(239,248,238,0.02)', border: '1px solid rgba(239,248,238,0.05)' }}>
            <div className="relative w-full md:w-[320px] shrink-0 aspect-[16/10] md:aspect-auto overflow-hidden">
              <img src={blog.featuredImage || fallbackImg} alt={blog.title} className="w-full h-full object-cover transition-transform duration-[1s] ease-[0.22,1,0.36,1] group-hover:scale-105" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(4,14,7,0.2) 0%, transparent 100%)' }} />
              {blog.category && (
                <span className="absolute top-4 left-4 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.15em]" style={{ backgroundColor: '#E8C547', color: '#040e07', borderRadius: '2px' }}>{blog.category}</span>
              )}
            </div>
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
              <div className="flex items-center gap-2.5 text-[9px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(239,248,238,0.28)' }}>
                <Calendar className="size-3" />{date}
                <span className="size-0.5 rounded-full" style={{ backgroundColor: 'rgba(239,248,238,0.15)' }} />
                <Clock className="size-3" />5 min
              </div>
              <h3 className="text-lg md:text-xl font-bold tracking-tight leading-snug mb-2 transition-colors duration-300 group-hover:text-[#E8C547]" style={{ color: '#eff8ee' }}>{blog.title}</h3>
              {blog.excerpt && <p className="text-[13px] font-medium leading-relaxed line-clamp-2 mb-4" style={{ color: 'rgba(239,248,238,0.38)' }}>{blog.excerpt}</p>}
              <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] transition-all duration-300 group-hover:gap-3.5" style={{ color: '#E8C547' }}>
                Read <ArrowRight className="size-3" />
              </span>
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  // ─── GRID VIEW ───
  return (
    <motion.article initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="group flex flex-col">
      <Link href={`/blogs/${blog.slug}`} className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col rounded-[18px] overflow-hidden transition-all duration-500 hover:-translate-y-1"
          style={{ backgroundColor: 'rgba(239,248,238,0.02)', border: '1px solid rgba(239,248,238,0.05)' }}>
          
          {/* Image */}
          <div className="relative aspect-[16/10] overflow-hidden">
            <img src={blog.featuredImage || fallbackImg} alt={blog.title} className="w-full h-full object-cover transition-transform duration-[1s] ease-[0.22,1,0.36,1] group-hover:scale-105" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(4,14,7,0.45) 0%, rgba(4,14,7,0.02) 60%)' }} />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: 'radial-gradient(circle at 50% 80%, rgba(232,197,71,0.07), transparent 60%)' }} />
            
            {blog.category && (
              <span className="absolute top-3.5 left-3.5 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.15em]" style={{ backgroundColor: '#E8C547', color: '#040e07', borderRadius: '2px' }}>{blog.category}</span>
            )}
            <div className="absolute bottom-3.5 right-3.5 flex items-center gap-1.5 px-2.5 py-1 rounded-md" style={{ backgroundColor: 'rgba(4,14,7,0.55)', backdropFilter: 'blur(8px)' }}>
              <Clock className="size-3" style={{ color: 'rgba(239,248,238,0.6)' }} />
              <span className="text-[9px] font-bold" style={{ color: 'rgba(239,248,238,0.7)' }}>5 min</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col p-5 md:p-6">
            <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(239,248,238,0.25)' }}>
              <Calendar className="size-3" />{date}
            </div>

            <h3 className="text-[15px] font-bold tracking-tight leading-snug mb-2.5 transition-colors duration-300 group-hover:text-[#E8C547] line-clamp-2" style={{ color: '#eff8ee' }}>{blog.title}</h3>

            {blog.excerpt && <p className="text-[12px] font-medium leading-relaxed line-clamp-2 mb-4" style={{ color: 'rgba(239,248,238,0.32)' }}>{blog.excerpt}</p>}

            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {blog.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider" style={{ backgroundColor: 'rgba(239,248,238,0.04)', color: 'rgba(239,248,238,0.3)', border: '1px solid rgba(239,248,238,0.06)' }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-auto pt-3.5" style={{ borderTop: '1px solid rgba(239,248,238,0.04)' }}>
              <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] transition-all duration-300 group-hover:gap-3.5" style={{ color: '#E8C547' }}>
                Read Article <ArrowRight className="size-3" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

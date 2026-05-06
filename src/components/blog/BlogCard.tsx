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

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      className={cn(
        "group relative bg-transparent transition-all duration-500 overflow-hidden",
        !isGrid && "flex flex-col md:flex-row gap-8"
      )}
    >
      {/* Image Section */}
      <div
        className={cn(
          "relative overflow-hidden rounded-[2rem]",
          isGrid ? "aspect-[4/3]" : "w-full md:w-2/5 aspect-[4/3] md:aspect-auto"
        )}
      >
        <Link href={`/blogs/${blog.slug}`}>
          <img
            src={blog.featuredImage || "https://images.unsplash.com/photo-1544022613-e87ce71c8e4d?auto=format&fit=crop&q=80"}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-[#0d2719]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </Link>
        
        {blog.category && (
          <Badge className="absolute top-4 left-4 bg-white text-[#0d2719] border-none font-bold text-[9px] uppercase tracking-[0.2em] px-4 py-1.5 rounded-[0.8rem] shadow-sm">
            {blog.category}
          </Badge>
        )}
      </div>

      {/* Content Section */}
      <div className={cn("py-6 flex flex-col flex-1", !isGrid && "justify-center")}>
        <div className="flex items-center gap-2 text-[11px] font-medium text-[#eff8ee]/40 mb-3">
          <span>
            {new Date(blog.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span>•</span>
          <span>5 min read</span>
        </div>

        <h3 className={cn(
          "font-bold tracking-tight text-[#eff8ee] group-hover:text-[#E8C547] transition-colors mb-4",
          isGrid ? "text-xl lg:text-2xl leading-tight" : "text-2xl lg:text-3xl leading-tight"
        )}>
          <Link href={`/blogs/${blog.slug}`}>
            {blog.title}
          </Link>
        </h3>

        {blog.excerpt && (
          <p className="text-[#eff8ee]/60 text-sm leading-relaxed mb-6 line-clamp-2">
            {blog.excerpt}
          </p>
        )}

        <div className="mt-auto">
          <Link 
            href={`/blogs/${blog.slug}`} 
            className="inline-flex items-center gap-2 text-xs font-bold text-[#E8C547] hover:gap-3 transition-all"
          >
            Read Article <ArrowRight className="size-4" />
          </Link>
        </div>
      </Link>
    </motion.article>
  );
}

"use client";

import { motion } from "framer-motion";
import { Calendar, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const isGrid = viewMode === "grid";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      className={cn(
        "group relative bg-white rounded-[2.5rem] border border-[#0d2719]/5 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden",
        !isGrid && "flex flex-col md:flex-row"
      )}
    >
      {/* Image Section */}
      <div
        className={cn(
          "relative overflow-hidden",
          isGrid ? "aspect-[16/10]" : "w-full md:w-2/5 aspect-[16/10] md:aspect-auto"
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
          <Badge className="absolute top-6 left-6 bg-white/90 backdrop-blur-md text-[#0d2719] border-none font-bold text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full">
            {blog.category}
          </Badge>
        )}
      </div>

      {/* Content Section */}
      <div className={cn("p-8 md:p-10 flex flex-col flex-1", !isGrid && "justify-center")}>
        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-[#0d2719]/40 mb-6">
          <span className="flex items-center gap-2">
            <Calendar className="size-3" />
            {new Date(blog.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className="size-1 rounded-full bg-[#0d2719]/10" />
          <span className="flex items-center gap-2">
            <Clock className="size-3" /> 5 min read
          </span>
        </div>

        <h3 className={cn(
          "font-bold tracking-tight text-[#0d2719] group-hover:text-[#0d2719]/70 transition-colors mb-4",
          isGrid ? "text-2xl leading-tight" : "text-3xl lg:text-4xl leading-tight"
        )}>
          <Link href={`/blogs/${blog.slug}`}>
            {blog.title}
          </Link>
        </h3>

        {blog.excerpt && (
          <p className="text-[#0d2719]/60 font-medium leading-relaxed mb-8 line-clamp-2 md:line-clamp-3">
            {blog.excerpt}
          </p>
        )}

        <div className="mt-auto">
          <Button
            asChild
            variant="link"
            className="p-0 h-auto text-[10px] font-black uppercase tracking-[0.2em] text-[#0d2719] hover:text-[#0d2719]/70 transition-all group-hover:translate-x-2 duration-300 no-underline"
          >
            <Link href={`/blogs/${blog.slug}`} className="flex items-center gap-3">
              Read Protocol <ArrowRight className="size-3" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.article>
  );
}

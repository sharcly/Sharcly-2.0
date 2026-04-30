"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface CategoryCardProps {
  name: string;
  slug: string;
  icon: LucideIcon;
  image?: string;
  count?: number;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ name, slug, icon: Icon, image, count }) => {
  return (
    <Link href={`/products/category/${slug}`} className="group block">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative mb-8"
      >
        <div className="relative aspect-[4/5] rounded-[2.5rem] bg-white overflow-hidden border border-black/[0.03] shadow-organic transition-all duration-700 group-hover:shadow-sharcly group-hover:-translate-y-2 group-hover:border-primary/10">
           {image ? (
             <Image 
               src={image} 
               alt={name} 
               fill
               className="h-full w-full object-cover transition-transform duration-[2s] group-hover:scale-105" 
               style={{ filter: 'brightness(0.95) contrast(1.02) saturate(0.9)' }}
             />
           ) : (
             <div className="h-full w-full flex items-center justify-center bg-sage/30">
                <Icon className="h-14 w-14 text-primary/10 group-hover:text-primary transition-all duration-1000" />
              </div>
           )}
           
           <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background/80 to-transparent transition-opacity duration-1000" />
           
           <div className="absolute bottom-10 left-10 right-10">
              <div className="flex items-center gap-4 mb-4">
                 <div className="h-px bg-primary/20 w-8 group-hover:w-12 transition-all duration-700" />
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 italic">Signature Series</span>
              </div>
              <h3 className="text-3xl font-heading font-black tracking-tight text-primary leading-tight">
                {name.split(' ').map((word, i) => (
                  <span key={i} className={i === 1 ? "italic font-serif opacity-80" : ""}>{word} </span>
                ))}
              </h3>
           </div>

           {count !== undefined && (
             <div className="absolute top-8 right-8 px-4 py-1.5 rounded-full border border-black/5 bg-white/60 backdrop-blur-2xl shadow-sm">
                <span className="text-[10px] font-black text-primary/60 tabular-nums tracking-widest">{count} Units</span>
             </div>
           )}
        </div>
      </motion.div>
      
      <div className="flex justify-center overflow-hidden">
        <p className="text-[11px] font-black text-primary/20 uppercase tracking-[0.4em] group-hover:text-primary transition-all duration-700 transform translate-y-2 group-hover:translate-y-0 italic">
          Explore Archive
        </p>
      </div>
    </Link>
  );
};

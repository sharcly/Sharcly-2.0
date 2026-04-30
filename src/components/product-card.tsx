"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ShoppingBag, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    stock?: number;
    description?: string;
    images?: any[];
    category?: { name: string };
  };
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.split('/api')[0] || "http://localhost:8181";
  const rawImage = product.imageUrls?.[0] || product.images?.[0]?.url || product.images?.[0];
  const imageUrl = rawImage?.startsWith('/api') ? `${baseUrl}${rawImage}` : (rawImage || "https://i.postimg.cc/K8nwpV4T/Premium-Hemp-Essentials-Sharcly.jpg");
  const dispatch = useDispatch();

  return (
    <div className="group flex flex-col h-full transition-all duration-500">
      <Link href={`/products/${product.slug}`} className="block relative aspect-[5/6] overflow-hidden rounded-xl bg-neutral-100 mb-6 group-hover:shadow-sm transition-shadow duration-500">
        <img 
          src={imageUrl} 
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.02] transition-colors" />
        
        <div className="absolute top-4 left-4">
          <Badge className="bg-white/90 backdrop-blur-md text-[9px] font-bold uppercase tracking-widest text-[#062D1B]/50 border-none px-3 py-1">
             {product.category?.name || "Series"}
          </Badge>
        </div>

        {product.stock === 0 && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-red-500/90 backdrop-blur-md text-[9px] font-bold uppercase tracking-widest text-white border-none px-3 py-1">
               Out of Stock
            </Badge>
          </div>
        )}

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
           <button 
             disabled={product.stock === 0}
             onClick={(e) => {
               e.preventDefault();
               e.stopPropagation();
               if (product.stock === 0) return;
               dispatch(addToCart({
                 id: product.id,
                 name: product.name,
                 slug: product.slug,
                 price: product.price,
                 quantity: 1,
                 image: imageUrl,
                 category: product.category?.name
               }));
             }}
             className={cn(
               "w-full h-10 rounded-full flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest shadow-xl transition-all",
               product.stock === 0 
                 ? "bg-neutral-200 text-black/20 cursor-not-allowed" 
                 : "bg-[#062D1B] text-white hover:bg-black active:scale-[0.98]"
             )}
           >
              {product.stock === 0 ? "Unavailable" : <><Plus className="size-3" /> Add to Cart</>}
           </button>
        </div>
      </Link>

      <div className="flex flex-col flex-1 px-1">
        <div className="flex justify-between items-baseline gap-4 mb-2">
           <h3 className="text-sm font-semibold tracking-tight text-[#062D1B]">
              {product.name}
           </h3>
           <span className="text-sm font-medium text-[#062D1B]/40 tabular-nums">${product.price}</span>
        </div>
        
        <p className="text-[12px] text-[#062D1B]/40 font-normal leading-relaxed line-clamp-1 mb-4">
          {product.description || "Micro-processed botanical extract for rhythmic balance."}
        </p>

        <Link 
          href={`/products/${product.slug}`}
          className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#062D1B]/20 group-hover:text-[#062D1B] transition-colors decoration-dotted underline-offset-4 hover:underline"
        >
          View Collection
        </Link>
      </div>
    </div>
  );
};

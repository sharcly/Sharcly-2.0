"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/lib/image-utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    stock?: number;
    description?: string;
    images?: any[];
    imageUrls?: string[];
    category?: { name: string };
  };
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const imageUrl = getImageUrl(product.imageUrls?.[0] || product.images?.[0]);
  const dispatch = useDispatch();

  return (
    <div className="group flex flex-col h-full transition-all duration-500">
      <Link
        href={`/products/${product.slug}`}
        className="block relative aspect-[4/5] overflow-hidden rounded-[20px] mb-5 transition-all duration-700 ease-[0.22,1,0.36,1] group-hover:-translate-y-[6px] group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
        style={{ backgroundColor: '#0d2518', boxShadow: '0 20px 50px rgba(0,0,0,0.4)' }}
      >
        <img 
          src={imageUrl} 
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-[0.22,1,0.36,1] group-hover:scale-[1.06]"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(4,14,7,0.85) 0%, rgba(4,14,7,0.05) 60%)' }} />

        {/* Gold glow on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: 'radial-gradient(circle at bottom center, rgba(232,197,71,0.12), transparent 70%)' }} />

        {/* Corner brackets */}
        <div className="absolute top-4 right-4 w-6 h-6 opacity-0 group-hover:opacity-40 transition-all duration-500 translate-x-1 -translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0">
          <div className="absolute top-0 right-0 w-full h-[1px] bg-[#E8C547]" />
          <div className="absolute top-0 right-0 h-full w-[1px] bg-[#E8C547]" />
        </div>
        <div className="absolute bottom-14 left-4 w-6 h-6 opacity-0 group-hover:opacity-40 transition-all duration-500 -translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0">
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#E8C547]" />
          <div className="absolute bottom-0 left-0 h-full w-[1px] bg-[#E8C547]" />
        </div>
        
        {/* Category tag */}
        <div className="absolute top-4 left-4">
          <span className="inline-block px-2.5 py-1 rounded-full border backdrop-blur-md text-[9px] font-semibold uppercase tracking-[0.16em]"
            style={{ backgroundColor: 'rgba(232,197,71,0.1)', borderColor: 'rgba(232,197,71,0.25)', color: '#E8C547' }}
          >
            {product.category?.name || "Series"}
          </span>
        </div>

        {product.stock === 0 && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-red-500/80 backdrop-blur-md text-[9px] font-bold uppercase tracking-widest text-white border-none px-3 py-1">
               Out of Stock
            </Badge>
          </div>
        )}

        {/* Bottom card content */}
        <div className="absolute bottom-0 inset-x-0 p-5 z-10">
          <h3 className="text-[15px] font-bold leading-tight mb-1" style={{ fontFamily: 'var(--font-cormorant), serif', color: '#eff8ee' }}>
            {product.name}
          </h3>
          <span className="text-[13px] font-semibold tabular-nums" style={{ color: '#E8C547' }}>
            ${product.price}
          </span>
        </div>

        {/* Quick Add — slides up on hover */}
        <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
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
               "w-full h-10 rounded-full flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95",
               product.stock === 0 
                 ? "bg-[#eff8ee]/10 text-[#eff8ee]/30 cursor-not-allowed" 
                 : "bg-[#E8C547] text-[#082f1d] hover:shadow-[0_4px_20px_rgba(232,197,71,0.3)]"
             )}
           >
              {product.stock === 0 ? "Unavailable" : <><Plus className="size-3" /> Add to Cart</>}
           </button>
        </div>
      </Link>
    </div>
  );
};

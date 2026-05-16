import React from "react";
import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/lib/image-utils";
import { motion } from "framer-motion";

const SERIES_COLORS: Record<string, { bg: string; text: string }> = {
  chill:      { bg: 'rgba(220,38,38,0.85)',   text: '#fff' },
  lift:       { bg: 'rgba(124,58,237,0.85)',  text: '#fff' },
  balance:    { bg: 'rgba(217,119,6,0.85)',   text: '#fff' },
  entourage:  { bg: 'rgba(234,88,12,0.85)',   text: '#fff' },
  sleep:      { bg: 'rgba(30,64,175,0.85)',   text: '#fff' },
  vape:       { bg: 'rgba(15,23,42,0.9)',     text: '#eff8ee' },
  default:    { bg: 'rgba(232,197,71,0.85)',  text: '#082f1d' },
}

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    actualPrice?: number;
    stock?: number;
    description?: string;
    images?: any[];
    imageUrls?: string[];
    category?: { name: string };
    rating?: number;
    reviews_count?: number;
    potency?: string;
  };
  viewMode?: "grid" | "list";
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode = "grid" }) => {
  const imageUrl = getImageUrl(product.imageUrls?.[0] || product.images?.[0]);
  const dispatch = useDispatch();

  const seriesKey = product.category?.name?.toLowerCase() || 'default';
  const seriesStyle = SERIES_COLORS[seriesKey] || SERIES_COLORS.default;

  const isList = viewMode === "list";

  return (
    <Link 
      href={`/products/${product.slug}`}
      className={cn(
        "group relative flex bg-[var(--card)] border border-[var(--border)] rounded-[20px] overflow-hidden transition-all duration-[450ms] cubic-bezier(0.22,1,0.36,1) hover:border-[rgba(232,197,71,0.22)] hover:-translate-y-1.5 hover:shadow-[0_28px_60px_rgba(0,0,0,0.45),0_0_0_1px_rgba(232,197,71,0.08)]",
        isList ? "flex-col sm:flex-row min-h-[180px]" : "flex-col h-full"
      )}
    >
      {/* Top radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(232,197,71,0.04),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Image Zone */}
      <div className={cn(
        "relative overflow-hidden bg-[linear-gradient(145deg,rgba(8,47,29,0.55),rgba(4,14,7,0.8))]",
        isList ? "aspect-square sm:aspect-auto sm:w-[240px] shrink-0" : "aspect-square"
      )}>
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(232,197,71,0.06)_0%,transparent_65%)] pointer-events-none z-[1]" />
        <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/5 to-transparent z-[2] pointer-events-none" />

        <img 
          src={imageUrl} 
          alt={product.name}
          className="absolute inset-0 w-full h-full object-contain p-5 drop-shadow-[0_10px_24px_rgba(0,0,0,0.35)] transition-transform duration-[650ms] cubic-bezier(0.22,1,0.36,1) group-hover:scale-[1.08] z-[1]"
        />

        {/* Series Badge */}
        <div 
          className="absolute top-[13px] left-[13px] px-[10px] py-[4px] rounded-full backdrop-blur-[8px] z-[4] text-[8.5px] font-bold uppercase tracking-[0.16em]"
          style={{ backgroundColor: seriesStyle.bg, color: seriesStyle.text }}
        >
          {product.category?.name || "Series"}
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-[rgba(8,47,29,0.25)] backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[5] flex items-center justify-center">
          <div className="bg-[#eff8ee]/95 text-[#082f1d] px-[22px] py-[9px] rounded-full text-[10px] font-bold uppercase tracking-[0.14em] shadow-[0_8px_24px_rgba(0,0,0,0.3)] transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            View Product
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className={cn(
        "p-[20px] sm:p-[28px] flex flex-col gap-[12px] border-[var(--border)] relative z-[1] flex-1",
        isList ? "border-t sm:border-t-0 sm:border-l" : "border-t"
      )}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 flex-1">
          <div className="space-y-3 flex-1">
            <h3 className={cn(
              "font-semibold text-[#eff8ee] leading-[1.3] transition-colors group-hover:text-[var(--gold)]",
              isList ? "text-[18px] sm:text-[22px]" : "text-[13px] line-clamp-2"
            )}>
              {product.name}
            </h3>
            
            {/* Stars */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-[13px] fill-[var(--gold)] text-[var(--gold)]" />
                ))}
              </div>
              <span className="text-[11px] text-[#eff8ee]/30">({product.reviews_count || 0} reviews)</span>
            </div>

            {isList && product.description && (
              <p className="text-[13px] text-[#eff8ee]/50 line-clamp-2 max-w-[500px]">
                {product.description}
              </p>
            )}

            <div className="text-[10px] font-semibold text-[#eff8ee]/35 uppercase tracking-[0.06em]">
              {product.potency || "Delta-9 · 30mg/serving"}
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4">
            <div className="flex items-center gap-2.5">
              <span className={cn(
                "font-serif font-bold text-[var(--gold)] leading-none shrink-0",
                isList ? "text-[28px] sm:text-[32px]" : "text-[20px]"
              )}>
                ${product.price}
              </span>
              {product.actualPrice && Number(product.actualPrice) > Number(product.price) && (
                <span className={cn(
                  "text-[#eff8ee]/30 line-through decoration-[var(--gold)]/30 font-medium",
                  isList ? "text-[18px] sm:text-[22px]" : "text-[14px]"
                )}>
                  ${product.actualPrice}
                </span>
              )}
            </div>

            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
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
                "flex items-center justify-center gap-2 bg-[var(--gold)] text-[#082f1d] rounded-full font-bold uppercase tracking-[0.10em] shadow-[0_4px_14px_rgba(232,197,71,0.22)] transition-all hover:bg-[#f0cf55] hover:scale-[1.04] hover:shadow-[0_6px_20px_rgba(232,197,71,0.3)] active:scale-95",
                isList ? "px-[24px] py-[10px] text-[11px] w-full sm:w-auto" : "px-[16px] py-[7px] text-[10px]"
              )}
            >
              <ShoppingCart className="size-[12px]" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};



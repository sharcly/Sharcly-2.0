"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useDispatch } from "react-redux"
import { addToCart } from "@/store/slices/cartSlice"
import { formatPrice } from "@/lib/utils"
import { getImageUrl } from "@/lib/image-utils"
import { toast } from "sonner"
import { Star } from "lucide-react"

interface FeaturedProductCardProps {
  product: any
  countryCode?: string
}

const seriesColors: Record<string, string> = {
  chill: '#dc2626',
  lift: '#7c3aed',
  balance: '#d97706',
  entourage: '#ea580c',
  sleep: '#1e40af',
  vape: '#1f2937',
}

export function FeaturedProductCard({ product }: FeaturedProductCardProps) {
  const [hovered, setHovered] = useState(false)
  const dispatch = useDispatch()
  
  const imageUrl = getImageUrl(product.imageUrls?.[0] || product.images?.[0])
  const price = typeof product.price === 'object' ? product.price.amount : product.price
  
  // Find series tag for badge
  const seriesTag = product.tags?.find((t: any) => 
    Object.keys(seriesColors).includes(t.name.toLowerCase())
  )

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: Number(price),
      quantity: 1,
      image: imageUrl,
      category: product.category?.name
    }))
    
    toast.success(`${product.name} added to cart`)
  }

  return (
    <Link 
      href={`/products/${product.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="block group relative rounded-[24px] p-2 transition-all duration-500"
      style={{
        background: 'rgba(239,248,238,0.04)',
        border: hovered ? '1px solid rgba(232,197,71,0.2)' : '1px solid rgba(239,248,238,0.08)',
        backdropFilter: 'blur(4px)',
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered ? '0 24px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(232,197,71,0.06)' : 'none',
      }}
    >
      {/* Image Area */}
      <div className="relative rounded-[20px] aspect-square overflow-hidden mb-5" style={{ background: 'rgba(8,47,29,0.5)' }}>
        <motion.img
          src={imageUrl}
          alt={product.name}
          animate={{ scale: hovered ? 1.08 : 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full object-cover"
        />
        
        {/* Hover Overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-[#082f1d]/18 backdrop-blur-[2px] flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.9, y: 16 }}
                animate={{ scale: 1, y: 0 }}
                className="px-6 py-3 bg-white text-[#082f1d] rounded-full shadow-xl font-bold text-[11px] uppercase tracking-[0.2em]"
                style={{ fontFamily: 'var(--font-dm-sans), sans-serif' }}
              >
                View Details
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Series Badge */}
        {seriesTag && (
          <div 
            className="absolute top-3 left-3 px-3 py-1.5 rounded-full shadow text-white font-black text-[9px] uppercase tracking-[0.2em] z-10"
            style={{ backgroundColor: seriesColors[seriesTag.name.toLowerCase()] }}
          >
            {seriesTag.name}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="px-3 pb-4 flex flex-col gap-2">
        {/* Name + Price */}
        <div className="flex items-start justify-between gap-2">
          <h3 
            className="text-[15px] font-black uppercase tracking-tighter line-clamp-2 transition-colors"
            style={{ 
              fontFamily: 'var(--font-dm-sans), sans-serif',
              color: hovered ? '#E8C547' : '#eff8ee'
            }}
          >
            {product.name}
          </h3>
          <div style={{
            fontSize: 16,
            fontWeight: 900,
            color: '#E8C547',
            background: 'rgba(232,197,71,0.1)',
            border: '1px solid rgba(232,197,71,0.2)',
            padding: '4px 12px',
            borderRadius: 10,
            letterSpacing: '-0.03em',
            flexShrink: 0,
            fontFamily: 'var(--font-dm-sans), sans-serif',
          }}>
            {formatPrice(price)}
          </div>
        </div>

        {/* Bottom Row: Stars + Add to Cart */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} fill="#C9A84C" stroke="none" />
              ))}
            </div>
            <span className="text-[10px] font-bold mt-1" style={{ color: 'rgba(239,248,238,0.35)' }}>48 Reviews</span>
          </div>

          <button
            onClick={handleAddToCart}
            style={{
              padding: '8px 18px',
              background: hovered ? '#E8C547' : 'transparent',
              border: hovered ? '1px solid #E8C547' : '1px solid rgba(232,197,71,0.4)',
              color: hovered ? '#082f1d' : '#E8C547',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              borderRadius: 100,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap',
              fontFamily: 'var(--font-dm-sans), sans-serif',
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  )
}

'use client'

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useFeaturedProducts } from "@/hooks/use-featured-products"
import { Skeleton } from "@/components/ui/skeleton"
import { FeaturedProductCard } from "@/components/product/featured-product-card"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function FeaturedProductsSection() {
  const { data, isFetching } = useFeaturedProducts()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsVisible, setItemsVisible] = useState(4)
  const containerRef = useRef<HTMLDivElement>(null)

  const featuredProducts = data?.products || []

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) setItemsVisible(4)
      else if (window.innerWidth >= 768) setItemsVisible(2.5)
      else setItemsVisible(1.2)
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const maxIndex = Math.max(0, featuredProducts.length - Math.floor(itemsVisible))

  const scrollNext = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex))
  }

  const scrollPrev = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0))
  }

  if (isFetching && featuredProducts.length === 0) {
    return (
      <section style={{ 
        background: 'linear-gradient(180deg, #040e07 0%, #082f1d 50%, #040e07 100%)',
        padding: '110px 0' 
      }}>
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="text-center mb-14">
            <div className="h-4 w-32 bg-white/5 rounded mx-auto mb-4 animate-pulse" />
            <div className="h-12 w-64 bg-white/5 rounded mx-auto mb-3 animate-pulse" />
            <div className="h-4 w-80 bg-white/5 rounded mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-white/5 rounded-[24px] animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (featuredProducts.length === 0) return null

  return (
    <section className="relative min-h-screen flex items-center py-24 overflow-hidden" style={{ 
      background: 'linear-gradient(180deg, #040e07 0%, #082f1d 50%, #040e07 100%)',
    }}>
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Decorative radial glow */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 900, height: 500,
        background: 'radial-gradient(ellipse, rgba(232,197,71,0.05) 0%, transparent 65%)',
        pointerEvents: 'none',
        zIndex: 1
      }} />

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 relative z-[2]">
        
        {/* SECTION HEADER */}
        <div className="text-center mb-14" style={{ position: 'relative', zIndex: 2 }}>
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#E8C547', opacity: .5 }} />
            <span style={{
              fontSize: 10, fontWeight: 600, letterSpacing: '0.22em',
              textTransform: 'uppercase', color: '#E8C547', opacity: .7
            }}>
              Sharcly Picks
            </span>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#E8C547', opacity: .5 }} />
          </div>

          {/* Heading */}
          <h2 style={{
            fontFamily: 'var(--font-cormorant), serif',
            color: '#eff8ee',
            fontSize: 'clamp(3rem, 4vw, 3.8rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            marginBottom: 10
          }}>
            Featured Products
          </h2>

          {/* Subtitle */}
          <div className="flex items-center justify-center gap-4">
            <div style={{ height: 1, width: 24, background: 'rgba(232,197,71,0.3)' }} />
            <p style={{
              fontFamily: 'var(--font-cormorant), serif',
              color: 'rgba(239,248,238,0.55)',
              fontSize: '1.1rem',
              fontStyle: 'italic',
              fontWeight: 500,
            }}>
              Built for every mood, every moment —{' '}
              <span style={{ color: '#eff8ee', fontWeight: 600, fontStyle: 'normal' }}>
                choose what fits.
              </span>
            </p>
            <div style={{ height: 1, width: 24, background: 'rgba(232,197,71,0.3)' }} />
          </div>
        </div>

        {/* CAROUSEL CONTAINER */}
        <div className="relative group/carousel">
          
          {/* Track */}
          <div className="relative overflow-visible md:overflow-hidden" ref={containerRef}>
            <motion.div
              className="flex gap-5 md:gap-6 overflow-x-auto md:overflow-x-visible no-scrollbar"
              animate={{ x: `-${(currentIndex * (100 / itemsVisible))}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex-shrink-0"
                  style={{ width: `calc(${100 / itemsVisible}% - ${((Math.ceil(itemsVisible) - 1) * 24) / Math.ceil(itemsVisible)}px)` }}
                >
                  <FeaturedProductCard product={product} />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Navigation Buttons */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-6 z-20 pointer-events-none">
            <button
              onClick={scrollPrev}
              disabled={currentIndex === 0}
              className="w-11 h-11 flex items-center justify-center rounded-full transition-all disabled:opacity-0 disabled:cursor-not-allowed pointer-events-auto opacity-0 group-hover/carousel:opacity-100"
              style={{
                background: 'rgba(239,248,238,0.06)',
                border: '1px solid rgba(239,248,238,0.12)',
                color: 'rgba(239,248,238,0.7)',
                backdropFilter: 'blur(8px)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(232,197,71,0.1)'
                e.currentTarget.style.borderColor = 'rgba(232,197,71,0.35)'
                e.currentTarget.style.color = '#E8C547'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(239,248,238,0.06)'
                e.currentTarget.style.borderColor = 'rgba(239,248,238,0.12)'
                e.currentTarget.style.color = 'rgba(239,248,238,0.7)'
              }}
            >
              <ChevronLeft size={24} />
            </button>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-6 z-20 pointer-events-none">
            <button
              onClick={scrollNext}
              disabled={currentIndex >= maxIndex}
              className="w-11 h-11 flex items-center justify-center rounded-full transition-all disabled:opacity-0 disabled:cursor-not-allowed pointer-events-auto opacity-0 group-hover/carousel:opacity-100"
              style={{
                background: 'rgba(239,248,238,0.06)',
                border: '1px solid rgba(239,248,238,0.12)',
                color: 'rgba(239,248,238,0.7)',
                backdropFilter: 'blur(8px)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(232,197,71,0.1)'
                e.currentTarget.style.borderColor = 'rgba(232,197,71,0.35)'
                e.currentTarget.style.color = '#E8C547'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(239,248,238,0.06)'
                e.currentTarget.style.borderColor = 'rgba(239,248,238,0.12)'
                e.currentTarget.style.color = 'rgba(239,248,238,0.7)'
              }}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mt-12">
          {Array.from({ length: Math.ceil(maxIndex) + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className="h-[6px] rounded-full transition-all duration-300"
              style={{
                width: currentIndex === i ? 28 : 8,
                background: currentIndex === i ? '#E8C547' : 'rgba(239,248,238,0.2)',
                opacity: 1,
              }}
            />
          ))}
        </div>

        {/* BOTTOM CTA */}
        <div className="mt-16 flex justify-center">
          <Link
            href="/products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: 'transparent',
              border: '1px solid rgba(232,197,71,0.35)',
              color: '#E8C547',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '14px 32px',
              borderRadius: 100,
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              fontFamily: 'var(--font-dm-sans), sans-serif',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#E8C547'
              e.currentTarget.style.color = '#082f1d'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#E8C547'
            }}
          >
            View All Products
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

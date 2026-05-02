"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { sanitizeHtml } from "@/lib/sanitize";

const seriesData = [
  {
    label: "Chill Series",
    tag: "Delta-8",
    description: "Dial it down, stay in control.",
    imageUrl: "https://i.postimg.cc/9QhwmspG/delta-8-lifestyle.jpg",
    to: "/products?series=chill",
    number: "01"
  },
  {
    label: "Lift Series",
    tag: "Delta-9",
    description: "Lock in with zero noise.",
    imageUrl: "https://i.postimg.cc/gcLxvGth/Delta-9-THC-30-MG-Lifestyle.jpg",
    to: "/products?series=lift",
    number: "02"
  },
  {
    label: "Balance Series",
    tag: "CBD",
    description: "Stay steady, all day.",
    imageUrl: "https://i.postimg.cc/FF6KRw9Z/CBD-Gummies-50-MG-Grapes-Lifestyle.jpg",
    to: "/products?series=balance",
    number: "03"
  },
  {
    label: "Entourage Series",
    tag: "Full Spectrum",
    description: "Whole plant, full effect.",
    imageUrl: "https://i.postimg.cc/jdQdX2HN/Full-Spectrum-Lifestyle.jpg",
    to: "/products?series=full-spectrum",
    number: "04"
  },
  {
    label: "Sleep Series",
    tag: "CBN · Delta-9",
    description: "Power down and drift easy.",
    imageUrl: "https://i.postimg.cc/Ls0s1Wt4/Dream-Lifestyle.jpg",
    to: "/products?series=sleep",
    number: "05"
  },
  {
    label: "Vape Series",
    tag: "Vape",
    description: "Fast hits with a clean feel.",
    imageUrl: "https://i.postimg.cc/43wfTSLb/Chill-Vape.jpg",
    to: "/products?series=vapes",
    number: "06"
  }
];

const CornerBrackets = () => (
  <>
    {/* Top Right */}
    <div className="absolute top-4 right-4 w-8 h-8 opacity-0 group-hover:opacity-50 transition-all duration-500 translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0">
      <div className="absolute top-0 right-0 w-full h-[1px]" style={{ backgroundColor: '#E8C547' }} />
      <div className="absolute top-0 right-0 h-full w-[1px]" style={{ backgroundColor: '#E8C547' }} />
    </div>
    {/* Bottom Left */}
    <div className="absolute bottom-4 left-4 w-8 h-8 opacity-0 group-hover:opacity-50 transition-all duration-500 -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0">
      <div className="absolute bottom-0 left-0 w-full h-[1px]" style={{ backgroundColor: '#E8C547' }} />
      <div className="absolute bottom-0 left-0 h-full w-[1px]" style={{ backgroundColor: '#E8C547' }} />
    </div>
  </>
);

const SeriesCard = ({ item, index }: { item: typeof seriesData[0], index: number }) => {
  return (
    <div className="group">
      <Link 
        href={item.to}
        className="relative block aspect-[3/4] rounded-[20px] overflow-hidden shadow-2xl transition-all duration-700 ease-[0.22,1,0.36,1] hover:-translate-y-[10px] hover:scale-[1.015]"
        style={{ 
          backgroundColor: '#0d2518',
          boxShadow: '0 40px 80px rgba(0,0,0,0.6)'
        }}
      >
        <Image 
          src={item.imageUrl} 
          alt={item.label} 
          fill 
          className="object-cover transition-transform duration-1000 ease-[0.22,1,0.36,1] group-hover:scale-[1.08] group-hover:brightness-110" 
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(4,14,7,0.92) 0%, rgba(4,14,7,0.1) 100%)' }} />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: 'radial-gradient(circle at bottom center, rgba(232,197,71,0.15), transparent 70%)' }} />
        <div className="absolute top-0 inset-x-0 h-[40%] pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.06), transparent)' }} />
        
        {/* Card Number Watermark */}
        <div 
          className="absolute top-6 left-6 text-[11px] tracking-[0.12em]" 
          style={{ 
            fontFamily: 'var(--font-cormorant), serif',
            color: 'rgba(239,248,238,0.25)' 
          }}
        >
          {item.number}
        </div>

        <CornerBrackets />

        {/* Card Content */}
        <div className="absolute bottom-0 inset-x-0 p-6 md:p-8 space-y-3 z-10">
          {/* Tag Pill */}
          <div 
            className="inline-block px-3 py-1 rounded-full border backdrop-blur-md"
            style={{ 
              backgroundColor: 'rgba(232,197,71,0.1)',
              borderColor: 'rgba(232,197,71,0.25)'
            }}
          >
            <span 
              className="text-[10px] font-semibold uppercase tracking-[0.18em]"
              style={{ 
                fontFamily: 'var(--font-dm-sans), sans-serif',
                color: '#E8C547'
              }}
            >
              {item.tag}
            </span>
          </div>

          <h3 
            className="text-2xl md:text-3xl font-bold leading-tight"
            style={{ 
              fontFamily: 'var(--font-cormorant), serif',
              color: '#eff8ee'
            }}
          >
            {item.label}
          </h3>

          {/* Description - Reveals on Hover */}
          <div className="max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100 transition-all duration-700 ease-[0.22,1,0.36,1] overflow-hidden">
            <p 
              className="text-[13px] leading-relaxed"
              style={{ 
                fontFamily: 'var(--font-dm-sans), sans-serif',
                color: 'rgba(239,248,238,0.52)'
              }}
            >
              {item.description}
            </p>
          </div>

          {/* CTA Button - Slides up on Hover */}
          <div className="pt-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 delay-75 ease-[0.22,1,0.36,1]">
            <div 
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold transition-transform active:scale-95"
              style={{ 
                fontFamily: 'var(--font-dm-sans), sans-serif',
                backgroundColor: '#E8C547',
                color: '#082f1d'
              }}
            >
              Explore 
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 7H13M13 7L7 1M13 7L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export const ShopBySeries = () => {
  return (
    <section 
      style={{ background: 'linear-gradient(175deg, #040e07 0%, #082f1d 50%, #040e07 100%)' }}
      className="relative overflow-hidden py-20 md:py-[110px] px-4 md:px-8"
    >
      {/* Central Glow */}
      <div 
        style={{ background: 'radial-gradient(circle, rgba(232,197,71,0.055) 0%, transparent 65%)' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none" 
      />

      <div className="relative z-10 max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#E8C547' }} />
            <span 
              className="text-[11px] font-semibold uppercase tracking-[0.22em]"
              style={{ 
                fontFamily: 'var(--font-dm-sans), sans-serif',
                color: '#E8C547' 
              }}
            >
              Curated Collections
            </span>
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#E8C547' }} />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[clamp(42px,5.5vw,76px)] font-bold leading-[0.95] tracking-tight mb-6"
            style={{ 
              fontFamily: 'var(--font-cormorant), serif',
              color: '#eff8ee'
            }}
          >
            Find Your <span className="italic" style={{ color: '#E8C547' }}>Series.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-[15px] font-light max-w-[480px] leading-relaxed"
            style={{ 
              fontFamily: 'var(--font-dm-sans), sans-serif',
              color: 'rgba(239,248,238,0.52)' 
            }}
          >
            Six carefully crafted lines — each built around a feeling, a moment, a state of being.
          </motion.p>
        </div>

        {/* Infinite Horizontal Scroller */}
        <div 
          className="relative w-full overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
          }}
        >
          <style dangerouslySetInnerHTML={{ __html: sanitizeHtml(`
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-33.333%); }
            }
            .marquee-container {
              display: flex;
              width: max-content;
              animation: marquee 60s linear infinite;
            }
            .marquee-container:hover {
              animation-play-state: paused;
            }
          `)}} />
          
          <div className="marquee-container py-12 gap-6 md:gap-10">
            {[...seriesData, ...seriesData, ...seriesData].map((item, index) => (
              <div key={`${item.number}-${index}`} className="w-[280px] md:w-[420px] shrink-0">
                <SeriesCard item={item} index={index} />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 md:mt-24 text-center"
        >
          <Link 
            href="/products"
            className="group inline-flex items-center gap-4 px-9 py-4 rounded-full border text-sm font-medium transition-all duration-300"
            style={{ 
              fontFamily: 'var(--font-dm-sans), sans-serif',
              borderColor: 'rgba(239,248,238,0.2)',
              color: '#eff8ee'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239,248,238,0.07)';
              e.currentTarget.style.borderColor = '#E8C547';
              e.currentTarget.style.color = '#E8C547';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(239,248,238,0.2)';
              e.currentTarget.style.color = '#eff8ee';
            }}
          >
            Shop All Series
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

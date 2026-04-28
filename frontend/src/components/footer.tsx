"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Instagram, Twitter, Facebook, ArrowUpRight, ShieldCheck, Activity, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white selection:bg-white selection:text-black">
      <div className="container mx-auto px-6 md:px-12 py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 md:gap-24">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-8">
            <Link href="/" className="inline-block group">
              <Image 
                src="https://cdn.mignite.app/ws/works_01KM0WR2ZSKYNHV0ZE2MPNM9EF/final-Logo-1--01KM5Y2NCW8720B30G9G0XW18Y.png" 
                alt="Brand Footer Logo" 
                width={120}
                height={40}
                className="h-8 w-auto brightness-0 invert opacity-60 group-hover:opacity-100 transition-opacity" 
              />
            </Link>
            <p className="text-lg text-white/40 leading-relaxed font-medium max-w-sm">
              Designing the future of performance and lifestyle through precision-engineered essentials.
            </p>
            <div className="flex gap-8">
              <Link href="#" className="text-white/20 hover:text-white transition-all transform hover:-translate-y-1">
                <Instagram className="size-6" />
              </Link>
              <Link href="#" className="text-white/20 hover:text-white transition-all transform hover:-translate-y-1">
                <Twitter className="size-6" />
              </Link>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-2 space-y-8">
            <h4 className="text-[12px] font-bold uppercase tracking-widest text-white/30">Shop</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link href="/products" className="hover:text-white/60 transition-colors">New Arrivals</Link></li>
              <li><Link href="/collections" className="hover:text-white/60 transition-colors">Collections</Link></li>
              <li><Link href="/bestsellers" className="hover:text-white/60 transition-colors">Bestsellers</Link></li>
              <li><Link href="/sale" className="hover:text-white/60 transition-colors">Sale</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-8">
             <h4 className="text-[12px] font-bold uppercase tracking-widest text-white/30">About</h4>
             <ul className="space-y-4 text-sm font-bold">
               <li><Link href="/about" className="hover:text-white/60 transition-colors">Our Story</Link></li>
               <li><Link href="/manufacturing" className="hover:text-white/60 transition-colors">Manufacturing</Link></li>
               <li><Link href="/sustainability" className="hover:text-white/60 transition-colors">Sustainability</Link></li>
               <li><Link href="/careers" className="hover:text-white/60 transition-colors">Careers</Link></li>
             </ul>
          </div>

          <div className="lg:col-span-2 space-y-8">
             <h4 className="text-[12px] font-bold uppercase tracking-widest text-white/30">Support</h4>
             <ul className="space-y-4 text-sm font-bold">
               <li><Link href="/contact" className="hover:text-white/60 transition-colors">Contact Us</Link></li>
               <li><Link href="/shipping" className="hover:text-white/60 transition-colors">Shipping & Returns</Link></li>
               <li><Link href="/faqs" className="hover:text-white/60 transition-colors">FAQs</Link></li>
               <li><Link href="/wholesale" className="hover:text-white/60 transition-colors">Wholesale</Link></li>
             </ul>
          </div>

          <div className="lg:col-span-2 space-y-8">
             <h4 className="text-[12px] font-bold uppercase tracking-widest text-white/30">Legal</h4>
             <ul className="space-y-4 text-sm font-bold">
               <li><Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy Policy</Link></li>
               <li><Link href="/terms" className="hover:text-white/60 transition-colors">Terms of Use</Link></li>
               <li><Link href="/cookies" className="hover:text-white/60 transition-colors">Cookies</Link></li>
             </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-32 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[11px] font-bold uppercase tracking-widest text-white/20">
            © {currentYear} ALL RIGHTS RESERVED. DESIGNED FOR PERFORMANCE.
          </p>
          <div className="flex gap-12">
             <div className="flex items-center gap-3 text-[11px] font-bold text-white/20">
                <Globe className="size-4" /> United States (USD)
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

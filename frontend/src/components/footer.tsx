"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Instagram, Twitter, Facebook, ArrowRight, Globe, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useRef } from "react";

const footerLinks = [
  {
    title: "Shop",
    links: [
      { name: "New Arrivals", href: "/products" },
      { name: "Collections", href: "/collections" },
      { name: "Bestsellers", href: "/bestsellers" },
      { name: "Sale", href: "/sale" },
    ],
  },
  {
    title: "About",
    links: [
      { name: "Our Story", href: "/about" },
      { name: "Manufacturing", href: "/manufacturing" },
      { name: "Sustainability", href: "/sustainability" },
      { name: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Support",
    links: [
      { name: "Contact Us", href: "/contact" },
      { name: "Shipping & Returns", href: "/shipping" },
      { name: "FAQs", href: "/faqs" },
      { name: "Wholesale", href: "/wholesale" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Use", href: "/terms" },
      { name: "Cookies", href: "/cookies" },
    ],
  },
];

const socialLinks = [
  { icon: Instagram, href: "#" },
  { icon: Twitter, href: "#" },
  { icon: Facebook, href: "#" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);

  return (
    <footer 
      ref={containerRef}
      className="relative bg-black text-white selection:bg-green-500/30 selection:text-white overflow-hidden"
    >
      {/* Background Depth & Noise */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.15),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <div className="container mx-auto px-6 md:px-12 py-24 relative z-10 max-w-7xl">
        {/* Newsletter Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-24"
        >
          <div className="relative group p-8 md:p-12 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(34,197,94,0.1)] hover:shadow-[0_0_60px_rgba(34,197,94,0.15)] transition-shadow duration-500">
            {/* Inner Glow */}
            <div className="absolute inset-0 bg-linear-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-4">
                <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">
                  Join the <span className="text-green-400">Community</span>
                </h3>
                <p className="text-zinc-400 text-lg max-w-md leading-relaxed">
                  Subscribe to receive exclusive early access, limited edition drops, and performance insights.
                </p>
              </div>
              
              <div className="relative">
                <div className={`flex flex-col sm:flex-row gap-4 p-1.5 rounded-2xl transition-all duration-500 ${isFocused ? "bg-white/10 shadow-[0_0_30px_rgba(34,197,94,0.2)]" : "bg-white/5"}`}>
                  <input 
                    type="email" 
                    placeholder="Enter your email address"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="flex-1 bg-transparent border-none outline-none px-6 py-4 text-white placeholder:text-zinc-500 text-sm md:text-base font-medium"
                  />
                  <button className="group/btn relative px-8 py-4 bg-green-500 hover:bg-green-400 text-black font-bold rounded-xl transition-all duration-300 overflow-hidden active:scale-95 whitespace-nowrap">
                    <span className="relative z-10 flex items-center gap-2">
                      Subscribe Now <ArrowRight className="size-4 group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                  </button>
                </div>
                <p className="mt-4 text-[11px] text-zinc-500 uppercase tracking-[0.2em] font-medium text-center sm:text-left px-2">
                  No spam. Just performance. Unsubscribe anytime.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-20 mb-24">
          {/* Brand Column */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-4 space-y-8"
          >
            <Link href="/" className="inline-block group">
              <Image 
                src="/assets/final-Logo-1.png" 
                alt="Brand Logo" 
                width={140}
                height={48}
                className="h-10 w-auto brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity duration-300" 
              />
            </Link>
            <p className="text-lg text-zinc-400 leading-relaxed font-medium max-w-sm">
              Providing premium wellness essentials and lifestyle products for your daily routine.
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="size-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-white/20 hover:text-green-400 transition-all duration-300"
                >
                  <social.icon className="size-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-12 sm:gap-8">
            {footerLinks.map((section, idx) => (
              <motion.div 
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + (idx * 0.1) }}
                className="space-y-8"
              >
                <h4 className="text-sm font-semibold uppercase tracking-[0.15em] text-zinc-200">
                  {section.title}
                </h4>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href} 
                        className="relative inline-block text-zinc-400 hover:text-white transition-colors duration-300 group/link"
                      >
                        <span className="relative z-10 inline-block group-hover/link:-translate-y-0.5 transition-transform duration-300">
                          {link.name}
                        </span>
                        <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-green-400 group-hover/link:w-full transition-all duration-300 ease-out" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] w-full bg-linear-to-r from-transparent via-white/10 to-transparent" />

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="pt-12 flex flex-col md:flex-row justify-between items-center gap-8"
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 text-center md:text-left">
            © {currentYear} Sharcly. ALL RIGHTS RESERVED. <span className="hidden sm:inline mx-2 text-zinc-800">|</span> DESIGNED FOR PERFORMANCE.
          </p>
          
          <div className="flex items-center gap-8 text-xs font-medium text-zinc-400">
            <button className="flex items-center gap-2 hover:text-white transition-colors group">
              <Globe className="size-4 group-hover:rotate-12 transition-transform" /> United States (USD)
            </button>
            <div className="hidden md:flex gap-6">
              <Link href="#" className="hover:text-white transition-colors">Ship to: NY</Link>
              <Link href="#" className="hover:text-white transition-colors">Language: EN</Link>
            </div>
          </div>
        </motion.div>

        {/* Compliance & Disclosure Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 pt-12 border-t border-white/5"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 text-[10px] sm:text-[11px] leading-relaxed tracking-wider">
            {/* Column 1 */}
            <div className="space-y-4 pr-0 md:pr-8 md:border-r border-white/5">
              <p className="font-bold text-zinc-200">21+ ONLY — FOR ADULTS 21 YEARS OF AGE OR OLDER.</p>
              <div className="space-y-2">
                <p className="font-bold text-zinc-300 uppercase tracking-widest">Hemp Compliance</p>
                <p className="text-zinc-500">
                  Sharcly products are processed in accordance with the 2018 Farm Bill. All offerings are derived from industrial hemp and contain a total delta-9 THC concentration that does not exceed 0.3%.
                </p>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-4 px-0 md:px-8 md:border-r border-white/5">
              <div className="space-y-2">
                <p className="font-bold text-zinc-300 uppercase tracking-widest">FDA Disclosure</p>
                <p className="text-zinc-500">
                  The statements made regarding these products have not been evaluated by the FDA. These products are not intended to diagnose, treat, cure or prevent any disease.
                </p>
              </div>
            </div>

            {/* Column 3 */}
            <div className="space-y-4 pl-0 md:pl-8">
              <div className="space-y-2">
                <p className="font-bold text-zinc-300 uppercase tracking-widest">Usage & Safety</p>
                <p className="text-zinc-500">
                  Consult with a physician before use if you have a medical condition or use prescription medications. A doctor's advice should be sought before using any hemp products. Void where prohibited by law.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Exclusive Button */}
      <motion.button
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        whileHover={{ scale: 1.05 }}
        className="fixed bottom-8 right-8 z-50 group"
      >
        <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full group-hover:bg-green-500/30 transition-all duration-500 animate-pulse" />
        <div className="relative flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
          <div className="size-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm font-semibold tracking-wide text-white whitespace-nowrap">Exclusive Offers</span>
          <Sparkles className="size-4 text-green-400" />
        </div>
      </motion.button>

      {/* Bottom Corner Accent */}
      <div className="absolute bottom-0 right-0 size-96 bg-green-500/5 blur-[120px] rounded-full -translate-x-1/4 translate-y-1/4 pointer-events-none" />
    </footer>
  );
}

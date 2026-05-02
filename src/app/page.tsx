"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
   ArrowRight,
   ShieldCheck,
   FlaskConical,
   Trees,
   Scale
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { apiClient } from "@/lib/api-client";
import { Marquee } from "@/components/marquee";
import { ProductCard } from "@/components/product-card";
import { motion } from "framer-motion";
import { useSeo } from "@/hooks/use-seo";
import { TestimonialsSection } from "@/components/testimonials";
import { TrustLoyaltySection } from "@/components/trust-loyalty-section";
import { ShopBySeries } from "@/components/shop-by-series";
import ProcessStorySection from "@/components/ProcessStorySection";
const MOCK_PRODUCTS = [
   {
      id: "p1",
      name: "Chill Series Gummies",
      slug: "chill-series-gummies",
      price: 45.00,
      category: { name: "Relaxation" },
      images: [{ id: "i1", url: "https://i.postimg.cc/T3qHks4z/Sharcly-Chill-Collection.jpg" }]
   },
   {
      id: "p2",
      name: "Lift Series Vapes",
      slug: "lift-series-vapes",
      price: 65.00,
      category: { name: "Energy" },
      images: [{ id: "i2", url: "https://i.postimg.cc/9F7Kz7H4/Sharcly-Lift-Series.jpg" }]
   },
   {
      id: "p3",
      name: "Sleep Series Tincture",
      slug: "sleep-series-tincture",
      price: 55.00,
      category: { name: "Recovery" },
      images: [{ id: "i3", url: "https://i.postimg.cc/vHgY9D41/Daytime-Clarity.jpg" }]
   },
   {
      id: "p4",
      name: "Balance Series Softgels",
      slug: "balance-series-softgels",
      price: 60.00,
      category: { name: "Daily" },
      images: [{ id: "i4", url: "https://i.postimg.cc/K8nwpV4T/Premium-Hemp-Essentials-Sharcly.jpg" }]
   }
];

export default function Home() {
   useSeo("home");

   return (
      <div className="min-h-screen bg-white text-[#062D1B] flex flex-col font-sans antialiased selection:bg-[#062D1B] selection:text-white">
         <AnnouncementBar />
         <Navbar />

         <main className="flex-1">
            {/* Precision Modern Hero */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-40 border-b border-gray-50 overflow-hidden">
               <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                  <motion.div
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ duration: 0.8 }}
                     className="space-y-8"
                  >
                     <div className="flex items-center gap-2">
                        <div className="h-px w-8 bg-[#062D1B]/20" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#062D1B]/50">Quality You Can Trust</span>
                     </div>

                     <h1 className="text-4xl md:text-6xl font-medium tracking-tight leading-tight">
                        Premium wellness <br /> essentials for your <br /> <span className="text-[#062D1B]/40 italic serif">daily routine.</span>
                     </h1>

                     <p className="text-base text-[#062D1B]/60 max-w-md leading-relaxed font-normal">
                        Thoughtfully crafted, lab-tested products designed to help you find balance and feel your best every single day.
                     </p>

                     <div className="flex flex-wrap gap-4 pt-4">
                        <Button className="btn-slim bg-[#062D1B] text-white hover:opacity-90">Shop All Products</Button>
                        <Button variant="ghost" className="btn-slim text-[#062D1B] hover:bg-neutral-50 border border-gray-100">About Us</Button>
                     </div>
                  </motion.div>

                  <motion.div
                     initial={{ opacity: 0, scale: 0.98 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ duration: 1, delay: 0.2 }}
                     className="relative aspect-square lg:aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-50 shadow-sm"
                  >
                     <Image
                        src="https://i.postimg.cc/K8nwpV4T/Premium-Hemp-Essentials-Sharcly.jpg"
                        alt="Precision Branding"
                        fill
                        className="object-cover"
                     />
                  </motion.div>
               </div>
            </section>

            {/* Global Verification Bar */}
            <section className="bg-white py-12 border-b border-gray-50">
               <div className="container mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-8">
                  {[
                     { icon: ShieldCheck, label: "Lab Verified" },
                     { icon: FlaskConical, label: "Cleaner Extraction" },
                     { icon: Trees, label: "Organically Grown" },
                     { icon: Scale, label: "Consistent Dosing" }
                  ].map((item, i) => (
                     <div key={i} className="flex flex-col items-center gap-3 text-center group">
                        <item.icon className="size-5 text-[#062D1B]/30 group-hover:text-[#062D1B] transition-colors" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#062D1B]/40">{item.label}</span>
                     </div>
                  ))}
               </div>
            </section>

            {/* Shop By Series - Premium Luxury Grid */}
            <ShopBySeries />


            {/* Modular Info Section */}
            <section className="py-24 bg-[#F9FAFB] border-y border-gray-50">
               <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                  <div className="space-y-10">
                     <h2 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight">
                        Rooted in radical <br /> transparency.
                     </h2>
                     <p className="text-sm text-[#062D1B]/60 leading-relaxed max-w-lg">
                        We believe you should know exactly what you are putting into your body. That is why we provide full, third-party lab results for every single batch of Sharcly products ever produced.
                     </p>
                     <div className="pt-4">
                        <Button variant="outline" className="btn-slim border-gray-200">Access Lab Results</Button>
                     </div>
                  </div>
                  <div className="aspect-square relative rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm">
                     <Image
                        src="https://i.postimg.cc/Y2hVpsDp/Sharcy-wellness-products-in-nature-setting.jpg"
                        alt="Science to Nature"
                        fill
                        className="object-cover"
                     />
                  </div>
               </div>
            </section>

            {/* Community Trust & Loyalty */}
            <TrustLoyaltySection />
            {/* Process Story Section */}
            <ProcessStorySection />



            {/* Community Feedback */}
            <TestimonialsSection />

            {/* Minimal Final CTA */}
            <section className="py-24 px-6 md:px-12">
               <div className="max-w-5xl mx-auto text-center space-y-10">
                  <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Ready to find your rhythm?</h2>
                  <div className="flex justify-center flex-wrap gap-4 pt-6">
                     <Button className="btn-slim bg-[#062D1B] text-white px-12">Explore Products</Button>
                     <Button variant="ghost" className="btn-slim border border-gray-100">Take the Routine Quiz</Button>
                  </div>
               </div>
            </section>
         </main>

         <Footer />
      </div>
   );
}

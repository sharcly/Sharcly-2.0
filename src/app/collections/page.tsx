"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const collections = [
  {
    title: "Chill Series",
    description: "Unwind with our premium relaxation-focused blends.",
    image: "https://i.postimg.cc/T3qHks4z/Sharcly-Chill-Collection.jpg",
    href: "/products?category=chill",
    color: "bg-blue-500/10"
  },
  {
    title: "Lift Series",
    description: "Elevate your energy and focus with our botanical extracts.",
    image: "https://i.postimg.cc/9F7Kz7H4/Sharcly-Lift-Series.jpg",
    href: "/products?category=lift",
    color: "bg-orange-500/10"
  },
  {
    title: "Sleep Series",
    description: "Restorative night-time solutions for deep, healing sleep.",
    image: "https://i.postimg.cc/vHgY9D41/Daytime-Clarity.jpg",
    href: "/products?category=sleep",
    color: "bg-indigo-500/10"
  },
  {
    title: "Balance Series",
    description: "Daily essentials to maintain your baseline wellness.",
    image: "https://i.postimg.cc/K8nwpV4T/Premium-Hemp-Essentials-Sharcly.jpg",
    href: "/products?category=balance",
    color: "bg-green-500/10"
  }
];

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-[#fcfdfc] text-[#0d2719] selection:bg-[#0d2719] selection:text-white">
      <Navbar />
      
      <main className="pt-32 pb-40">
        <section className="container mx-auto px-6 mb-24">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 mb-8"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">The Curated Sets</span>
              <div className="h-px w-12 bg-[#0d2719]/10" />
              <Sparkles className="size-4 opacity-40" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl lg:text-9xl font-black tracking-tighter leading-[0.8] mb-12"
            >
              CURATED <br />
              <span className="italic font-serif opacity-30">COLLECTIONS.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl lg:text-2xl text-[#0d2719]/50 font-medium max-w-2xl leading-relaxed"
            >
              Discover our precision-engineered series, each crafted for a specific state of being.
            </motion.p>
          </div>
        </section>

        <section className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
          {collections.map((collection, i) => (
            <motion.div
              key={collection.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="group relative h-[600px] rounded-[3rem] overflow-hidden bg-white border border-[#0d2719]/5 shadow-sm hover:shadow-xl transition-all duration-700"
            >
              <div className="absolute inset-0">
                <Image 
                  src={collection.image} 
                  alt={collection.title} 
                  fill 
                  className="object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d2719]/80 via-transparent to-transparent opacity-60" />
              </div>
              
              <div className="absolute bottom-0 left-0 w-full p-12 text-white">
                <div className={`inline-block px-4 py-1 rounded-full ${collection.color} backdrop-blur-md border border-white/20 mb-6`}>
                  <span className="text-[10px] font-bold uppercase tracking-widest">{collection.title}</span>
                </div>
                <h2 className="text-4xl font-bold tracking-tighter mb-4 italic">{collection.title}</h2>
                <p className="text-white/60 text-lg mb-8 max-w-md font-medium leading-relaxed">
                  {collection.description}
                </p>
                <Link 
                  href={collection.href}
                  className="inline-flex items-center gap-3 font-bold uppercase tracking-widest text-xs group/btn"
                >
                  Explore Collection 
                  <div className="size-10 rounded-full bg-white text-[#0d2719] flex items-center justify-center transition-transform group-hover/btn:translate-x-2">
                    <ArrowRight className="size-5" />
                  </div>
                </Link>
              </div>
            </motion.div>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}

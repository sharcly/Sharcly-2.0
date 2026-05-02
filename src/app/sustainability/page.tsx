"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import Image from "next/image";
import { Leaf, Trees, Wind, Droplets, Sparkles } from "lucide-react";

export default function SustainabilityPage() {
  return (
    <div className="min-h-screen bg-[#fcfdfc] text-[#0d2719] selection:bg-[#0d2719] selection:text-white antialiased">
      <Navbar />
      
      <main className="pt-32 pb-40">
        <section className="container mx-auto px-6 mb-32">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 mb-8"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Earth First Approach</span>
              <div className="h-px w-12 bg-[#0d2719]/10" />
              <Sparkles className="size-4 opacity-40" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl lg:text-9xl font-black tracking-tighter leading-[0.8] mb-12"
            >
              EARTH <br />
              <span className="italic font-serif opacity-30">CONSCIOUS.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl lg:text-2xl text-[#0d2719]/50 font-medium max-w-2xl leading-relaxed"
            >
              We believe true wellness includes the health of our planet. Our commitment to sustainability is woven into every thread of Sharcly.
            </motion.p>
          </div>
        </section>

        {/* Hero Image */}
        <section className="container mx-auto px-6 mb-40">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="relative h-[60vh] md:h-[80vh] rounded-[4rem] overflow-hidden shadow-2xl"
          >
            <Image 
              src="https://i.postimg.cc/Y2hVpsDp/Sharcy-wellness-products-in-nature-setting.jpg" 
              alt="Sustainability" 
              fill 
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-[#0d2719]/10" />
            <div className="absolute bottom-12 left-12 right-12 flex flex-col md:flex-row justify-between items-end gap-8">
              <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/20 max-w-sm">
                <p className="text-[#0d2719] font-bold text-xl italic tracking-tight">"Our goal is to leave the botanical landscape better than we found it."</p>
              </div>
              <div className="flex gap-4">
                <div className="size-16 rounded-full bg-white flex items-center justify-center shadow-lg"><Leaf className="size-8 text-green-600" /></div>
                <div className="size-16 rounded-full bg-white flex items-center justify-center shadow-lg"><Trees className="size-8 text-green-800" /></div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Pillars */}
        <section className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              icon: Wind,
              title: "Carbon Neutral",
              desc: "We offset 100% of our carbon footprint, from manufacturing to fulfillment, through verified global reforestation projects."
            },
            {
              icon: Droplets,
              title: "Water Conservation",
              desc: "Our extraction facilities use closed-loop water systems, reducing waste by up to 90% compared to industry standards."
            },
            {
              icon: Leaf,
              title: "Zero Waste",
              desc: "From biodegradable packaging to recycled shipping materials, we are on a mission to reach zero-waste by 2025."
            }
          ].map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-12 rounded-[3.5rem] bg-white border border-[#0d2719]/5 hover:border-[#0d2719]/10 transition-all shadow-sm hover:shadow-md"
            >
              <div className="size-16 rounded-2xl bg-[#f0f9f0] flex items-center justify-center text-[#0d2719] mb-10">
                <pillar.icon className="size-8" />
              </div>
              <h3 className="text-3xl font-bold tracking-tighter mb-6 italic">{pillar.title}</h3>
              <p className="text-lg text-[#0d2719]/60 font-medium leading-relaxed">{pillar.desc}</p>
            </motion.div>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}

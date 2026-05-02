"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import Image from "next/image";
import { FlaskConical, Microscope, ShieldCheck, Zap, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Microscope,
    title: "Molecular Analysis",
    description: "Every batch begins with rigorous testing of raw materials to ensure they meet our uncompromising standards for purity and potency.",
    image: "https://i.postimg.cc/Y2hVpsDp/Sharcy-wellness-products-in-nature-setting.jpg"
  },
  {
    icon: FlaskConical,
    title: "Cryogenic Extraction",
    description: "We use sub-zero CO2 extraction methods to preserve the delicate terpene profiles and cannabinoid integrity of the plant.",
    image: "https://i.postimg.cc/T3qHks4z/Sharcly-Chill-Collection.jpg"
  },
  {
    icon: ShieldCheck,
    title: "Triple-Stage Filtration",
    description: "A proprietary three-step filtration process removes all impurities while keeping the essential beneficial compounds intact.",
    image: "https://i.postimg.cc/9F7Kz7H4/Sharcly-Lift-Series.jpg"
  }
];

export default function ManufacturingPage() {
  return (
    <div className="min-h-screen bg-white text-[#0d2719] selection:bg-[#0d2719] selection:text-white antialiased">
      <Navbar />
      
      <main className="pt-32 pb-40">
        <section className="container mx-auto px-6 mb-32">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 mb-8"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">The Science of Purity</span>
              <div className="h-px w-12 bg-[#0d2719]/10" />
              <Sparkles className="size-4 opacity-40" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl lg:text-9xl font-black tracking-tighter leading-[0.8] mb-12"
            >
              PRECISION <br />
              <span className="italic font-serif opacity-30">ENGINEERED.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl lg:text-2xl text-[#0d2719]/50 font-medium max-w-2xl leading-relaxed"
            >
              Our manufacturing process is where nature meets elite science. We leave nothing to chance.
            </motion.p>
          </div>
        </section>

        {/* Process Steps */}
        <section className="container mx-auto px-6 space-y-40">
          {steps.map((step, i) => (
            <div key={step.title} className={`flex flex-col lg:flex-row items-center gap-20 ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
              <motion.div 
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="lg:w-1/2 space-y-8"
              >
                <div className="size-20 rounded-3xl bg-[#0d2719] text-white flex items-center justify-center shadow-xl shadow-[#0d2719]/10">
                  <step.icon className="size-10" />
                </div>
                <h2 className="text-4xl md:text-6xl font-bold tracking-tighter italic">{step.title}</h2>
                <p className="text-xl text-[#0d2719]/60 font-medium leading-relaxed max-w-lg">
                  {step.description}
                </p>
                <div className="pt-8 flex items-center gap-6">
                  <div className="h-px w-12 bg-[#0d2719]/10" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Standard ISO-9001</span>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="lg:w-1/2 relative h-[500px] md:h-[600px] w-full rounded-[4rem] overflow-hidden shadow-2xl border border-[#0d2719]/5"
              >
                <Image 
                  src={step.image} 
                  alt={step.title} 
                  fill 
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0d2719]/20 via-transparent to-transparent" />
              </motion.div>
            </div>
          ))}
        </section>

        {/* Lab Certification */}
        <section className="container mx-auto px-6 mt-40">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#0d2719] rounded-[4rem] p-12 lg:p-24 text-white text-center relative overflow-hidden"
          >
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_70%)] pointer-events-none" />
             <div className="relative z-10 max-w-3xl mx-auto space-y-12">
               <div className="flex justify-center">
                 <div className="size-24 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                   <Zap className="size-10 text-white" />
                 </div>
               </div>
               <h2 className="text-4xl md:text-7xl font-bold tracking-tighter italic">Radical Transparency</h2>
               <p className="text-xl text-white/60 font-medium leading-relaxed">
                 We publish full third-party laboratory reports for every single batch. Scan the QR code on any Sharcly product to access the molecular breakdown of what's inside.
               </p>
               <div className="pt-8">
                 <button className="px-12 h-16 rounded-full bg-white text-[#0d2719] font-black uppercase tracking-widest text-xs hover:bg-white/90 transition-all hover:scale-105 active:scale-95">
                   View Latest Batch Report
                 </button>
               </div>
             </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

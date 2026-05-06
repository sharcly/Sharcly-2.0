"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { FlaskConical, Microscope, ShieldCheck, Zap, Sparkles, Award, Leaf, Beaker, ArrowDown } from "lucide-react";
import { useRef } from "react";

const steps = [
  {
    icon: Microscope,
    number: "01",
    title: "Molecular Analysis",
    description: "Every batch begins with rigorous testing of raw materials to ensure they meet our uncompromising standards for purity and potency. We reject over 60% of incoming materials.",
    image: "https://i.postimg.cc/Y2hVpsDp/Sharcy-wellness-products-in-nature-setting.jpg",
    stat: "99.8%",
    statLabel: "Purity Threshold"
  },
  {
    icon: FlaskConical,
    number: "02",
    title: "Cryogenic Extraction",
    description: "We use sub-zero CO₂ extraction methods to preserve the delicate terpene profiles and cannabinoid integrity of the plant — no ethanol, no compromise.",
    image: "https://i.postimg.cc/T3qHks4z/Sharcly-Chill-Collection.jpg",
    stat: "-40°C",
    statLabel: "Extraction Temp"
  },
  {
    icon: ShieldCheck,
    number: "03",
    title: "Triple-Stage Filtration",
    description: "A proprietary three-step filtration process removes all impurities while keeping the essential beneficial compounds intact. Each stage is independently verified.",
    image: "https://i.postimg.cc/9F7Kz7H4/Sharcly-Lift-Series.jpg",
    stat: "3×",
    statLabel: "Filtration Stages"
  }
];

const certifications = [
  { icon: Award, label: "ISO 9001 Certified" },
  { icon: Leaf, label: "USDA Organic" },
  { icon: ShieldCheck, label: "GMP Compliant" },
  { icon: Beaker, label: "Third-Party Tested" },
];

export default function ManufacturingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <div className="min-h-screen antialiased" style={{ background: '#040e07', color: '#eff8ee' }}>
      <Navbar />
      
      {/* ═══════════════ HERO ═══════════════ */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(175deg, #040e07 0%, #0a2a17 35%, #040e07 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(232,197,71,0.06) 0%, transparent 70%)' }} />
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ 
            backgroundImage: 'linear-gradient(rgba(239,248,238,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(239,248,238,0.5) 1px, transparent 1px)',
            backgroundSize: '80px 80px'
          }} />
          {/* Horizontal gold lines */}
          <div className="absolute top-[30%] left-0 w-full h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(232,197,71,0.15) 20%, rgba(232,197,71,0.15) 80%, transparent 100%)' }} />
          <div className="absolute bottom-[30%] left-0 w-full h-px" style={{ background: 'linear-gradient(90deg, transparent 5%, rgba(232,197,71,0.08) 40%, rgba(232,197,71,0.08) 60%, transparent 95%)' }} />
        </div>

        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          {/* Overline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full mb-10"
            style={{ backgroundColor: 'rgba(232,197,71,0.08)', border: '1px solid rgba(232,197,71,0.15)' }}
          >
            <Sparkles className="size-3.5" style={{ color: '#E8C547' }} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: '#E8C547' }}>The Science of Purity</span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl sm:text-7xl lg:text-[9rem] font-black tracking-[-0.04em] leading-[0.85] mb-8"
          >
            <span style={{ color: '#eff8ee', textShadow: '0 0 100px rgba(232,197,71,0.12)' }}>PRECISION</span>
            <br />
            <span className="italic font-serif" style={{ color: 'rgba(239,248,238,0.15)' }}>ENGINEERED.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-base sm:text-lg lg:text-xl font-medium max-w-2xl mx-auto leading-relaxed mb-14"
            style={{ color: 'rgba(239,248,238,0.45)' }}
          >
            Where nature meets elite science. Every product is the result of obsessive attention to detail — we leave nothing to chance.
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col items-center gap-3"
          >
            <span className="text-[9px] font-bold uppercase tracking-[0.3em]" style={{ color: 'rgba(239,248,238,0.2)' }}>Our Process</span>
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}>
              <ArrowDown className="size-4" style={{ color: 'rgba(239,248,238,0.2)' }} />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════ CERTIFICATION BAR ═══════════════ */}
      <section className="relative z-10 border-y" style={{ borderColor: 'rgba(239,248,238,0.06)', backgroundColor: 'rgba(4,14,7,0.9)', backdropFilter: 'blur(20px)' }}>
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x" style={{ divideColor: 'rgba(239,248,238,0.06)' }}>
            {certifications.map((cert, idx) => (
              <motion.div
                key={cert.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="flex flex-col sm:flex-row items-center gap-3 py-7 sm:py-8 px-4 md:px-6 text-center sm:text-left"
              >
                <div className="size-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(232,197,71,0.08)', border: '1px solid rgba(232,197,71,0.1)' }}>
                  <cert.icon className="size-4.5" style={{ color: '#E8C547' }} />
                </div>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider" style={{ color: 'rgba(239,248,238,0.6)' }}>{cert.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <main className="pb-32">
        {/* ═══════════════ PROCESS STEPS ═══════════════ */}
        <section className="py-24 md:py-32" style={{ background: 'linear-gradient(180deg, #040e07 0%, #082f1d 50%, #040e07 100%)' }}>
          <div className="container mx-auto px-6 md:px-12 space-y-32 lg:space-y-40">
            {steps.map((step, i) => (
              <div key={step.title} className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                {/* Text */}
                <motion.div 
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="lg:w-1/2 space-y-7"
                >
                  {/* Step number + icon */}
                  <div className="flex items-center gap-5">
                    <div className="size-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(232,197,71,0.08)', border: '1px solid rgba(232,197,71,0.12)' }}>
                      <step.icon className="size-6" style={{ color: '#E8C547' }} />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-[0.3em]" style={{ color: 'rgba(239,248,238,0.2)' }}>
                      Step {step.number}
                    </span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1]" style={{ color: '#eff8ee' }}>
                    {step.title}
                  </h2>

                  <p className="text-base font-medium leading-relaxed max-w-lg" style={{ color: 'rgba(239,248,238,0.45)' }}>
                    {step.description}
                  </p>

                  {/* Stat callout */}
                  <div className="flex items-end gap-4 pt-4">
                    <span className="text-5xl lg:text-6xl font-black tracking-tighter" style={{ color: '#E8C547' }}>{step.stat}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest pb-2" style={{ color: 'rgba(239,248,238,0.3)' }}>{step.statLabel}</span>
                  </div>

                  <div className="h-px w-20" style={{ background: 'linear-gradient(90deg, rgba(232,197,71,0.3) 0%, transparent 100%)' }} />
                </motion.div>
                
                {/* Image */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="lg:w-1/2 relative h-[400px] md:h-[520px] w-full rounded-[24px] overflow-hidden group"
                  style={{ border: '1px solid rgba(239,248,238,0.06)', boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }}
                >
                  <Image 
                    src={step.image} 
                    alt={step.title} 
                    fill 
                    className="object-cover transition-transform duration-[1.2s] ease-[0.22,1,0.36,1] group-hover:scale-105"
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(4,14,7,0.5) 0%, rgba(4,14,7,0.05) 50%)' }} />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: 'radial-gradient(circle at center, rgba(232,197,71,0.06), transparent 70%)' }} />
                  
                  {/* Corner brackets */}
                  <div className="absolute top-5 right-5 w-7 h-7 opacity-0 group-hover:opacity-30 transition-all duration-500">
                    <div className="absolute top-0 right-0 w-full h-[1px]" style={{ backgroundColor: '#E8C547' }} />
                    <div className="absolute top-0 right-0 h-full w-[1px]" style={{ backgroundColor: '#E8C547' }} />
                  </div>
                  <div className="absolute bottom-5 left-5 w-7 h-7 opacity-0 group-hover:opacity-30 transition-all duration-500">
                    <div className="absolute bottom-0 left-0 w-full h-[1px]" style={{ backgroundColor: '#E8C547' }} />
                    <div className="absolute bottom-0 left-0 h-full w-[1px]" style={{ backgroundColor: '#E8C547' }} />
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════ TRANSPARENCY CTA ═══════════════ */}
        <section className="container mx-auto px-6 md:px-12 py-24 md:py-32">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-[24px] overflow-hidden text-center"
            style={{ border: '1px solid rgba(232,197,71,0.12)' }}
          >
            {/* Background layers */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(232,197,71,0.04) 0%, rgba(4,14,7,0.98) 40%, rgba(232,197,71,0.03) 100%)' }} />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px]" style={{ background: 'radial-gradient(circle, rgba(232,197,71,0.08) 0%, transparent 60%)' }} />
            <div className="absolute inset-0 opacity-[0.02]" style={{ 
              backgroundImage: 'linear-gradient(rgba(239,248,238,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(239,248,238,0.5) 1px, transparent 1px)',
              backgroundSize: '60px 60px'
            }} />
            
            <div className="relative z-10 py-20 px-8 md:py-28 md:px-16 max-w-3xl mx-auto space-y-10">
              <div className="flex justify-center">
                <div className="size-20 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(232,197,71,0.1)', border: '1px solid rgba(232,197,71,0.15)' }}>
                  <Zap className="size-9" style={{ color: '#E8C547' }} />
                </div>
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] block mb-4" style={{ color: '#E8C547' }}>Full Transparency</span>
                <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black tracking-tight leading-[0.95] mb-6" style={{ color: '#eff8ee' }}>
                  Radical<br />
                  <span className="italic font-serif" style={{ color: 'rgba(239,248,238,0.2)' }}>Accountability.</span>
                </h2>
              </div>

              <p className="text-base lg:text-lg font-medium leading-relaxed max-w-xl mx-auto" style={{ color: 'rgba(239,248,238,0.45)' }}>
                We publish full third-party laboratory reports for every single batch. Scan the QR code on any Sharcly product to access the complete molecular breakdown.
              </p>

              <div>
                <button className="px-10 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 hover:shadow-[0_4px_30px_rgba(232,197,71,0.25)]" style={{ backgroundColor: '#E8C547', color: '#040e07' }}>
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

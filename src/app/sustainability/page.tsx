"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { Leaf, Trees, Wind, Droplets, Recycle, Globe, ArrowDown, Sprout, Target } from "lucide-react";
import { useRef } from "react";

const pillars = [
  {
    icon: Wind,
    title: "Carbon Neutral",
    stat: "100%",
    statLabel: "Offset",
    desc: "We offset 100% of our carbon footprint — from manufacturing to fulfillment — through verified global reforestation projects.",
  },
  {
    icon: Droplets,
    title: "Water Conservation",
    stat: "90%",
    statLabel: "Less Waste",
    desc: "Our extraction facilities use closed-loop water systems, reducing waste by up to 90% compared to industry standards.",
  },
  {
    icon: Leaf,
    title: "Zero Waste",
    stat: "0",
    statLabel: "Landfill Goal",
    desc: "From biodegradable packaging to recycled shipping materials, we are on a mission to reach absolute zero-waste operations.",
  },
];

const commitments = [
  { icon: Recycle, title: "Recyclable Packaging", desc: "Every box, bottle and label is designed for full recyclability." },
  { icon: Globe, title: "Ethical Sourcing", desc: "All raw materials traced back to certified organic, fair-trade farms." },
  { icon: Sprout, title: "Regenerative Farming", desc: "We partner with farms using regenerative agriculture practices." },
  { icon: Target, title: "Science-Based Targets", desc: "Emissions reduction targets aligned with the Paris Agreement." },
];

const milestones = [
  { year: "2021", event: "Switched to 100% recyclable packaging across all product lines." },
  { year: "2022", event: "Achieved carbon-neutral certification for all manufacturing operations." },
  { year: "2023", event: "Launched closed-loop water system, reducing consumption by 90%." },
  { year: "2024", event: "Partnered with 12 regenerative farms across Oregon and Colorado." },
  { year: "2025", event: "On track for full zero-waste certification across supply chain." },
];

export default function SustainabilityPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <div className="min-h-screen antialiased" style={{ background: '#040e07', color: '#eff8ee' }}>
      <Navbar />

      {/* ═══════════════ HERO ═══════════════ */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(175deg, #040e07 0%, #0a2a17 35%, #040e07 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 40% 45%, rgba(34,197,94,0.06) 0%, transparent 70%)' }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 40% 40% at 70% 30%, rgba(232,197,71,0.04) 0%, transparent 70%)' }} />
          {/* Horizontal lines */}
          <div className="absolute top-[28%] left-0 w-full h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(34,197,94,0.12) 30%, rgba(232,197,71,0.08) 70%, transparent 100%)' }} />
          <div className="absolute bottom-[28%] left-0 w-full h-px" style={{ background: 'linear-gradient(90deg, transparent 5%, rgba(34,197,94,0.06) 50%, transparent 95%)' }} />
        </div>

        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          {/* Overline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full mb-10"
            style={{ backgroundColor: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)' }}
          >
            <Leaf className="size-3.5" style={{ color: '#22c55e' }} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: '#22c55e' }}>Earth First Approach</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl sm:text-7xl lg:text-[9rem] font-black tracking-[-0.04em] leading-[0.85] mb-8"
          >
            <span style={{ color: '#eff8ee', textShadow: '0 0 100px rgba(34,197,94,0.1)' }}>EARTH</span>
            <br />
            <span className="italic font-serif" style={{ color: 'rgba(239,248,238,0.15)' }}>CONSCIOUS.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-base sm:text-lg lg:text-xl font-medium max-w-2xl mx-auto leading-relaxed mb-14"
            style={{ color: 'rgba(239,248,238,0.45)' }}
          >
            True wellness includes the health of our planet. Our commitment to sustainability is woven into every layer of Sharcly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col items-center gap-3"
          >
            <span className="text-[9px] font-bold uppercase tracking-[0.3em]" style={{ color: 'rgba(239,248,238,0.2)' }}>Our Commitment</span>
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}>
              <ArrowDown className="size-4" style={{ color: 'rgba(239,248,238,0.2)' }} />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════ HERO IMAGE BAND ═══════════════ */}
      <section className="relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="container mx-auto px-6 md:px-12"
        >
          <div className="relative h-[50vh] md:h-[65vh] rounded-[24px] overflow-hidden group" style={{ border: '1px solid rgba(239,248,238,0.06)', boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }}>
            <Image 
              src="https://i.postimg.cc/Y2hVpsDp/Sharcy-wellness-products-in-nature-setting.jpg" 
              alt="Sustainability" 
              fill 
              className="object-cover transition-transform duration-[1.5s] ease-[0.22,1,0.36,1] group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(4,14,7,0.7) 0%, rgba(4,14,7,0.15) 50%, rgba(4,14,7,0.3) 100%)' }} />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: 'radial-gradient(circle at 50% 70%, rgba(34,197,94,0.06), transparent 70%)' }} />
            
            {/* Quote overlay */}
            <div className="absolute bottom-8 left-8 right-8 md:bottom-12 md:left-12 md:right-12 flex flex-col md:flex-row justify-between items-end gap-6">
              <div className="px-7 py-5 rounded-2xl max-w-md" style={{ backgroundColor: 'rgba(4,14,7,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(239,248,238,0.08)' }}>
                <p className="text-sm sm:text-base font-bold italic leading-relaxed" style={{ color: 'rgba(239,248,238,0.85)' }}>
                  &ldquo;Our goal is to leave the botanical landscape better than we found it.&rdquo;
                </p>
              </div>
              <div className="flex gap-3">
                <div className="size-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.15)' }}>
                  <Leaf className="size-5" style={{ color: '#22c55e' }} />
                </div>
                <div className="size-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.15)' }}>
                  <Trees className="size-5" style={{ color: '#22c55e' }} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <main className="pb-32">
        {/* ═══════════════ THREE PILLARS ═══════════════ */}
        <section className="py-24 md:py-32" style={{ background: 'linear-gradient(180deg, #040e07 0%, #082f1d 50%, #040e07 100%)' }}>
          <div className="container mx-auto px-6 md:px-12">
            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mb-16"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.3em] block mb-3" style={{ color: '#22c55e' }}>Our Pillars</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1]" style={{ color: '#eff8ee' }}>
                Three commitments<br />
                <span className="italic font-serif" style={{ color: 'rgba(239,248,238,0.2)' }}>that define us.</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pillars.map((pillar, i) => (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="group p-8 md:p-10 rounded-[20px] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.3)]"
                  style={{ backgroundColor: 'rgba(239,248,238,0.025)', border: '1px solid rgba(239,248,238,0.06)' }}
                >
                  {/* Icon */}
                  <div className="size-14 rounded-2xl flex items-center justify-center mb-7" style={{ backgroundColor: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.12)' }}>
                    <pillar.icon className="size-6" style={{ color: '#22c55e' }} />
                  </div>

                  {/* Stat */}
                  <div className="flex items-end gap-3 mb-5">
                    <span className="text-4xl lg:text-5xl font-black tracking-tighter" style={{ color: '#22c55e' }}>{pillar.stat}</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest pb-2" style={{ color: 'rgba(239,248,238,0.3)' }}>{pillar.statLabel}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold tracking-tight mb-4" style={{ color: '#eff8ee' }}>{pillar.title}</h3>

                  {/* Description */}
                  <p className="text-sm font-medium leading-relaxed" style={{ color: 'rgba(239,248,238,0.4)' }}>{pillar.desc}</p>

                  {/* Bottom accent */}
                  <div className="mt-7 h-px" style={{ background: 'linear-gradient(90deg, rgba(34,197,94,0.2) 0%, transparent 100%)' }} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ COMMITMENTS GRID ═══════════════ */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14"
            >
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] block mb-3" style={{ color: '#E8C547' }}>Beyond Basics</span>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight" style={{ color: '#eff8ee' }}>Our Commitments</h2>
              </div>
              <p className="text-sm font-medium max-w-sm" style={{ color: 'rgba(239,248,238,0.4)' }}>
                Every decision is measured against its environmental impact.
              </p>
            </motion.div>

            <div className="h-px mb-14" style={{ background: 'linear-gradient(90deg, rgba(232,197,71,0.2) 0%, rgba(232,197,71,0.05) 50%, transparent 100%)' }} />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {commitments.map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="group p-7 rounded-[16px] transition-all duration-500 hover:-translate-y-1"
                  style={{ backgroundColor: 'rgba(239,248,238,0.02)', border: '1px solid rgba(239,248,238,0.05)' }}
                >
                  <div className="size-11 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: 'rgba(232,197,71,0.06)', border: '1px solid rgba(232,197,71,0.1)' }}>
                    <item.icon className="size-5" style={{ color: '#E8C547' }} />
                  </div>
                  <h3 className="text-sm font-bold mb-2" style={{ color: '#eff8ee' }}>{item.title}</h3>
                  <p className="text-xs font-medium leading-relaxed" style={{ color: 'rgba(239,248,238,0.35)' }}>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ TIMELINE ═══════════════ */}
        <section className="py-20 md:py-28" style={{ background: 'linear-gradient(180deg, rgba(4,14,7,0.5) 0%, #082f1d 50%, rgba(4,14,7,0.5) 100%)' }}>
          <div className="container mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto mb-16"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.3em] block mb-3" style={{ color: '#22c55e' }}>Progress</span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight" style={{ color: '#eff8ee' }}>Our Journey</h2>
            </motion.div>

            <div className="max-w-2xl mx-auto relative">
              {/* Vertical line */}
              <div className="absolute left-[19px] md:left-[23px] top-0 bottom-0 w-px" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(34,197,94,0.2) 10%, rgba(34,197,94,0.2) 90%, transparent 100%)' }} />

              <div className="space-y-8">
                {milestones.map((m, idx) => (
                  <motion.div
                    key={m.year}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08 }}
                    className="flex gap-6 md:gap-8 items-start group"
                  >
                    {/* Dot */}
                    <div className="relative z-10 shrink-0">
                      <div className="size-10 md:size-12 rounded-xl flex items-center justify-center transition-all duration-300" style={{ backgroundColor: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)' }}>
                        <span className="text-[10px] font-black" style={{ color: '#22c55e' }}>{m.year}</span>
                      </div>
                    </div>
                    {/* Content */}
                    <div className="pt-2 md:pt-3 pb-2">
                      <p className="text-sm md:text-base font-medium leading-relaxed" style={{ color: 'rgba(239,248,238,0.6)' }}>
                        {m.event}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ BOTTOM CTA ═══════════════ */}
        <section className="container mx-auto px-6 md:px-12 py-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-[24px] overflow-hidden text-center"
            style={{ border: '1px solid rgba(34,197,94,0.12)' }}
          >
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.04) 0%, rgba(4,14,7,0.98) 40%, rgba(34,197,94,0.03) 100%)' }} />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px]" style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 60%)' }} />

            <div className="relative z-10 py-20 px-8 md:py-28 md:px-16 max-w-3xl mx-auto space-y-8">
              <div className="flex justify-center">
                <div className="size-20 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.15)' }}>
                  <Globe className="size-9" style={{ color: '#22c55e' }} />
                </div>
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] block mb-4" style={{ color: '#22c55e' }}>Join The Movement</span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[0.95] mb-5" style={{ color: '#eff8ee' }}>
                  Every purchase<br />
                  <span className="italic font-serif" style={{ color: 'rgba(239,248,238,0.2)' }}>plants a tree.</span>
                </h2>
              </div>

              <p className="text-base font-medium leading-relaxed max-w-xl mx-auto" style={{ color: 'rgba(239,248,238,0.4)' }}>
                Through our partnership with One Tree Planted, every Sharcly order contributes directly to global reforestation efforts.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <button className="px-10 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 hover:shadow-[0_4px_30px_rgba(34,197,94,0.25)]" style={{ backgroundColor: '#22c55e', color: '#040e07' }}>
                  Shop Now
                </button>
                <button className="px-10 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all" style={{ color: 'rgba(239,248,238,0.6)', border: '1px solid rgba(239,248,238,0.1)' }}>
                  Learn More
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

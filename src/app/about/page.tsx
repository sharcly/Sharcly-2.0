"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Globe,
  Users,
  Heart,
  ShieldCheck,
  Leaf,
  Eye,
  FlaskConical,
  Droplets,
  Truck,
  Star,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { useSeo } from "@/hooks/use-seo";
import { useRef } from "react";

/**
 * TYPOGRAPHIC SCALE (8px Grid)
 * Display: 96px (6rem) / 120px (7.5rem)
 * H1: 64px (4rem)
 * H2: 48px (3rem)
 * H3: 32px (2rem)
 * Body-L: 20px (1.25rem)
 * Body-R: 16px (1rem)
 * Small: 14px (0.875rem)
 * 
 * SPACING SCALE (8px Grid)
 * 8, 16, 24, 32, 40, 48, 64, 80, 128, 160
 */

export default function AboutPage() {
  useSeo("about");
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const fadeInUp = {
    hidden: { opacity: 0, y: 24 }, // 24px move
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased selection:bg-[#E8C547] selection:text-[#082f1d]" style={{ background: "linear-gradient(160deg, #040e07 0%, #082f1d 50%, #040e07 100%)", color: "#eff8ee" }}>
      {/* Background Elements */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle at center, rgba(232,197,71,0.05) 0%, transparent 70%)",
        }}
      />
      <Navbar />

      <main ref={containerRef} className="flex-1 overflow-x-hidden">
        {/* 1. HERO SECTION */}
        <section className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-24 px-6 overflow-hidden">
          {/* Animated Glass Blobs */}
          <motion.div 
            animate={{ x: [0, 40, 0], y: [0, 24, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 -left-20 w-[480px] h-[480px] bg-white/5 rounded-full blur-[120px] pointer-events-none" 
          />
          <motion.div 
            animate={{ x: [0, -32, 0], y: [0, 48, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/4 -right-20 w-[560px] h-[560px] bg-[#E8C547]/10 rounded-full blur-[140px] pointer-events-none" 
          />

          <div className="container max-w-[1280px] mx-auto relative z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-[960px] mx-auto text-center"
            >
              <motion.div variants={fadeInUp}>
                <Badge className="px-6 py-2 rounded-full border-white/10 bg-white/5 backdrop-blur-xl text-white font-bold uppercase tracking-widest text-[12px] mb-12 shadow-sm">
                  EST. 2024 • THE FUTURE OF WELLNESS
                </Badge>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-5xl md:text-[96px] font-bold tracking-tighter leading-[1.05] md:leading-[0.95] mb-12"
              >
                CRAFTING <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-white/80 to-white">
                  PURE FLOW.
                </span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-[20px] md:text-[28px] font-medium text-white/60 max-w-[800px] mx-auto leading-tight mb-16"
              >
                Precision-engineered botanical essentials. We blend elite science with organic purity to elevate your daily ritual.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Button size="lg" className="h-16 md:h-20 px-12 rounded-full bg-[#E8C547] text-[#082f1d] hover:bg-[#E8C547]/90 font-bold text-[18px] md:text-[20px] group transition-all duration-500 shadow-xl relative overflow-hidden">
                  <span className="relative z-10 flex items-center gap-3">
                    Explore Our Story <ArrowRight className="size-6 group-hover:translate-x-2 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                </Button>
                
                <div className="flex items-center gap-4 px-8 py-4 md:py-5 bg-white/5 backdrop-blur-2xl rounded-full border border-white/10 cursor-pointer hover:bg-white/10 transition-all duration-300 shadow-sm">
                  <div className="size-10 md:size-12 rounded-full bg-[#E8C547] flex items-center justify-center text-[#082f1d]">
                    <Star className="size-5 md:size-6 fill-current" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-[14px] md:text-[16px] leading-none text-white">4.9/5 TRUSTSCORE</p>
                    <p className="text-[10px] font-bold text-white/40 mt-1 tracking-widest uppercase">Verified Excellence</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* 2. BRAND STORY */}
        <section className="py-24 md:py-40 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20 pointer-events-none" />
          <div className="container max-w-[1280px] mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-32">
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="space-y-12"
              >
                <div>
                  <Badge variant="outline" className="mb-6 border-white/10 text-white/40 px-4 py-1 text-[12px]">THE GENESIS</Badge>
                  <h2 className="text-4xl md:text-[64px] font-bold tracking-tighter mb-8 italic text-white">Why We Exist</h2>
                  <p className="text-[18px] md:text-[22px] text-white/70 leading-relaxed font-medium">
                    In a world of constant digital static, we found ourselves yearning for clarity. Sharcly was born from the belief that balance shouldn't be a luxury—it should be your baseline.
                  </p>
                </div>
                <div className="p-10 md:p-12 rounded-[32px] md:rounded-[48px] bg-white/[0.03] border border-white/10 shadow-xl shadow-black/20 relative overflow-hidden group">
                  <p className="text-[20px] md:text-[24px] italic font-serif text-white/80 leading-relaxed relative z-10">
                    "We architect the silence in the noise. Our products are the precision instruments for your modern life."
                  </p>
                  <div className="mt-8 flex items-center gap-4 relative z-10">
                    <div className="h-[1px] w-12 bg-white/20" />
                    <p className="font-bold uppercase tracking-widest text-[11px] text-white/40">The Sharcly Collective</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="space-y-12 lg:pt-24"
              >
                <div>
                  <Badge variant="outline" className="mb-6 border-white/10 text-white/40 px-4 py-1 text-[12px]">THE CORE</Badge>
                  <h2 className="text-4xl md:text-[64px] font-bold tracking-tighter mb-8 italic text-white">Our Philosophy</h2>
                  <p className="text-[18px] md:text-[22px] text-white/70 leading-relaxed font-medium">
                    Minimalist formulation. Maximum molecular integrity. We reject the complex in favor of the effective, using only what is essential for your potential.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                  <div className="p-8 md:p-10 rounded-[32px] bg-white/[0.03] border border-white/10 shadow-lg flex flex-col justify-between h-44 md:h-48 group transition-all duration-300 hover:border-white/20">
                    <div className="size-10 md:size-12 rounded-2xl bg-white/5 flex items-center justify-center text-white group-hover:bg-[#E8C547] group-hover:text-[#082f1d] transition-all duration-500">
                      <TrendingUp className="size-5 md:size-6" />
                    </div>
                    <div>
                      <span className="text-4xl md:text-[48px] font-bold tracking-tighter text-white">100%</span>
                      <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-white/30 mt-2">Organic Purity</p>
                    </div>
                  </div>
                  <div className="p-8 md:p-10 rounded-[32px] bg-[#E8C547] text-[#082f1d] shadow-lg flex flex-col justify-between h-44 md:h-48 group">
                    <div className="size-10 md:size-12 rounded-2xl bg-black/10 flex items-center justify-center text-[#082f1d] group-hover:bg-white group-hover:text-[#082f1d] transition-all duration-500">
                      <ShieldCheck className="size-5 md:size-6" />
                    </div>
                    <div>
                      <span className="text-4xl md:text-[48px] font-bold tracking-tighter">0.0%</span>
                      <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-black/40 mt-2">Compromise</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 3. TRUST & QUALITY */}
        <section className="py-24 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#082f1d]/20 via-transparent to-transparent pointer-events-none" />
          <div className="container max-w-[1280px] mx-auto px-6 relative z-10">
            <div className="text-center max-w-[800px] mx-auto mb-20">
              <Badge className="mb-6 bg-[#E8C547] text-[#082f1d] rounded-full px-4 py-1 font-bold text-[11px] tracking-widest uppercase">Quality Standard</Badge>
              <h2 className="text-4xl md:text-[56px] font-bold tracking-tighter mb-6 italic text-white">The Sharcly Standard</h2>
              <p className="text-[18px] md:text-[20px] text-white/50 font-medium">We define luxury through the lens of absolute quality and radical honesty.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              {[
                {
                  icon: ShieldCheck,
                  title: "Lab Certified",
                  desc: "Triple-tested by independent clinics for purity, ensuring a standard of excellence that is unmatched."
                },
                {
                  icon: Leaf,
                  title: "Sustainable Art",
                  desc: "Every extract is ethically sourced from sustainable, high-altitude botanical sanctuaries."
                },
                {
                  icon: Eye,
                  title: "Absolute Clarity",
                  desc: "Complete sourcing transparency with real-time lab data accessible for every single bottle."
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -12 }}
                  className="p-10 md:p-12 rounded-[40px] bg-white/[0.03] backdrop-blur-3xl border border-white/10 transition-all duration-700 group shadow-lg relative overflow-hidden"
                >
                  <div className="size-16 md:size-20 rounded-3xl bg-[#E8C547] text-[#082f1d] flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-black/20">
                    <item.icon className="size-8 md:size-10" />
                  </div>
                  <h3 className="text-[28px] md:text-[32px] font-bold mb-6 tracking-tighter italic text-white">{item.title}</h3>
                  <p className="text-[16px] md:text-[18px] text-white/60 leading-relaxed font-medium">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. VISUAL STORY BLOCK */}
        <section className="px-6 md:px-12 py-20 bg-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] as any }}
            className="relative h-[60vh] md:h-[80vh] rounded-[48px] md:rounded-[64px] overflow-hidden group shadow-2xl border-4 md:border-8 border-white/10"
          >
            <motion.div style={{ scale: imageScale }} className="absolute inset-0 z-0">
              <Image
                src="https://i.postimg.cc/Y2hVpsDp/Sharcy-wellness-products-in-nature-setting.jpg"
                alt="Sharcly Immersive"
                fill
                className="object-cover transition-transform duration-[4000ms] group-hover:scale-105"
                priority
              />
            </motion.div>
            
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10" />
            
            <div className="absolute bottom-0 left-0 w-full p-10 md:p-20 z-20">
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 1.2 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-[2px] w-12 bg-white/40" />
                  <span className="text-white/60 font-bold tracking-widest text-[12px] uppercase">Elite Sourcing</span>
                </div>
                <h2 className="text-4xl md:text-[80px] font-bold text-white tracking-tighter leading-[1.05] md:leading-[0.9] max-w-[960px]">
                  NATURE <br />
                  <span className="italic opacity-80 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">UNCOMPROMISED.</span>
                </h2>
              </motion.div>
            </div>

            <motion.div 
              animate={{ x: ["-100%", "200%"], opacity: [0, 0.3, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 4 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg] z-30 pointer-events-none" 
            />
          </motion.div>
        </section>

        {/* 5. BRAND PILLARS */}
        <section className="py-24 md:py-40">
          <div className="container max-w-[1280px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-12">
              {[
                {
                  icon: Globe,
                  title: "Integrity First",
                  desc: "Our supply chain is a testament to our values. Radical transparency isn't a policy; it's our DNA."
                },
                {
                  icon: Heart,
                  title: "Human Centric",
                  desc: "We design for the human spirit. Our products are frictionless, silent companions in your journey."
                },
                {
                  icon: Users,
                  title: "The Collective",
                  desc: "A worldwide gathering of visionaries, athletes, and thinkers united by the art of the pause."
                }
              ].map((pillar, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="relative p-10 md:p-12 rounded-[40px] bg-white/[0.03] border border-white/10 group transition-all duration-500 overflow-hidden"
                >
                  <div className="size-16 md:size-20 rounded-[24px] bg-white/5 text-white flex items-center justify-center mb-10 group-hover:bg-[#E8C547] group-hover:text-[#082f1d] transition-all duration-700 shadow-sm">
                    <pillar.icon className="size-8 md:size-10" />
                  </div>
                  <h3 className="text-[28px] md:text-[36px] font-bold tracking-tighter mb-6 italic text-white">{pillar.title}</h3>
                  <p className="text-[16px] md:text-[18px] text-white/60 leading-relaxed font-medium">{pillar.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. PROCESS / CRAFT */}
        <section className="py-24 md:py-40 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent pointer-events-none" />
          <div className="container max-w-[1280px] mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row gap-20 md:gap-32 items-start">
              <div className="lg:w-[40%] sticky top-40">
                <Badge className="mb-8 bg-[#E8C547] text-[#082f1d] border-none px-6 py-2 uppercase tracking-widest text-[12px] font-bold">The Craftsmanship</Badge>
                <h2 className="text-5xl md:text-[88px] font-bold tracking-tighter leading-[1] md:leading-[0.85] mb-12 italic text-white">The Art <br /> of Flow.</h2>
                <p className="text-[18px] md:text-[22px] text-white/60 font-medium leading-relaxed">
                  We deliberate over every molecule. True luxury isn't found in speed, but in the unwavering commitment to the slow, precise process.
                </p>
                
                <div className="mt-16 p-6 md:p-8 rounded-[32px] bg-white/[0.03] backdrop-blur-xl border border-white/10 inline-flex items-center gap-6 shadow-sm">
                  <div className="size-14 md:size-16 rounded-2xl bg-[#E8C547] flex items-center justify-center text-[#082f1d]">
                    <FlaskConical className="size-7 md:size-8" />
                  </div>
                  <div>
                    <p className="text-[10px] md:text-[11px] font-bold text-white/40 tracking-widest uppercase">Laboratory Grade</p>
                    <p className="text-[18px] md:text-[20px] font-bold text-white">Scientific Excellence</p>
                  </div>
                </div>
              </div>

              <div className="lg:w-[60%] space-y-6 md:space-y-8">
                {[
                  {
                    step: "01",
                    title: "Elite Sourcing",
                    desc: "We hand-select botanical extracts from high-altitude organic farms where nature thrives in its purest form.",
                    icon: Leaf
                  },
                  {
                    step: "02",
                    title: "Molecular Precision",
                    desc: "Our master chemists blend at sub-zero temperatures to protect the delicate structural integrity of each ingredient.",
                    icon: Droplets
                  },
                  {
                    step: "03",
                    title: "Clinical Validation",
                    desc: "Exhaustive third-party verification ensures each batch exceeds pharmaceutical-grade standards for purity.",
                    icon: CheckCircle2
                  },
                  {
                    step: "04",
                    title: "Conscious Delivery",
                    desc: "Artisanal packaging and carbon-neutral fulfillment, delivered as a silent ritual to your doorstep.",
                    icon: Truck
                  }
                ].map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group p-10 md:p-12 rounded-[40px] bg-white/[0.03] backdrop-blur-2xl border border-white/10 hover:bg-white/5 hover:shadow-xl transition-all duration-700 flex flex-col md:flex-row gap-10 md:gap-12 items-center md:items-start"
                  >
                    <div className="text-5xl md:text-[64px] font-black text-white/5 group-hover:text-white/10 transition-colors duration-700 leading-none">{step.step}</div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-[24px] md:text-[32px] font-bold mb-4 md:mb-6 flex items-center justify-center md:justify-start gap-4 italic tracking-tighter text-white">
                        {step.title}
                        <step.icon className="size-6 md:size-8 text-white/20 group-hover:text-[#E8C547] transition-all duration-700" />
                      </h3>
                      <p className="text-[16px] md:text-[19px] text-white/60 font-medium leading-relaxed">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 7. SOCIAL PROOF */}
        <section className="py-24 md:py-32 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20 pointer-events-none" />
          <div className="container max-w-[1280px] mx-auto px-6 relative z-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-20 text-center mb-32">
              {[
                { val: "10k+", label: "Elite Members" },
                { val: "98%", label: "Satisfaction" },
                { val: "4.9", label: "TrustScore" },
                { val: "24/7", label: "Concierge" }
              ].map((stat, i) => (
                <div key={i} className="space-y-4">
                  <div className="text-5xl md:text-[80px] font-bold tracking-tighter leading-none">{stat.val}</div>
                  <p className="text-white/30 uppercase tracking-widest text-[11px] font-bold">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="max-w-[960px] mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-12 md:p-20 rounded-[48px] text-center"
              >
                <div className="flex justify-center gap-2 mb-10">
                  {[...Array(5)].map((_, i) => <Star key={i} className="size-6 md:size-8 fill-white text-white shadow-white" />)}
                </div>
                <p className="text-[24px] md:text-[40px] font-medium leading-tight italic mb-12 tracking-tighter text-white/90">
                  "Sharcly is the definitive standard. The molecular precision and the sensory experience are simply in a league of their own."
                </p>
                <div className="flex flex-col items-center gap-4">
                  <div className="size-16 rounded-full bg-white text-[#082f1d] flex items-center justify-center text-[20px] font-bold">JD</div>
                  <div className="text-center">
                    <p className="text-[20px] font-bold">Julian D.</p>
                    <p className="text-[12px] text-white/40 font-bold uppercase tracking-widest mt-1">Founding Member & Athlete</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 8. CTA */}
        <section className="py-24 md:py-40 px-6 md:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/[0.03] border border-white/10 backdrop-blur-3xl rounded-[48px] md:rounded-[64px] p-16 md:p-32 text-center text-white relative overflow-hidden group shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-[480px] h-[480px] bg-white/5 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[480px] h-[480px] bg-white/5 rounded-full blur-[120px] -ml-40 -mb-40 pointer-events-none" />

            <div className="max-w-[800px] mx-auto space-y-12 relative z-10">
              <h2 className="text-5xl md:text-[104px] font-bold tracking-tighter leading-[1] md:leading-[0.85] italic">
                JOIN THE <br />
                <span className="text-white/40">COLLECTIVE.</span>
              </h2>
              <p className="text-[18px] md:text-[24px] text-white/50 font-medium max-w-[600px] mx-auto leading-relaxed">
                Access the future of botanical performance. Redefine your baseline with the Sharcly collection.
              </p>
              <div className="pt-8">
                <Button size="lg" className="h-20 md:h-24 px-16 md:px-20 rounded-full bg-[#E8C547] text-[#082f1d] hover:bg-[#E8C547]/90 font-bold text-[20px] md:text-[24px] shadow-2xl group transition-all duration-500" asChild>
                  <Link href="/products" className="flex items-center gap-4">
                    Shop the Catalog <TrendingUp className="size-8 md:size-10 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

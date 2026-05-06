"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Leaf, TrendingUp, ArrowRight, Star } from "lucide-react";

import { Button } from "@/components/ui/button";

const SERIES = ["Chill", "Lift", "Balance", "Sleep", "Vape"];

const MARQUEE_ITEMS = [
  "Better Sleep", "Lab Verified", "Plant-Based", "Clean Sourced",
  "Balanced Living", "Unwind Naturally", "Daily Reset",
  "Farm Bill Compliant", "USDA Organic", "COA Every Batch"
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as any },
  },
};

export function HeroSection() {
  const [activeSeries, setActiveSeries] = useState("Chill");

  return (
    <section className="relative h-[calc(100vh-40px)] flex flex-col lg:grid lg:grid-cols-2 overflow-hidden bg-[#040e07] selection:bg-[#E8C547] selection:text-[#040e07]">
      {/* Mesh Gradient & Texture Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: "linear-gradient(135deg, #040e07 0%, #082f1d 45%, #051a10 100%)",
          }}
        />
        {/* Radial Glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#082f1d] rounded-full blur-[120px] opacity-30" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#E8C547] rounded-full blur-[180px] opacity-[0.03]" />

        {/* Grain Overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04] mix-blend-overlay">
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.6"
              numOctaves="3"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* LEFT PANEL */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col justify-center px-6 pt-24 pb-16 lg:pt-0 lg:pb-0 lg:pl-20 lg:pr-12"
      >
        {/* Age / Compliance Pill */}
        <motion.div variants={itemVariants} className="mb-6 self-start">
          <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-[#E8C547]/[0.08] border border-[#E8C547]/20">
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-[#E8C547] shadow-[0_0_8px_#E8C547]"
            />
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#E8C547]">
              21+ · Farm Bill Compliant · Free Shipping $50+
            </span>
          </div>
        </motion.div>

        {/* Kicker */}
        <motion.span
          variants={itemVariants}
          className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#eff8ee]/55 mb-4"
        >
          Premium Hemp-Derived Wellness
        </motion.span>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="font-cormorant text-[clamp(38px,4.8vw,64px)] font-black leading-[1] tracking-[-0.025em] text-[#eff8ee] mb-5"
        >
          Balance is Where <br />
          <span className="relative inline-block italic text-[#E8C547]">
            Better Living
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.2, delay: 0.9, ease: "easeInOut" }}
              className="absolute -bottom-1 left-0 h-[1.5px] bg-gradient-to-right from-[#E8C547] to-transparent"
              style={{ background: "linear-gradient(to right, #E8C547, rgba(232,197,71,0))" }}
            />
          </span> <br />
          Begins.
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          variants={itemVariants}
          className="text-[14px] lg:text-[14px] text-[#eff8ee]/60 font-medium leading-[1.6] max-w-[400px] mb-6"
        >
          Clean, lab-verified hemp-derived products — crafted for people
          who take their wellness as seriously as their ambitions.
        </motion.p>

        {/* CTA Row */}
        <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-8">
          <Button
            className="group h-auto px-8 py-4 rounded-full bg-[#E8C547] text-[#082f1d] hover:bg-[#f0cf55] transition-all duration-300 shadow-[0_8px_28px_rgba(232,197,71,0.28)] hover:-translate-y-0.5 active:scale-95"
          >
            <span className="text-[12px] font-bold uppercase tracking-[0.08em]">Explore Products</span>
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>

          <Button
            variant="outline"
            className="h-auto px-8 py-4 rounded-full border-[#eff8ee]/18 bg-transparent text-[#eff8ee] hover:bg-[#eff8ee]/05 hover:border-[#eff8ee]/35 transition-all"
          >
            <span className="text-[12px] font-bold uppercase tracking-[0.08em]">Our Story</span>
          </Button>
        </motion.div>

        {/* Trust Micro-Row */}
        <motion.div variants={itemVariants} className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#E8C547]/60" />
            <span className="text-[11px] font-medium text-[#eff8ee]/50">Third-Party Lab Tested</span>
          </div>
          <div className="w-px h-3 bg-[#eff8ee]/12" />
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-[#E8C547]/60" />
            <span className="text-[11px] font-medium text-[#eff8ee]/50">USDA Organic Hemp</span>
          </div>
          <div className="w-px h-3 bg-[#eff8ee]/12" />
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#E8C547]/60" />
            <span className="text-[11px] font-medium text-[#eff8ee]/50">30-Day Guarantee</span>
          </div>
        </motion.div>
      </motion.div>

      {/* RIGHT PANEL */}
      <div className="relative z-10 flex items-center justify-center lg:justify-start px-6 pb-24 lg:pb-0 lg:pl-10 lg:pr-20 lg:py-16">
        <div className="relative w-full max-w-[580px] aspect-square">
          {/* Main Visual Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative w-full h-full rounded-[28px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6),0_0_0_1px_rgba(232,197,71,0.1),inset_0_0_40px_rgba(0,0,0,0.4)] bg-black isolate"
            style={{ maskImage: "linear-gradient(white, white)" }}
          >
            {/* Video Background */}
            <div className="relative w-full h-full">
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="w-full h-full object-cover saturate-[1.15] brightness-[0.92] transition-opacity duration-1000"
              >
                <source src="/assets/main-hero.mp4" type="video/mp4" />
              </video>

              {/* Overlays for smoother integration */}
              <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.5)] pointer-events-none" />
              <div className="absolute inset-x-0 top-0 h-[30%] bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-[35%] bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
            </div>

            {/* Corner Brackets */}
            <div className="absolute top-6 left-6 w-7 h-7 border-t-[1.5px] border-l-[1.5px] border-[#E8C547]/40 pointer-events-none" />
            <div className="absolute top-6 right-6 w-7 h-7 border-t-[1.5px] border-r-[1.5px] border-[#E8C547]/40 pointer-events-none" />
            <div className="absolute bottom-6 left-6 w-7 h-7 border-b-[1.5px] border-l-[1.5px] border-[#E8C547]/40 pointer-events-none" />
            <div className="absolute bottom-6 right-6 w-7 h-7 border-b-[1.5px] border-r-[1.5px] border-[#E8C547]/40 pointer-events-none" />

            {/* Bottom Label Overlay */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#eff8ee]/40">
                Sharcly · Premium Hemp Collection
              </span>
            </div>
          </motion.div>

          {/* Floating Badge 1: COA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9, ease: [0.22, 1, 0.36, 1] as any }}
            className="absolute -left-4 lg:-left-12 bottom-12 w-[210px] p-[14px_18px] rounded-[16px] bg-[#082f1d]/85 backdrop-blur-[20px] border border-[#E8C547]/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E8C547]/10 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#E8C547]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#E8C547]">Lab Verified</span>
              <span className="text-[11px] text-[#eff8ee]/70 leading-tight">COA available for every batch</span>
            </div>
          </motion.div>

          {/* Floating Badge 2: Stars */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.05, ease: [0.22, 1, 0.36, 1] as any }}
            className="absolute -right-4 lg:-right-10 top-12 w-[130px] p-[16px] rounded-[16px] bg-[#082f1d]/85 backdrop-blur-[20px] border border-[#E8C547]/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center text-center"
          >
            <span className="font-cormorant text-2xl font-bold text-[#eff8ee] mb-1 leading-none">4.9</span>
            <div className="flex gap-0.5 mb-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-[#E8C547] text-[#E8C547]" />
              ))}
            </div>
            <span className="text-[11px] font-medium text-[#eff8ee]/55 whitespace-nowrap">2,400+ Reviews</span>
          </motion.div>

          {/* Series Pills */}
          <div className="hidden lg:flex absolute -right-20 top-1/2 -translate-y-1/2 flex-col gap-2 z-20">
            {SERIES.map((series, idx) => (
              <motion.button
                key={series}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 1.2 + (idx * 0.1) }}
                onClick={() => setActiveSeries(series)}
                className={`
                  px-4 py-2 rounded-full border text-[9.5px] font-bold uppercase tracking-[0.12em] transition-all
                  ${activeSeries === series
                    ? "bg-[#E8C547]/07 border-[#E8C547]/40 text-[#E8C547]"
                    : "border-[#eff8ee]/10 text-[#eff8ee]/40 hover:border-[#eff8ee]/25 hover:text-[#eff8ee]/60"
                  }
                `}
              >
                {series}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* MARQUEE STRIP */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-[#040e07]/70 backdrop-blur-[10px] border-t border-[#eff8ee]/05 py-2.5 overflow-hidden group">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: [0, "-50%"] }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop"
          }}
        >
          {/* Double items for seamless loop */}
          {[...Array(2)].map((_, idx) => (
            <div key={idx} className="flex">
              {MARQUEE_ITEMS.map((item, i) => (
                <div key={i} className="flex items-center px-12 gap-4">
                  <span className="text-[8px] text-[#E8C547]/45">✦</span>
                  <span className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[#eff8ee]/35">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

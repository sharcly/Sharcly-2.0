"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export const FinalCTA = () => {
  return (
    <section className="relative py-20 lg:py-32 px-6 text-center overflow-hidden bg-[#040e07] text-[#eff8ee]">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Decorative Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[400px] bg-radial-gradient from-[#E8C547]/[0.08] to-transparent pointer-events-none" 
           style={{ background: 'radial-gradient(ellipse, rgba(232,197,71,0.12), transparent 70%)' }} />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Eyebrow */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="w-8 h-[1px] bg-[#E8C547]/40" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#E8C547]">
            Your Wellness, Your Way
          </span>
          <div className="w-8 h-[1px] bg-[#E8C547]/40" />
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-cormorant text-[clamp(36px,7vw,72px)] font-black leading-[1.1] mb-6"
        >
          Ready to find your <br />
          <span className="italic text-[#E8C547] relative">
            Balance?
            <motion.span 
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="absolute -bottom-1 left-0 h-[1.5px] bg-[#E8C547]/40"
            />
          </span>
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-[15px] lg:text-[17px] leading-relaxed text-[#eff8ee]/60 max-w-md mx-auto mb-10"
        >
          Six series. Every mood. One brand you can trust. 
          Find exactly what your body needs to thrive in every moment.
        </motion.p>

        {/* Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#E8C547] text-[#082f1d] text-[12px] font-bold uppercase tracking-widest hover:bg-[#f0cf55] transition-all duration-300 shadow-[0_10px_30px_rgba(232,197,71,0.3)] hover:-translate-y-1 flex items-center justify-center gap-2">
            Explore Products
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button className="w-full sm:w-auto px-8 py-4 rounded-full border border-[#eff8ee]/20 bg-transparent text-[#eff8ee]/80 text-[12px] font-bold uppercase tracking-widest hover:bg-[#eff8ee]/5 transition-all duration-300 flex items-center justify-center gap-2">
            Take the Series Quiz
            <Sparkles className="w-4 h-4 text-[#E8C547]/60" />
          </button>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 pt-8 border-t border-[#eff8ee]/05 flex flex-wrap justify-center gap-x-8 gap-y-4"
        >
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-[#E8C547]" />
            <span className="text-[11px] font-medium text-[#eff8ee]/40 uppercase tracking-wider">Lab Tested</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-[#E8C547]" />
            <span className="text-[11px] font-medium text-[#eff8ee]/40 uppercase tracking-wider">USDA Organic</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-[#E8C547]" />
            <span className="text-[11px] font-medium text-[#eff8ee]/40 uppercase tracking-wider">Fast Shipping</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};


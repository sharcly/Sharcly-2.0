"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Lock, 
  MessageSquare, 
  CheckCircle2, 
  ArrowRight,
  Sprout,
  Leaf,
  Trees,
  Crown,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";

const TrustBar = () => {
  const pillars = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#E8C547]" />,
      headline: "Lab Verified",
      subtext: "Every batch tested by accredited third-party labs. COA linked."
    },
    {
      icon: <Lock className="w-6 h-6 text-[#E8C547]" />,
      headline: "Secure Checkout",
      subtext: "256-bit SSL encryption. Your data is always protected."
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-[#E8C547]" />,
      headline: "24/7 Support",
      subtext: "Real humans ready to help anytime, day or night."
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-[#E8C547]" />,
      headline: "30-Day Guarantee",
      subtext: "Love it or your money back. Zero questions asked."
    }
  ];

  return (
    <div className="w-full bg-[#082f1d] border-b border-[#E8C547]/10 overflow-hidden">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`flex flex-col items-center lg:items-start text-center lg:text-left px-4 lg:px-8 ${
                index !== pillars.length - 1 ? "lg:border-r lg:border-[#E8C547]/30" : ""
              }`}
            >
              <div className="mb-4">{pillar.icon}</div>
              <h3 className="text-[#eff8ee] font-serif text-lg font-semibold mb-1">
                {pillar.headline}
              </h3>
              <p className="text-[rgba(239,248,238,0.65)] text-sm leading-relaxed">
                {pillar.subtext}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const WhySharclyFeature = () => {
  return (
    <section className="relative w-full bg-[#082f1d] py-24 overflow-hidden">
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left Side: Content */}
          <div className="w-full lg:w-[60%] space-y-8">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-serif text-[#eff8ee] leading-[1.1]"
            >
              Purity Isn't<br />
              a Promise.<br />
              It's Proof.
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-[#eff8ee]/80 text-lg md:text-xl leading-relaxed max-w-2xl font-body"
            >
              Every Sharcly product is crafted from organically grown US hemp, 
              independently tested, and built for people who refuse to compromise 
              on what they put in their bodies.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <a 
                href="/lab-results" 
                className="group inline-flex items-center text-[#E8C547] font-bold tracking-wider uppercase text-sm border-b border-transparent hover:border-[#E8C547] transition-all duration-300 pb-1"
              >
                View Lab Reports 
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-2" />
              </a>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-4 md:gap-6 pt-4"
            >
              {["USDA Organic Hemp", "Farm Bill Compliant", "No Heavy Metals", "No Pesticides"].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-[#eff8ee]/60">
                  <Check className="w-3 h-3 text-[#E8C547]" />
                  {badge}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Side: COA Card Mockup */}
          <div className="w-full lg:w-[40%] flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[320px] aspect-[3/4]">
              {/* Back Card */}
              <motion.div 
                initial={{ opacity: 0, rotate: 0, y: 20 }}
                whileInView={{ opacity: 1, rotate: 2, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="absolute inset-0 bg-[#eff8ee]/90 border border-[#082f1d]/10 shadow-2xl rounded-sm transform translate-y-4"
              />
              
              {/* Front Card */}
              <motion.div 
                initial={{ opacity: 0, rotate: 0, y: 20 }}
                whileInView={{ opacity: 1, rotate: -3, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="absolute inset-0 bg-[#eff8ee] border border-[#082f1d]/20 shadow-2xl rounded-sm p-8 flex flex-col justify-between overflow-hidden"
              >
                {/* Paper Texture Overlay */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/felt.png')]" />
                
                <div className="relative">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <p className="text-[10px] font-bold text-[#082f1d]/40 uppercase tracking-tighter">Certificate of Analysis</p>
                      <h4 className="text-xl font-serif text-[#082f1d] font-bold">COA Report</h4>
                    </div>
                    <div className="w-10 h-10 border-2 border-[#E8C547] rounded-full flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6 text-[#E8C547]" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-[8px] uppercase tracking-widest text-[#082f1d]/40">Batch ID</p>
                      <p className="text-xs font-bold text-[#082f1d]">SH-2024-001-A</p>
                    </div>
                    <div>
                      <p className="text-[8px] uppercase tracking-widest text-[#082f1d]/40">Product</p>
                      <p className="text-xs font-bold text-[#082f1d]">Chill Series Gummies</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[8px] uppercase tracking-widest text-[#082f1d]/40">THC</p>
                        <p className="text-xs font-bold text-[#082f1d]">&lt;0.3%</p>
                      </div>
                      <div>
                        <p className="text-[8px] uppercase tracking-widest text-[#082f1d]/40">CBD</p>
                        <p className="text-xs font-bold text-[#082f1d]">25mg/unit</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative pt-6 border-t border-[#082f1d]/10 flex justify-between items-end">
                  <div>
                    <p className="text-[8px] uppercase tracking-widest text-[#082f1d]/40">Tested Date</p>
                    <p className="text-[10px] font-bold text-[#082f1d]">Oct 12, 2024</p>
                  </div>
                  <div className="bg-[#E8C547] text-[#082f1d] px-3 py-1 rounded text-[10px] font-bold tracking-widest uppercase">
                    PASSED
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const LoyaltyTeaser = () => {
  const tiers = [
    {
      name: "Seedling",
      icon: <Sprout className="w-12 h-12" />,
      points: "0–199 pts",
      perk: "Free shipping over $50",
      active: true
    },
    {
      name: "Cultivator",
      icon: <Leaf className="w-12 h-12" />,
      points: "200–499 pts",
      perk: "10% off every order",
      active: false
    },
    {
      name: "Elevated",
      icon: <Trees className="w-12 h-12" />,
      points: "500–999 pts",
      perk: "Early product access",
      active: false
    },
    {
      name: "Reserve",
      icon: <Crown className="w-12 h-12" />,
      points: "1000+ pts",
      perk: "VIP drops + free gifts",
      active: false
    }
  ];

  return (
    <section className="relative w-full bg-[#082f1d] py-24 overflow-hidden border-t border-[#E8C547]/10">
      {/* Botanical Decorations */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none hidden lg:block">
        <svg width="400" height="600" viewBox="0 0 400 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 600C100 400 300 200 400 100" stroke="#E8C547" strokeWidth="2" strokeDasharray="10 10" />
          <circle cx="100" cy="500" r="40" stroke="#E8C547" strokeWidth="1" />
          <path d="M0 300C100 300 200 400 200 600" stroke="#E8C547" strokeWidth="1" />
        </svg>
      </div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none hidden lg:block rotate-180">
        <svg width="400" height="600" viewBox="0 0 400 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 600C100 400 300 200 400 100" stroke="#E8C547" strokeWidth="2" strokeDasharray="10 10" />
          <circle cx="100" cy="500" r="40" stroke="#E8C547" strokeWidth="1" />
          <path d="M0 300C100 300 200 400 200 600" stroke="#E8C547" strokeWidth="1" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 space-y-4"
        >
          <span className="text-[#E8C547] font-bold uppercase tracking-[0.2em] text-xs">SHARCLY CIRCLE</span>
          <h2 className="text-4xl md:text-6xl font-serif text-[#eff8ee]">
            Every Purchase<br />Moves You Forward.
          </h2>
          <p className="text-[#eff8ee]/60 max-w-2xl mx-auto font-body">
            Earn points with every order. Unlock exclusive tiers, early access, and member-only rewards. Join free — no commitment.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {tiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`relative p-8 rounded-2xl border transition-all duration-300 bg-[#eff8ee]/[0.06] hover:bg-[#eff8ee]/[0.1] ${
                tier.active ? "border-[#E8C547]/60 shadow-[0_0_20px_rgba(232,197,71,0.1)]" : "border-[#E8C547]/20"
              } hover:border-[#E8C547] group`}
            >
              <div className="flex flex-col items-center gap-6">
                <div className="text-[#E8C547] transition-transform duration-500 group-hover:scale-110">
                  {tier.icon}
                </div>
                <div className="space-y-2">
                  <h4 className="text-2xl font-serif text-[#eff8ee]">{tier.name}</h4>
                  <p className="text-[rgba(239,248,238,0.65)] text-xs uppercase tracking-widest font-body">{tier.points}</p>
                </div>
                <p className="text-[#eff8ee]/80 text-sm font-medium pt-4 border-t border-[#E8C547]/10 w-full">
                  {tier.perk}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Button 
            className="bg-[#E8C547] text-[#082f1d] hover:bg-[#E8C547]/90 h-14 px-10 rounded-full font-bold text-sm uppercase tracking-widest transition-transform hover:scale-[1.03] shadow-lg shadow-[#E8C547]/10"
          >
            Join the Circle — It's Free
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export const TrustLoyaltySection = () => {
  return (
    <>
      <TrustBar />
      <WhySharclyFeature />
      <LoyaltyTeaser />
    </>
  );
};

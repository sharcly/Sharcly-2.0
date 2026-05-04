"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import { FileText, Scale, BookOpen } from "lucide-react";
import Script from "next/script";

export default function TermsPage() {
  return (
    <div className="min-h-screen antialiased" style={{ background: '#040e07', color: '#eff8ee' }}>
      <Navbar />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(175deg, #040e07 0%, #0a2a17 40%, #040e07 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 40% at 50% 30%, rgba(232,197,71,0.04) 0%, transparent 70%)' }} />
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full mb-8" style={{ backgroundColor: 'rgba(232,197,71,0.08)', border: '1px solid rgba(232,197,71,0.15)' }}>
            <Scale className="size-3.5" style={{ color: '#E8C547' }} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: '#E8C547' }}>Legal Documentation</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-[-0.03em] leading-[0.9] mb-6"
            style={{ color: '#eff8ee' }}
          >
            Terms &amp;<br />
            <span className="italic font-serif" style={{ color: 'rgba(239,248,238,0.18)' }}>Conditions</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-base font-medium leading-relaxed max-w-lg mx-auto" style={{ color: 'rgba(239,248,238,0.45)' }}>
            Please review the terms that govern your use of Sharcly products and services.
          </motion.p>
        </div>
      </section>

      {/* ═══════════════ INDICATORS ═══════════════ */}
      <section className="container mx-auto px-6 md:px-12 mb-12">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: FileText, label: "Clear Language" },
              { icon: Scale, label: "Fair Terms" },
              { icon: BookOpen, label: "Full Transparency" },
            ].map((item, idx) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.08 }}
                className="flex flex-col items-center gap-3 py-5 px-3 rounded-[14px] text-center"
                style={{ backgroundColor: 'rgba(239,248,238,0.02)', border: '1px solid rgba(239,248,238,0.05)' }}
              >
                <div className="size-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(232,197,71,0.08)' }}>
                  <item.icon className="size-4" style={{ color: '#E8C547' }} />
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(239,248,238,0.5)' }}>{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ POLICY EMBED ═══════════════ */}
      <section className="container mx-auto px-6 md:px-12 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-3xl mx-auto rounded-[20px] overflow-hidden"
          style={{ backgroundColor: 'rgba(239,248,238,0.025)', border: '1px solid rgba(239,248,238,0.06)' }}
        >
          {/* Header bar */}
          <div className="px-8 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(239,248,238,0.05)' }}>
            <span className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: '#E8C547' }}>Full Terms</span>
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(239,248,238,0.2)' }}>Managed via Termly</span>
          </div>

          {/* Termly embed container */}
          <div className="p-6 md:p-10 min-h-[600px] terms-embed-container">
            <div 
              data-name="termly-embed" 
              data-id="YOUR_PRIVACY_ID_HERE" 
              data-type="iframe"
            ></div>
            <Script
              src="https://app.termly.io/embed-policy.min.js"
              strategy="afterInteractive"
            />
          </div>
        </motion.div>
      </section>

      <Footer />

      {/* Override Termly iframe styles to match dark theme */}
      <style jsx global>{`
        .terms-embed-container iframe {
          border: none !important;
          border-radius: 12px !important;
          min-height: 600px !important;
          filter: invert(0.88) hue-rotate(180deg) !important;
        }
      `}</style>
    </div>
  );
}

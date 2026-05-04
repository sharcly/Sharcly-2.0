"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Shield } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";

export function AgeVerification() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Only show on home page
    if (pathname !== "/") return;

    const isVerified = localStorage.getItem("sharcly_age_verified");
    if (!isVerified) {
      setIsOpen(true);
    }
  }, [pathname]);

  const handleVerify = () => {
    localStorage.setItem("sharcly_age_verified", "true");
    setIsOpen(false);
    window.dispatchEvent(new Event("age-verified"));
  };

  const handleExit = () => {
    window.location.href = "https://www.google.com";
  };

  // If not on home page or already verified, don't render anything
  if (pathname !== "/" || !isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black overflow-hidden selection:bg-emerald-500 selection:text-white">
        
        {/* Cinematic Background */}
        <div className="absolute inset-0">
          <Image 
            src="https://i.postimg.cc/Y2hVpsDp/Sharcy-wellness-products-in-nature-setting.jpg" 
            alt="Sharcly Lifestyle"
            fill
            className="object-cover opacity-40 grayscale"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
          {/* Grainy Texture */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-2xl px-6 md:px-12 py-20 flex flex-col items-center"
        >
          {/* Elegant Header */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-12"
          >
            <img src="https://i.postimg.cc/qM6nntM3/Sharcly-Logo-White.png" alt="Sharcly" className="h-8 w-auto opacity-80" />
          </motion.div>

          <div className="space-y-8 text-center">
            <div className="space-y-4">
               <motion.span 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.3 }}
                 className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-500/80"
               >
                 Security & Compliance
               </motion.span>
               <h2 className="text-4xl md:text-7xl font-medium text-white italic font-serif leading-[1.1]">
                 Verify your <br /> <span className="text-white/60">experience.</span>
               </h2>
            </div>
            
            <p className="text-white/40 text-lg md:text-xl font-light leading-relaxed max-w-md mx-auto">
              Our curated collection is intended exclusively for individuals aged 21 and above. Please confirm your age to enter.
            </p>
          </div>

          <div className="mt-16 w-full max-w-sm space-y-4">
            <button
              onClick={handleVerify}
              className="group relative w-full h-18 rounded-full bg-white text-black font-bold text-base transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 shadow-2xl shadow-white/10"
            >
              I AM 21 OR OLDER
              <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={handleExit}
              className="w-full h-18 rounded-full border border-white/10 text-white/40 hover:text-white hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-[0.2em]"
            >
              EXIT EXPERIENCE
            </button>
          </div>

          {/* Footer Disclaimer */}
          <div className="mt-12 flex flex-col items-center gap-4">
             <div className="h-px w-12 bg-white/10" />
             <p className="text-[9px] text-white/20 uppercase tracking-[0.2em] font-medium leading-loose text-center max-w-xs">
               Hemp-derived products only. By entering, you agree to our <br />
               <span className="text-white/40 cursor-pointer hover:text-emerald-500">Terms of Service</span> & <span className="text-white/40 cursor-pointer hover:text-emerald-500">Privacy Policy</span>.
             </p>
          </div>

        </motion.div>

        {/* corner accents */}
        <div className="absolute top-10 left-10 hidden md:block">
           <div className="text-[10px] font-bold text-white/10 vertical-text tracking-[1em] uppercase">Sharcly Est. 2024</div>
        </div>
        <div className="absolute bottom-10 right-10 hidden md:block">
           <Shield className="size-6 text-white/5" />
        </div>

        <style jsx>{`
          .vertical-text {
            writing-mode: vertical-rl;
            transform: rotate(180deg);
          }
          .font-serif {
            font-family: var(--font-cormorant), serif;
          }
        `}</style>
      </div>
    </AnimatePresence>
  );
}

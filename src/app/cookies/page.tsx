"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api-client";
import { motion } from "framer-motion";
import { Cookie, MousePointer2, ShieldCheck, Sparkles } from "lucide-react";

export default function CookiesPage() {
  const [content, setContent] = useState<any>({
    legal: {
      body: `Cookies help us provide a seamless experience on Sharcly. Think of them as a "memory" for our website that helps us recognize you and remember your preferences.\n\n1. ESSENTIAL COOKIES\nThese are necessary for the site to function. They handle things like keeping your shopping cart items saved while you browse other pages and ensuring your secure login works properly.\n\n2. PERFORMANCE & ANALYTICS\nWe use these to understand how visitors interact with Sharcly. It helps us see which "Series" are most popular and where we can improve the site speed and navigation.\n\n3. PERSONALIZATION\nThese cookies allow us to remember your choices (like your preferred language or region) to provide a more personalized experience during your next visit.\n\n4. YOUR CHOICES\nYou can choose to disable cookies in your browser settings at any time. However, please note that some parts of our site may not function correctly without them (like the checkout process).\n\n5. NO THIRD-PARTY AD TRACKING\nWe do not use cookies to track your behavior across other websites for the purpose of third-party advertising. Our focus is solely on making your Sharcly experience the best it can be.`
    }
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await apiClient.get("/cms/cookies");
        if (response.data.success && response.data.content) {
          setContent(response.data.content);
        }
      } catch (error) {
        console.error("Failed to fetch cookie content:", error);
      }
    };
    fetchContent();
  }, []);

  return (
    <div className="min-h-screen bg-[#040e07] text-[#eff8ee] selection:bg-[#eff8ee] selection:text-[#040e07] antialiased">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-32 pb-24 md:pt-48 md:pb-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 to-transparent" />
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4 mb-8"
              >
                <Badge className="bg-[#E8C547]/10 text-[#E8C547] border-none font-black text-[10px] uppercase tracking-[0.3em] px-4 py-1.5">Consent Logic</Badge>
                <div className="h-px w-12 bg-emerald-500/20" />
                <Sparkles className="size-4 text-[#E8C547] opacity-40" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-12 uppercase"
              >
                COOKIE <br />
                <span className="opacity-20 italic font-serif">PREFERENCES</span>.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl lg:text-2xl text-emerald-100/40 font-medium max-w-2xl leading-relaxed"
              >
                We use technologies to tailor your experience and ensure our digital ecosystem operates with peak performance.
              </motion.p>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="bg-white border border-primary/5 rounded-[3rem] p-8 md:p-16 min-h-[600px]">
              <p className="text-center text-primary/40 font-bold mb-10">Managed via Termly Main Account</p>
              <div
                data-name="termly-embed"
                data-id="YOUR_COOKIES_ID_HERE"
                data-type="iframe"
              ></div>
              <Script
                src="https://app.termly.io/embed-policy.min.js"
                strategy="afterInteractive"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

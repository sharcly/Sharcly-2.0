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
      body: `Cookies serve as the memory of the Sharcly digital ecosystem, allowing us to provide a seamless and personalized journey for every visitor.\n\n1. ESSENTIAL LOGIC\nThese cookies are critical for core functionality. They manage secure sessions, remember your cart items as you navigate series, and ensure the checkout process remains stable.\n\n2. PERFORMANCE ARCHITECTURE\nWe utilize analytical cookies to understand how our community interacts with the platform. This data allows us to optimize site speed, refine navigation, and understand which series resonate most.\n\n3. EXPERIENCE PERSONALIZATION\nThese allow our platform to remember your preferences—such as language or regional settings—to provide a more tailored experience upon your return.\n\n4. VOLUNTARY CONSENT\nYou may adjust your browser settings to decline cookies at any time. Please be aware that disabling essential cookies may impact the stability of the checkout and login modules.\n\n5. TRACKING INTEGRITY\nSharcly does not employ cookies for cross-site behavioral tracking for third-party advertising. Our focus is exclusively on the refinement of your Sharcly experience.`
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
    <div className="min-h-screen font-sans antialiased selection:bg-[#E8C547] selection:text-[#040e07]" style={{ background: "linear-gradient(160deg, #040e07 0%, #082f1d 50%, #040e07 100%)", color: "#eff8ee" }}>
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex items-center justify-center pt-32 pb-24 px-6 overflow-hidden">
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

          <div className="container max-w-[1280px] mx-auto relative z-20 text-center">
            <div className="max-w-[960px] mx-auto">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-4 mb-8"
              >
                <Badge className="bg-[#E8C547]/10 text-[#E8C547] border border-[#E8C547]/20 font-black text-[10px] uppercase tracking-[0.3em] px-6 py-2 rounded-full">Consent Logic</Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-12 uppercase"
              >
                COOKIE <br />
                <span className="italic font-serif text-[#E8C547]">PREFERENCES</span>.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl lg:text-2xl text-white/40 font-medium max-w-2xl mx-auto leading-relaxed"
              >
                We use technologies to tailor your experience and ensure our digital ecosystem operates with peak performance.
              </motion.p>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="bg-white border border-primary/5 rounded-[3rem] p-8 md:p-16 min-h-[600px] text-primary/80">
              <div className="prose prose-emerald max-w-none prose-headings:text-[#040e07] prose-headings:font-black prose-a:text-[#E8C547] prose-a:font-bold hover:prose-a:underline">
                <div 
                  className="leading-relaxed text-lg"
                  dangerouslySetInnerHTML={{ __html: content.legal?.body || "Cookie policy content is being prepared." }}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api-client";
import { motion } from "framer-motion";
import { FileText, Scale, Gavel, Sparkles } from "lucide-react";
import Script from "next/script";

export default function TermsPage() {
  const [content, setContent] = useState<any>({
    legal: {
      body: `Welcome to Sharcly. By accessing our website and purchasing our products, you agree to the following terms, designed to ensure a safe and transparent experience for everyone in our community.\n\n1. AGE REQUIREMENT\nYou must be at least 21 years of age to purchase Sharcly products. By placing an order, you confirm that you meet this age requirement. We reserve the right to verify age at our discretion.\n\n2. PRODUCT INTENT\nSharcly products are hemp-derived and contain less than 0.3% THC in accordance with federal law. These products are intended for wellness and relaxation. They are not intended to diagnose, treat, or cure any disease. Please consult with a healthcare professional before use.\n\n3. SHIPPING & COMPLIANCE\nWe ship only to states where our products are legally compliant. It is your responsibility to understand the local laws in your jurisdiction before placing an order.\n\n4. SATISFACTION GUARANTEE\nWe stand by the quality of our series. If you are not satisfied with your purchase, please refer to our Returns policy or contact our support team. We aim to resolve every concern with fairness and speed.\n\n5. INTELLECTUAL PROPERTY\nAll content on this site, including designs, photography, and the "Sharcly" name, is the property of Sharcly and may not be used without our express written consent.`
    }
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await apiClient.get("/cms/terms");
        if (response.data.success && response.data.content) {
          setContent(response.data.content);
        }
      } catch (error) {
        console.error("Failed to fetch terms content:", error);
      }
    };
    fetchContent();
  }, []);

  return (
    <>
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
                  <Badge className="bg-[#E8C547]/10 text-[#E8C547] border-none font-black text-[10px] uppercase tracking-[0.3em] px-4 py-1.5">Legal Framework</Badge>
                  <div className="h-px w-12 bg-emerald-500/20" />
                  <Sparkles className="size-4 text-[#E8C547] opacity-40" />
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-12 uppercase"
                >
                  TERMS & <br/>
                  <span className="opacity-20 italic font-serif">CONDITIONS</span>.
                </motion.h1>

                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl lg:text-2xl text-emerald-100/40 font-medium max-w-2xl leading-relaxed"
                >
                  Clear, honest, and binding agreements that define the relationship between our brand and our community.
                </motion.p>
              </div>
           </div>
        </section>

        {/* Legal Content */}
        <section className="py-24 md:py-40 border-t border-white/5">
           <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                 {/* Sidebar Sticky */}
                 <div className="lg:col-span-4 space-y-10">
                    <div className="sticky top-40 space-y-8">
                       <div className="space-y-4">
                          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/40">Last Updated</p>
                          <p className="text-sm font-bold text-emerald-100 italic">May 05, 2026</p>
                       </div>
                       
                       <div className="h-px w-full bg-white/5" />

                       <div className="space-y-6">
                          <div className="flex items-center gap-4 group">
                             <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-100 group-hover:bg-[#E8C547] group-hover:text-[#040e07] transition-all">
                                <Scale className="size-4" />
                             </div>
                             <div>
                                <h4 className="text-xs font-black uppercase tracking-widest">Fair Use</h4>
                                <p className="text-[10px] font-medium text-emerald-100/30">Responsible community guidelines</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-4 group">
                             <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-100 group-hover:bg-[#E8C547] group-hover:text-[#040e07] transition-all">
                                <Gavel className="size-4" />
                             </div>
                             <div>
                                <h4 className="text-xs font-black uppercase tracking-widest">Compliance</h4>
                                <p className="text-[10px] font-medium text-emerald-100/30">Federally compliant standards</p>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Main Body */}
                 <div className="lg:col-span-8">
                    <div className="bg-white border border-primary/5 rounded-[3rem] p-8 md:p-16 min-h-[600px] terms-embed-container">
                      <p className="text-center text-primary/40 font-bold mb-10">Managed via Termly Main Account</p>
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
                 </div>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>

    {/* Override Termly iframe styles to match dark theme */}
    <style jsx global>{\`
      .terms-embed-container iframe {
        border: none !important;
        border-radius: 12px !important;
        min-height: 600px !important;
        filter: invert(0.88) hue-rotate(180deg) !important;
      }
    \`}</style>
    </>
  );
}

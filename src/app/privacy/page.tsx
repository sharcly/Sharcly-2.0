"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api-client";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, Sparkles } from "lucide-react";
import Script from "next/script";

export default function PrivacyPage() {
  const [content, setContent] = useState<any>({
    legal: {
      body: `At Sharcly, we believe your privacy is a fundamental right. This policy outlines how we handle your personal information with the same care and respect we give our products.\n\n1. INFORMATION COLLECTION\nWe collect information you provide directly to us, such as your name, shipping address, and email when you place an order or subscribe to our newsletter. We also collect minimal technical data via cookies to ensure our site works correctly for you.\n\n2. HOW WE USE YOUR DATA\nYour data is primarily used to fulfill your orders, process payments, and provide you with the best possible customer support. If you've opted in, we may also send you updates about new series launches and wellness tips.\n\n3. NO DATA SELLING\nWe have never sold, and will never sell, your personal information to third parties. Your data stays within the Sharcly ecosystem, used only by our trusted service providers (like shipping carriers and payment processors) to complete your transactions.\n\n4. DATA SECURITY\nWe use industry-standard SSL/TLS encryption for all data transfers. Your payment information is processed through secure, PCI-compliant gateways and is never stored on our local servers.\n\n5. YOUR RIGHTS\nYou have the right to access, correct, or delete your personal data at any time. If you wish to exercise these rights, please contact our privacy team at privacy@sharcly.com.`
    }
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await apiClient.get("/cms/privacy");
        if (response.data.success && response.data.content) {
          setContent(response.data.content);
        }
      } catch (error) {
        console.error("Failed to fetch privacy content:", error);
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
                  <Badge className="bg-[#E8C547]/10 text-[#E8C547] border-none font-black text-[10px] uppercase tracking-[0.3em] px-4 py-1.5">Data Sovereignty</Badge>
                  <div className="h-px w-12 bg-emerald-500/20" />
                  <Sparkles className="size-4 text-[#E8C547] opacity-40" />
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-12 uppercase"
                >
                  PRIVACY <br/>
                  <span className="opacity-20 italic font-serif">PROTOCOL</span>.
                </motion.h1>

                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl lg:text-2xl text-emerald-100/40 font-medium max-w-2xl leading-relaxed"
                >
                  Your trust is our most valuable asset. We are committed to transparency and the ethical stewardship of your data.
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
                                <Lock className="size-4" />
                             </div>
                             <div>
                                <h4 className="text-xs font-black uppercase tracking-widest">Secure Storage</h4>
                                <p className="text-[10px] font-medium text-emerald-100/30">AES-256 encryption standards</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-4 group">
                             <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-100 group-hover:bg-[#E8C547] group-hover:text-[#040e07] transition-all">
                                <Eye className="size-4" />
                             </div>
                             <div>
                                <h4 className="text-xs font-black uppercase tracking-widest">No Sale of Data</h4>
                                <p className="text-[10px] font-medium text-emerald-100/30">Your info stays within Sharcly</p>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Main Body */}
                 <div className="lg:col-span-8">
                    <div className="bg-white border border-primary/5 rounded-[3rem] p-8 md:p-16 min-h-[600px] privacy-embed-container">
                      <p className="text-center text-primary/40 font-bold mb-10">Managed via Termly Main Account</p>
                      <div 
                        data-name="termly-embed" 
                        data-id="4646b218-ff12-44d4-b4cc-1c2d8d805ccf" 
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
      .privacy-embed-container iframe {
        border: none !important;
        border-radius: 12px !important;
        min-height: 600px !important;
        filter: invert(0.88) hue-rotate(180deg) !important;
      }
    \`}</style>
    </>
  );
}

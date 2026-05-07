"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api-client";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, Sparkles } from "lucide-react";

export default function PrivacyPage() {
  const [content, setContent] = useState<any>({
    legal: {
      body: `At Sharcly, we consider the privacy of our community as paramount as the quality of our formulations. This Privacy Protocol outlines our commitment to the ethical stewardship of your data.\n\n1. INFORMATION HARVESTING\nWe collect data you provide explicitly—such as your identity, shipping destination, and contact details—to fulfill orders and provide bespoke support. Minimal technical metadata is collected to ensure the peak performance of our digital flagship.\n\n2. USAGE PROTOCOLS\nYour data is utilized strictly for transaction fulfillment, secure payment processing, and if opted-in, highly curated updates on new series launches.\n\n3. DATA SOVEREIGNTY\nWe operate on a strict no-sale policy. Your personal information has never been, and will never be, sold to third parties. Data remains within the Sharcly ecosystem, shared only with essential partners (logistics and payment gateways) required to complete your experience.\n\n4. CRYPTOGRAPHIC SECURITY\nAll data transfers are protected by industry-leading SSL/TLS encryption. Your financial information is handled by PCI-compliant processors and never touches our local servers.\n\n5. YOUR RIGHTS\nYou maintain full authority over your data. You may request access, correction, or deletion of your information at any time by contacting our privacy team at privacy@sharcly.com.`
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
                  <Badge className="bg-[#E8C547]/10 text-[#E8C547] border border-[#E8C547]/20 font-black text-[10px] uppercase tracking-[0.3em] px-6 py-2 rounded-full">Data Sovereignty</Badge>
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-12 uppercase"
                >
                  PRIVACY <br/>
                  <span className="italic font-serif text-[#E8C547]">PROTOCOL</span>.
                </motion.h1>

                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl lg:text-2xl text-white/40 font-medium max-w-2xl mx-auto leading-relaxed"
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
                    <div className="bg-white border border-primary/5 rounded-[3rem] p-8 md:p-16 min-h-[600px] text-primary/80">
                      <div className="prose prose-emerald max-w-none prose-headings:text-[#040e07] prose-headings:font-black prose-a:text-[#E8C547] prose-a:font-bold hover:prose-a:underline">
                        <div 
                          className="leading-relaxed text-lg"
                          dangerouslySetInnerHTML={{ __html: content.legal?.body || "Privacy policy content is being prepared." }}
                        />
                      </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>

    </>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { InquiriesView } from "./components/InquiriesView";
import { PricingManager } from "./components/PricingManager";
import { ClipboardList, Settings2, ShieldCheck } from "lucide-react";

export default function WholesaleDashboard() {
  const [activeTab, setActiveTab] = useState("inquiries");

  return (
    <div className="min-h-screen bg-[#f0f9f0] selection:bg-[#0d2719]/10 selection:text-[#0d2719]">
      <div className="container mx-auto px-6 pt-32 pb-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-[#0d2719] rounded-xl flex items-center justify-center shadow-lg shadow-[#0d2719]/20">
                  <ShieldCheck className="text-emerald-400 h-6 w-6" />
                </div>
                <h1 className="text-sm font-black uppercase tracking-[0.3em] text-[#0d2719]/40">Manager Panel</h1>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif text-[#0d2719]">Wholesale Management</h2>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList className="bg-[#0d2719]/5 p-1.5 h-14 rounded-2xl border border-[#0d2719]/10">
                <TabsTrigger 
                  value="inquiries" 
                  className="rounded-xl px-8 h-full font-bold uppercase tracking-widest text-[10px] data-[state=active]:bg-[#0d2719] data-[state=active]:text-white transition-all duration-300"
                >
                  <ClipboardList className="w-4 h-4 mr-2" /> View Inquiries
                </TabsTrigger>
                <TabsTrigger 
                  value="plans" 
                  className="rounded-xl px-8 h-full font-bold uppercase tracking-widest text-[10px] data-[state=active]:bg-[#0d2719] data-[state=active]:text-white transition-all duration-300"
                >
                  <Settings2 className="w-4 h-4 mr-2" /> Manage Tiers
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Content Area */}
          <div className="min-h-[600px]">
            <AnimatePresence mode="wait">
              {activeTab === "inquiries" ? (
                <motion.div
                  key="inquiries"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <InquiriesView />
                </motion.div>
              ) : (
                <motion.div
                  key="plans"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <PricingManager />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

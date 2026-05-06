"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { InquiriesView } from "./components/InquiriesView";
import { PlansManagement } from "./components/PlansManagement";
import { ContentManagement } from "./components/ContentManagement";
import { ShieldCheck, Briefcase, ClipboardList, Layers, Layout } from "lucide-react";

export default function WholesaleDashboard() {
  const [activeTab, setActiveTab] = useState<"inquiries" | "plans" | "content">("inquiries");

  return (
    <div className="min-h-screen bg-neutral-50/50 selection:bg-emerald-500/10 selection:text-emerald-900">
      <div className="container mx-auto px-6 py-12 max-w-[1600px]">
        <div className="space-y-10">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-3 mb-1">
                <div className="size-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-600/20">
                  <Briefcase className="text-white h-4 w-4" />
                </div>
                <h1 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Wholesale Center</h1>
              </div>
              <h2 className="text-2xl font-black tracking-tight text-neutral-900">
                {activeTab === "inquiries" ? "Partner Inquiries" : activeTab === "plans" ? "Pricing Plans" : "Page Content"}
              </h2>
              <p className="text-neutral-500 font-medium text-xs">
                {activeTab === "inquiries" 
                  ? "Manage your wholesale partnership requests and business leads." 
                  : activeTab === "plans"
                    ? "Control the partnership tiers and benefits shown on the public website."
                    : "Edit the text content, headlines, and testimonials on the public wholesale page."}
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex p-1 bg-neutral-100 rounded-2xl border border-neutral-200/50 self-start lg:self-center">
               <button 
                 onClick={() => setActiveTab("inquiries")}
                 className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                   activeTab === "inquiries" 
                     ? "bg-white text-neutral-900 shadow-xl shadow-black/5" 
                     : "text-neutral-400 hover:text-neutral-600"
                 }`}
               >
                  <ClipboardList className="size-3.5" /> Inquiries
               </button>
               <button 
                 onClick={() => setActiveTab("plans")}
                 className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                   activeTab === "plans" 
                     ? "bg-white text-neutral-900 shadow-xl shadow-black/5" 
                     : "text-neutral-400 hover:text-neutral-600"
                 }`}
               >
                  <Layers className="size-3.5" /> Pricing Plans
               </button>
               <button 
                 onClick={() => setActiveTab("content")}
                 className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                   activeTab === "content" 
                     ? "bg-white text-neutral-900 shadow-xl shadow-black/5" 
                     : "text-neutral-400 hover:text-neutral-600"
                 }`}
               >
                  <Layout className="size-3.5" /> Content
               </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="min-h-[600px]">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {activeTab === "inquiries" && <InquiriesView />}
              {activeTab === "plans" && <PlansManagement />}
              {activeTab === "content" && <ContentManagement />}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

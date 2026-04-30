"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Calendar, Clock, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";

export function GreetingSection() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Aura Morning";
    if (hour < 17) return "Golden Hours";
    return "Obsidian Evening";
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="relative overflow-hidden rounded-[4rem] bg-white/[0.01] p-12 md:p-20 shadow-3xl hairline-border group">
      {/* Premium Background Decors */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[700px] h-[700px] bg-accent/5 rounded-full blur-[160px] pointer-events-none group-hover:scale-110 transition-transform duration-[5s]" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-accent/[0.02] rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-20">
        <div className="space-y-10 flex-1">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-5 px-6 py-3 rounded-full bg-white/5 backdrop-blur-3xl border border-white/5 text-accent text-[10px] font-bold uppercase tracking-[0.4em]"
          >
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent shadow-[0_0_12px_rgba(197,160,89,1)]"></span>
            </div>
            <span>Core Integrity Nominal • Authorized Access</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <h1 className="text-6xl md:text-9xl font-heading font-normal text-foreground tracking-tight leading-[0.85]">
               <span className="opacity-20 italic font-extralight">{getGreeting()},</span><br className="md:hidden" />
               <span className="text-foreground ml-2 md:ml-8">{user?.name?.split(' ')[0]}.</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary/40 leading-relaxed font-body italic max-w-3xl">
              Your Sharcly Dashboard is synchronized with your personalized wellness routine. <span className="text-primary italic font-medium">Balance is flowing through all nodes today.</span>
            </p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-8 min-w-[380px]"
        >
          <div className="p-10 rounded-[3rem] bg-white/[0.01] hairline-border flex flex-col gap-10 shadow-2xl relative overflow-hidden group/box transition-all duration-700 hover:bg-white/[0.02]">
             <div className="absolute inset-0 shimmer opacity-5" />
             <div className="flex items-center gap-8 relative z-10">
                <div className="h-16 w-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center border border-white/5 shadow-xl group-hover/box:border-accent/30 transition-all duration-500">
                   <Calendar className="h-7 w-7 text-accent/40 group-hover/box:text-accent transition-colors" />
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent/20">Solar Cycle</span>
                   <span className="text-xl font-heading text-foreground mt-3 tracking-tight">{formatDate(currentTime)}</span>
                </div>
             </div>
             
             <div className="h-px bg-white/[0.03] w-full" />
             
             <div className="flex items-center gap-8 relative z-10">
                <div className="h-16 w-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center border border-white/5 shadow-xl group-hover/box:border-accent/30 transition-all duration-500">
                   <Clock className="h-7 w-7 text-accent/40 group-hover/box:text-accent transition-colors" />
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent/20">Latent Synchrony</span>
                   <span className="text-xl font-heading text-foreground mt-3 tracking-tight">Verified 24.8ms Pulse</span>
                </div>
             </div>
          </div>
          
          <Button className="h-20 rounded-full bg-accent text-accent-foreground hover:scale-[1.03] active:scale-[0.97] border-none font-bold text-[12px] uppercase tracking-[0.3em] gap-6 group shadow-3xl shadow-accent/20 transition-all duration-500">
             Initiate Neural Audit <ArrowRight className="h-5 w-5 group-hover:translate-x-4 transition-transform duration-700" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

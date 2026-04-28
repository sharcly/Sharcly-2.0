"use client";

import { motion } from "framer-motion";

export function AnnouncementBar() {
  return (
    <div className="announcement-bar bg-[#062D1B] text-white h-10 px-6 md:px-12 relative z-[60] flex items-center justify-center overflow-hidden">
      <div className="flex items-center gap-12 text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap">
        <span className="flex items-center gap-2">
           Free Shipping on Orders Over $150
        </span>
        <span className="hidden md:block opacity-20">/</span>
        <span className="hidden md:block">
           Elite Member Early Access is Live
        </span>
        <span className="hidden md:block opacity-20">/</span>
        <span className="hidden md:block">
           30-Day Effortless Returns
        </span>
      </div>
    </div>
  );
}

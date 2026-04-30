"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  separator?: React.ReactNode;
  speed?: number;
  className?: string;
  itemClassName?: string;
}

export const Marquee: React.FC<MarqueeProps> = ({ 
  items, 
  separator = <span className="mx-12 opacity-30">✦</span>,
  speed = 40,
  className = "",
  itemClassName = ""
}) => {
  const content = (
    <>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <span className={cn("whitespace-nowrap inline-block", itemClassName)}>
            {item}
          </span>
          {separator}
        </React.Fragment>
      ))}
    </>
  );

  return (
    <div className={cn("relative flex overflow-x-hidden select-none py-6", className)}>
      <div 
        className="animate-marquee whitespace-nowrap flex items-center shrink-0" 
        style={{ animationDuration: `${speed}s` }}
      >
        {content}
        {content}
      </div>

      <div 
        className="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center h-full shrink-0" 
        style={{ animationDuration: `${speed}s` }}
      >
        {content}
        {content}
      </div>
    </div>
  );
};

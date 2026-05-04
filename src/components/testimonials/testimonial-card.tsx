"use client";

import React from "react";
import { motion } from "framer-motion";
import { StarRating } from "./star-rating";

export interface Testimonial {
  id?: string;
  name: string;
  role: string;
  company?: string | null;
  message: string;
  rating: number;
  image?: string | null;
  featured: boolean;
  createdAt?: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
}

export const TestimonialCard = ({ testimonial, index }: TestimonialCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ 
        y: -10, 
        boxShadow: "0 20px 40px -15px rgba(232, 197, 71, 0.15)",
        borderColor: "rgba(232, 197, 71, 0.3)"
      }}
      className="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-white/10 flex flex-col justify-between h-full transition-all duration-500 group"
    >
      <div>
        <div className="flex justify-between items-start mb-5">
          <StarRating rating={testimonial.rating} />
          {testimonial.featured && (
            <div className="bg-[#E8C547]/10 text-[#E8C547] text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full border border-[#E8C547]/20">
              Verified Experience
            </div>
          )}
        </div>
        
        <blockquote className="text-white/90 text-[16px] leading-relaxed font-medium mb-8">
          "{testimonial.message}"
        </blockquote>
      </div>
      
      <div className="flex items-center gap-3 pt-6 border-t border-white/5">
        {testimonial.image ? (
          <img 
            src={testimonial.image} 
            alt={testimonial.name} 
            className="w-12 h-12 rounded-full object-cover border-2 border-[#E8C547]/20" 
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-[#E8C547]/10 flex items-center justify-center text-[#E8C547] font-bold text-lg">
            {testimonial.name.charAt(0)}
          </div>
        )}
        <div className="flex flex-col">
          <cite className="not-italic font-bold text-white text-base">
            {testimonial.name}
          </cite>
          <span className="text-sm text-white/40 font-medium">
            {testimonial.role}{testimonial.company ? ` • ${testimonial.company}` : ''}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

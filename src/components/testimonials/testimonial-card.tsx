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
        y: -5, 
        boxShadow: "0 20px 40px -15px rgba(13, 39, 25, 0.1)",
        borderColor: "rgba(13, 39, 25, 0.1)"
      }}
      className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-transparent flex flex-col justify-between h-full transition-all duration-300"
    >
      <div>
        <div className="flex justify-between items-start mb-5">
          <StarRating rating={testimonial.rating} />
          {testimonial.featured && (
            <div className="bg-[#f0f9f0] text-[#0d2719] text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full border border-[#0d2719]/10">
              Verified Experience
            </div>
          )}
        </div>
        
        <blockquote className="text-[#0d2719] text-[15px] leading-relaxed font-medium mb-6">
          "{testimonial.message}"
        </blockquote>
      </div>
      
      <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
        {testimonial.image ? (
          <img 
            src={testimonial.image} 
            alt={testimonial.name} 
            className="w-10 h-10 rounded-full object-cover border-2 border-[#f0f9f0]" 
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[#f0f9f0] flex items-center justify-center text-[#0d2719] font-bold text-base">
            {testimonial.name.charAt(0)}
          </div>
        )}
        <div className="flex flex-col">
          <cite className="not-italic font-bold text-[#0d2719] text-base">
            {testimonial.name}
          </cite>
          <span className="text-sm text-gray-500 font-medium">
            {testimonial.role}{testimonial.company ? ` • ${testimonial.company}` : ''}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

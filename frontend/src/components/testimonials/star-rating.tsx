"use client";

import React from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
}

export const StarRating = ({ rating }: StarRatingProps) => {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => {
        // Calculate the fill percentage for each star
        // 1 means full, 0 means empty, 0.x means partial
        const fillPercentage = Math.max(0, Math.min(1, rating - i));
        
        return (
          <div key={i} className="relative w-4 h-4">
            {/* Background star (empty) */}
            <Star size={16} className="text-gray-200" />
            
            {/* Foreground star (filled) with clip-path/width */}
            <div 
              className="absolute inset-0 overflow-hidden" 
              style={{ width: `${fillPercentage * 100}%` }}
            >
              <Star size={16} className="fill-[#0d2719] text-[#0d2719]" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

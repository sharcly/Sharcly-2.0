"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TestimonialCard, Testimonial } from "./testimonial-card";

// Fallback data as requested
const formattedCustomerReviews: Testimonial[] = [
  { name: "Sarah M.", role: "Customer", company: "Austin, TX", message: "I've tried a lot of CBD products and nothing compares. My sleep has genuinely improved and I feel so much calmer throughout the day.", rating: 5, featured: true },
  { name: "James R.", role: "Customer", company: "Denver, CO", message: "The Focus series is a game changer. Clean energy, no jitters. I use it every morning before my workouts and feel locked in.", rating: 4.1, featured: false },
  { name: "Priya L.", role: "Customer", company: "Seattle, WA", message: "I love that everything is lab tested and organic. I feel confident knowing exactly what's in every gummy. Highly recommend the Chill series.", rating: 5, featured: true },
  { name: "Marcus K.", role: "Customer", company: "Miami, FL", message: "Great flavor on the Delta-8 gummies. Took a bit longer to kick in than expected, but the relaxation was worth the wait.", rating: 4.8, featured: false },
  { name: "Elena G.", role: "Customer", company: "Portland, OR", message: "Finally found a night routine that works. No grogginess the next morning, just pure restful sleep. Sharcly is the real deal.", rating: 4.3, featured: false },
  { name: "David T.", role: "Customer", company: "Nashville, TN", message: "The Balance series helps a lot with my post-run recovery. Shipping took an extra day, but the product quality is top-tier.", rating: 4, featured: false },
  { name: "Sophie W.", role: "Customer", company: "San Diego, CA", message: "The branding is beautiful but the results are better. The THCP blend is perfect for weekend hiking trips. Truly elevated.", rating: 5, featured: true }
];

// This ensures the API is only called once per session
let testimonialsCache: Testimonial[] | null = null;
let isFetchingTestimonials = false;
const testimonialListeners: Array<(data: Testimonial[]) => void> = [];

interface TestimonialsSectionProps {
  featuredOnly?: boolean;
  limit?: number;
}

export const TestimonialsSection = ({ featuredOnly = false, limit }: TestimonialsSectionProps) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(testimonialsCache || []);
  const [isLoading, setIsLoading] = useState(!testimonialsCache);

  // Embla setup with faster Autoplay for a smooth "scrolling" feel
  const autoplay = React.useMemo(() => Autoplay({
    delay: 4000,
    stopOnInteraction: false,
    stopOnMouseEnter: true
  }), []);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      loop: true,
      skipSnaps: false,
      dragFree: true
    },
    [autoplay]
  );

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  useEffect(() => {
    // 1. If we already have cached data, use it immediately
    if (testimonialsCache) {
      setTestimonials(testimonialsCache);
      setIsLoading(false);
      return;
    }

    // 2. If another instance is already fetching, subscribe to its completion
    if (isFetchingTestimonials) {
      const listener = (data: Testimonial[]) => {
        setTestimonials(data);
        setIsLoading(false);
      };
      testimonialListeners.push(listener);
      return () => {
        const index = testimonialListeners.indexOf(listener);
        if (index > -1) testimonialListeners.splice(index, 1);
      };
    }

    // 3. Otherwise, perform the fetch
    const fetchTestimonials = async () => {
      isFetchingTestimonials = true;
      try {
        // Fetch all testimonials once to populate the cache
        // Filtering is done locally in displayData
        const response = await fetch('/api/testimonials');

        // Check if response is ok and is JSON
        const contentType = response.headers.get("content-type");
        if (!response.ok || !contentType || !contentType.includes("application/json")) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();

        const fetchedData = (result.success && result.data && result.data.length > 0)
          ? result.data
          : formattedCustomerReviews;

        // Update cache and state
        testimonialsCache = fetchedData;
        setTestimonials(fetchedData);

        // Notify any other components waiting for this data
        testimonialListeners.forEach(listener => listener(fetchedData));
        testimonialListeners.length = 0;
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        // Fallback to hardcoded data on error and cache it too
        testimonialsCache = formattedCustomerReviews;
        setTestimonials(formattedCustomerReviews);
        testimonialListeners.forEach(listener => listener(formattedCustomerReviews));
        testimonialListeners.length = 0;
      } finally {
        setIsLoading(false);
        isFetchingTestimonials = false;
      }
    };

    fetchTestimonials();
  }, []); // Run once on mount to populate the global cache

  const displayData = useMemo(() => {
    return testimonials
      .filter(t => !featuredOnly || t.featured)
      .sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0;
      })
      .slice(0, limit || testimonials.length);
  }, [testimonials, featuredOnly, limit]);

  return (
    <section
      className="px-6 md:px-12 overflow-hidden flex flex-col justify-center items-center relative"
      style={{ 
        minHeight: 'calc(100vh - 72px)', 
        padding: '80px 24px',
        background: "linear-gradient(160deg, #040e07 0%, #082f1d 50%, #040e07 100%)",
        color: "#eff8ee"
      }}
    >
      {/* grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      {/* gold glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "800px",
          height: "400px",
          background:
            "radial-gradient(ellipse, rgba(232,197,71,0.08), transparent 65%)",
          pointerEvents: "none",
        }}
      />
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-end mb-8 gap-8">
          <div className="text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 mb-6 bg-white/5 rounded-full border border-[#E8C547]/20 backdrop-blur-sm"
            >
              <span className="text-[#E8C547] text-xs font-bold uppercase tracking-widest">
                Community Voices
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-5xl font-bold text-white mb-0 tracking-tight leading-[1.1] font-serif"
            >
              Shared Success <br className="hidden md:block" /> 
              <span style={{ fontStyle: "italic", color: "#E8C547" }}>with Sharcly.</span>
            </motion.h2>
          </div>

          <div className="flex gap-3 mb-2">
            <button
              onClick={scrollPrev}
              aria-label="Previous testimonial"
              className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-[#E8C547] hover:text-[#082f1d] hover:border-transparent transition-all duration-300 active:scale-95 group"
            >
              <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={scrollNext}
              aria-label="Next testimonial"
              className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-[#E8C547] hover:text-[#082f1d] hover:border-transparent transition-all duration-300 active:scale-95 group"
            >
              <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </header>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="w-12 h-12 border-4 border-[#0d2719]/10 border-t-[#0d2719] rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="embla cursor-grab active:cursor-grabbing" ref={emblaRef}>
            <div className="embla__container flex gap-6">
              {displayData.map((testimonial, index) => (
                <div
                  key={testimonial.id || `fallback-${index}`}
                  className="embla__slide flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0"
                >
                  <div className="h-full py-4 px-1">
                    <TestimonialCard
                      testimonial={testimonial}
                      index={index}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <button className="bg-[#E8C547] text-[#082f1d] px-10 py-4 rounded-full font-bold text-base hover:opacity-90 transition-all duration-300 shadow-xl shadow-[#E8C547]/20 active:scale-95 uppercase tracking-wider">
            Read All Reviews
          </button>
        </motion.div>
      </div>
    </section>
  );
};

"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
   ArrowRight,
   ShieldCheck,
   FlaskConical,
   Trees,
   Scale
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { apiClient } from "@/lib/api-client";
import { Marquee } from "@/components/marquee";
import { ProductCard } from "@/components/product-card";
import { motion } from "framer-motion";
import { useSeo } from "@/hooks/use-seo";
import { TestimonialsSection } from "@/components/testimonials";
import { TrustLoyaltySection } from "@/components/trust-loyalty-section";
import { ShopBySeries } from "@/components/shop-by-series";
import ProcessStorySection from "@/components/ProcessStorySection";
import { FinalCTA } from "@/components/final-cta";
import { FeaturedProductsSection } from "@/components/sections/featured-products-section";
const MOCK_PRODUCTS = [
   {
      id: "p1",
      name: "Chill Series Gummies",
      slug: "chill-series-gummies",
      price: 45.00,
      category: { name: "Relaxation" },
      images: [{ id: "i1", url: "https://i.postimg.cc/T3qHks4z/Sharcly-Chill-Collection.jpg" }]
   },
   {
      id: "p2",
      name: "Lift Series Vapes",
      slug: "lift-series-vapes",
      price: 65.00,
      category: { name: "Energy" },
      images: [{ id: "i2", url: "https://i.postimg.cc/9F7Kz7H4/Sharcly-Lift-Series.jpg" }]
   },
   {
      id: "p3",
      name: "Sleep Series Tincture",
      slug: "sleep-series-tincture",
      price: 55.00,
      category: { name: "Recovery" },
      images: [{ id: "i3", url: "https://i.postimg.cc/vHgY9D41/Daytime-Clarity.jpg" }]
   },
   {
      id: "p4",
      name: "Balance Series Softgels",
      slug: "balance-series-softgels",
      price: 60.00,
      category: { name: "Daily" },
      images: [{ id: "i4", url: "https://i.postimg.cc/K8nwpV4T/Premium-Hemp-Essentials-Sharcly.jpg" }]
   }
];

import { HeroSection } from "@/components/hero-section";

export default function Home() {
   useSeo("home");

   const [cmsContent, setCmsContent] = useState<any>(null);

   useEffect(() => {
     const fetchContent = async () => {
       try {
         const res = await apiClient.get("/cms/home");
         if (res.data && res.data.content) {
            setCmsContent(res.data.content);
         }
       } catch (err) {
         console.error("Failed to fetch home cms content", err);
       }
     };
     fetchContent();
   }, []);

   let heroDynamicData = null;
   let seriesDynamicData = null;

   if (cmsContent?.hero?.json_data) {
     try {
       heroDynamicData = JSON.parse(cmsContent.hero.json_data);
     } catch (e) {
       console.error("Failed to parse hero json_data", e);
     }
   }

   if (cmsContent?.series?.json_data) {
     try {
       seriesDynamicData = JSON.parse(cmsContent.series.json_data);
     } catch (e) {
       console.error("Failed to parse series json_data", e);
     }
   }

   return (
      <div className="min-h-screen bg-white text-[#062D1B] flex flex-col font-sans antialiased selection:bg-[#062D1B] selection:text-white">
         <AnnouncementBar />
         <Navbar />

         <main className="flex-1">
            <HeroSection dynamicData={heroDynamicData} />

            {/* Featured Products Section */}
            <FeaturedProductsSection />

            {/* Shop By Series - Premium Luxury Grid */}
            <ShopBySeries dynamicData={seriesDynamicData} />


            {/* Modular Info Section */}
            <section
               style={{
                  position: "relative",
                  padding: "120px 0",
                  background:
                     "linear-gradient(180deg, #040e07 0%, #051a10 40%, #082f1d 70%, #051a10 100%)",
                  overflow: "hidden",
                  color: "#eff8ee",
               }}
            >
               {/* dot grid */}
               <div
                  style={{
                     position: "absolute",
                     inset: 0,
                     backgroundImage:
                        "radial-gradient(circle, rgba(239,248,238,0.05) 1px, transparent 1px)",
                     backgroundSize: "36px 36px",
                     pointerEvents: "none",
                  }}
               />

               <div
                  style={{
                     maxWidth: "1200px",
                     margin: "0 auto",
                     padding: "0 24px",
                     display: "grid",
                     gridTemplateColumns: "1fr 1fr",
                     gap: "80px",
                     alignItems: "center",
                     position: "relative",
                     zIndex: 2,
                  }}
               >
                  {/* LEFT */}
                  <div>
                     {/* label */}
                     <div
                        style={{
                           display: "flex",
                           alignItems: "center",
                           gap: "10px",
                           fontSize: "10px",
                           letterSpacing: "0.2em",
                           textTransform: "uppercase",
                           color: "#E8C547",
                           marginBottom: "20px",
                        }}
                     >
                        <span style={{ width: "24px", height: "1px", background: "#E8C547" }} />
                        Radical Transparency
                     </div>

                     {/* headline */}
                     <h2
                        style={{
                           fontFamily: "serif",
                           fontSize: "clamp(36px, 4vw, 58px)",
                           lineHeight: 1.1,
                           marginBottom: "24px",
                        }}
                     >
                        Rooted in <br />
                        <span style={{ color: "#E8C547", fontStyle: "italic" }}>
                           radical
                        </span>{" "}
                        <br />
                        transparency.
                     </h2>

                     {/* body */}
                     <p
                        style={{
                           fontSize: "15px",
                           lineHeight: 1.8,
                           color: "rgba(239,248,238,0.6)",
                           maxWidth: "420px",
                           marginBottom: "30px",
                        }}
                     >
                        We believe you should know exactly what you are putting into your body.
                        That is why we provide full, third-party lab results for every single
                        batch of Sharcly products ever produced.
                     </p>

                     {/* stats */}
                     <div
                        style={{
                           display: "flex",
                           gap: "30px",
                           padding: "20px 0",
                           borderTop: "1px solid rgba(239,248,238,0.08)",
                           borderBottom: "1px solid rgba(239,248,238,0.08)",
                           marginBottom: "30px",
                        }}
                     >
                        <div>
                           <div
                              style={{
                                 fontFamily: "serif",
                                 fontSize: "30px",
                                 color: "#E8C547",
                              }}
                           >
                              100%
                           </div>
                           <div style={{ fontSize: "11px", color: "rgba(239,248,238,0.5)" }}>
                              Batches Lab Tested
                           </div>
                        </div>

                        <div>
                           <div
                              style={{
                                 fontFamily: "serif",
                                 fontSize: "30px",
                                 color: "#E8C547",
                              }}
                           >
                              3rd
                           </div>
                           <div style={{ fontSize: "11px", color: "rgba(239,248,238,0.5)" }}>
                              Party Verified
                           </div>
                        </div>

                        <div>
                           <div
                              style={{
                                 fontFamily: "serif",
                                 fontSize: "30px",
                                 color: "#E8C547",
                              }}
                           >
                              0
                           </div>
                           <div style={{ fontSize: "11px", color: "rgba(239,248,238,0.5)" }}>
                              Hidden Ingredients
                           </div>
                        </div>
                     </div>

                     {/* button */}
                     <button
                        style={{
                           padding: "14px 28px",
                           borderRadius: "999px",
                           border: "1px solid rgba(239,248,238,0.2)",
                           background: "transparent",
                           color: "#eff8ee",
                           fontSize: "12px",
                           letterSpacing: "0.12em",
                           textTransform: "uppercase",
                           cursor: "pointer",
                        }}
                     >
                        Access Lab Results →
                     </button>
                  </div>

                  {/* RIGHT IMAGE */}
                  <div style={{ position: "relative" }}>
                     <div
                        style={{
                           borderRadius: "24px",
                           overflow: "hidden",
                           border: "1px solid rgba(239,248,238,0.08)",
                           boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
                           aspectRatio: "1.1/1",
                           background: "#0a1f12",
                        }}
                     >
                        <img
                           src="https://i.postimg.cc/Y2hVpsDp/Sharcy-wellness-products-in-nature-setting.jpg"
                           alt="Science to Nature"
                           style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              filter: "brightness(0.9) saturate(1.1)",
                           }}
                        />
                     </div>
                  </div>
               </div>
            </section>

            {/* Community Trust & Loyalty */}
            <TrustLoyaltySection />
            {/* Process Story Section */}
            <ProcessStorySection />



            {/* Community Feedback */}
            <TestimonialsSection />

            {/* Minimal Final CTA */}
            <FinalCTA />
         </main>

         <Footer />
      </div>
   );
}

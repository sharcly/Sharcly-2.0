"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { WholesaleForm } from "@/components/wholesale-form";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  TrendingUp, 
  ChevronRight,
  Package,
  Layers,
  Zap,
  Star
} from "lucide-react";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSeo } from "@/hooks/use-seo";
import { apiClient } from "@/lib/api-client";

const HARDCODED_TIERS = [
  {
    name: "Retailer",
    minOrder: "$500",
    discount: "20% off",
    features: [
      "Net 30 payment terms",
      "Branded display materials",
      "Product education resources",
      "Dedicated account rep"
    ],
    featured: false
  },
  {
    name: "Distributor",
    minOrder: "$2,500",
    discount: "35% off",
    features: [
      "Net 60 payment terms",
      "Co-branded marketing assets",
      "Priority inventory allocation",
      "Quarterly in-person support",
      "White-label options available"
    ],
    featured: true
  },
  {
    name: "Enterprise",
    minOrder: "Custom",
    discount: "Custom pricing",
    features: [
      "Custom formulation",
      "Private label / white label",
      "Exclusive territory rights",
      "Dedicated logistics support",
      "Custom compliance documentation"
    ],
    featured: false
  }
];

export default function WholesalePage() {
  useSeo("wholesale");
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);

  useEffect(() => {
    async function fetchPlans() {
      try {
        const response = await apiClient.get("/wholesale/plans");
        const { success, data } = response.data;
        if (success && data && data.length > 0) {
          setPlans(data);
        } else {
          setPlans(HARDCODED_TIERS);
        }
      } catch (error) {
        console.error("Failed to fetch plans:", error);
        setPlans(HARDCODED_TIERS);
      } finally {
        setIsLoadingPlans(false);
      }
    }
    fetchPlans();
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased selection:bg-[#E8C547] selection:text-[#082f1d]" style={{ background: "linear-gradient(160deg, #040e07 0%, #082f1d 50%, #040e07 100%)", color: "#eff8ee" }}>
      {/* Background Elements */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle at center, rgba(232,197,71,0.05) 0%, transparent 70%)",
        }}
      />
      <Navbar />
      
      <main>
        {/* 1. HERO SECTION */}
        <section className="relative pt-32 pb-24 md:pt-48 md:pb-40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent -z-10" />
          
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full mb-8 border border-white/10"
              >
                <span className="w-2 h-2 rounded-full bg-[#E8C547] animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">B2B Partnership</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-6xl md:text-8xl font-serif text-white leading-[1.1] mb-8"
              >
                Partner With Us
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl md:text-2xl text-white/60 font-medium max-w-2xl mx-auto mb-12 leading-relaxed"
              >
                Premium wellness products for modern retailers. Join our global network and elevate your customer experience.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-6"
              >
                <Button 
                  size="lg" 
                  className="h-16 px-12 bg-[#E8C547] hover:bg-[#E8C547]/90 text-[#082f1d] font-bold text-sm uppercase tracking-widest rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/20"
                  onClick={() => document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="h-16 px-12 border-2 border-white/10 text-white hover:bg-white/5 font-bold text-sm uppercase tracking-widest rounded-2xl transition-all"
                  onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  View Pricing
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 2. BENEFITS SECTION */}
        <section className="py-32">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "High Margins",
                  desc: "Optimized wholesale pricing to maximize your retail profitability.",
                  icon: TrendingUp
                },
                {
                  title: "Fast Logistics",
                  desc: "Global shipping network ensuring reliable inventory management.",
                  icon: Truck
                },
                {
                  title: "Clean Design",
                  desc: "Award-winning packaging that resonates with premium shoppers.",
                  icon: Layers
                },
                {
                  title: "Certified Purity",
                  desc: "Comprehensive lab testing and COAs for total transparency.",
                  icon: ShieldCheck
                }
              ].map((benefit, i) => (
                <motion.div
                  key={i}
                  {...fadeIn}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="p-10 bg-white/[0.03] rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-white/10 group"
                >
                  <div className="h-14 w-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#E8C547] transition-colors duration-500">
                    <benefit.icon className="h-6 w-6 text-white group-hover:text-[#082f1d] transition-colors duration-500" />
                  </div>
                  <h3 className="text-2xl font-serif text-white mb-4">{benefit.title}</h3>
                  <p className="text-white/60 font-medium leading-relaxed">{benefit.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. PRICING TIERS */}
        <section id="pricing" className="py-32">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-5xl md:text-7xl font-serif text-white mb-8">Wholesale Tiers</h2>
              <p className="text-xl text-white/60 font-medium italic">Flexible options designed for every stage of your business growth.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              {isLoadingPlans ? (
                // Skeleton Loading State
                [1, 2, 3].map((i) => (
                  <div key={i} className="p-10 rounded-[3rem] border border-[#0d2719]/5 bg-white space-y-6">
                    <Skeleton className="h-8 w-32 bg-[#0d2719]/5" />
                    <Skeleton className="h-12 w-24 bg-[#0d2719]/5" />
                    <div className="space-y-4">
                      <Skeleton className="h-4 w-full bg-[#0d2719]/5" />
                      <Skeleton className="h-4 w-full bg-[#0d2719]/5" />
                      <Skeleton className="h-4 w-[80%] bg-[#0d2719]/5" />
                    </div>
                    <Skeleton className="h-14 w-full rounded-2xl bg-[#0d2719]/5 mt-auto" />
                  </div>
                ))
              ) : (
                plans.map((tier, i) => (
                  <motion.div
                    key={tier.name}
                    {...fadeIn}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    whileHover={{ y: -12 }}
                    className={`relative p-10 rounded-[3rem] border flex flex-col transition-all duration-500 ${
                      tier.featured 
                        ? 'bg-[#E8C547] border-[#E8C547] shadow-2xl shadow-black/20 z-10 scale-105' 
                        : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.05]'
                    }`}
                  >
                    {tier.featured && (
                      <Badge className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-[#082f1d] border-none font-black uppercase tracking-[0.2em] px-6 py-2 rounded-full text-[10px] shadow-lg">
                        <Star className="w-3 h-3 mr-2 inline" /> Most Popular
                      </Badge>
                    )}

                    <div className="mb-10">
                      <h3 className={`text-3xl font-serif mb-2 ${tier.featured ? 'text-[#082f1d]' : 'text-white'}`}>
                        {tier.name}
                      </h3>
                      <div className="flex items-baseline gap-2">
                         <span className={`text-4xl font-serif ${tier.featured ? 'text-[#082f1d]' : 'text-[#E8C547]'}`}>{tier.discount}</span>
                      </div>
                      <p className={`text-xs font-bold uppercase tracking-widest mt-2 ${tier.featured ? 'text-[#082f1d]/40' : 'text-white/40'}`}>
                        Min. Order: {tier.minOrder}
                      </p>
                    </div>

                    <div className="space-y-4 mb-12 flex-1">
                      {(Array.isArray(tier.features) ? tier.features : []).map((feature: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className={`h-5 w-5 shrink-0 ${tier.featured ? 'text-[#082f1d]' : 'text-[#E8C547]'}`} />
                          <span className={`text-sm font-medium leading-relaxed ${tier.featured ? 'text-[#082f1d]/80' : 'text-white/70'}`}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Button 
                      className={`w-full h-14 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all ${
                        tier.featured 
                          ? 'bg-[#082f1d] hover:bg-[#082f1d]/90 text-white' 
                          : 'bg-[#E8C547] hover:bg-[#E8C547]/90 text-[#082f1d]'
                      }`}
                      onClick={() => document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      Select {tier.name}
                    </Button>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* 4. PRODUCT PREVIEW */}
        <section className="py-32">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
              <div className="max-w-2xl">
                <h2 className="text-5xl md:text-6xl font-serif text-white mb-6">Best-Sellers</h2>
                <p className="text-lg text-white/60 font-medium">Ready-to-ship premium wellness products with high consumer demand.</p>
              </div>
              <Button variant="link" className="text-[#E8C547] font-bold uppercase tracking-widest text-xs h-auto p-0 group">
                Browse Full Catalog <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[1, 2, 3].map((item) => (
                <motion.div
                  key={item}
                  {...fadeIn}
                  transition={{ duration: 0.6, delay: item * 0.1 }}
                  className="bg-white/[0.03] rounded-[2.5rem] p-6 border border-white/10 group cursor-pointer shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="relative aspect-[4/5] bg-white/5 rounded-[1.5rem] overflow-hidden mb-8">
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="w-full h-full flex items-center justify-center text-white/5 font-serif text-5xl italic font-black">
                      {item === 1 ? 'RELAX' : item === 2 ? 'FOCUS' : 'VITAL'}
                    </div>
                  </div>
                  <div className="px-2">
                    <h4 className="text-2xl font-serif text-white mb-1">Premium Hemp Blend</h4>
                    <p className="text-xs font-black text-white/30 uppercase tracking-[0.2em] mb-6">Limited Batch Edition</p>
                    <div className="flex items-center justify-between pt-6 border-t border-white/10">
                      <span className="text-white font-serif text-xl italic opacity-60">MSRP $49.00</span>
                      <div className="h-12 w-12 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-[#E8C547] transition-colors duration-500 shadow-sm">
                        <ArrowRight className="h-5 w-5 text-white group-hover:text-[#082f1d] transition-colors duration-500" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. HOW IT WORKS */}
        <section className="py-32">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-6xl font-serif text-white mb-20">Seamless Integration</h2>
            
            <div className="relative max-w-5xl mx-auto">
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -translate-y-1/2 hidden md:block" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-20 relative">
                {[
                  { step: "01", title: "Apply", desc: "Submit your business details via our B2B form." },
                  { step: "02", title: "Approval", desc: "Our team validates your credentials within 24h." },
                  { step: "03", title: "Order", desc: "Gain instant access to wholesale pricing & portal." }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    {...fadeIn}
                    transition={{ duration: 0.6, delay: i * 0.2 }}
                    className="relative z-10"
                  >
                    <div className="w-20 h-20 bg-[#E8C547] text-[#082f1d] rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-10 shadow-2xl shadow-black/30">
                      {item.step}
                    </div>
                    <h3 className="text-2xl font-serif text-white mb-4">{item.title}</h3>
                    <p className="text-white/60 font-medium max-w-[200px] mx-auto">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 6. FORM SECTION */}
        <section id="apply-form" className="py-32 relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#E8C547]/10 rounded-full blur-[150px] -translate-y-1/2" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#E8C547]/5 rounded-full blur-[120px] translate-y-1/2" />

          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-20">
              <h2 className="text-5xl md:text-8xl font-serif text-white mb-8">Join the Network</h2>
              <p className="text-xl text-white/60 font-medium italic">Complete the application below and our retail team will contact you shortly.</p>
            </div>
            
            <WholesaleForm />
          </div>
        </section>

        {/* 7. SOCIAL PROOF */}
        <section className="py-32">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
               <motion.div {...fadeIn}>
                 <Star className="w-10 h-10 text-[#E8C547] mx-auto mb-8 opacity-20" />
                 <p className="text-3xl md:text-5xl font-serif text-white italic leading-[1.3] mb-12">
                   "Sharcly's wholesale process is as premium as their products. The dedicated support and fast shipping have made them our top partner."
                 </p>
                 <div className="flex items-center justify-center gap-6">
                    <div className="w-16 h-16 bg-white/5 rounded-full border-4 border-white/10 shadow-sm" />
                    <div className="text-left">
                       <p className="font-black text-xl text-white tracking-tight">Marcus Thorne</p>
                       <p className="text-xs font-black uppercase tracking-[0.2em] text-white/30">Director, Pure Wellness Group</p>
                    </div>
                 </div>
               </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

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
  Star,
  Leaf,
  Globe,
  Sparkles
} from "lucide-react";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSeo } from "@/hooks/use-seo";
import { apiClient } from "@/lib/api-client";

const HARDCODED_TIERS = [
  {
    name: "Retail Partner",
    minOrder: "$500",
    discount: "20% Margin",
    features: [
      "Standard payment terms",
      "Official retail signage",
      "Staff training guides",
      "Direct support line"
    ],
    featured: false
  },
  {
    name: "Growth Partner",
    minOrder: "$2,500",
    discount: "35% Margin",
    features: [
      "Extended payment window",
      "Co-branded marketing",
      "Priority shipping queue",
      "On-site support visits",
      "Custom branding options"
    ],
    featured: true
  },
  {
    name: "Enterprise",
    minOrder: "Custom",
    discount: "Bulk Rates",
    features: [
      "Custom product mixes",
      "Private label services",
      "Exclusive local rights",
      "Direct logistics link",
      "Full compliance docs"
    ],
    featured: false
  }
];

export default function WholesalePage() {
  useSeo("wholesale");
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [pageContent, setPageContent] = useState({
    heroTitle: "Grow with Sharcly.",
    heroSubtitle: "Access high-precision botanical products for your retail space. We provide the quality, you provide the experience.",
    testimonialQuote: "Sharcly doesn't just sell products; they build relationships. Their support team and product quality are second to none in this industry.",
    testimonialAuthor: "Global Retail Director",
    testimonialRole: "Pure Wellness Network"
  });

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch Plans
        const plansRes = await apiClient.get("/wholesale/plans");
        if (plansRes.data.success && plansRes.data.data?.length > 0) {
          setPlans(plansRes.data.data);
        } else {
          setPlans(HARDCODED_TIERS);
        }

        // Fetch Page Content
        const cmsRes = await apiClient.get("/cms/wholesale");
        if (cmsRes.data.success && cmsRes.data.data) {
          const data = cmsRes.data.data;
          setPageContent({
            heroTitle: data.hero?.title || pageContent.heroTitle,
            heroSubtitle: data.hero?.subtitle || pageContent.heroSubtitle,
            testimonialQuote: data.testimonial?.quote || pageContent.testimonialQuote,
            testimonialAuthor: data.testimonial?.author || pageContent.testimonialAuthor,
            testimonialRole: data.testimonial?.role || pageContent.testimonialRole,
          });
        }
      } catch (error) {
        console.error("Failed to fetch page data:", error);
        setPlans(HARDCODED_TIERS);
      } finally {
        setIsLoadingPlans(false);
      }
    }
    fetchData();
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#040e07] text-[#eff8ee] selection:bg-emerald-500/20 selection:text-emerald-300 overflow-x-hidden">
      <Navbar />
      
      <main>
        {/* 1. HERO SECTION */}
        <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
          {/* Hero Image Background */}
          <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-gradient-to-b from-[#040e07] via-transparent to-[#040e07] z-10" />
             <div className="absolute inset-0 bg-gradient-to-r from-[#040e07] via-[#040e07]/40 to-transparent z-10" />
             <img 
               src="/wholesale_hero_image_1778007530988.png" 
               alt="Sharcly Wholesale" 
               className="size-full object-cover scale-105"
             />
          </div>

          <div className="container mx-auto px-6 relative z-20">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-500/10 rounded-full mb-10 border border-emerald-500/20"
              >
                <Sparkles className="size-3.5 text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Official Partnership Portal</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tighter mb-8"
              >
                {pageContent.heroTitle}
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="text-lg md:text-xl text-white/50 font-medium max-w-lg mb-12 leading-relaxed"
              >
                {pageContent.heroSubtitle}
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="flex flex-col sm:flex-row items-center gap-6"
              >
                <Button 
                  size="lg" 
                  className="h-20 px-12 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-600/30 group"
                  onClick={() => document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Apply to Partner <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <button 
                  className="h-20 px-12 text-white/40 hover:text-white font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center gap-3"
                  onClick={() => document.getElementById('tiers')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Explore Tiers <ChevronRight className="size-4" />
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 2. VALUE PROPS */}
        <section className="py-40 bg-white/[0.02] border-y border-white/5 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[160px] translate-x-1/2 -translate-y-1/2" />
          
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {[
                {
                  title: "Better Margins",
                  desc: "Fair wholesale pricing designed to help your business stay profitable.",
                  icon: TrendingUp
                },
                {
                  title: "Reliable Shipping",
                  desc: "A solid logistics network that ensures your shelves are never empty.",
                  icon: Truck
                },
                {
                  title: "Elite Design",
                  desc: "Packaging that stands out and tells a story of quality and care.",
                  icon: Leaf
                },
                {
                  title: "Pure Quality",
                  desc: "Fully tested products with transparent lab results for every batch.",
                  icon: ShieldCheck
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  {...fadeIn}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className="space-y-6"
                >
                  <div className="size-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                    <item.icon className="size-6 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight">{item.title}</h3>
                  <p className="text-white/40 font-medium leading-relaxed text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. TIERS SECTION */}
        <section id="tiers" className="py-40 relative">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">Partner Tiers</h2>
              <p className="text-base text-white/40 font-medium">Simple options for businesses of all sizes. Choose what fits you best.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
              {isLoadingPlans ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="p-12 rounded-[3rem] border border-white/5 bg-white/5 space-y-8 h-[600px]">
                    <Skeleton className="h-10 w-48 bg-white/10 rounded-xl" />
                    <Skeleton className="h-20 w-32 bg-white/10 rounded-xl" />
                    <div className="space-y-4">
                      <Skeleton className="h-4 w-full bg-white/10 rounded-lg" />
                      <Skeleton className="h-4 w-full bg-white/10 rounded-lg" />
                      <Skeleton className="h-4 w-3/4 bg-white/10 rounded-lg" />
                    </div>
                  </div>
                ))
              ) : (
                plans.map((tier, i) => (
                  <motion.div
                    key={tier.name}
                    {...fadeIn}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className={`relative p-12 rounded-[3rem] border flex flex-col transition-all duration-700 group ${
                      tier.featured 
                        ? 'bg-emerald-600 border-emerald-500 shadow-2xl shadow-emerald-600/20 z-10 lg:scale-105' 
                        : 'bg-white/5 border-white/10 hover:bg-white/[0.08]'
                    }`}
                  >
                    {tier.featured && (
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-white text-emerald-900 font-black uppercase tracking-[0.3em] px-8 py-2.5 rounded-full text-[9px] shadow-2xl z-20">
                         Most Popular
                      </div>
                    )}

                    <div className="mb-12">
                      <h3 className={`text-3xl font-black tracking-tight mb-4 ${tier.featured ? 'text-white' : 'text-white'}`}>
                        {tier.name}
                      </h3>
                      <div className="flex items-baseline gap-2">
                         <span className={`text-5xl font-black ${tier.featured ? 'text-white' : 'text-emerald-500'}`}>{tier.discount}</span>
                      </div>
                      <p className={`text-[10px] font-black uppercase tracking-[0.25em] mt-3 ${tier.featured ? 'text-white/60' : 'text-white/30'}`}>
                        Starting at {tier.minOrder}
                      </p>
                    </div>

                    <div className="space-y-5 mb-14 flex-1">
                      {(Array.isArray(tier.features) ? tier.features : []).map((feature: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-4">
                          <CheckCircle2 className={`h-5 w-5 shrink-0 ${tier.featured ? 'text-white' : 'text-emerald-500'}`} />
                          <span className={`text-sm font-bold leading-relaxed ${tier.featured ? 'text-white/80' : 'text-white/50'}`}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Button 
                      className={`w-full h-18 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-xl ${
                        tier.featured 
                          ? 'bg-white hover:bg-emerald-50 text-emerald-900 shadow-emerald-900/10' 
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                      }`}
                      onClick={() => document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      Get Started
                    </Button>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* 4. FORM SECTION */}
        <section id="apply-form" className="py-40 relative">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500/5 blur-[120px] rounded-full" />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center mb-20">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-500/10 rounded-full mb-6 border border-emerald-500/20">
                <Leaf className="size-3 text-emerald-400" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400">Join the Collective</span>
              </div>
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-6">Partner Inquiry</h2>
              <p className="text-lg text-white/40 font-medium">Tell us about your business. We'll find the best way to work together.</p>
            </div>
            
            <WholesaleForm />
          </div>
        </section>

        {/* 5. FOOTER TESTIMONIAL */}
        <section className="py-40 border-t border-white/5">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
               <motion.div {...fadeIn}>
                 <p className="text-3xl md:text-5xl font-black tracking-tighter text-white leading-[1.2] mb-14 italic">
                   "{pageContent.testimonialQuote}"
                 </p>
                 <div className="flex flex-col items-center gap-6">
                    <div className="size-20 bg-emerald-600 rounded-3xl rotate-12 shadow-2xl shadow-emerald-600/20 flex items-center justify-center">
                       <Globe className="size-10 text-white" />
                    </div>
                    <div className="space-y-1">
                       <p className="font-black text-2xl text-white tracking-tight">{pageContent.testimonialAuthor}</p>
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">{pageContent.testimonialRole}</p>
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

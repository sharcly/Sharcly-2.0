"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Award, 
  FileText, 
  ArrowRight,
  ChevronRight,
  Globe,
  Truck,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { useSeo } from "@/hooks/use-seo";

export default function WholesalePage() {
  useSeo("wholesale");

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 md:pt-48 md:pb-40 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-primary/[0.02]" />
          <div className="container mx-auto px-6">
            <div className="max-w-4xl">
              <Badge className="bg-accent/10 text-accent border-none font-black text-[10px] uppercase tracking-widest px-4 mb-8">Wholesale Partnership</Badge>
              <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-primary leading-[0.85] mb-12">
                ELEVATE YOUR <br/>
                <span className="text-accent italic font-serif">RETAIL</span> EXPERIENCE.
              </h1>
              <p className="text-xl md:text-2xl text-foreground/70 leading-relaxed font-medium max-w-2xl">
                Partner with Sharcly to bring clean, lab-tested hemp products to your customers. 
                Premium branding, reliable margins, and full compliance.
              </p>
              <div className="mt-12 flex flex-wrap gap-6">
                 <Button size="lg" className="h-16 px-12 font-black uppercase tracking-widest text-xs premium-gradient rounded-2xl">
                    Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                 </Button>
                 <Button variant="outline" size="lg" className="h-16 px-12 font-black uppercase tracking-widest text-xs bg-primary/5 border-primary/10 rounded-2xl">
                    Download Brand Kit
                 </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Partnership Benefits */}
        <section className="py-32 bg-primary">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  title: "Strong Margins",
                  icon: BarChart3,
                  desc: "Industry-leading wholesale discounts that leave room for healthy retail markup and business growth."
                },
                {
                  title: "Premium Brand",
                  icon: Award,
                  desc: "A brand your customers will recognize and trust — no explaining required at the point of sale."
                },
                {
                  title: "Full Compliance",
                  icon: FileText,
                  desc: "Complete COA documentation, compliant labeling, and Farm Bill certification included with every batch."
                }
              ].map((benefit, i) => (
                <div key={i} className="p-12 bg-white/5 border border-white/10 rounded-[3rem] group hover:bg-white/10 transition-colors">
                  <div className="h-14 w-14 bg-accent/20 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                    <benefit.icon className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="text-3xl font-black tracking-tight text-cream mb-6">{benefit.title}</h3>
                  <p className="text-cream/60 font-medium leading-relaxed">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Tiers */}
        <section className="py-32">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-24">
              <Badge className="bg-primary/5 text-primary/40 border-none font-black text-[9px] uppercase tracking-widest px-3 mb-6">Partnership levels</Badge>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-primary">TIERED PRICING.</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {[
                {
                  tier: "Retailer",
                  min: "$500",
                  discount: "20% off",
                  features: ["Net 30 terms", "Display materials", "Education resources", "Standard Support"],
                  highlight: false
                },
                {
                  tier: "Distributor",
                  min: "$2,500",
                  discount: "35% off",
                  features: ["Net 60 terms", "Priority inventory", "White-label options", "Dedicated Account Manager"],
                  highlight: true
                },
                {
                  tier: "Enterprise",
                  min: "Custom",
                  discount: "Custom",
                  features: ["Private label", "Exclusive territory", "Custom formulation", "24/7 Priority Support"],
                  highlight: false
                }
              ].map((tier, i) => (
                <div key={i} className={`p-12 rounded-[3rem] border flex flex-col ${tier.highlight ? 'bg-primary border-primary p-[3.25rem] scale-105 shadow-2xl shadow-primary/20' : 'bg-primary/[0.02] border-primary/5'}`}>
                  <h3 className={`text-2xl font-black tracking-widest uppercase mb-4 ${tier.highlight ? 'text-accent' : 'text-primary'}`}>{tier.tier}</h3>
                  <div className="mb-10">
                    <p className={`text-4xl font-black tracking-tighter ${tier.highlight ? 'text-cream' : 'text-primary'}`}>{tier.discount}</p>
                    <p className={`text-sm font-bold uppercase tracking-[0.2em] mt-2 ${tier.highlight ? 'text-cream/40' : 'text-primary/40'}`}>Min. Order: {tier.min}</p>
                  </div>
                  <div className="space-y-4 mb-12 flex-1">
                    {tier.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                         <ChevronRight className={`h-4 w-4 ${tier.highlight ? 'text-accent' : 'text-primary/40'}`} />
                         <span className={`font-medium ${tier.highlight ? 'text-cream/80' : 'text-primary/60'}`}>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs ${tier.highlight ? 'bg-accent hover:bg-accent/90 text-white border-none' : 'premium-gradient'}`}>
                    Select Tier
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Compliance & Support */}
        <section className="py-32 bg-primary/[0.01]">
          <div className="container mx-auto px-6">
            <div className="bg-background border border-primary/5 rounded-[3rem] p-12 md:p-20 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] scale-150">
                 <ShieldCheck className="h-64 w-64 text-primary" />
              </div>
              <div className="max-w-2xl relative z-10">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-primary mb-8 leading-none">TRUSTED BY RETAILERS NATIONWIDE.</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                   <div className="space-y-4">
                      <div className="flex items-center gap-3">
                         <Globe className="h-6 w-6 text-accent" />
                         <h4 className="font-black text-xs uppercase tracking-widest text-primary">Farm Bill Certified</h4>
                      </div>
                      <p className="text-foreground/50 text-sm font-medium">All products are within 0.3% THC limits and fully legal for resale.</p>
                   </div>
                   <div className="space-y-4">
                      <div className="flex items-center gap-3">
                         <Truck className="h-6 w-6 text-accent" />
                         <h4 className="font-black text-xs uppercase tracking-widest text-primary">Reliable Logistics</h4>
                      </div>
                      <p className="text-foreground/50 text-sm font-medium">Most wholesale orders ship within 24-48 hours with full tracking.</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Mail, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";

const DEFAULT_FAQS = [
  {
    category: "Product & Ingredients",
    items: [
      { q: "What is the difference between CBD, Delta-8, and Delta-9?", a: "CBD (Cannabidiol) is non-psychoactive and won't give you a 'high'. Delta-8 is mildly psychoactive, offering a lighter, clearer experience. Delta-9 is the primary psychoactive compound; ours are derived from hemp and contain less than 0.3% THC by dry weight, making them federally compliant." },
      { q: "Are your products lab-tested?", a: "Yes, absolutely. Independent ISO/IEC 17025 accredited laboratories verify every batch for potency and safety. We test for cannabinoids as well as potential contaminants like pesticides, heavy metals, and residual solvents." },
    ]
  }
];

export default function FAQPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await apiClient.get("/faqs?activeOnly=true");
        if (response.data.success && response.data.data?.length > 0) {
          // Group by category
          const grouped = response.data.data.reduce((acc: any, curr: any) => {
            const cat = curr.category || "General";
            if (!acc[cat]) acc[cat] = { category: cat, items: [] };
            acc[cat].items.push({ q: curr.question, a: curr.answer });
            return acc;
          }, {});
          setFaqs(Object.values(grouped));
        } else {
          setFaqs(DEFAULT_FAQS);
        }
      } catch (error) {
        console.error("Failed to fetch FAQs:", error);
        setFaqs(DEFAULT_FAQS);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/10 selection:text-primary">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 border-b border-border bg-card/30">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl space-y-6">
              <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 border-primary/20 bg-primary/5 text-primary">Support Center</Badge>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-foreground leading-[1.1] uppercase">
                Commonly Asked <br/> Questions
              </h1>
              <p className="text-lg text-muted-foreground font-medium max-w-xl">
                Find answers to frequent inquiries about our laboratory-verified products, shipping protocols, and service policies.
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
              {/* Sidebar Help */}
              <div className="lg:col-span-4 space-y-8">
                <Card className="p-8 border-border/50 bg-card rounded-[2rem] shadow-organic border">
                  <div className="space-y-6">
                    <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                      <HelpCircle className="h-6 w-6" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-black tracking-tight">Need further assistance?</h3>
                      <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                        Our dedicated support team is available Monday through Friday for immediate assistance.
                      </p>
                    </div>
                    <div className="space-y-3 pt-2">
                       <Button className="w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20" asChild>
                          <Link href="/contact">Get in Touch</Link>
                       </Button>
                       <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-primary/30">support@sharcly.com</p>
                    </div>
                  </div>
                </Card>

                <div className="px-6 space-y-4">
                  <div className="flex items-center gap-3">
                     <div className="size-2 bg-emerald-500 rounded-full animate-pulse" />
                     <h4 className="font-black text-[10px] uppercase tracking-widest text-primary/40">Real-time support active</h4>
                  </div>
                  <p className="text-muted-foreground text-xs font-medium leading-relaxed">
                    Access our live assistance module during peak hours for direct product consultation.
                  </p>
                </div>
              </div>

              {/* FAQ Accordion */}
              <div className="lg:col-span-8">
                {isLoading ? (
                  <div className="flex items-center gap-3 text-primary/40">
                     <Loader2 className="size-5 animate-spin" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Loading Knowledge Base...</span>
                  </div>
                ) : (
                  <div className="space-y-20">
                    {faqs.map((group: any, i: number) => (
                      <div key={i} className="space-y-8">
                        <div className="flex items-center gap-4">
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary whitespace-nowrap">{group.category}</p>
                          <div className="h-px w-full bg-primary/5" />
                        </div>
                        <Accordion type="single" collapsible className="w-full space-y-4">
                          {group.items.map((item: any, idx: number) => (
                            <AccordionItem key={idx} value={`item-${i}-${idx}`} className="border-none bg-neutral-50 rounded-2xl px-8 hover:bg-neutral-100 transition-all group overflow-hidden shadow-sm">
                              <AccordionTrigger className="text-lg font-black tracking-tight text-left hover:no-underline py-6">
                                 {item.q}
                              </AccordionTrigger>
                              <AccordionContent className="text-neutral-500 font-medium leading-relaxed pb-8 text-base">
                                 {item.a}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Global Banner */}
        <section className="pb-32">
          <div className="container mx-auto px-6">
            <Card className="border-border/50 bg-neutral-900 text-white rounded-[3rem] p-16 text-center border overflow-hidden relative shadow-2xl">
               <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                  <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase">Precision Fulfillment. <br/> Worldwide Shipping.</h2>
                  <p className="text-white/40 font-medium text-lg italic">We prioritize security and discretion in every shipment, ensuring safe arrival within 3-7 business days.</p>
                  <div className="flex flex-wrap justify-center gap-8 text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500">
                     <span>Verified Tracked Delivery</span>
                     <span>Opaque Neutral Packaging</span>
                     <span>Full Transit Protection</span>
                  </div>
               </div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

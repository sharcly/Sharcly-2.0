import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function FAQPage() {
  const faqs = [
    {
      category: "Product & Ingredients",
      items: [
        {
          q: "What is the difference between CBD, Delta-8, and Delta-9?",
          a: "CBD (Cannabidiol) is non-psychoactive and won't give you a 'high'. Delta-8 is mildly psychoactive, offering a lighter, clearer experience. Delta-9 is the primary psychoactive compound; ours are derived from hemp and contain less than 0.3% THC by dry weight, making them federally compliant."
        },
        {
          q: "Are your products lab-tested?",
          a: "Yes, absolutely. Independent ISO/IEC 17025 accredited laboratories verify every batch for potency and safety. We test for cannabinoids as well as potential contaminants like pesticides, heavy metals, and residual solvents."
        },
        {
          q: "How much should I take to start?",
          a: "We recommend starting low and going slow. A good starting dose is typically 10-25mg. Assess how you feel after 1-2 hours before considering another dose. Everyone's body chemistry is unique."
        }
      ]
    },
    {
      category: "Shipping & Returns",
      items: [
        {
          q: "How long does shipping take?",
          a: "Standard shipping typically takes 3-7 business days. We offer free shipping on all orders over $75 within the United States. Most orders are processed and shipped within 24 hours of being placed."
        },
        {
          q: "What is your return policy?",
          a: "We offer a 30-day satisfaction guarantee. If you're not satisfied with your purchase, you can request a full refund or exchange within 30 days of receiving your order-no questions asked."
        },
        {
          q: "What if my item arrives damaged?",
          a: "We strive for perfection but understand things happen. Please contact our support team at support@sharcly.com with a photo of the damaged item, and we'll arrange an immediate replacement or refund."
        }
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 border-b border-border bg-card/30">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl space-y-6">
              <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest px-4">Support Center</Badge>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
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
                <Card className="p-8 border-border/50 bg-card rounded-2xl shadow-sm border">
                  <div className="space-y-6">
                    <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                      <HelpCircle className="h-6 w-6" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold tracking-tight">Need further assistance?</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Our dedicated support team is available Monday through Friday for immediate assistance.
                      </p>
                    </div>
                    <div className="space-y-3 pt-2">
                       <Button className="w-full h-11 rounded-xl font-bold text-xs uppercase tracking-widest" asChild>
                          <Link href="/contact">Get in Touch</Link>
                       </Button>
                       <p className="text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">support@sharcly.com</p>
                    </div>
                  </div>
                </Card>

                <div className="px-6 space-y-4">
                  <div className="flex items-center gap-3">
                     <MessageCircle className="h-4 w-4 text-primary" />
                     <h4 className="font-bold text-[10px] uppercase tracking-widest">Real-time support</h4>
                  </div>
                  <p className="text-muted-foreground text-xs font-medium leading-relaxed">
                    Access our live assistance module during peak hours for direct product consultation.
                  </p>
                </div>
              </div>

              {/* FAQ Accordion */}
              <div className="lg:col-span-8">
                <div className="space-y-20">
                  {faqs.map((group: any, i: number) => (
                    <div key={i} className="space-y-10">
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/50">{group.category}</p>
                        <div className="h-px w-12 bg-primary/20" />
                      </div>
                      <Accordion type="single" collapsible className="w-full space-y-4">
                        {group.items.map((item: any, idx: number) => (
                          <AccordionItem key={idx} value={`item-${i}-${idx}`} className="border border-border/50 bg-card/30 rounded-xl px-6 hover:bg-card/50 transition-all group overflow-hidden">
                            <AccordionTrigger className="text-lg font-bold tracking-tight text-left hover:no-underline py-5">
                               {item.q}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground font-medium leading-relaxed pb-6 text-base">
                               {item.a}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Global Banner */}
        <section className="pb-32">
          <div className="container mx-auto px-6">
            <Card className="border-border/50 bg-background rounded-3xl p-12 text-center border overflow-hidden relative">
               <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                  <h2 className="text-3xl font-bold tracking-tight">Precision Fulfillment. Worldwide Shipping.</h2>
                  <p className="text-muted-foreground font-medium text-lg">We prioritize security and discretion in every shipment, ensuring safe arrival within 3-7 business days.</p>
                  <div className="flex flex-wrap justify-center gap-8 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                     <span>Verified Tracked Delivery</span>
                     <span>Opaque Neutral Packaging</span>
                     <span>Full Transit Protection</span>
                  </div>
               </div>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

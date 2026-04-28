import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LiftSeriesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="relative pt-32 pb-24 md:pt-48 md:pb-40 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-orange-400/5" />
          <div className="container mx-auto px-6">
            <div className="max-w-4xl">
              <Badge className="bg-orange-400/10 text-orange-600 border-none font-black text-[10px] uppercase tracking-widest px-4 mb-8">Lift Series</Badge>
              <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-primary leading-[0.85] mb-12">
                LOCK IN WITH <br/>
                <span className="text-orange-400 italic font-serif">ZERO</span> NOISE.
              </h1>
              <p className="text-xl md:text-2xl text-foreground/70 leading-relaxed font-medium max-w-2xl mb-12">
                Elevate your focus and energy. The Lift Series is crafted for peak performance and mental clarity during your most demanding hours.
              </p>
              <Button size="lg" className="h-16 px-12 font-black uppercase tracking-widest text-xs premium-gradient rounded-2xl" asChild>
                <Link href="/products?series=lift">View Lift Collection <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </section>
        
        <section className="py-24 border-t border-primary/5">
           <div className="container mx-auto px-6 text-center">
              <p className="text-primary/40 font-bold uppercase tracking-widest text-sm">Loading Lift Series Collection...</p>
           </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

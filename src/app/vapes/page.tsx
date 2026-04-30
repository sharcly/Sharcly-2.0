import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Cloud, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function VapesSeriesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="relative pt-32 pb-24 md:pt-48 md:pb-40 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-rose-400/5" />
          <div className="container mx-auto px-6">
            <div className="max-w-4xl">
              <Badge className="bg-rose-400/10 text-rose-600 border-none font-black text-[10px] uppercase tracking-widest px-4 mb-8">Vape Series</Badge>
              <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-primary leading-[0.85] mb-12">
                FAST HITS, <br/>
                <span className="text-rose-400 italic font-serif">CLEAN</span> FEEL.
              </h1>
              <p className="text-xl md:text-2xl text-foreground/70 leading-relaxed font-medium max-w-2xl mb-12">
                Immediate effect, premium purity. Our Vape Series delivers rapid results with the cleanest distillates and natural terpenes.
              </p>
              <Button size="lg" className="h-16 px-12 font-black uppercase tracking-widest text-xs premium-gradient rounded-2xl" asChild>
                <Link href="/products?category=vapes">View Vape Collection <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </section>
        
        <section className="py-24 border-t border-primary/5">
           <div className="container mx-auto px-6 text-center">
              <p className="text-primary/40 font-bold uppercase tracking-widest text-sm">Loading Vape Series Collection...</p>
           </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

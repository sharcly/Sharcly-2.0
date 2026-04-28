"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight,
  Globe,
  Users,
  Heart,
  Play
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useSeo } from "@/hooks/use-seo";

export default function AboutPage() {
  useSeo("about");

  const fadeInUp: any = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const staggerContainer: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans selection:bg-black selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* Massive Branding Hero */}
        <section className="relative pt-48 pb-32 md:pt-60 md:pb-48 overflow-hidden">
          <div className="container mx-auto px-6 md:px-12">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-6xl"
            >
              <motion.div variants={fadeInUp}>
                 <Badge variant="outline" className="px-5 py-2 rounded-full border-black/10 text-black/40 font-bold uppercase tracking-widest text-[10px] mb-12">
                   The Sharcly Vision
                 </Badge>
              </motion.div>
              
              <motion.h1 
                variants={fadeInUp}
                className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-12 uppercase"
              >
                RESTORE <br /> YOUR FLOW.
              </motion.h1>

              <motion.p 
                variants={fadeInUp}
                className="text-xl md:text-2xl font-medium text-black/40 max-w-4xl leading-tight"
              >
                Sharcly was born from a simple realization: modern life is loud. We build precision-crafted cannabinoid essentials designed to help you tune out the noise and find your natural rhythm.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* High-Impact Editorial Image */}
        <section className="px-6 md:px-12 pb-32">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-[60vh] md:h-[90vh] rounded-[3rem] overflow-hidden group"
          >
            <Image 
              src="https://i.postimg.cc/Y2hVpsDp/Sharcy-wellness-products-in-nature-setting.jpg"
              alt="Sharcly Narrative"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/5" />
          </motion.div>
        </section>

        {/* Brand Pillars */}
        <section className="py-32 bg-neutral-50">
          <div className="container mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-24 font-medium">
              <div className="space-y-8">
                 <div className="size-16 rounded-3xl bg-black text-white flex items-center justify-center">
                    <Globe className="size-8" />
                 </div>
                 <h3 className="text-3xl font-bold tracking-tighter">Global Integrity.</h3>
                 <p className="text-lg text-black/50 leading-relaxed">
                   From the fiber to the finish, we maintain a radical transparency in our global supply chain. We only partner with individuals who share our obsession with quality.
                 </p>
              </div>
              <div className="space-y-8">
                 <div className="size-16 rounded-3xl bg-neutral-200 text-black flex items-center justify-center">
                    <Heart className="size-8" />
                 </div>
                 <h3 className="text-3xl font-bold tracking-tighter">Human Design.</h3>
                 <p className="text-lg text-black/50 leading-relaxed">
                   Products inspired by movement. Whether you are at rest or in full flow, our design philosophy remains consistent: frictionless, silent, and superior.
                 </p>
              </div>
              <div className="space-y-8">
                 <div className="size-16 rounded-3xl bg-neutral-100 text-black flex items-center justify-center">
                    <Users className="size-8" />
                 </div>
                 <h3 className="text-3xl font-bold tracking-tighter">The Community.</h3>
                 <p className="text-lg text-black/50 leading-relaxed">
                   We are more than a brand. We are a collective of thinkers, athletes, and creators who value the subtle art of balance in a chaotic modern world.
                 </p>
              </div>
            </div>
          </div>
        </section>

        {/* Narrative Split */}
        <section className="py-32 md:py-60">
           <div className="container mx-auto px-6 md:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                 <div className="space-y-12">
                    <h2 className="text-5xl md:text-[6rem] font-bold tracking-tighter leading-none">THE CRAFT <br /> OF FLOW.</h2>
                    <p className="text-xl md:text-2xl text-black/50 leading-relaxed font-medium">
                      Our process is slow. We deliberate over every stitch, every ingredient, and every interaction. Because true luxury isn&apos;t just about the result; it&apos;s about the unwavering commitment to the process.
                    </p>
                    <div className="flex">
                       <Button size="lg" className="h-20 px-16 rounded-full bg-black text-white hover:bg-neutral-800 font-bold text-lg gap-4">
                          Explore Manufacturing <ArrowRight className="size-6" />
                       </Button>
                    </div>
                 </div>
                 <div className="relative aspect-square rounded-[4rem] overflow-hidden shadow-2xl">
                    <Image 
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1500&auto=format&fit=crop"
                      alt="Narrative Image"
                      fill
                      className="object-cover"
                    />
                 </div>
              </div>
           </div>
        </section>

        {/* Modern CTA */}
        <section className="pb-32 px-6 md:px-12">
           <div className="bg-black rounded-[4rem] p-16 md:p-32 text-center text-white relative overflow-hidden">
              <div className="max-w-4xl mx-auto space-y-12 relative z-10">
                 <h2 className="text-5xl md:text-9xl font-bold tracking-tighter leading-tight">JOIN THE CLUB.</h2>
                 <p className="text-xl md:text-2xl text-white/50 font-medium max-w-2xl mx-auto">
                    Experience the collection that defined the new standard of lifestyle performance.
                 </p>
                 <div className="pt-8">
                    <Button size="lg" className="h-20 px-16 rounded-full bg-white text-black hover:bg-neutral-200 font-bold text-xl" asChild>
                       <Link href="/products">Shop the Catalog</Link>
                    </Button>
                 </div>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

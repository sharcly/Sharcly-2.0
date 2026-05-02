"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import { Truck, RotateCcw, ShieldCheck, Globe, Sparkles } from "lucide-react";

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-white text-[#0d2719] selection:bg-[#0d2719] selection:text-white antialiased">
      <Navbar />
      
      <main className="pt-32 pb-40">
        <section className="container mx-auto px-6 mb-24">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 mb-8"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Support & Logistics</span>
              <div className="h-px w-12 bg-[#0d2719]/10" />
              <Sparkles className="size-4 opacity-40" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl lg:text-9xl font-black tracking-tighter leading-[0.8] mb-12"
            >
              SHIPPING <br />
              <span className="italic font-serif opacity-30">& RETURNS.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl lg:text-2xl text-[#0d2719]/50 font-medium max-w-2xl leading-relaxed"
            >
              Seamless logistics designed for your convenience. We ensure your wellness essentials reach you with speed and care.
            </motion.p>
          </div>
        </section>

        {/* Info Grid */}
        <section className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="size-14 rounded-2xl bg-[#0d2719] text-white flex items-center justify-center">
                  <Truck className="size-7" />
                </div>
                <h2 className="text-3xl font-bold tracking-tighter italic">Shipping Policy</h2>
              </div>
              <div className="space-y-6 text-[#0d2719]/70 font-medium leading-relaxed">
                <p>We provide complimentary standard shipping on all orders over $75 within the continental United States.</p>
                <div className="p-8 rounded-3xl bg-[#f0f9f0] border border-[#0d2719]/5 space-y-4">
                  <div className="flex justify-between border-b border-[#0d2719]/10 pb-4">
                    <span>Standard Shipping (3-5 Days)</span>
                    <span className="font-bold">$5.95</span>
                  </div>
                  <div className="flex justify-between border-b border-[#0d2719]/10 pb-4">
                    <span>Express Delivery (1-2 Days)</span>
                    <span className="font-bold">$15.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>International Shipping</span>
                    <span className="font-bold text-xs uppercase tracking-widest">Calculated at Checkout</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="size-14 rounded-2xl bg-[#0d2719] text-white flex items-center justify-center">
                  <Globe className="size-7" />
                </div>
                <h2 className="text-3xl font-bold tracking-tighter italic">Tracking</h2>
              </div>
              <p className="text-[#0d2719]/70 font-medium leading-relaxed">
                Once your order has been dispatched, you will receive a tracking link via email. Please allow up to 24 hours for the tracking information to update.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="size-14 rounded-2xl bg-[#0d2719] text-white flex items-center justify-center">
                  <RotateCcw className="size-7" />
                </div>
                <h2 className="text-3xl font-bold tracking-tighter italic">Returns & Refunds</h2>
              </div>
              <div className="space-y-6 text-[#0d2719]/70 font-medium leading-relaxed">
                <p>We offer a 30-day satisfaction guarantee. If you are not completely satisfied with your purchase, you may return the product for a full refund or exchange.</p>
                <ul className="space-y-4 list-disc pl-6 opacity-80">
                  <li>Items must be returned within 30 days of delivery.</li>
                  <li>Product should be at least 50% full for a refund.</li>
                  <li>Shipping costs for returns are the responsibility of the customer unless the product is defective.</li>
                  <li>Refunds are processed within 5-7 business days of receiving the return.</li>
                </ul>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="size-14 rounded-2xl bg-[#0d2719] text-white flex items-center justify-center">
                  <ShieldCheck className="size-7" />
                </div>
                <h2 className="text-3xl font-bold tracking-tighter italic">Quality Guarantee</h2>
              </div>
              <p className="text-[#0d2719]/70 font-medium leading-relaxed">
                Every Sharcly product is triple-tested for quality. If you receive a damaged or defective item, please contact our support team immediately for a complimentary replacement.
              </p>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

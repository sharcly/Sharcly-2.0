"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import { Truck, RotateCcw, ShieldCheck, Globe, Package, Clock, MapPin, ArrowDown, CheckCircle, HelpCircle, Mail } from "lucide-react";
import Link from "next/link";

const shippingRates = [
  { method: "Standard Shipping", time: "3–5 Business Days", price: "$5.95", note: "Free over $75" },
  { method: "Express Delivery", time: "1–2 Business Days", price: "$15.00", note: null },
  { method: "International", time: "7–14 Business Days", price: "Calculated", note: "At checkout" },
];

const returnSteps = [
  { step: "01", title: "Contact Us", desc: "Reach out within 30 days of delivery via email or our contact form." },
  { step: "02", title: "Ship It Back", desc: "We'll provide a return label. Product should be at least 50% full." },
  { step: "03", title: "Get Refunded", desc: "Refunds are processed within 5–7 business days of receiving the return." },
];

const highlights = [
  { icon: Truck, title: "Free Shipping", desc: "On all orders over $75 within the continental US." },
  { icon: RotateCcw, title: "30-Day Returns", desc: "Full satisfaction guarantee on every product." },
  { icon: ShieldCheck, title: "Quality Assured", desc: "Triple-tested. Damaged items replaced free of charge." },
  { icon: Package, title: "Discreet Packaging", desc: "Unmarked boxes with no product details visible." },
];

export default function ShippingPage() {
  return (
    <div className="min-h-screen antialiased" style={{ background: '#040e07', color: '#eff8ee' }}>
      <Navbar />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(175deg, #040e07 0%, #0a2a17 35%, #040e07 100%)' }} />
          <div className="absolute top-0 right-0 w-[500px] h-[500px]" style={{ background: 'radial-gradient(circle, rgba(232,197,71,0.04) 0%, transparent 60%)' }} />
          <div className="absolute top-[30%] left-0 w-full h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(232,197,71,0.12) 30%, rgba(232,197,71,0.12) 70%, transparent 100%)' }} />
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-20">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 mb-8"
              >
                <div className="size-1.5 rounded-full" style={{ backgroundColor: '#E8C547' }} />
                <span className="text-[10px] font-black uppercase tracking-[0.35em]" style={{ color: '#E8C547' }}>Support & Logistics</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl sm:text-6xl lg:text-8xl xl:text-[7rem] font-black tracking-[-0.03em] leading-[0.88]"
              >
                <span style={{ color: '#eff8ee' }}>Shipping</span>
                <br />
                <span className="italic font-serif" style={{ color: 'rgba(239,248,238,0.15)' }}>&amp; Returns</span>
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-base lg:text-lg font-medium max-w-md leading-relaxed lg:pb-3"
              style={{ color: 'rgba(239,248,238,0.45)' }}
            >
              Seamless logistics designed for your convenience. We ensure your wellness essentials arrive with speed, care, and discretion.
            </motion.p>
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-14 h-px origin-left"
            style={{ background: 'linear-gradient(90deg, rgba(232,197,71,0.4) 0%, rgba(232,197,71,0.08) 60%, transparent 100%)' }}
          />
        </div>
      </section>

      {/* ═══════════════ HIGHLIGHTS BAR ═══════════════ */}
      <section className="border-y" style={{ borderColor: 'rgba(239,248,238,0.06)', backgroundColor: 'rgba(4,14,7,0.9)', backdropFilter: 'blur(20px)' }}>
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x" style={{ divideColor: 'rgba(239,248,238,0.06)' }}>
            {highlights.map((h, idx) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="py-7 md:py-9 px-4 md:px-7 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left"
              >
                <div className="size-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(232,197,71,0.08)', border: '1px solid rgba(232,197,71,0.1)' }}>
                  <h.icon className="size-4.5" style={{ color: '#E8C547' }} />
                </div>
                <div>
                  <h3 className="text-xs font-bold mb-0.5" style={{ color: '#eff8ee' }}>{h.title}</h3>
                  <p className="text-[10px] font-medium" style={{ color: 'rgba(239,248,238,0.4)' }}>{h.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <main className="pb-32">
        {/* ═══════════════ SHIPPING RATES ═══════════════ */}
        <section className="py-24 md:py-32" style={{ background: 'linear-gradient(180deg, #040e07 0%, #082f1d 50%, #040e07 100%)' }}>
          <div className="container mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
              {/* Left: Shipping */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-10"
              >
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] block mb-3" style={{ color: '#E8C547' }}>Delivery</span>
                  <h2 className="text-3xl sm:text-4xl font-black tracking-tight" style={{ color: '#eff8ee' }}>Shipping Rates</h2>
                </div>

                <div className="rounded-[20px] overflow-hidden" style={{ border: '1px solid rgba(239,248,238,0.06)' }}>
                  {shippingRates.map((rate, idx) => (
                    <div
                      key={rate.method}
                      className="flex items-center justify-between px-7 py-6"
                      style={{ 
                        backgroundColor: idx % 2 === 0 ? 'rgba(239,248,238,0.02)' : 'rgba(239,248,238,0.04)',
                        borderBottom: idx < shippingRates.length - 1 ? '1px solid rgba(239,248,238,0.05)' : 'none'
                      }}
                    >
                      <div>
                        <h4 className="text-sm font-bold mb-1" style={{ color: '#eff8ee' }}>{rate.method}</h4>
                        <div className="flex items-center gap-2">
                          <Clock className="size-3" style={{ color: 'rgba(239,248,238,0.3)' }} />
                          <span className="text-[11px] font-medium" style={{ color: 'rgba(239,248,238,0.4)' }}>{rate.time}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black" style={{ color: '#E8C547' }}>{rate.price}</span>
                        {rate.note && (
                          <span className="block text-[9px] font-bold uppercase tracking-wider mt-0.5" style={{ color: 'rgba(239,248,238,0.3)' }}>{rate.note}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tracking info */}
                <div className="p-7 rounded-[16px] space-y-4" style={{ backgroundColor: 'rgba(239,248,238,0.02)', border: '1px solid rgba(239,248,238,0.05)' }}>
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(232,197,71,0.08)', border: '1px solid rgba(232,197,71,0.1)' }}>
                      <MapPin className="size-4" style={{ color: '#E8C547' }} />
                    </div>
                    <h3 className="text-sm font-bold" style={{ color: '#eff8ee' }}>Order Tracking</h3>
                  </div>
                  <p className="text-sm font-medium leading-relaxed" style={{ color: 'rgba(239,248,238,0.4)' }}>
                    Once dispatched, you&apos;ll receive a tracking link via email. Please allow up to 24 hours for tracking info to update after shipment.
                  </p>
                </div>
              </motion.div>

              {/* Right: Returns */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-10"
              >
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] block mb-3" style={{ color: '#E8C547' }}>Hassle-Free</span>
                  <h2 className="text-3xl sm:text-4xl font-black tracking-tight" style={{ color: '#eff8ee' }}>Returns Process</h2>
                </div>

                {/* 3-step process */}
                <div className="space-y-5">
                  {returnSteps.map((s, idx) => (
                    <motion.div
                      key={s.step}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex gap-5 p-6 rounded-[16px] group transition-all duration-300 hover:-translate-y-0.5"
                      style={{ backgroundColor: 'rgba(239,248,238,0.02)', border: '1px solid rgba(239,248,238,0.05)' }}
                    >
                      <div className="size-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(232,197,71,0.08)', border: '1px solid rgba(232,197,71,0.12)' }}>
                        <span className="text-xs font-black" style={{ color: '#E8C547' }}>{s.step}</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold mb-1.5" style={{ color: '#eff8ee' }}>{s.title}</h4>
                        <p className="text-[13px] font-medium leading-relaxed" style={{ color: 'rgba(239,248,238,0.4)' }}>{s.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Quality guarantee */}
                <div className="p-7 rounded-[16px] space-y-4" style={{ backgroundColor: 'rgba(239,248,238,0.02)', border: '1px solid rgba(239,248,238,0.05)' }}>
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(232,197,71,0.08)', border: '1px solid rgba(232,197,71,0.1)' }}>
                      <ShieldCheck className="size-4" style={{ color: '#E8C547' }} />
                    </div>
                    <h3 className="text-sm font-bold" style={{ color: '#eff8ee' }}>Quality Guarantee</h3>
                  </div>
                  <p className="text-sm font-medium leading-relaxed" style={{ color: 'rgba(239,248,238,0.4)' }}>
                    Every Sharcly product is triple-tested for quality. If you receive a damaged or defective item, contact our support team for a complimentary replacement — no questions asked.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════ FAQ SECTION ═══════════════ */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-6 md:px-12 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.3em] block mb-3" style={{ color: '#E8C547' }}>Common Questions</span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight" style={{ color: '#eff8ee' }}>Shipping FAQ</h2>
            </motion.div>

            <div className="space-y-4">
              {[
                { q: "Do you ship internationally?", a: "Yes, we ship to most countries worldwide. International shipping rates are calculated at checkout based on your location." },
                { q: "How long does standard shipping take?", a: "Standard shipping within the US typically takes 3–5 business days. Orders placed before 2 PM EST ship same day." },
                { q: "Can I change my shipping address after ordering?", a: "Yes, contact us within 2 hours of placing your order and we'll update the address before fulfillment." },
                { q: "What if my package is lost or stolen?", a: "We'll reship your order at no charge. Simply contact our support team with your order number within 14 days of the expected delivery." },
                { q: "Are returns free?", a: "Return shipping costs are the customer's responsibility unless the product is defective or damaged. We provide a prepaid label for defective items." },
              ].map((faq, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.06 }}
                  className="p-6 rounded-[16px]"
                  style={{ backgroundColor: 'rgba(239,248,238,0.02)', border: '1px solid rgba(239,248,238,0.05)' }}
                >
                  <div className="flex items-start gap-4">
                    <HelpCircle className="size-4 mt-0.5 shrink-0" style={{ color: '#E8C547' }} />
                    <div>
                      <h4 className="text-sm font-bold mb-2" style={{ color: '#eff8ee' }}>{faq.q}</h4>
                      <p className="text-[13px] font-medium leading-relaxed" style={{ color: 'rgba(239,248,238,0.4)' }}>{faq.a}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ CONTACT CTA ═══════════════ */}
        <section className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-[24px] overflow-hidden text-center"
            style={{ border: '1px solid rgba(232,197,71,0.1)' }}
          >
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(232,197,71,0.04) 0%, rgba(4,14,7,0.98) 40%, rgba(232,197,71,0.03) 100%)' }} />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px]" style={{ background: 'radial-gradient(circle, rgba(232,197,71,0.07) 0%, transparent 60%)' }} />

            <div className="relative z-10 py-16 px-8 md:py-24 md:px-16 max-w-2xl mx-auto space-y-7">
              <div className="size-16 rounded-2xl flex items-center justify-center mx-auto" style={{ backgroundColor: 'rgba(232,197,71,0.1)', border: '1px solid rgba(232,197,71,0.15)' }}>
                <Mail className="size-7" style={{ color: '#E8C547' }} />
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] block mb-3" style={{ color: '#E8C547' }}>Need Help?</span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-4" style={{ color: '#eff8ee' }}>
                  Still have questions?
                </h2>
                <p className="text-sm font-medium leading-relaxed" style={{ color: 'rgba(239,248,238,0.4)' }}>
                  Our support team is available Monday–Friday, 9 AM – 6 PM EST. We typically respond within 2 hours.
                </p>
              </div>

              <Link 
                href="/contact"
                className="inline-flex items-center px-10 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 hover:shadow-[0_4px_30px_rgba(232,197,71,0.25)]"
                style={{ backgroundColor: '#E8C547', color: '#040e07' }}
              >
                Contact Support
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

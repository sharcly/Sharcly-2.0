"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, RotateCcw, ShieldCheck, Package, Clock, MapPin, ChevronDown, ArrowRight, Mail, Globe, Sparkles } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";

const shippingTiers = [
  {
    method: "Standard",
    time: "3–5 Business Days",
    price: "$5.95",
    highlight: "Free over $75",
    icon: Package,
    details: "Available for all US addresses. Orders placed before 2 PM EST ship same day.",
  },
  {
    method: "Express",
    time: "1–2 Business Days",
    price: "$15.00",
    highlight: null,
    icon: Truck,
    details: "Priority handling with signature confirmation. Available Mon–Fri.",
  },
  {
    method: "International",
    time: "7–14 Business Days",
    price: "Calculated",
    highlight: "At checkout",
    icon: MapPin,
    details: "Ships to 40+ countries. Duties and taxes may apply at destination.",
  },
];

const returnTimeline = [
  { num: "01", title: "Initiate Return", desc: "Contact us within 30 days of delivery via email or our contact form.", color: "#E8C547" },
  { num: "02", title: "Ship It Back", desc: "We provide a return label. Product must be at least 50% full for refund eligibility.", color: "#E8C547" },
  { num: "03", title: "Get Refunded", desc: "Refunds processed within 5–7 business days to your original payment method.", color: "#E8C547" },
];

const faqs = [
  { q: "Do you ship internationally?", a: "Yes, we ship to most countries worldwide. International shipping rates are calculated at checkout based on your location and package weight." },
  { q: "How long does standard shipping take?", a: "Standard shipping within the US typically takes 3–5 business days. Orders placed before 2 PM EST ship same day." },
  { q: "Can I change my shipping address after ordering?", a: "Yes, contact us within 2 hours of placing your order and we'll update the address before fulfillment." },
  { q: "What if my package is lost or stolen?", a: "We'll reship your order at no charge. Simply contact our support team with your order number within 14 days of the expected delivery date." },
  { q: "Are returns free?", a: "Return shipping costs are the customer's responsibility unless the product is defective or damaged. We provide a prepaid label for defective items." },
];

export default function ShippingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [cmsContent, setCmsContent] = useState<any>({
    hero: {
      title: "SHIPPING & RETURNS.",
      tagline: "Seamless logistics designed for your convenience. We ensure your wellness essentials reach you with speed and care."
    },
    shipping: {
      title: "Shipping Policy",
      description: "We provide complimentary standard shipping on all orders over $75 within the continental United States."
    },
    tracking: {
      title: "Tracking",
      description: "Once your order has been dispatched, you will receive a tracking link via email. Please allow up to 24 hours for the tracking information to update."
    },
    returns: {
      title: "Returns & Refunds",
      description: "We offer a 30-day satisfaction guarantee. If you are not completely satisfied with your purchase, you may return the product for a full refund or exchange."
    },
    guarantee: {
      title: "Quality Guarantee",
      description: "Every Sharcly product is triple-tested for quality. If you receive a damaged or defective item, please contact our support team immediately for a complimentary replacement."
    }
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await apiClient.get("/cms/shipping");
        if (response.data.success && response.data.content) {
          setCmsContent(response.data.content);
        }
      } catch (error) {
        console.error("Failed to fetch shipping content:", error);
      }
    };
    fetchContent();
  }, []);

  return (
    <div className="min-h-screen antialiased" style={{ background: '#040e07', color: '#eff8ee' }}>
      <Navbar />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative pt-36 pb-14 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(175deg, #040e07 0%, #0a2a17 40%, #040e07 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 40% at 50% 30%, rgba(232,197,71,0.05) 0%, transparent 70%)' }} />
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full mb-8"
            style={{ backgroundColor: 'rgba(232,197,71,0.08)', border: '1px solid rgba(232,197,71,0.15)' }}>
            <Truck className="size-3.5" style={{ color: '#E8C547' }} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: '#E8C547' }}>Shipping & Returns</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-[-0.03em] leading-[0.9] mb-6"
          >
            <span style={{ color: '#eff8ee' }}>Delivered with</span><br />
            <span className="italic font-serif" style={{ color: 'rgba(239,248,238,0.18)' }}>Precision</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-base font-medium leading-relaxed max-w-lg mx-auto"
            style={{ color: 'rgba(239,248,238,0.45)' }}>
            Fast, discreet, and reliable. We handle your orders with the care they deserve — from lab to doorstep.
          </motion.p>
        </div>
      </section>

      {/* ═══════════════ TRUST BAR ═══════════════ */}
      <section className="container mx-auto px-6 md:px-12 mb-16">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Truck, label: "Free over $75" },
            { icon: Package, label: "Discreet Packaging" },
            { icon: RotateCcw, label: "30-Day Returns" },
            { icon: ShieldCheck, label: "Quality Guaranteed" },
          ].map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.06 }}
              className="flex flex-col items-center gap-2.5 py-5 px-3 rounded-[14px] text-center"
              style={{ backgroundColor: 'rgba(239,248,238,0.02)', border: '1px solid rgba(239,248,238,0.05)' }}
            >
              <div className="size-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(232,197,71,0.08)' }}>
                <item.icon className="size-4" style={{ color: '#E8C547' }} />
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(239,248,238,0.5)' }}>{item.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <main className="pb-32">
        {/* ═══════════════ SHIPPING TIERS ═══════════════ */}
        <section className="container mx-auto px-6 md:px-12 mb-24">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <span className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: '#E8C547' }}>Delivery Options</span>
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(232,197,71,0.15) 0%, transparent 100%)' }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {shippingTiers.map((tier, idx) => (
                <motion.div
                  key={tier.method}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="group p-6 rounded-[18px] flex flex-col transition-all duration-500 hover:-translate-y-1"
                  style={{ backgroundColor: 'rgba(239,248,238,0.02)', border: '1px solid rgba(239,248,238,0.05)' }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="size-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(232,197,71,0.08)', border: '1px solid rgba(232,197,71,0.1)' }}>
                      <tier.icon className="size-5" style={{ color: '#E8C547' }} />
                    </div>
                    {tier.highlight && (
                      <span className="px-2.5 py-1 rounded text-[8px] font-black uppercase tracking-wider" style={{ backgroundColor: 'rgba(232,197,71,0.1)', color: '#E8C547' }}>{tier.highlight}</span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold mb-1" style={{ color: '#eff8ee' }}>{tier.method}</h3>
                  <div className="flex items-center gap-1.5 mb-4">
                    <Clock className="size-3" style={{ color: 'rgba(239,248,238,0.3)' }} />
                    <span className="text-[11px] font-medium" style={{ color: 'rgba(239,248,238,0.4)' }}>{tier.time}</span>
                  </div>

                  <p className="text-[12px] font-medium leading-relaxed mb-5 flex-1" style={{ color: 'rgba(239,248,238,0.35)' }}>{tier.details}</p>

                  <div className="pt-4" style={{ borderTop: '1px solid rgba(239,248,238,0.04)' }}>
                    <span className="text-2xl font-black" style={{ color: '#E8C547' }}>{tier.price}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Tracking card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-5 p-6 rounded-[16px] flex flex-col sm:flex-row items-center gap-5"
              style={{ backgroundColor: 'rgba(239,248,238,0.02)', border: '1px solid rgba(239,248,238,0.05)' }}
            >
              <div className="size-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(232,197,71,0.08)' }}>
                <MapPin className="size-4" style={{ color: '#E8C547' }} />
              </div>
              <div className="text-center sm:text-left">
                <h4 className="text-sm font-bold mb-0.5" style={{ color: '#eff8ee' }}>Real-Time Tracking</h4>
                <p className="text-[12px] font-medium" style={{ color: 'rgba(239,248,238,0.4)' }}>Every order includes a tracking link via email. Updates within 24 hours of dispatch.</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════ RETURNS PROCESS ═══════════════ */}
        <section className="container mx-auto px-6 md:px-12 mb-24">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <span className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: '#E8C547' }}>Hassle-Free Returns</span>
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(232,197,71,0.15) 0%, transparent 100%)' }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {returnTimeline.map((step, idx) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative p-6 rounded-[18px]"
                  style={{ backgroundColor: 'rgba(239,248,238,0.02)', border: '1px solid rgba(239,248,238,0.05)' }}
                >
                  {/* Connector line on desktop */}
                  {idx < returnTimeline.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-[9px] w-[18px] h-px" style={{ backgroundColor: 'rgba(232,197,71,0.15)' }} />
                  )}
                  <span className="text-3xl font-black block mb-4" style={{ color: 'rgba(232,197,71,0.15)' }}>{step.num}</span>
                  <h4 className="text-base font-bold mb-2" style={{ color: '#eff8ee' }}>{step.title}</h4>
                  <p className="text-[13px] font-medium leading-relaxed" style={{ color: 'rgba(239,248,238,0.4)' }}>{step.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Quality guarantee strip */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-5 p-6 rounded-[16px] flex flex-col sm:flex-row items-center gap-5"
              style={{ backgroundColor: 'rgba(239,248,238,0.02)', border: '1px solid rgba(239,248,238,0.05)' }}
            >
              <div className="size-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(232,197,71,0.08)' }}>
                <ShieldCheck className="size-4" style={{ color: '#E8C547' }} />
              </div>
              <div className="text-center sm:text-left">
                <h4 className="text-sm font-bold mb-0.5" style={{ color: '#eff8ee' }}>Quality Guarantee</h4>
                <p className="text-[12px] font-medium" style={{ color: 'rgba(239,248,238,0.4)' }}>Damaged or defective? We replace it free — no questions asked. Just email us a photo.</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════ FAQ ACCORDION ═══════════════ */}
        <section className="container mx-auto px-6 md:px-12 mb-24">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <span className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: '#E8C547' }}>Common Questions</span>
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(232,197,71,0.15) 0%, transparent 100%)' }} />
            </div>

            <div className="space-y-2.5">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="rounded-[14px] transition-all duration-300"
                    style={{ backgroundColor: isOpen ? 'rgba(232,197,71,0.035)' : 'rgba(239,248,238,0.02)', border: `1px solid ${isOpen ? 'rgba(232,197,71,0.12)' : 'rgba(239,248,238,0.05)'}` }}>
                    <button onClick={() => setOpenFaq(isOpen ? null : idx)} className="w-full flex items-start gap-4 px-6 py-5 text-left">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[15px] font-bold leading-snug pr-4 transition-colors duration-200" style={{ color: isOpen ? '#E8C547' : '#eff8ee' }}>{faq.q}</h4>
                      </div>
                      <div className="size-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300"
                        style={{ backgroundColor: isOpen ? 'rgba(232,197,71,0.1)' : 'rgba(239,248,238,0.04)' }}>
                        <ChevronDown className="size-4 transition-transform duration-300" style={{ color: isOpen ? '#E8C547' : 'rgba(239,248,238,0.3)', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                      </div>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                          <div className="px-6 pb-6">
                            <div className="h-px mb-4" style={{ backgroundColor: 'rgba(232,197,71,0.06)' }} />
                            <p className="text-sm font-medium leading-[1.85]" style={{ color: 'rgba(239,248,238,0.55)' }}>{faq.a}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════ CONTACT CTA ═══════════════ */}
        <section className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="relative rounded-[20px] overflow-hidden"
              style={{ backgroundColor: 'rgba(239,248,238,0.025)', border: '1px solid rgba(239,248,238,0.06)' }}>
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 80% at 30% 50%, rgba(232,197,71,0.04), transparent 70%)' }} />

              <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                <div className="size-16 md:size-18 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(232,197,71,0.08)', border: '1px solid rgba(232,197,71,0.12)' }}>
                  <Mail className="size-7" style={{ color: '#E8C547' }} />
                </div>
                <div className="text-center md:text-left flex-1">
                  <h3 className="text-xl font-black tracking-tight mb-1.5" style={{ color: '#eff8ee' }}>Still need help?</h3>
                  <p className="text-sm font-medium" style={{ color: 'rgba(239,248,238,0.4)' }}>Mon–Fri, 9 AM – 6 PM EST. Average response time under 2 hours.</p>
                </div>
                <Link href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 hover:shadow-[0_4px_24px_rgba(232,197,71,0.2)] shrink-0 whitespace-nowrap"
                  style={{ backgroundColor: '#E8C547', color: '#040e07' }}>
                  Contact Support <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

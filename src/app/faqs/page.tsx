"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, Mail, ChevronDown, Search, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const faqData = [
  {
    category: "Product & Ingredients",
    questions: [
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
        a: "We recommend starting low and going slow. A good starting dose is typically 10–25mg. Assess how you feel after 1–2 hours before considering another dose. Everyone's body chemistry is unique."
      },
      {
        q: "Are your products organic?",
        a: "All our hemp is sourced from USDA-certified organic farms. Our extraction and manufacturing processes maintain organic integrity throughout the entire supply chain."
      },
    ]
  },
  {
    category: "Shipping & Delivery",
    questions: [
      {
        q: "How long does shipping take?",
        a: "Standard shipping typically takes 3–7 business days. We offer free shipping on all orders over $75 within the United States. Most orders are processed and shipped within 24 hours."
      },
      {
        q: "Do you ship internationally?",
        a: "Yes, we ship to most countries worldwide. International shipping rates are calculated at checkout based on your location and typically takes 7–14 business days."
      },
      {
        q: "Is shipping discreet?",
        a: "Absolutely. All orders ship in plain, unmarked packaging with no product details visible on the outside. Your privacy is our priority."
      },
    ]
  },
  {
    category: "Returns & Refunds",
    questions: [
      {
        q: "What is your return policy?",
        a: "We offer a 30-day satisfaction guarantee. If you're not satisfied with your purchase, you can request a full refund or exchange within 30 days of receiving your order — no questions asked."
      },
      {
        q: "What if my item arrives damaged?",
        a: "Contact our support team at support@sharcly.com with a photo of the damaged item, and we'll arrange an immediate replacement or refund at no cost to you."
      },
      {
        q: "How long do refunds take?",
        a: "Once we receive your returned item, refunds are processed within 5–7 business days. The refund will appear on your original payment method."
      },
    ]
  },
  {
    category: "Legal & Compliance",
    questions: [
      {
        q: "Are your products legal?",
        a: "Yes. All Sharcly products are derived from industrial hemp and comply with the 2018 Farm Bill. They contain less than 0.3% Delta-9 THC by dry weight, making them federally legal in the United States."
      },
      {
        q: "Will your products show up on a drug test?",
        a: "While our products contain trace amounts of THC (below 0.3%), we cannot guarantee they won't trigger a positive result on a drug test. If this is a concern, we recommend consulting with your employer or healthcare provider."
      },
      {
        q: "Do I need to be 21 to purchase?",
        a: "Yes, you must be 21 years of age or older to purchase any Sharcly products. Age verification is required at checkout."
      },
    ]
  },
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const allQuestions = faqData.flatMap((cat, ci) =>
    cat.questions.map((q, qi) => ({ ...q, category: cat.category, id: `${ci}-${qi}` }))
  );

  const filtered = searchQuery.trim()
    ? allQuestions.filter(q =>
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  return (
    <div className="min-h-screen antialiased" style={{ background: '#040e07', color: '#eff8ee' }}>
      <Navbar />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(175deg, #040e07 0%, #0a2a17 40%, #040e07 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 40% at 50% 30%, rgba(232,197,71,0.05) 0%, transparent 70%)' }} />
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full mb-8" style={{ backgroundColor: 'rgba(232,197,71,0.08)', border: '1px solid rgba(232,197,71,0.15)' }}>
            <HelpCircle className="size-3.5" style={{ color: '#E8C547' }} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: '#E8C547' }}>Support Center</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-[-0.03em] leading-[0.9] mb-6"
            style={{ color: '#eff8ee' }}
          >
            How can we<br />
            <span className="italic font-serif" style={{ color: 'rgba(239,248,238,0.18)' }}>help you?</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-base font-medium leading-relaxed mb-10 max-w-lg mx-auto" style={{ color: 'rgba(239,248,238,0.45)' }}>
            Browse our most common questions or search for something specific.
          </motion.p>

          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="relative max-w-xl mx-auto">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 size-5" style={{ color: 'rgba(239,248,238,0.25)' }} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type your question..."
              className="w-full h-16 pl-[52px] pr-14 rounded-2xl text-base font-medium outline-none transition-all border"
              style={{ backgroundColor: 'rgba(239,248,238,0.04)', borderColor: 'rgba(239,248,238,0.08)', color: '#eff8ee' }}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(232,197,71,0.3)'; e.target.style.boxShadow = '0 0 30px rgba(232,197,71,0.06)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(239,248,238,0.08)'; e.target.style.boxShadow = 'none'; }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-5 top-1/2 -translate-y-1/2 size-7 rounded-full flex items-center justify-center transition-colors hover:bg-[#eff8ee]/10" style={{ backgroundColor: 'rgba(239,248,238,0.06)' }}>
                <X className="size-3.5" style={{ color: '#eff8ee' }} />
              </button>
            )}
          </motion.div>
        </div>
      </section>

      <main className="pb-32">
        {/* ═══════════════ FAQ CONTENT ═══════════════ */}
        <section className="container mx-auto px-6 md:px-12 max-w-3xl">
          <AnimatePresence mode="wait">
            {filtered ? (
              /* Search Results */
              <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-8" style={{ color: 'rgba(239,248,238,0.3)' }}>
                  {filtered.length} result{filtered.length !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
                </p>
                {filtered.length === 0 ? (
                  <div className="py-24 text-center">
                    <div className="size-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: 'rgba(232,197,71,0.06)' }}>
                      <Search className="size-7" style={{ color: 'rgba(232,197,71,0.25)' }} />
                    </div>
                    <h3 className="text-lg font-black mb-1.5" style={{ color: '#eff8ee' }}>No results found</h3>
                    <p className="text-sm font-medium mb-6" style={{ color: 'rgba(239,248,238,0.4)' }}>Try different keywords or browse by category below.</p>
                    <button onClick={() => setSearchQuery("")} className="text-[10px] font-black uppercase tracking-widest underline underline-offset-4" style={{ color: '#E8C547' }}>Clear Search</button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filtered.map((faq) => (
                      <AccordionCard key={faq.id} id={faq.id} q={faq.q} a={faq.a} isOpen={!!openItems[faq.id]} toggle={toggleItem} badge={faq.category} />
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              /* Category View */
              <motion.div key="cats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-16">
                {faqData.map((cat, ci) => (
                  <div key={cat.category}>
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: '#E8C547' }}>{cat.category}</span>
                      <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(232,197,71,0.15) 0%, transparent 100%)' }} />
                      <span className="text-[10px] font-bold" style={{ color: 'rgba(239,248,238,0.2)' }}>{cat.questions.length}</span>
                    </div>
                    <div className="space-y-2.5">
                      {cat.questions.map((q, qi) => {
                        const id = `${ci}-${qi}`;
                        return <AccordionCard key={id} id={id} q={q.q} a={q.a} isOpen={!!openItems[id]} toggle={toggleItem} />;
                      })}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ═══════════════ CONTACT CTA ═══════════════ */}
        <section className="container mx-auto px-6 md:px-12 mt-28 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-[20px] overflow-hidden"
            style={{ backgroundColor: 'rgba(239,248,238,0.025)', border: '1px solid rgba(239,248,238,0.06)' }}
          >
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 80% at 30% 50%, rgba(232,197,71,0.04), transparent 70%)' }} />
            
            <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="size-16 md:size-20 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(232,197,71,0.08)', border: '1px solid rgba(232,197,71,0.12)' }}>
                <Mail className="size-7 md:size-8" style={{ color: '#E8C547' }} />
              </div>
              <div className="text-center md:text-left flex-1">
                <h3 className="text-xl font-black tracking-tight mb-2" style={{ color: '#eff8ee' }}>Still have questions?</h3>
                <p className="text-sm font-medium leading-relaxed" style={{ color: 'rgba(239,248,238,0.4)' }}>
                  Our team is available Mon–Fri, 9 AM – 6 PM EST. Average response time under 2 hours.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 hover:shadow-[0_4px_24px_rgba(232,197,71,0.2)] shrink-0 whitespace-nowrap"
                style={{ backgroundColor: '#E8C547', color: '#040e07' }}
              >
                Get in Touch <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/* ═══ Custom Accordion Card ═══ */
function AccordionCard({ id, q, a, isOpen, toggle, badge }: { id: string; q: string; a: string; isOpen: boolean; toggle: (id: string) => void; badge?: string }) {
  return (
    <div
      className="rounded-[14px] transition-all duration-300"
      style={{
        backgroundColor: isOpen ? 'rgba(232,197,71,0.035)' : 'rgba(239,248,238,0.02)',
        border: `1px solid ${isOpen ? 'rgba(232,197,71,0.12)' : 'rgba(239,248,238,0.05)'}`,
      }}
    >
      <button onClick={() => toggle(id)} className="w-full flex items-start gap-4 px-6 py-5 text-left group">
        <div className="flex-1 min-w-0">
          {badge && (
            <span className="inline-block text-[8px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded mb-2" style={{ backgroundColor: 'rgba(232,197,71,0.1)', color: '#E8C547' }}>{badge}</span>
          )}
          <h3 className="text-[15px] font-bold leading-snug pr-4 transition-colors duration-200" style={{ color: isOpen ? '#E8C547' : '#eff8ee' }}>{q}</h3>
        </div>
        <div className="size-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300"
          style={{ backgroundColor: isOpen ? 'rgba(232,197,71,0.1)' : 'rgba(239,248,238,0.04)' }}>
          <ChevronDown className="size-4 transition-transform duration-300" style={{ color: isOpen ? '#E8C547' : 'rgba(239,248,238,0.3)', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">
              <div className="h-px mb-4" style={{ backgroundColor: 'rgba(232,197,71,0.06)' }} />
              <p className="text-sm font-medium leading-[1.85]" style={{ color: 'rgba(239,248,238,0.55)' }}>{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

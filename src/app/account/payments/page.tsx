"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  CreditCard, 
  Plus, 
  Trash2, 
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mocking payments for now
    setPayments([
      {
        id: "pm_1",
        brand: "visa",
        last4: "4242",
        exp_month: 12,
        exp_year: 2026,
        is_default: true
      }
    ]);
    setLoading(false);
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-px w-8 bg-[#062D1B]/20" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#062D1B]/50">Secure Wallet</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#062D1B]">
            Payment <span className="text-[#EBB56B] italic font-serif">Methods</span>.
          </h2>
        </div>
        
        <Button className="h-14 px-8 rounded-2xl bg-[#062D1B] hover:bg-black text-white text-[10px] font-black uppercase tracking-widest gap-3 shadow-xl shadow-[#062D1B]/10 transition-all">
          <Plus className="size-4" /> Add Payment Method
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {loading ? (
          [...Array(1)].map((_, i) => (
            <div key={i} className="h-64 bg-white border border-black/5 rounded-[2.5rem] animate-pulse" />
          ))
        ) : payments.length === 0 ? (
          <div className="md:col-span-2 p-20 text-center bg-white border border-dashed border-black/10 rounded-[3rem]">
            <CreditCard className="size-12 opacity-10 mx-auto mb-6" />
            <p className="text-sm font-medium text-gray-400">No payment methods found.</p>
          </div>
        ) : (
          payments.map((pm, i) => (
            <motion.div
              key={pm.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="group relative bg-[#062D1B] rounded-[2.5rem] p-10 text-white hover:shadow-2xl transition-all overflow-hidden"
            >
              <div className="absolute top-0 right-0 size-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
              
              <div className="relative z-10 h-full flex flex-col justify-between space-y-12">
                <div className="flex justify-between items-start">
                   <div className="size-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center">
                      <CreditCard className="size-7 text-[#EBB56B]" />
                   </div>
                   {pm.is_default && (
                     <Badge className="bg-[#EBB56B] text-[#062D1B] border-none px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full">
                       Default Method
                     </Badge>
                   )}
                </div>

                <div className="space-y-1">
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-2">Card Number</p>
                   <p className="text-2xl font-black tracking-[0.2em]">•••• •••• •••• {pm.last4}</p>
                </div>

                <div className="flex justify-between items-end">
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Expiry Date</p>
                      <p className="font-bold">{pm.exp_month}/{pm.exp_year}</p>
                   </div>
                   <div className="flex gap-2">
                      <button className="size-12 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all">
                        <Trash2 className="size-4 text-white/60" />
                      </button>
                   </div>
                </div>
              </div>
            </motion.div>
          ))
        )}

        {/* Info Card */}
        <div className="p-10 rounded-[2.5rem] bg-white border border-black/5 flex flex-col justify-center gap-8">
           <div className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-[#062D1B]/5 flex items-center justify-center text-[#062D1B]">
                 <ShieldCheck className="size-6" />
              </div>
              <h4 className="font-bold tracking-tight text-lg">Bank-Grade Security</h4>
           </div>
           <p className="text-sm font-medium text-gray-500 leading-relaxed">
             Your payment data is fully encrypted and never stored on our servers. We use industry-leading processors to ensure your sequence remains private.
           </p>
           <div className="flex items-center gap-4 opacity-30">
              <Lock className="size-4" />
              <p className="text-[9px] font-black uppercase tracking-widest">PCI DSS COMPLIANT</p>
           </div>
        </div>
      </div>
      
      {/* Visual Support */}
      <div className="p-12 rounded-[3.5rem] bg-neutral-900 text-white relative overflow-hidden group">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
         <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
               <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <Zap className="size-3 text-emerald-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">One-Click Sequence</span>
               </div>
               <h3 className="text-3xl font-bold tracking-tight italic">Instant Wellness Access.</h3>
               <p className="text-white/40 text-sm font-medium leading-relaxed">Enable fast-checkout to bypass standard authentication and receive your botanical drops with zero friction.</p>
            </div>
            <div className="flex justify-end">
               <button className="h-16 px-10 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-4">
                 Enable Fast-Checkout <ArrowRight className="size-4" />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}

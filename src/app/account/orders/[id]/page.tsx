"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CreditCard, 
  MapPin,
  ChevronRight,
  ShieldCheck,
  FileText,
  XCircle,
  Loader2,
  Download,
  X
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const fetchOrder = async () => {
    try {
      const response = await apiClient.get(`/orders/${id}`);
      setOrder(response.data.order);
    } catch (error) {
      console.error("Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleDownloadInvoice = async () => {
    setIsDownloading(true);
    try {
      const response = await apiClient.get(`/orders/${id}/invoice`, { 
        responseType: 'blob' 
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${String(id).slice(0, 8)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Invoice download started");
    } catch (error) {
      toast.error("Failed to download invoice");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) return toast.error("Please provide a reason for cancellation");
    
    setIsCancelling(true);
    try {
      await apiClient.post(`/orders/${id}/cancel`, { reason: cancelReason });
      toast.success("Order cancelled successfully");
      setIsCancelModalOpen(false);
      fetchOrder(); // Refresh order data
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to cancel order");
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center gap-6">
      <div className="size-16 border-4 border-white/5 border-t-[#EBB56B] rounded-full animate-spin shadow-[0_0_20px_rgba(235,181,107,0.1)]" />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#EBB56B] animate-pulse">Decrypting Order Vault</p>
    </div>
  );

  if (!order) return (
    <div className="p-20 text-center space-y-6">
       <XCircle className="size-12 text-red-400 mx-auto opacity-20" />
       <p className="text-[#eff8ee]/40 text-[10px] font-bold uppercase tracking-widest">Order not found in history</p>
       <Link href="/account/orders" className="inline-flex h-12 px-8 items-center rounded-full bg-white/5 text-[#eff8ee] text-[10px] font-black uppercase tracking-widest border border-white/10 hover:bg-white/10 transition-all">
          Back to Archives
       </Link>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-8 border-b border-white/5">
        <div className="space-y-4">
          <Link href="/account/orders" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#eff8ee]/20 hover:text-[#eff8ee] transition-colors group">
            <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" /> Archives
          </Link>
          <div className="space-y-2">
             <h2 className="text-4xl md:text-5xl font-serif italic text-[#eff8ee]">Order <span className="text-[#EBB56B]">#{order.id.slice(-8).toUpperCase()}</span></h2>
             <p className="text-[10px] font-bold uppercase tracking-widest text-[#eff8ee]/30">Authenticated on {new Date(order.createdAt).toLocaleDateString()} · {new Date(order.createdAt).toLocaleTimeString()}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Badge className={cn(
            "rounded-full px-8 py-2 text-[9px] font-black uppercase tracking-[0.2em] border-none h-12 flex items-center shadow-2xl",
            order.status === 'DELIVERED' ? "bg-emerald-500 text-[#040e07]" : 
            order.status === 'CANCELLED' ? "bg-red-500 text-white" : "bg-amber-400 text-[#040e07]"
          )}>
            {order.status}
          </Badge>
          
          <Button 
            onClick={handleDownloadInvoice}
            disabled={isDownloading}
            variant="outline" 
            className="h-12 rounded-full border-white/10 bg-white/5 px-8 text-[10px] font-black uppercase tracking-widest text-[#eff8ee] hover:bg-[#EBB56B] hover:text-[#040e07] hover:border-[#EBB56B] transition-all gap-3 shadow-xl shadow-black/20"
          >
            {isDownloading ? <Loader2 className="size-4 animate-spin" /> : <FileText className="size-4" />}
            Invoice
          </Button>

          {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
            <Button 
              onClick={() => setIsCancelModalOpen(true)}
              variant="outline" 
              className="h-12 rounded-full border-red-500/20 text-red-400 px-8 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white hover:border-red-500 transition-all gap-3"
            >
              <XCircle className="size-4" />
              Void Order
            </Button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-12">
           <section className="space-y-6">
              <h3 className="text-xl font-serif italic text-[#eff8ee] flex items-center gap-4">
                <Package className="size-6 text-[#EBB56B]" /> Items Summary
              </h3>
              <div className="bg-[#0d2518] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                {order.items?.map((item: any, i: number) => (
                  <div key={item.id} className={cn(
                    "p-8 flex items-center gap-8",
                    i !== 0 && "border-t border-white/5"
                  )}>
                    <div className="size-24 rounded-2xl bg-[#040e07] overflow-hidden shrink-0 border border-white/5 shadow-inner">
                       <img src={item.product?.image || "https://i.postimg.cc/K8nwpV4T/Premium-Hemp-Essentials-Sharcly.jpg"} alt={item.product?.name} className="w-full h-full object-cover saturate-[1.2] brightness-90" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className="text-xl font-serif italic text-[#eff8ee] tracking-tight truncate">{item.product?.name || "Product"}</p>
                       <div className="flex gap-4 mt-2">
                          <p className="text-[9px] font-black uppercase tracking-widest text-[#eff8ee]/30">Qty: {item.quantity}</p>
                          <p className="text-[9px] font-black uppercase tracking-widest text-[#EBB56B]">Unit Price: ${Number(item.price).toFixed(2)}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-xl font-black text-[#eff8ee] font-mono tracking-tighter">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
           </section>

           {/* Financial Summary */}
           <section className="bg-[#0d2518] rounded-[2.5rem] p-10 text-[#eff8ee] space-y-8 relative overflow-hidden shadow-2xl border border-white/5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(235,181,107,0.05),transparent_70%)]" />
              <div className="relative z-10 space-y-5">
                 <div className="flex justify-between text-[#eff8ee]/40 text-[10px] font-black uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span className="text-[#eff8ee] font-mono tracking-tighter">${(Number(order.totalAmount) - Number(order.taxAmount) - Number(order.shippingAmount)).toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-[#eff8ee]/40 text-[10px] font-black uppercase tracking-widest">
                    <span>Shipping Hub Fee</span>
                    <span className="text-[#eff8ee] font-mono tracking-tighter">${Number(order.shippingAmount).toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-[#eff8ee]/40 text-[10px] font-black uppercase tracking-widest">
                    <span>Government Surcharge (Tax)</span>
                    <span className="text-[#eff8ee] font-mono tracking-tighter">${Number(order.taxAmount).toFixed(2)}</span>
                 </div>
                 <div className="h-px w-full bg-white/5 my-8" />
                 <div className="flex justify-between items-end">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#EBB56B]">Total Investment</p>
                      <p className="text-5xl font-black tracking-tighter text-[#eff8ee] font-mono">${Number(order.totalAmount).toFixed(2)}</p>
                    </div>
                    <div className="text-right hidden sm:block space-y-2">
                       <p className="text-[10px] font-black uppercase tracking-widest text-[#eff8ee]/40">Payment Asset</p>
                       <p className="text-xs font-bold flex items-center gap-3 justify-end text-[#EBB56B]">
                          <CreditCard className="size-4" /> {order.paymentMethod?.toUpperCase() || "CREDIT CARD"}
                       </p>
                    </div>
                 </div>
              </div>
           </section>

           {order.status === 'CANCELLED' && order.cancelReason && (
              <section className="p-10 bg-red-400/5 border border-red-400/10 rounded-[2.5rem] space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-widest text-red-400">Voiding Authority Reason</p>
                 <p className="text-lg font-serif italic text-red-400/60 leading-relaxed">"{order.cancelReason}"</p>
              </section>
           )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
           {/* Shipping Info */}
           <section className="p-8 bg-[#0d2518] border border-white/5 rounded-[2.5rem] space-y-8 shadow-2xl">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#eff8ee]/30 flex items-center gap-3">
                <Truck className="size-4 text-[#EBB56B]" /> Shipping Manifest
              </h4>
              <div className="space-y-2 text-[#eff8ee] font-serif italic text-lg leading-relaxed">
                 {typeof order.shippingAddress === 'string' ? (
                   <p className="opacity-60">{order.shippingAddress}</p>
                 ) : (
                   <>
                     <p>{order.shippingAddress?.first_name} {order.shippingAddress?.last_name}</p>
                     <div className="text-xs font-sans font-medium text-[#eff8ee]/40 not-italic space-y-1">
                        <p>{order.shippingAddress?.address_1}</p>
                        <p>{order.shippingAddress?.city}, {order.shippingAddress?.province} {order.shippingAddress?.postal_code}</p>
                        <p className="uppercase tracking-widest opacity-60">{order.shippingAddress?.country || "United States"}</p>
                     </div>
                   </>
                 )}
              </div>
              <div className="pt-8 border-t border-white/5 space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-widest text-[#eff8ee]/30">Live Status Feed</p>
                 <div className="flex items-center gap-4 px-6 py-3 rounded-full bg-[#040e07] border border-white/5">
                    <div className={cn(
                      "size-2.5 rounded-full shadow-[0_0_10px_currentColor]",
                      order.status === 'DELIVERED' ? "bg-emerald-500 text-emerald-500" : 
                      order.status === 'CANCELLED' ? "bg-red-500 text-red-500" : "bg-amber-400 text-amber-400 animate-pulse"
                    )} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#eff8ee]">{order.status}</span>
                 </div>
              </div>
           </section>

           {/* Security Verification */}
           <div className="p-8 rounded-[2.5rem] bg-white/5 flex items-center gap-6 border border-white/5 group hover:bg-white/10 transition-all">
              <div className="size-14 rounded-2xl bg-[#040e07] flex items-center justify-center text-emerald-400 shadow-2xl group-hover:scale-110 transition-transform">
                 <ShieldCheck className="size-7" />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-[#eff8ee]">Lab Verified</p>
                 <p className="text-[10px] text-[#eff8ee]/30 font-medium leading-relaxed mt-1">Authenticity sequence matched and confirmed.</p>
              </div>
           </div>

           {/* Need Help? */}
           <div className="p-8 rounded-[2.5rem] bg-[#EBB56B]/5 border border-[#EBB56B]/10 space-y-6">
              <h4 className="font-serif italic text-xl text-[#eff8ee]">Need Assistance?</h4>
              <p className="text-xs font-medium text-[#eff8ee]/40 leading-relaxed">Our botanical concierge team is available to help with your order.</p>
              <button className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] text-[#eff8ee] hover:bg-[#EBB56B] hover:text-[#040e07] hover:border-[#EBB56B] transition-all shadow-xl">
                Contact Support
              </button>
           </div>
        </div>
      </div>

      {/* Cancellation Modal */}
      <AnimatePresence>
        {isCancelModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }} 
               onClick={() => setIsCancelModalOpen(false)}
               className="absolute inset-0 bg-[#040e07]/80 backdrop-blur-xl" 
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }} 
               animate={{ opacity: 1, scale: 1, y: 0 }} 
               exit={{ opacity: 0, scale: 0.95, y: 20 }} 
               className="relative w-full max-w-md bg-[#0d2518] rounded-[3rem] p-12 shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/5 space-y-10"
             >
                <div className="flex justify-between items-center">
                   <h3 className="text-3xl font-serif italic text-[#eff8ee]">Void <span className="text-red-400">Order?</span></h3>
                   <button onClick={() => setIsCancelModalOpen(false)} className="size-10 rounded-full bg-white/5 flex items-center justify-center text-[#eff8ee]/20 hover:text-[#eff8ee] transition-colors">
                      <X size={20} />
                   </button>
                </div>
                
                <p className="text-[11px] text-[#eff8ee]/40 font-medium leading-relaxed">
                  We're sorry to see you cancel this collection. Please provide a reason for the record so we can improve the botanical experience.
                </p>

                <div className="space-y-6">
                   <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-[#eff8ee]/20 ml-1">Cancellation Reason</label>
                      <Input 
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        placeholder="e.g., Change of preference..." 
                        className="h-16 rounded-2xl border-white/5 bg-black/20 text-[#eff8ee] focus:bg-black/40 transition-all placeholder:text-[#eff8ee]/10"
                      />
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4 pt-4">
                      <Button 
                        variant="ghost" 
                        onClick={() => setIsCancelModalOpen(false)}
                        className="h-14 rounded-full text-[10px] font-black uppercase tracking-widest text-[#eff8ee]/40 hover:text-[#eff8ee] hover:bg-white/5"
                      >
                         Retain Order
                      </Button>
                      <Button 
                        onClick={handleCancelOrder}
                        disabled={isCancelling}
                        className="h-14 rounded-full bg-red-500 hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-red-500/20"
                      >
                         {isCancelling ? <Loader2 className="size-4 animate-spin" /> : "Confirm Void"}
                      </Button>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

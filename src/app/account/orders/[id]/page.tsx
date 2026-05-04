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

  if (loading) return <div className="h-96 flex items-center justify-center"><div className="size-10 border-4 border-[#062D1B]/10 border-t-[#062D1B] rounded-full animate-spin" /></div>;
  if (!order) return <div className="p-20 text-center">Order not found.</div>;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-8 border-b border-black/5">
        <div className="space-y-4">
          <Link href="/account/orders" className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#062D1B]/40 hover:text-[#062D1B] transition-colors group">
            <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" /> Back to History
          </Link>
          <div className="space-y-1">
             <h2 className="text-4xl font-bold tracking-tight">Order <span className="text-[#EBB56B]">#{order.id.slice(-8).toUpperCase()}</span></h2>
             <p className="text-sm text-gray-500 font-medium">Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge className={cn(
            "rounded-full px-6 py-2 text-xs font-bold uppercase tracking-widest border-none h-10 flex items-center",
            order.status === 'DELIVERED' ? "bg-green-500 text-white" : 
            order.status === 'CANCELLED' ? "bg-red-500 text-white" : "bg-orange-500 text-white"
          )}>
            {order.status}
          </Badge>
          
          <Button 
            onClick={handleDownloadInvoice}
            disabled={isDownloading}
            variant="outline" 
            className="h-10 rounded-full border-black/5 px-6 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all gap-2"
          >
            {isDownloading ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
            Invoice
          </Button>

          {order.status === 'PENDING' && (
            <Button 
              onClick={() => setIsCancelModalOpen(true)}
              variant="outline" 
              className="h-10 rounded-full border-red-100 text-red-500 px-6 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all gap-2"
            >
              <XCircle className="size-3.5" />
              Cancel Order
            </Button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-8">
           <section className="space-y-6">
              <h3 className="text-xl font-bold tracking-tight flex items-center gap-3">
                <Package className="size-5 text-[#062D1B]/20" /> Items Summary
              </h3>
              <div className="bg-white border border-black/5 rounded-[2.5rem] overflow-hidden">
                {order.items?.map((item: any, i: number) => (
                  <div key={item.id} className={cn(
                    "p-8 flex items-center gap-6",
                    i !== 0 && "border-t border-black/5"
                  )}>
                    <div className="size-20 rounded-2xl bg-neutral-50 overflow-hidden shrink-0 border border-black/5">
                       <img src={item.product?.image || "https://i.postimg.cc/K8nwpV4T/Premium-Hemp-Essentials-Sharcly.jpg"} alt={item.product?.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className="font-bold text-lg tracking-tight truncate">{item.product?.name || "Product"}</p>
                       <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                       <p className="font-bold">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
           </section>

           {/* Financial Summary */}
           <section className="bg-[#062D1B] rounded-[2.5rem] p-10 text-white space-y-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(235,181,107,0.1),transparent_60%)]" />
              <div className="relative z-10 space-y-4">
                 <div className="flex justify-between text-white/40 text-sm font-bold uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span className="text-white">${(Number(order.totalAmount) - Number(order.taxAmount) - Number(order.shippingAmount)).toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-white/40 text-sm font-bold uppercase tracking-widest">
                    <span>Shipping</span>
                    <span className="text-white">${Number(order.shippingAmount).toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-white/40 text-sm font-bold uppercase tracking-widest">
                    <span>Taxes</span>
                    <span className="text-white">${Number(order.taxAmount).toFixed(2)}</span>
                 </div>
                 <div className="h-px w-full bg-white/10 my-6" />
                 <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#EBB56B] mb-2">Total Amount Paid</p>
                      <p className="text-4xl font-black tracking-tighter">${Number(order.totalAmount).toFixed(2)}</p>
                    </div>
                    <div className="text-right hidden sm:block">
                       <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Payment Method</p>
                       <p className="text-sm font-bold flex items-center gap-2 justify-end">
                          <CreditCard className="size-4 text-[#EBB56B]" /> {order.paymentMethod?.toUpperCase() || "CREDIT CARD"}
                       </p>
                    </div>
                 </div>
              </div>
           </section>

           {order.status === 'CANCELLED' && order.cancelReason && (
              <section className="p-8 bg-red-50 border border-red-100 rounded-[2.5rem] space-y-3">
                 <p className="text-[10px] font-black uppercase tracking-widest text-red-400">Cancellation Reason</p>
                 <p className="text-sm font-medium text-red-900 leading-relaxed italic">"{order.cancelReason}"</p>
              </section>
           )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
           {/* Shipping Info */}
           <section className="p-8 bg-white border border-black/5 rounded-[2.5rem] space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest text-[#062D1B]/40 flex items-center gap-2">
                <Truck className="size-4" /> Shipping Address
              </h4>
              <div className="space-y-1 text-[#062D1B] font-bold">
                 {typeof order.shippingAddress === 'string' ? (
                   <p className="opacity-60 font-medium leading-relaxed">{order.shippingAddress}</p>
                 ) : (
                   <>
                     <p>{order.shippingAddress?.first_name} {order.shippingAddress?.last_name}</p>
                     <p className="opacity-60 font-medium">{order.shippingAddress?.address_1}</p>
                     <p className="opacity-60 font-medium">{order.shippingAddress?.city}, {order.shippingAddress?.province} {order.shippingAddress?.postal_code}</p>
                   </>
                 )}
              </div>
              <div className="pt-6 border-t border-black/5">
                 <p className="text-[10px] font-black uppercase tracking-widest text-[#062D1B]/40 mb-3">Status Log</p>
                 <div className="flex items-center gap-3 text-sm font-bold">
                    <div className={cn(
                      "size-2 rounded-full",
                      order.status === 'DELIVERED' ? "bg-green-500" : 
                      order.status === 'CANCELLED' ? "bg-red-500" : "bg-orange-500 animate-pulse"
                    )} />
                    {order.status}
                 </div>
              </div>
           </section>

           {/* Security Verification */}
           <div className="p-8 rounded-[2.5rem] bg-neutral-50 flex items-center gap-4 border border-black/5">
              <div className="size-12 rounded-full bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                 <ShieldCheck className="size-6" />
              </div>
              <div>
                 <p className="text-xs font-bold uppercase tracking-widest">Lab Verified</p>
                 <p className="text-[10px] text-gray-400 font-medium leading-tight mt-0.5">Authenticity sequence matched and confirmed.</p>
              </div>
           </div>

           {/* Need Help? */}
           <div className="p-8 rounded-[2.5rem] bg-[#EBB56B]/5 border border-[#EBB56B]/20 space-y-4">
              <h4 className="font-bold tracking-tight italic">Need assistance?</h4>
              <p className="text-xs font-medium text-[#062D1B]/60 leading-relaxed">Our botanical concierge team is available to help with your order.</p>
              <button className="w-full h-12 bg-white border border-[#EBB56B]/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#EBB56B] hover:text-white transition-all">
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
               className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }} 
               animate={{ opacity: 1, scale: 1, y: 0 }} 
               exit={{ opacity: 0, scale: 0.95, y: 20 }} 
               className="relative w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl space-y-8"
             >
                <div className="flex justify-between items-center">
                   <h3 className="text-2xl font-bold tracking-tight italic">Cancel Order?</h3>
                   <button onClick={() => setIsCancelModalOpen(false)} className="size-10 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-300 hover:text-neutral-900 transition-colors">
                      <X size={20} />
                   </button>
                </div>
                
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  We're sorry to see you cancel. Please tell us why so we can improve our service.
                </p>

                <div className="space-y-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Reason for Cancellation</label>
                      <Input 
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        placeholder="e.g., Changed my mind, found a better price..." 
                        className="h-14 rounded-xl border-black/5 bg-neutral-50"
                      />
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4 pt-4">
                      <Button 
                        variant="ghost" 
                        onClick={() => setIsCancelModalOpen(false)}
                        className="h-14 rounded-xl text-[10px] font-black uppercase tracking-widest"
                      >
                         Keep Order
                      </Button>
                      <Button 
                        onClick={handleCancelOrder}
                        disabled={isCancelling}
                        className="h-14 rounded-xl bg-red-500 hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-500/20"
                      >
                         {isCancelling ? <Loader2 className="size-4 animate-spin" /> : "Cancel Now"}
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

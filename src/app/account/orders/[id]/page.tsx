"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CreditCard, 
  MapPin,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchOrder();
  }, [id]);

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
             <h2 className="text-4xl font-bold tracking-tight">Order <span className="text-[#EBB56B]">#{order.display_id || order.id.slice(-8).toUpperCase()}</span></h2>
             <p className="text-sm text-gray-500 font-medium">Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
          </div>
        </div>
        <Badge className={cn(
          "rounded-full px-6 py-2 text-xs font-bold uppercase tracking-widest border-none h-fit",
          order.status === 'completed' ? "bg-green-500 text-white shadow-lg shadow-green-500/20" : "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
        )}>
          {order.status}
        </Badge>
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
                       <img src={item.product?.images?.[0]?.url || "https://i.postimg.cc/K8nwpV4T/Premium-Hemp-Essentials-Sharcly.jpg"} alt={item.product?.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className="font-bold text-lg tracking-tight truncate">{item.product?.name || "Product"}</p>
                       <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                       <p className="font-bold">${(Number(item.price) * item.quantity)}</p>
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
                    <span className="text-white">${(Number(order.totalAmount) - Number(order.taxAmount) - Number(order.shippingAmount))}</span>
                 </div>
                 <div className="flex justify-between text-white/40 text-sm font-bold uppercase tracking-widest">
                    <span>Shipping</span>
                    <span className="text-white">${Number(order.shippingAmount)}</span>
                 </div>
                 <div className="flex justify-between text-white/40 text-sm font-bold uppercase tracking-widest">
                    <span>Taxes</span>
                    <span className="text-white">${Number(order.taxAmount)}</span>
                 </div>
                 <div className="h-px w-full bg-white/10 my-6" />
                 <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#EBB56B] mb-2">Total Amount Paid</p>
                      <p className="text-4xl font-black tracking-tighter">${Number(order.totalAmount)}</p>
                    </div>
                    <div className="text-right hidden sm:block">
                       <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Payment Method</p>
                       <p className="text-sm font-bold flex items-center gap-2 justify-end">
                          <CreditCard className="size-4 text-[#EBB56B]" /> {order.paymentMethod || "Saved Card"}
                       </p>
                    </div>
                 </div>
              </div>
           </section>
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
                   <p className="opacity-60 font-medium">{order.shippingAddress}</p>
                 ) : (
                   <>
                     <p>{order.shippingAddress?.first_name} {order.shippingAddress?.last_name}</p>
                     <p className="opacity-60 font-medium">{order.shippingAddress?.address_1}</p>
                     <p className="opacity-60 font-medium">{order.shippingAddress?.city}, {order.shippingAddress?.province} {order.shippingAddress?.postal_code}</p>
                   </>
                 )}
              </div>
              <div className="pt-6 border-t border-black/5">
                 <p className="text-[10px] font-black uppercase tracking-widest text-[#062D1B]/40 mb-3">Shipment Status</p>
                 <div className="flex items-center gap-3 text-sm font-bold">
                    <div className={cn(
                      "size-2 rounded-full animate-pulse",
                      order.status === 'DELIVERED' ? "bg-green-500" : "bg-orange-500"
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
              <p className="text-xs font-medium text-[#062D1B]/60 leading-relaxed">Our botanical concierge team is available 24/7 to help with your order.</p>
              <button className="w-full h-12 bg-white border border-[#EBB56B]/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#EBB56B] hover:text-white transition-all">
                Contact Support
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

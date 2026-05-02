"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight, Package, Calendar, Tag } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiClient.get("/orders");
        setOrders(response.data.orders || []);
      } catch (error) {
        console.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-px w-8 bg-[#062D1B]/20" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#062D1B]/50">Order History</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#062D1B]">
          Your <span className="text-[#EBB56B] italic font-serif">Purchases</span>.
        </h2>
      </div>

      <div className="min-h-[400px]">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-white border border-black/5 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="p-20 text-center bg-white border border-dashed border-black/10 rounded-[3rem]">
            <div className="size-20 rounded-full bg-neutral-50 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="size-8 opacity-10" />
            </div>
            <p className="text-sm font-medium text-gray-400">No orders found in your history.</p>
            <Link href="/products" className="inline-block mt-8 px-8 h-12 rounded-xl bg-[#062D1B] text-white text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all leading-[48px]">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative bg-white border border-black/5 rounded-[2.5rem] p-8 hover:shadow-xl transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-2xl bg-[#062D1B]/5 flex items-center justify-center text-[#062D1B]">
                        <Package className="size-5" />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-[#062D1B]/30 mb-0.5">Order ID</p>
                        <p className="font-bold tracking-tight">#{order.display_id || order.id.slice(-8).toUpperCase()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-8 flex-1 md:px-12">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#062D1B]/20 mb-1 flex items-center gap-1.5">
                        <Calendar className="size-3" /> Date
                      </p>
                      <p className="font-bold text-sm">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#062D1B]/20 mb-1 flex items-center gap-1.5">
                        <Tag className="size-3" /> Amount
                      </p>
                      <p className="font-bold text-sm">${(order.total / 100).toFixed(2)}</p>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#062D1B]/20 mb-2">Status</p>
                      <Badge className={cn(
                        "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest border-none",
                        order.status === 'completed' ? "bg-green-500/10 text-green-600" : "bg-orange-500/10 text-orange-600"
                      )}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>

                  <Link href={`/account/orders/${order.id}`}>
                    <button className="h-14 px-8 rounded-2xl bg-neutral-50 group-hover:bg-[#062D1B] group-hover:text-white transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                      Details <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

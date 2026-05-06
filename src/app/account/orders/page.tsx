"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { ShoppingBag, ArrowRight, Package } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiClient.get("/orders/my-orders");
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
      <div className="space-y-2 border-b border-white/5 pb-8">
        <h2 className="text-4xl font-serif italic text-[#eff8ee]">Order <span className="text-[#EBB56B]">Archive</span></h2>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#eff8ee]/40">Trace your premium collection history</p>
      </div>

      <div className="min-h-[400px]">
        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-white/5 rounded-[2rem] animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-white/10 rounded-[2.5rem] space-y-6">
            <ShoppingBag className="size-16 opacity-10 mx-auto" />
            <p className="text-[#eff8ee]/30 text-[10px] font-bold uppercase tracking-widest">No orders found in your vault</p>
            <Link href="/products" className="inline-flex h-14 px-10 items-center rounded-full bg-[#EBB56B] text-[#040e07] text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-[#EBB56B]/10">
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="bg-[#0d2518] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#040e07]/50 border-b border-white/5 text-[#EBB56B] text-[9px] font-black uppercase tracking-[0.2em]">
                  <tr>
                    <th className="px-10 py-6">Reference</th>
                    <th className="px-10 py-6">Date</th>
                    <th className="px-10 py-6">Status</th>
                    <th className="px-10 py-6">Investment</th>
                    <th className="px-10 py-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map((order) => (
                    <tr key={order.id} className="group hover:bg-white/5 transition-colors">
                      <td className="px-10 py-8 font-black font-mono text-[11px] text-[#eff8ee]">#{order.display_id || order.id.slice(-8).toUpperCase()}</td>
                      <td className="px-10 py-8 text-xs text-[#eff8ee]/40 font-medium">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-10 py-8">
                        <Badge className={cn(
                          "rounded-full px-4 py-1 text-[8px] font-black uppercase tracking-[0.2em] border-none shadow-none",
                          order.status === 'completed' || order.status === 'DELIVERED' 
                            ? "bg-emerald-400/10 text-emerald-400" 
                            : "bg-amber-400/10 text-amber-400"
                        )}>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="px-10 py-8 font-bold text-sm text-[#eff8ee]">${Number(order.totalAmount).toFixed(2)}</td>
                      <td className="px-10 py-8 text-right">
                        <Link href={`/account/orders/${order.id}`} className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[#EBB56B] hover:text-white transition-colors group/link">
                          Details
                          <ArrowRight className="size-3 group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

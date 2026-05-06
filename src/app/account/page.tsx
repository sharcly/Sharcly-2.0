"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, ArrowRight, MapPin, CreditCard } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { apiClient } from "@/lib/api-client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AccountPage() {
  const { user } = useAuth();
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const response = await apiClient.get("/orders/my-orders");
        setRecentOrders(response.data.orders?.slice(0, 3) || []);
      } catch (error) {
        console.error("Failed to fetch recent orders");
      } finally {
        setLoading(false);
      }
    };
    fetchRecentOrders();
  }, []);

  if (!user) return null;

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <section className="space-y-4">
        <h2 className="text-5xl md:text-6xl font-serif italic text-[#eff8ee]">
          Welcome back, <span className="text-[#EBB56B]">{user.name?.split(' ')[0] || 'Member'}</span>
        </h2>
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#eff8ee]/40">Your Private Collection & Orders</p>
      </section>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Recent Orders Card */}
        <div className="group relative">
          <div className="absolute inset-0 bg-[#EBB56B] rounded-[2.5rem] rotate-1 group-hover:rotate-0 transition-transform duration-500 opacity-5" />
          <div className="relative border border-white/5 rounded-[2.5rem] p-10 bg-[#0d2518] shadow-2xl hover:shadow-[#EBB56B]/5 transition-all duration-500 flex flex-col justify-between min-h-[350px]">
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-serif italic text-[#eff8ee]">Recent Orders</h3>
                <ShoppingBag className="size-5 text-[#EBB56B]" />
              </div>
              
              {loading ? (
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-16 bg-white/5 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <Link href={`/account/orders/${order.id}`} key={order.id} className="flex justify-between items-center p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#eff8ee]">#{order.id.slice(-8).toUpperCase()}</p>
                        <p className="text-[#eff8ee]/30 text-[10px] font-bold mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm text-[#eff8ee]">${Number(order.totalAmount).toFixed(2)}</p>
                        <p className="text-[8px] font-black uppercase tracking-widest text-emerald-400">{order.status}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center space-y-4">
                   <div className="size-12 rounded-full bg-white/5 flex items-center justify-center mx-auto opacity-20"><ShoppingBag className="size-5" /></div>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-[#eff8ee]/30">No recent orders found</p>
                </div>
              )}
            </div>
            
            <Link href="/account/orders" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#eff8ee] group/btn pt-8">
              <span>{recentOrders.length > 0 ? "Browse History" : "Start Shopping"}</span>
              <div className="size-8 rounded-full bg-[#EBB56B] flex items-center justify-center text-[#040e07] group-hover/btn:translate-x-1 transition-transform">
                <ArrowRight className="size-3.5" />
              </div>
            </Link>
          </div>
        </div>

        {/* Profile Card */}
        <div className="group relative">
          <div className="absolute inset-0 bg-[#EBB56B] rounded-[2.5rem] -rotate-1 group-hover:rotate-0 transition-transform duration-500 opacity-5" />
          <div className="relative border border-white/5 rounded-[2.5rem] p-10 bg-[#0d2518] shadow-2xl hover:shadow-[#EBB56B]/5 transition-all duration-500 flex flex-col justify-between min-h-[350px]">
             <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-serif italic text-[#eff8ee]">Identity</h3>
                  <div className="size-10 rounded-full bg-[#EBB56B] flex items-center justify-center text-[#040e07] text-xs font-bold uppercase">{user.name?.charAt(0)}</div>
                </div>
                
                <div className="space-y-6">
                   <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase tracking-widest text-[#eff8ee]/30">Display Name</p>
                      <p className="text-xl font-bold tracking-tight text-[#eff8ee]">{user.name}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase tracking-widest text-[#eff8ee]/30">Email Address</p>
                      <p className="text-sm font-medium text-[#eff8ee]/60 italic">{user.email}</p>
                   </div>
                   <div className="pt-4 flex gap-2">
                      <div className="px-4 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-[8px] font-black uppercase tracking-widest text-emerald-400">Verified Member</div>
                      <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-[8px] font-black uppercase tracking-widest text-[#eff8ee]/40">Active since {new Date((user as any).createdAt).getFullYear()}</div>
                   </div>
                </div>
             </div>

             <Link href="/account/profile" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#eff8ee] group/btn pt-8">
              <span>Personalize Profile</span>
              <div className="size-8 rounded-full bg-[#EBB56B] flex items-center justify-center text-[#040e07] group-hover/btn:translate-x-1 transition-transform">
                <ArrowRight className="size-3.5" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-16 border-t border-white/5">
        {[
          { title: "Order History", desc: "Review your past purchases and track deliveries.", href: "/account/orders", icon: ShoppingBag },
          { title: "Shipping Hub", desc: "Add or edit your premium delivery locations.", href: "/account/addresses", icon: MapPin }
        ].map((link) => (
          <Link key={link.href} href={link.href} className="group p-8 rounded-[2rem] border border-white/5 hover:border-[#EBB56B]/50 bg-[#0d2518]/50 hover:bg-[#0d2518] hover:shadow-2xl hover:shadow-[#EBB56B]/5 transition-all duration-500 space-y-4">
             <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#EBB56B] group-hover:bg-[#EBB56B] group-hover:text-[#040e07] transition-colors duration-500">
                <link.icon className="size-5" />
             </div>
             <div>
                <h4 className="text-lg font-serif italic text-[#eff8ee]">{link.title}</h4>
                <p className="text-[10px] font-medium text-[#eff8ee]/40 leading-relaxed mt-1">{link.desc}</p>
             </div>
          </Link>
        ))}
      </section>
    </div>
  );
}

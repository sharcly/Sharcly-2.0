"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ShoppingBag, 
  MapPin, 
  Settings, 
  CreditCard,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AccountPage() {
  const { user } = useAuth();

  const quickStats = [
    { label: "Total Orders", value: "0", icon: ShoppingBag, color: "text-blue-500" },
    { label: "Active Subs", value: "0", icon: Sparkles, color: "text-orange-500" },
    { label: "Saved Places", value: "0", icon: MapPin, color: "text-green-500" },
  ];

  if (!user) return null;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-px w-8 bg-[#062D1B]/20" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#062D1B]/50">Member Dashboard</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#062D1B]">
            Welcome back, <span className="text-[#EBB56B] italic font-serif">{user.name.split(' ')[0]}</span>.
          </h2>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {quickStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-3xl bg-white border border-black/5 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl bg-neutral-50 group-hover:bg-[#062D1B] group-hover:text-white transition-all`}>
                <stat.icon className="size-5" />
              </div>
              <span className="text-3xl font-black tracking-tighter">{stat.value}</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#062D1B]/30">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Recent Orders */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold tracking-tight">Recent Orders</h3>
            <Link href="/account/orders" className="text-xs font-bold uppercase tracking-widest text-[#EBB56B] hover:text-[#062D1B] transition-colors flex items-center gap-2 group">
              View All <ArrowRight className="size-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="p-12 text-center bg-white border border-dashed border-black/10 rounded-[2.5rem]">
            <div className="size-20 rounded-full bg-neutral-50 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="size-8 opacity-10" />
            </div>
            <p className="text-sm font-medium text-gray-400">You haven't placed any orders yet.</p>
            <Link href="/products" className="inline-block mt-8 px-8 h-12 rounded-xl bg-[#062D1B] text-white text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all leading-[48px]">
              Start Shopping
            </Link>
          </div>
        </section>

        {/* Profile Card */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold tracking-tight">Personal Details</h3>
          <div className="bg-[#062D1B] rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 size-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl transition-transform duration-1000 group-hover:scale-110" />
            
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-6">
                <div className="size-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-2xl font-black">
                  {user.name[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-xl font-bold tracking-tight">{user.name}</p>
                  <p className="text-white/40 text-sm font-medium">{user.email}</p>
                </div>
              </div>

              <div className="h-px w-full bg-white/10" />

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Member Since</p>
                  <p className="font-bold">May 2024</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Tier Level</p>
                  <p className="font-bold text-[#EBB56B]">Gold Member</p>
                </div>
              </div>

              <Link href="/account/profile" className="flex items-center justify-center w-full h-14 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                Edit Profile Settings
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

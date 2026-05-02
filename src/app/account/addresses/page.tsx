"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { motion } from "framer-motion";
import { 
  MapPin, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mocking addresses for now
    setAddresses([
      {
        id: "addr_1",
        name: "Home",
        first_name: "John",
        last_name: "Doe",
        address_1: "123 Hemp Street",
        city: "Wellness Valley",
        province: "CA",
        postal_code: "90210",
        country_code: "US",
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
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#062D1B]/50">Managed Locations</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#062D1B]">
            Saved <span className="text-[#EBB56B] italic font-serif">Addresses</span>.
          </h2>
        </div>
        
        <Button className="h-14 px-8 rounded-2xl bg-[#062D1B] hover:bg-black text-white text-[10px] font-black uppercase tracking-widest gap-3 shadow-xl shadow-[#062D1B]/10 transition-all">
          <Plus className="size-4" /> Add New Address
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {loading ? (
          [...Array(2)].map((_, i) => (
            <div key={i} className="h-64 bg-white border border-black/5 rounded-[2.5rem] animate-pulse" />
          ))
        ) : addresses.length === 0 ? (
          <div className="md:col-span-2 p-20 text-center bg-white border border-dashed border-black/10 rounded-[3rem]">
            <MapPin className="size-12 opacity-10 mx-auto mb-6" />
            <p className="text-sm font-medium text-gray-400">No saved addresses found.</p>
          </div>
        ) : (
          addresses.map((address, i) => (
            <motion.div
              key={address.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="group relative bg-white border border-black/5 rounded-[2.5rem] p-10 hover:shadow-2xl transition-all"
            >
              {address.is_default && (
                <Badge className="absolute top-8 right-8 bg-emerald-500/10 text-emerald-600 border-none px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full">
                  Primary Sequence
                </Badge>
              )}
              
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-neutral-50 flex items-center justify-center text-[#062D1B] group-hover:bg-[#062D1B] group-hover:text-white transition-all">
                    <MapPin className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg tracking-tight">{address.name}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#062D1B]/30">Shipping Destination</p>
                  </div>
                </div>

                <div className="space-y-1 font-medium text-[#062D1B]/70 leading-relaxed">
                  <p className="font-bold text-[#062D1B]">{address.first_name} {address.last_name}</p>
                  <p>{address.address_1}</p>
                  <p>{address.city}, {address.province} {address.postal_code}</p>
                  <p className="uppercase tracking-widest text-xs font-bold opacity-40">{address.country_code}</p>
                </div>

                <div className="flex items-center gap-3 pt-6 border-t border-black/5">
                   <button className="flex-1 h-12 rounded-xl bg-neutral-50 hover:bg-[#062D1B] hover:text-white text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                     <Edit3 className="size-3" /> Edit
                   </button>
                   <button className="size-12 rounded-xl bg-neutral-50 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center">
                     <Trash2 className="size-4" />
                   </button>
                </div>
              </div>
            </motion.div>
          ))
        )}

        {/* Add Shortcut */}
        <button className="h-64 border-2 border-dashed border-black/5 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 hover:border-[#EBB56B]/40 hover:bg-[#EBB56B]/5 transition-all group">
           <div className="size-14 rounded-full bg-neutral-50 flex items-center justify-center group-hover:scale-110 transition-transform">
             <Plus className="size-6 opacity-20" />
           </div>
           <p className="text-[10px] font-black uppercase tracking-widest opacity-20">Initialize New Destination</p>
        </button>
      </div>
      
      {/* Visual Support */}
      <div className="p-10 rounded-[3rem] bg-[#062D1B] text-white relative overflow-hidden group">
         <div className="absolute top-0 right-0 size-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl" />
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="size-20 rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shrink-0">
               <Sparkles className="size-10 text-[#EBB56B]" />
            </div>
            <div className="flex-1 text-center md:text-left space-y-2">
               <h4 className="text-2xl font-bold tracking-tight">Sync Your Sequence.</h4>
               <p className="text-white/40 text-sm font-medium max-w-xl">Save your preferred shipping destinations for a faster, frictionless checkout experience. Every address is encrypted and secure.</p>
            </div>
            <button className="h-14 px-8 rounded-2xl bg-[#EBB56B] text-[#062D1B] text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all whitespace-nowrap">
               Enable Fast-Check
            </button>
         </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { MapPin, Plus, Trash2, Edit3, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = async () => {
    try {
      const response = await apiClient.get("/addresses");
      setAddresses(response.data.addresses || []);
    } catch (error) {
      console.error("Failed to fetch addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/addresses/${id}`);
      toast.success("Address deleted");
      setAddresses(addresses.filter(a => a.id !== id));
    } catch (error) {
      toast.error("Failed to delete address");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await apiClient.patch(`/addresses/${id}/default`);
      toast.success("Default address updated");
      fetchAddresses();
    } catch (error) {
      toast.error("Failed to update default address");
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/5 pb-8">
        <div className="space-y-2">
          <h2 className="text-4xl font-serif italic text-[#eff8ee]">Shipping <span className="text-[#EBB56B]">Hub</span></h2>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#eff8ee]/40">Manage your premium delivery locations</p>
        </div>
        <Button className="h-12 px-8 rounded-full bg-[#EBB56B] hover:opacity-90 text-[#040e07] text-[10px] font-black uppercase tracking-[0.2em] gap-3 transition-all shadow-xl shadow-[#EBB56B]/10">
          <Plus className="size-4" /> New Address
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {loading ? (
          [...Array(2)].map((_, i) => (
            <div key={i} className="h-48 bg-white/5 rounded-[2rem] animate-pulse" />
          ))
        ) : addresses.length === 0 ? (
          <div className="md:col-span-2 py-20 text-center border border-dashed border-white/10 rounded-[2.5rem]">
            <MapPin className="size-10 opacity-10 mx-auto mb-4" />
            <p className="text-[#eff8ee]/40 text-[10px] font-bold uppercase tracking-widest">No saved addresses found</p>
          </div>
        ) : (
          addresses.map((address) => (
            <div
              key={address.id}
              className="group relative bg-[#0d2518] border border-white/5 rounded-[2rem] p-8 shadow-2xl hover:shadow-[#EBB56B]/5 transition-all duration-500"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-2">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#eff8ee]/40">{address.name || "Default Address"}</h3>
                  {address.is_default && (
                    <Badge className="bg-emerald-400/10 text-emerald-400 border-none px-4 py-1 text-[8px] font-black uppercase tracking-widest rounded-full shadow-none">
                      Primary
                    </Badge>
                  )}
                </div>
                <div className="flex gap-1">
                  {!address.is_default && (
                    <button 
                      onClick={() => handleSetDefault(address.id)}
                      className="size-10 rounded-full hover:bg-[#EBB56B] hover:text-[#040e07] text-[#eff8ee]/20 transition-all flex items-center justify-center"
                      title="Set as primary"
                    >
                      <MapPin className="size-4" />
                    </button>
                  )}
                  <button className="size-10 rounded-full hover:bg-white/5 text-[#eff8ee]/20 hover:text-[#eff8ee] transition-all flex items-center justify-center">
                    <Edit3 className="size-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(address.id)}
                    className="size-10 rounded-full hover:bg-red-400/10 text-[#eff8ee]/20 hover:text-red-400 transition-all flex items-center justify-center"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-xl font-serif italic text-[#eff8ee]">{address.first_name} {address.last_name}</p>
                <div className="space-y-0.5 text-[11px] font-medium text-[#eff8ee]/40 tracking-wide">
                  <p>{address.street || address.address_1}</p>
                  <p>{address.city}, {address.state || address.province} {address.zipCode || address.postal_code}</p>
                  <p className="uppercase opacity-40">{address.country}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

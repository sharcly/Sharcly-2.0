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
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-[#062D1B]">Shipping Addresses</h2>
          <p className="text-gray-500">Manage your saved addresses for a faster checkout experience.</p>
        </div>
        <Button className="h-10 px-6 rounded-lg bg-[#062D1B] hover:opacity-90 text-white text-xs font-bold gap-2 transition-all">
          <Plus className="size-4" /> Add Address
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {loading ? (
          [...Array(2)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-50 rounded-xl animate-pulse" />
          ))
        ) : addresses.length === 0 ? (
          <div className="md:col-span-2 py-20 text-center border border-dashed border-gray-200 rounded-2xl">
            <MapPin className="size-10 opacity-10 mx-auto mb-4" />
            <p className="text-gray-400">No saved addresses found.</p>
          </div>
        ) : (
          addresses.map((address) => (
            <div
              key={address.id}
              className="group relative bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:border-[#062D1B] transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <h3 className="font-bold">{address.name}</h3>
                  {address.is_default && (
                    <Badge className="bg-emerald-50 text-emerald-600 border-none px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-full shadow-none">
                      Default
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  {!address.isDefault && (
                    <button 
                      onClick={() => handleSetDefault(address.id)}
                      className="text-[10px] font-bold text-[#062D1B] hover:underline"
                    >
                      Set as default
                    </button>
                  )}
                  <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#062D1B] transition-colors">
                    <Edit3 className="size-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(address.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-1 text-sm text-gray-500">
                <p className="font-bold text-[#062D1B]">{address.first_name} {address.last_name}</p>
                <p>{address.street || address.address_1}</p>
                <p>{address.city}, {address.state || address.province} {address.zipCode || address.postal_code}</p>
                <p className="uppercase">{address.country}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

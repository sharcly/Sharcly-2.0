"use client";

import { useState, useEffect } from "react";
import { Search, Mail, Phone, Calendar, Tag, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { format } from "date-fns";

export default function OfferClaimsPage() {
  const [claims, setClaims] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const response = await apiClient.get("/marketing/claims");
      setClaims(response.data);
    } catch (error) {
      toast.error("Failed to fetch claims");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClaims = claims.filter(claim => 
    claim.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    claim.phone.includes(searchQuery) ||
    claim.couponCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 italic serif">Offer Claims</h2>
          <p className="text-sm text-neutral-500 font-medium">View and track leads captured through the welcome popup.</p>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
          <Input 
            placeholder="Search email, phone or code..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="h-10 pl-10 rounded-xl border-neutral-100 bg-neutral-50/50"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-black/5 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/50 border-b border-neutral-50">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Visitor Info</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Offer Claimed</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Coupon Generated</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Date Captured</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {filteredClaims.map((claim) => (
                <tr key={claim.id} className="hover:bg-neutral-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-bold text-neutral-900">
                        <Mail size={12} className="text-neutral-300" />
                        {claim.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-neutral-400">
                        <Phone size={12} className="text-neutral-300" />
                        {claim.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Tag size={14} />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-neutral-900">{claim.welcomeOffer?.title}</p>
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{claim.welcomeOffer?.discount}% OFF</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-600 text-[11px] font-black tracking-widest uppercase">
                      {claim.couponCode}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-400 font-medium">
                      <Calendar size={12} />
                      {format(new Date(claim.createdAt), "MMM d, yyyy • HH:mm")}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredClaims.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="space-y-3">
                      <div className="size-12 bg-neutral-50 rounded-xl flex items-center justify-center mx-auto text-neutral-200">
                        <User size={24} />
                      </div>
                      <p className="text-sm font-medium text-neutral-400">No claims found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

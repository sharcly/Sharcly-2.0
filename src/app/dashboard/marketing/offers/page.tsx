"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Gift, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import OfferDrawer from "@/components/admin/OfferDrawer";

export default function WelcomeOffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<any>(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await apiClient.get("/marketing/offers");
      setOffers(response.data);
    } catch (error) {
      toast.error("Failed to fetch offers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDrawer = (offer: any = null) => {
    setEditingOffer(offer);
    setIsDrawerOpen(true);
  };

  const handleSave = async (formData: any) => {
    try {
      const data = new FormData();
      
      // Append basic fields
      data.append("title", formData.title);
      data.append("subtitle", formData.subtitle || "");
      data.append("description", formData.description);
      data.append("discount", formData.discount);
      data.append("discountType", formData.discountType);
      data.append("step2Title", formData.step2Title || "");
      data.append("step2Text", formData.step2Text || "");
      data.append("footerText", formData.footerText || "");
      data.append("isActive", String(formData.isActive));
      
      // Append complex fields
      data.append("options", JSON.stringify(formData.options));
      
      // Append file if present
      if (formData.imageFile) {
        data.append("image", formData.imageFile);
      } else if (formData.image) {
        // If no new file but existing image path
        data.append("image", formData.image);
      }

      if (editingOffer) {
        await apiClient.put(`/marketing/offers/${editingOffer.id}`, data, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Offer updated successfully");
      } else {
        await apiClient.post("/marketing/offers", data, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Offer created successfully");
      }
      setIsDrawerOpen(false);
      fetchOffers();
    } catch (error) {
      toast.error("Failed to save offer");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;
    try {
      await apiClient.delete(`/marketing/offers/${id}`);
      toast.success("Offer deleted");
      fetchOffers();
    } catch (error) {
      toast.error("Failed to delete offer");
    }
  };

  const toggleStatus = async (offer: any) => {
    try {
      await apiClient.put(`/marketing/offers/${offer.id}`, {
        isActive: !offer.isActive
      });
      fetchOffers();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 italic serif">Welcome Offers</h2>
          <p className="text-sm text-neutral-500 font-medium">Manage the offers displayed in the visitor welcome popup.</p>
        </div>
        <Button 
          onClick={() => handleOpenDrawer()}
          className="h-11 px-6 rounded-xl premium-gradient font-bold shadow-lg gap-2 border-none"
        >
          <Plus className="size-4" /> Create Offer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <Card key={offer.id} className="border-black/5 shadow-sm rounded-2xl overflow-hidden bg-white group hover:shadow-md transition-shadow">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className={`size-12 rounded-2xl flex items-center justify-center ${offer.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-neutral-50 text-neutral-400'}`}>
                  <Gift size={24} />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleOpenDrawer(offer)}
                    className="size-8 rounded-lg bg-neutral-50 flex items-center justify-center text-neutral-400 hover:text-neutral-900 transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={() => handleDelete(offer.id)}
                    className="size-8 rounded-lg bg-red-50 flex items-center justify-center text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-neutral-900">{offer.title}</h3>
                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{offer.subtitle || 'No Subtitle'}</p>
                <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">{offer.description}</p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-emerald-600">
                    {offer.discountType === "FIXED" ? "$" : ""}{offer.discount}{offer.discountType === "PERCENTAGE" ? "%" : ""}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-300">Off</span>
                </div>
                <button 
                  onClick={() => toggleStatus(offer)}
                  className="flex items-center gap-2"
                >
                  {offer.isActive ? (
                    <ToggleRight className="text-emerald-500" size={28} />
                  ) : (
                    <ToggleLeft className="text-neutral-200" size={28} />
                  )}
                </button>
              </div>
            </CardContent>
          </Card>
        ))}

        {offers.length === 0 && !isLoading && (
          <div className="col-span-full py-20 text-center space-y-4 bg-neutral-50 rounded-[2.5rem] border-2 border-dashed border-neutral-100">
             <div className="size-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm text-neutral-200">
                <Gift size={32} />
             </div>
             <p className="text-sm font-medium text-neutral-400">No welcome offers created yet.</p>
          </div>
        )}
      </div>

      <OfferDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSave}
        initialData={editingOffer}
      />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Gift, Save, X, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function WelcomeOffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discount: "",
    isActive: true
  });

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

  const handleOpenModal = (offer: any = null) => {
    if (offer) {
      setEditingOffer(offer);
      setFormData({
        title: offer.title,
        description: offer.description,
        discount: offer.discount.toString(),
        isActive: offer.isActive
      });
    } else {
      setEditingOffer(null);
      setFormData({
        title: "",
        description: "",
        discount: "",
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingOffer) {
        await apiClient.put(`/marketing/offers/${editingOffer.id}`, formData);
        toast.success("Offer updated successfully");
      } else {
        await apiClient.post("/marketing/offers", formData);
        toast.success("Offer created successfully");
      }
      setIsModalOpen(false);
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
          onClick={() => handleOpenModal()}
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
                    onClick={() => handleOpenModal(offer)}
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
                <p className="text-xs text-neutral-400 leading-relaxed">{offer.description}</p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-emerald-600">{offer.discount}%</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-300">Discount</span>
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

      {/* Offer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8 border-b border-neutral-50 flex justify-between items-center bg-neutral-50/50">
              <h3 className="text-xl font-bold italic serif">{editingOffer ? 'Edit Offer' : 'New Offer'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-neutral-900 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest">Offer Title</Label>
                  <Input 
                    placeholder="e.g. 15% Welcome Gift"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    required
                    className="h-12 rounded-xl border-neutral-100 bg-neutral-50/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest">Description</Label>
                  <Textarea 
                    placeholder="Briefly describe what the user gets"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    required
                    className="rounded-xl border-neutral-100 bg-neutral-50/50 min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest">Discount Percentage (%)</Label>
                  <Input 
                    type="number"
                    placeholder="15"
                    value={formData.discount}
                    onChange={e => setFormData({...formData, discount: e.target.value})}
                    required
                    className="h-12 rounded-xl border-neutral-100 bg-neutral-50/50"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest">Active Status</Label>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                  >
                    {formData.isActive ? (
                      <ToggleRight className="text-emerald-500" size={32} />
                    ) : (
                      <ToggleLeft className="text-neutral-200" size={32} />
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 h-12 rounded-xl border-neutral-100"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 h-12 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-bold border-none"
                >
                  <Save className="size-4 mr-2" /> {editingOffer ? 'Update' : 'Save Offer'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

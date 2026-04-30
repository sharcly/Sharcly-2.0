"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, X, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: any;
  onSuccess: () => void;
}

export function PlanModal({ isOpen, onClose, plan, onSuccess }: PlanModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    minOrder: "",
    discount: "",
    features: [""] as string[],
    featured: false
  });

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name,
        minOrder: plan.minOrder,
        discount: plan.discount,
        features: Array.isArray(plan.features) ? [...plan.features] : [""],
        featured: plan.featured
      });
    } else {
      setFormData({
        name: "",
        minOrder: "",
        discount: "",
        features: [""],
        featured: false
      });
    }
  }, [plan, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (plan) {
        await apiClient.put(`/wholesale/plans/${plan.id}`, formData);
        toast.success("Tier updated successfully");
      } else {
        await apiClient.post("/wholesale/plans", formData);
        toast.success("New tier created successfully");
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ""] });
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl rounded-[2.5rem] border-none p-0 bg-[#f0f9f0] shadow-2xl overflow-hidden">
        <div className="p-10 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="mb-10">
            <DialogTitle className="text-4xl font-serif text-[#0d2719]">
              {plan ? "Edit Tier" : "Create New Tier"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-black/30 ml-1">Tier Name</Label>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Retailer"
                  required
                  className="h-14 bg-white border-none rounded-2xl focus:ring-2 focus:ring-[#0d2719]/10 transition-all shadow-sm font-medium"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-black/30 ml-1">Min. Order</Label>
                <Input 
                  value={formData.minOrder}
                  onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
                  placeholder="Ex: $500"
                  required
                  className="h-14 bg-white border-none rounded-2xl focus:ring-2 focus:ring-[#0d2719]/10 transition-all shadow-sm font-medium"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-black/30 ml-1">Discount Text</Label>
              <Input 
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                placeholder="Ex: 20% off"
                required
                className="h-14 bg-white border-none rounded-2xl focus:ring-2 focus:ring-[#0d2719]/10 transition-all shadow-sm font-medium"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between ml-1">
                <Label className="text-[10px] font-black uppercase tracking-widest text-black/30">Features / Benefits</Label>
                <Button 
                  type="button" 
                  onClick={addFeature}
                  variant="ghost" 
                  size="sm"
                  className="h-8 rounded-lg text-[#0d2719] hover:bg-[#0d2719]/5 font-black uppercase tracking-widest text-[9px]"
                >
                  <Plus className="w-3 h-3 mr-1" /> Add Feature
                </Button>
              </div>
              <div className="space-y-3">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2 group">
                    <div className="relative flex-1">
                      <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                      <Input 
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        placeholder="Feature description..."
                        required
                        className="h-12 pl-12 bg-white border-none rounded-xl focus:ring-2 focus:ring-[#0d2719]/10 transition-all shadow-sm text-sm font-medium"
                      />
                    </div>
                    <Button 
                      type="button" 
                      onClick={() => removeFeature(index)}
                      variant="ghost" 
                      size="icon"
                      className="h-12 w-12 rounded-xl text-rose-500 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-6 bg-white rounded-3xl shadow-sm border border-[#0d2719]/5">
              <div className="space-y-1">
                <p className="font-bold text-[#0d2719]">Featured Tier</p>
                <p className="text-[10px] font-medium text-black/40 uppercase tracking-wider">Highlight this plan with a premium dark theme</p>
              </div>
              <Switch 
                checked={formData.featured}
                onCheckedChange={(val) => setFormData({ ...formData, featured: val })}
                className="data-[state=checked]:bg-[#0d2719]"
              />
            </div>

            <div className="flex gap-4 pt-6">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={onClose}
                className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] text-[#0d2719]/40 hover:bg-[#0d2719]/5 transition-all"
              >
                Cancel
              </Button>
              <Button 
                disabled={isSubmitting}
                className="flex-[2] h-14 bg-[#0d2719] hover:bg-[#1a3d2b] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-[#0d2719]/20 transition-all active:scale-95"
              >
                {isSubmitting ? "Saving..." : plan ? "Update Tier" : "Create Tier"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Edit2, 
  CheckCircle2, 
  AlertCircle,
  Package,
  Layers,
  Star,
  Save,
  X,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api-client";
import { motion, AnimatePresence } from "framer-motion";

interface Plan {
  id: string;
  name: string;
  minOrder: string;
  discount: string;
  features: string[];
  featured: boolean;
}

export function PlansManagement() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Partial<Plan> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get("/wholesale/plans");
      if (response.data.success) {
        setPlans(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSave = async () => {
    if (!editingPlan?.name || !editingPlan?.discount) return;
    
    setIsSaving(true);
    try {
      if (editingPlan.id) {
        await apiClient.put(`/wholesale/plans/${editingPlan.id}`, editingPlan);
      } else {
        await apiClient.post("/wholesale/plans", editingPlan);
      }
      setIsModalOpen(false);
      fetchPlans();
    } catch (error) {
      console.error("Failed to save plan:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    try {
      await apiClient.delete(`/wholesale/plans/${id}`);
      fetchPlans();
    } catch (error) {
      console.error("Failed to delete plan:", error);
    }
  };

  const addFeature = () => {
    setEditingPlan({
      ...editingPlan,
      features: [...(editingPlan?.features || []), ""]
    });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...(editingPlan?.features || [])];
    newFeatures[index] = value;
    setEditingPlan({ ...editingPlan, features: newFeatures });
  };

  const removeFeature = (index: number) => {
    const newFeatures = [...(editingPlan?.features || [])];
    newFeatures.splice(index, 1);
    setEditingPlan({ ...editingPlan, features: newFeatures });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-black tracking-tight text-neutral-900">Partner Tiers</h3>
          <p className="text-sm text-neutral-500 font-medium">Control what pricing and benefits your wholesale partners see on the public page.</p>
        </div>
        <Button 
          onClick={() => {
            setEditingPlan({ name: "", discount: "", minOrder: "", features: [""], featured: false });
            setIsModalOpen(true);
          }}
          className="h-12 px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-600/20 gap-2"
        >
          <Plus className="size-4" /> Add New Tier
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="p-8 rounded-[2.5rem] bg-white border border-neutral-100 space-y-6">
              <Skeleton className="h-8 w-32 rounded-lg" />
              <Skeleton className="h-12 w-48 rounded-lg" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full rounded-full" />
                <Skeleton className="h-4 w-full rounded-full" />
                <Skeleton className="h-4 w-2/3 rounded-full" />
              </div>
            </div>
          ))
        ) : plans.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-neutral-200">
             <div className="size-16 rounded-3xl bg-neutral-50 flex items-center justify-center mx-auto mb-4 text-neutral-300">
                <Package className="size-8" />
             </div>
             <p className="font-black uppercase tracking-widest text-neutral-400 text-xs">No pricing tiers defined</p>
          </div>
        ) : (
          plans.map((plan) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              key={plan.id}
              className={`group relative p-8 rounded-[2.5rem] bg-white border transition-all duration-500 ${
                plan.featured ? "border-emerald-500 ring-4 ring-emerald-500/5 shadow-2xl" : "border-neutral-100 shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between mb-8">
                <div>
                   <h4 className="text-2xl font-black tracking-tight text-neutral-900 leading-tight">{plan.name}</h4>
                   <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mt-1">{plan.discount}</p>
                </div>
                {plan.featured && (
                  <div className="px-3 py-1 bg-emerald-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-600/20">
                     Featured
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-2 text-neutral-400">
                   <Layers className="size-3.5" />
                   <p className="text-[10px] font-black uppercase tracking-widest">Included Benefits</p>
                </div>
                <div className="space-y-3">
                  {plan.features.slice(0, 3).map((f, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="size-4 text-emerald-500" />
                      <span className="text-sm font-bold text-neutral-700">{f}</span>
                    </div>
                  ))}
                  {plan.features.length > 3 && (
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-7">+{plan.features.length - 3} more</p>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-50 flex items-center justify-between">
                 <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Min. {plan.minOrder}</p>
                 <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => {
                        setEditingPlan(plan);
                        setIsModalOpen(true);
                      }}
                      className="size-10 rounded-xl hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900 transition-all"
                    >
                      <Edit2 className="size-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(plan.id)}
                      className="size-10 rounded-xl hover:bg-rose-50 text-neutral-400 hover:text-rose-500 transition-all"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                 </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-xl rounded-[2.5rem] border-none p-0 bg-white shadow-2xl overflow-hidden">
          <div className="bg-neutral-900 p-8 text-white">
            <h2 className="text-2xl font-black tracking-tight">{editingPlan?.id ? "Edit Tier" : "New Tier"}</h2>
            <p className="text-white/40 text-xs font-bold mt-1">Define partnership levels and benefits.</p>
          </div>
          
          <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Tier Name</Label>
                <Input 
                  value={editingPlan?.name} 
                  onChange={(e) => setEditingPlan({...editingPlan, name: e.target.value})}
                  placeholder="e.g. Growth Partner"
                  className="h-14 bg-neutral-50 border-none rounded-xl font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Min. Order</Label>
                <Input 
                  value={editingPlan?.minOrder} 
                  onChange={(e) => setEditingPlan({...editingPlan, minOrder: e.target.value})}
                  placeholder="e.g. $2,500"
                  className="h-14 bg-neutral-50 border-none rounded-xl font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Discount/Benefit</Label>
                <Input 
                  value={editingPlan?.discount} 
                  onChange={(e) => setEditingPlan({...editingPlan, discount: e.target.value})}
                  placeholder="e.g. 35% Off"
                  className="h-14 bg-neutral-50 border-none rounded-xl font-bold"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl mt-4">
                 <div className="space-y-0.5">
                    <p className="text-sm font-black text-neutral-900">Featured Tier</p>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Mark as most popular</p>
                 </div>
                 <Switch 
                   checked={editingPlan?.featured} 
                   onCheckedChange={(checked) => setEditingPlan({...editingPlan, featured: checked})}
                 />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                 <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Key Features & Benefits</Label>
                 <Button variant="ghost" onClick={addFeature} className="h-8 text-emerald-600 font-black uppercase tracking-widest text-[9px] gap-1.5 hover:bg-emerald-50">
                    <Plus className="size-3" /> Add Feature
                 </Button>
              </div>
              <div className="space-y-3">
                {editingPlan?.features?.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 group">
                    <div className="flex-1 relative">
                       <Input 
                         value={feature} 
                         onChange={(e) => updateFeature(i, e.target.value)}
                         placeholder="Benefit description..."
                         className="h-12 bg-neutral-50 border-none rounded-xl font-bold pl-4 pr-10"
                       />
                       <button 
                         onClick={() => removeFeature(i)}
                         className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-neutral-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                       >
                          <X className="size-3.5" />
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="p-8 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between gap-4">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] text-neutral-400">
               Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="h-14 px-10 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-600/20 gap-2 flex-1"
            >
              {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              {editingPlan?.id ? "Update Tier" : "Save Tier"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

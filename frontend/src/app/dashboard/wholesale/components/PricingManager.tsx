"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, Star, CheckCircle2 } from "lucide-react";
import { PlanModal } from "./PlanModal";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export function PricingManager() {
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    
    try {
      await apiClient.delete(`/wholesale/plans/${id}`);
      toast.success("Plan deleted successfully");
      fetchPlans();
    } catch (error) {
      toast.error("Failed to delete plan");
    }
  };

  const handleEdit = (plan: any) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedPlan(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <Button 
          onClick={handleAdd}
          className="h-14 px-8 bg-[#0d2719] hover:bg-[#1a3d2b] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-[#0d2719]/20 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4 mr-2" /> Add New Tier
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="p-10 rounded-[3rem] bg-white border border-[#0d2719]/5 space-y-6">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-12 w-24" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[80%]" />
              </div>
              <div className="flex gap-4 pt-6">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </div>
          ))
        ) : plans.length === 0 ? (
          <div className="col-span-full h-[400px] flex flex-col items-center justify-center space-y-6 opacity-30">
            <Plus className="w-16 h-16" />
            <div className="text-center">
              <p className="font-serif text-2xl text-[#0d2719]">No pricing plans found</p>
              <p className="font-medium">Click the button above to create your first tier.</p>
            </div>
          </div>
        ) : (
          plans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative p-10 rounded-[3rem] border transition-all duration-500 flex flex-col ${
                plan.featured 
                  ? 'bg-[#0d2719] border-[#0d2719] shadow-2xl shadow-[#0d2719]/20' 
                  : 'bg-white border-[#0d2719]/5 hover:shadow-xl'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-emerald-400 text-[#0d2719] rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2">
                  <Star className="w-3 h-3" /> Featured Tier
                </div>
              )}

              <div className="mb-10">
                <h3 className={`text-3xl font-serif mb-2 ${plan.featured ? 'text-white' : 'text-[#0d2719]'}`}>
                  {plan.name}
                </h3>
                <p className={`text-4xl font-serif ${plan.featured ? 'text-emerald-400' : 'text-[#0d2719]'}`}>
                  {plan.discount}
                </p>
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] mt-3 ${plan.featured ? 'text-white/40' : 'text-black/30'}`}>
                  Min. Order: {plan.minOrder}
                </p>
              </div>

              <div className="space-y-4 mb-12 flex-1">
                {(Array.isArray(plan.features) ? plan.features : []).map((feature: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className={`h-5 w-5 shrink-0 ${plan.featured ? 'text-emerald-400' : 'text-[#0d2719]'}`} />
                    <span className={`text-sm font-medium leading-relaxed ${plan.featured ? 'text-white/80' : 'text-black/70'}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={() => handleEdit(plan)}
                  variant="outline" 
                  className={`flex-1 h-12 rounded-xl font-bold uppercase tracking-widest text-[10px] ${
                    plan.featured 
                      ? 'border-white/20 text-white hover:bg-white/10' 
                      : 'border-[#0d2719]/10 text-[#0d2719] hover:bg-[#0d2719]/5'
                  }`}
                >
                  <Edit2 className="w-3 h-3 mr-2" /> Edit
                </Button>
                <Button 
                  onClick={() => handleDelete(plan.id)}
                  variant="outline"
                  className={`h-12 w-12 rounded-xl flex items-center justify-center p-0 transition-colors ${
                    plan.featured 
                      ? 'border-white/20 text-white hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-400/50' 
                      : 'border-[#0d2719]/10 text-[#0d2719] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <PlanModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        plan={selectedPlan}
        onSuccess={fetchPlans}
      />
    </div>
  );
}

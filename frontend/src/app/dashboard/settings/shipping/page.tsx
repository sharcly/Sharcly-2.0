"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Truck, Zap, Save, Loader2 } from "lucide-react";

export default function ShippingSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    shippingCharge: 0,
    freeShippingThreshold: 0,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get("/settings");
      if (data.success) {
        setSettings({
          shippingCharge: Number(data.settings.shippingCharge) || 0,
          freeShippingThreshold: Number(data.settings.freeShippingThreshold) || 0,
        });
      }
    } catch (error) {
      toast.error("Failed to load shipping settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.put("/settings", settings);
      toast.success("Shipping rates updated successfully");
    } catch (error) {
      toast.error("Failed to save shipping settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 text-neutral-200 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Shipping Rates</h2>
        <p className="text-sm text-neutral-500 font-medium">Configure how much customers pay for delivery and when they get it for free.</p>
      </div>

      <Card className="border-black/5 shadow-sm rounded-3xl overflow-hidden bg-white">
        <CardHeader className="p-8 border-b border-black/5 bg-neutral-50/50">
          <CardTitle className="text-lg font-bold">Delivery Pricing</CardTitle>
          <CardDescription className="text-xs">Set your base rates and free delivery qualification amount.</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSave} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">
                    <Truck className="size-4" />
                  </div>
                  <Label className="text-[10px] uppercase font-black text-black/40 tracking-widest text-orange-900/60">Standard Shipping Fee</Label>
                </div>
                <div className="relative">
                  <Input 
                    type="number" 
                    className="h-14 text-xl font-bold rounded-2xl bg-neutral-50 border-black/5 pl-10" 
                    value={settings.shippingCharge}
                    onChange={(e) => setSettings({...settings, shippingCharge: Number(e.target.value)})}
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-neutral-400">$</span>
                </div>
                <p className="text-[11px] text-neutral-400 font-medium line-height-relaxed italic">
                  This fee is applied to all orders that do not reach the free shipping threshold.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
                    <Zap className="size-4" />
                  </div>
                  <Label className="text-[10px] uppercase font-black text-black/40 tracking-widest text-blue-900/60">Free Shipping Min. Order</Label>
                </div>
                <div className="relative">
                  <Input 
                    type="number" 
                    className="h-14 text-xl font-bold rounded-2xl bg-neutral-50 border-black/5 pl-10" 
                    value={settings.freeShippingThreshold}
                    onChange={(e) => setSettings({...settings, freeShippingThreshold: Number(e.target.value)})}
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-neutral-400">$</span>
                </div>
                <p className="text-[11px] text-neutral-400 font-medium line-height-relaxed italic">
                  Customers will get free delivery if their cart total is equal to or higher than this amount.
                </p>
              </div>
            </div>

            <div className="pt-8 border-t border-black/5 flex justify-end">
              <Button type="submit" disabled={saving} className="h-14 px-12 rounded-2xl bg-neutral-900 text-white hover:bg-neutral-800 transition-all font-bold gap-3 shadow-xl">
                 {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="size-4" />}
                 {saving ? "Saving Changes..." : "Save Shipping Rates"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

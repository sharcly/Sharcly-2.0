"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Receipt, Save, Loader2, Info } from "lucide-react";

export default function TaxesSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    taxRate: 0,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get("/settings");
      if (data.success) {
        setSettings({
          taxRate: Number(data.settings.taxRate) || 0,
        });
      }
    } catch (error) {
      toast.error("Failed to load tax settings");
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
      toast.success("Tax rates updated successfully");
    } catch (error) {
      toast.error("Failed to save tax settings");
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
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Tax Configuration</h2>
        <p className="text-sm text-neutral-500 font-medium">Manage the global tax percentage applied to customer orders at checkout.</p>
      </div>

      <Card className="border-black/5 shadow-sm rounded-3xl overflow-hidden bg-white max-w-2xl">
        <CardHeader className="p-8 border-b border-black/5 bg-neutral-50/50">
          <CardTitle className="text-lg font-bold">Standard Tax Rate</CardTitle>
          <CardDescription className="text-xs">Set the default tax percentage for all sales.</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSave} className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center">
                  <Receipt className="size-4" />
                </div>
                <Label className="text-[10px] uppercase font-black text-black/40 tracking-widest text-emerald-900/60">Global Tax Percentage (%)</Label>
              </div>
              <div className="relative">
                <Input 
                  type="number" 
                  step="0.01"
                  className="h-20 text-4xl font-black rounded-2xl bg-neutral-50 border-black/5 pr-16" 
                  value={settings.taxRate}
                  onChange={(e) => setSettings({...settings, taxRate: Number(e.target.value)})}
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-neutral-300 text-2xl">%</span>
              </div>
              
              <div className="p-4 rounded-2xl bg-white border border-black/5 flex gap-4 items-start shadow-sm shadow-black/5">
                <Info className="size-5 text-neutral-400 shrink-0 mt-0.5" />
                <p className="text-xs text-neutral-500 font-normal leading-relaxed">
                  Important: This tax is calculated and added to the cart subtotal during the final payment processing step once the shipping address is confirmed.
                </p>
              </div>
            </div>

            <div className="pt-8 border-t border-black/5 flex justify-end">
              <Button type="submit" disabled={saving} className="h-14 px-12 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all font-bold gap-3 shadow-xl">
                 {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="size-4" />}
                 {saving ? "Applying..." : "Apply Tax Rate"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

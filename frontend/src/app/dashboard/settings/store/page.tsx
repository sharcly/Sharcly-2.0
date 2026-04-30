"use client";

import React, { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RefreshCw, Save } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StoreSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    storeName: "",
    supportEmail: "",
    currency: "USD",
    logoUrl: ""
  });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get("/settings/store");
      if (data.settings) {
        setSettings({
          storeName: data.settings.storeName || "",
          supportEmail: data.settings.supportEmail || "",
          currency: data.settings.currency || "USD",
          logoUrl: data.settings.logoUrl || ""
        });
      }
    } catch (error) {
      toast.error("Failed to load store configuration");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.patch("/settings/store", settings);
      toast.success("Store details updated successfully");
    } catch (error) {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="h-8 w-8 text-neutral-200 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Business Details</h2>
        <p className="text-sm text-neutral-500 font-medium">Manage your store's identity and basic commerce settings.</p>
      </div>

      <Card className="border-black/5 shadow-sm rounded-3xl overflow-hidden bg-white">
        <CardHeader className="p-8 border-b border-black/5 bg-neutral-50/50">
          <CardTitle className="text-lg font-bold">General Information</CardTitle>
          <CardDescription className="text-xs">These details will be used across your storefront and customer receipts.</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSave} className="space-y-8">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-3">
                <Label className="text-[10px] uppercase font-black text-black/40 tracking-widest">Store Name</Label>
                <Input 
                  value={settings.storeName} 
                  onChange={e => setSettings({...settings, storeName: e.target.value})}
                  className="h-12 rounded-xl bg-neutral-50 border-black/5 font-bold"
                  placeholder="e.g. Sharcly Boutique"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] uppercase font-black text-black/40 tracking-widest">Support Email</Label>
                <Input 
                  value={settings.supportEmail} 
                  onChange={e => setSettings({...settings, supportEmail: e.target.value})}
                  className="h-12 rounded-xl bg-neutral-50 border-black/5 font-medium"
                  placeholder="support@scarly.com"
                  type="email"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] uppercase font-black text-black/40 tracking-widest">Store Currency</Label>
                <Input 
                  value={settings.currency} 
                  onChange={e => setSettings({...settings, currency: e.target.value})}
                  className="h-12 rounded-xl bg-neutral-50 border-black/5 font-black uppercase"
                  placeholder="USD"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] uppercase font-black text-black/40 tracking-widest">Public Logo URL</Label>
                <Input 
                  value={settings.logoUrl} 
                  onChange={e => setSettings({...settings, logoUrl: e.target.value})}
                  className="h-12 rounded-xl bg-neutral-50 border-black/5"
                  placeholder="https://cloud.com/logo.png"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-black/5 flex justify-end">
              <Button type="submit" disabled={saving} className="h-14 px-12 rounded-2xl bg-neutral-900 text-white hover:bg-neutral-800 transition-all font-bold gap-3 shadow-xl">
                {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? "Saving Changes..." : "Save Business Details"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {/* Decorative Branding Footer */}
      <div className="flex items-center gap-4 px-4 opacity-5 hover:opacity-20 transition-opacity duration-700">
         <div className="h-[1px] flex-1 bg-neutral-900" />
         <span className="text-[9px] font-black uppercase tracking-[0.4em]">Store Management Node</span>
         <div className="h-[1px] flex-1 bg-neutral-900" />
      </div>
    </div>
  );
}

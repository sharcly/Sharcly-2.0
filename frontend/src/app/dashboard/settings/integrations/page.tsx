"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { 
  Plus, 
  Share2, 
  Trash2, 
  CheckCircle2, 
  Loader2, 
  ExternalLink, 
  Globe, 
  Shield, 
  Zap,
  MoreVertical,
  Eye,
  EyeOff
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PLATFORMS = [
  { id: "stripe", name: "Stripe", description: "Payments & Financial Infrastructure", color: "text-indigo-600", bg: "bg-indigo-50" },
  { id: "klaviyo", name: "Klaviyo", description: "Marketing & SMS Automation", color: "text-emerald-600", bg: "bg-emerald-50" },
  { id: "google_analytics", name: "Google Analytics", description: "Web Analytics & Performance", color: "text-amber-600", bg: "bg-amber-50" },
  { id: "mailchimp", name: "Mailchimp", description: "Email Marketing & CRM", color: "text-yellow-600", bg: "bg-yellow-50" },
  { id: "facebook_pixel", name: "Facebook Pixel", description: "Conversion Tracking & Ads", color: "text-blue-600", bg: "bg-blue-50" },
];

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showKey, setShowKey] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    platform: "",
    apiKey: "",
  });

  const fetchIntegrations = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get("/admin/integrations");
      setIntegrations(response.data.integrations);
    } catch (error) {
      toast.error("Failed to load integrations");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.platform || !formData.apiKey) {
      return toast.error("Please fill in all fields");
    }

    try {
      setIsSaving(true);
      await apiClient.post("/admin/integrations", formData);
      toast.success(`${formData.platform.toUpperCase()} integration updated successfully`);
      setIsModalOpen(false);
      setFormData({ platform: "", apiKey: "" });
      fetchIntegrations();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save integration");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this integration?")) return;

    try {
      await apiClient.delete(`/admin/integrations/${id}`);
      toast.success("Integration removed");
      fetchIntegrations();
    } catch (error) {
      toast.error("Failed to remove integration");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900">API Integrations</h2>
          <p className="text-sm text-neutral-500 font-medium">Connect your store with third-party platforms and services.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="h-12 px-8 rounded-2xl premium-gradient font-bold shadow-xl shadow-blue-500/20 gap-2 border-none">
          <Plus className="h-4 w-4" /> Connect Platform
        </Button>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-3xl bg-neutral-100 animate-pulse" />
          ))}
        </div>
      ) : integrations.length === 0 ? (
        <Card className="border-black/5 shadow-sm rounded-3xl overflow-hidden bg-white border-dashed">
          <CardContent className="py-24 text-center space-y-6">
             <div className="size-20 rounded-[2.5rem] bg-neutral-50 flex items-center justify-center mx-auto border border-black/5 text-neutral-200">
                <Share2 size={40} />
             </div>
             <div className="space-y-2 max-w-sm mx-auto">
                <h3 className="text-lg font-bold text-neutral-900">No Integrations Active</h3>
                <p className="text-sm text-neutral-400 font-medium leading-relaxed">
                   Connect your favorite marketing, payment, and analytics platforms to extend your store's capabilities.
                </p>
             </div>
             <Button onClick={() => setIsModalOpen(true)} variant="outline" className="h-11 rounded-xl border-black/5 text-xs font-bold gap-2 hover:bg-neutral-50">
                <Zap className="size-4 text-amber-500" /> Start Integrating
             </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => {
            const platformInfo = PLATFORMS.find(p => p.id === integration.platform) || {
              name: integration.platform,
              description: "Third-party platform",
              color: "text-neutral-600",
              bg: "bg-neutral-50"
            };

            return (
              <Card key={integration.id} className="border-black/5 shadow-sharcly rounded-3xl overflow-hidden hover:scale-[1.02] transition-all duration-500 group bg-white">
                <CardHeader className="p-6 pb-2">
                   <div className="flex justify-between items-start">
                      <div className={`size-12 rounded-2xl ${platformInfo.bg} flex items-center justify-center ${platformInfo.color}`}>
                         <Zap className="size-6" />
                      </div>
                      <Badge className="bg-emerald-50 text-emerald-600 border-none px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase">
                         Active
                      </Badge>
                   </div>
                   <div className="mt-4">
                      <CardTitle className="text-lg font-bold">{platformInfo.name}</CardTitle>
                      <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-40 mt-1">{platformInfo.description}</CardDescription>
                   </div>
                </CardHeader>
                <CardContent className="p-6 pt-4 space-y-6">
                   <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-[9px] font-black uppercase tracking-widest opacity-30">API Identifier</Label>
                        <button 
                          onClick={() => setShowKey(showKey === integration.id ? null : integration.id)}
                          className="text-[9px] font-black uppercase tracking-widest text-blue-600 hover:underline"
                        >
                          {showKey === integration.id ? "Hide Key" : "Reveal Key"}
                        </button>
                      </div>
                      <div className="bg-neutral-50 p-3 rounded-xl border border-black/5 flex items-center justify-between font-mono text-xs">
                         <span className="truncate max-w-[150px] opacity-60">
                            {showKey === integration.id ? integration.apiKey : "••••••••••••••••"}
                         </span>
                         <CheckCircle2 className="size-3 text-emerald-500" />
                      </div>
                   </div>

                   <div className="flex items-center justify-between gap-3 pt-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(integration.id)}
                        className="rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-600 h-9 font-bold text-xs"
                      >
                         <Trash2 className="size-3 mr-2" /> Disconnect
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="rounded-xl h-9 font-bold text-xs border-black/5"
                      >
                         Configure <ExternalLink className="size-3 ml-2" />
                      </Button>
                   </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Recommended Section */}
      <div className="space-y-6 pt-10">
        <div className="flex items-center gap-4">
           <div className="h-px flex-1 bg-black/5" />
           <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-300">Recommended Integrations</h3>
           <div className="h-px flex-1 bg-black/5" />
        </div>
        
        <div className="grid md:grid-cols-4 gap-6">
           {PLATFORMS.filter(p => !integrations.find(i => i.platform === p.id)).slice(0, 4).map(platform => (
             <Card key={platform.id} className="border-black/5 shadow-sm rounded-3xl bg-neutral-50/50 group cursor-pointer hover:bg-white hover:shadow-sharcly transition-all border-dashed">
                <CardContent className="p-6 flex items-center gap-4">
                   <div className={`size-10 rounded-xl ${platform.bg} flex items-center justify-center ${platform.color} group-hover:scale-110 transition-transform`}>
                      <Plus className="size-4" />
                   </div>
                   <div>
                      <h4 className="text-xs font-bold">{platform.name}</h4>
                      <p className="text-[9px] font-bold text-neutral-400 mt-0.5">{platform.id === 'stripe' ? 'Payments' : 'Marketing'}</p>
                   </div>
                </CardContent>
             </Card>
           ))}
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[450px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden bg-white">
          <div className="premium-gradient h-2 pt-0" />
          <div className="p-8">
            <DialogHeader className="mb-8">
              <DialogTitle className="text-2xl font-black tracking-tight text-neutral-900">Connect Platform</DialogTitle>
              <DialogDescription className="text-neutral-400 font-medium">
                Choose a service provider and enter your API credentials to activate the plugin.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Service Provider</Label>
                <Select value={formData.platform} onValueChange={(v) => setFormData({...formData, platform: v})}>
                  <SelectTrigger className="h-14 rounded-2xl border-black/5 bg-neutral-50 px-6 font-bold focus:ring-4 focus:ring-blue-500/5 transition-all">
                    <SelectValue placeholder="Select a platform" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-black/5 shadow-2xl p-2 bg-white">
                    {PLATFORMS.map((platform) => (
                      <SelectItem key={platform.id} value={platform.id} className="font-bold py-3 px-4 rounded-xl">
                        {platform.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="other" className="font-bold py-3 px-4 rounded-xl">Custom Integration</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Access Key / API Secret</Label>
                <div className="relative">
                  <Input 
                    type="password"
                    placeholder="sk_live_..."
                    className="h-14 rounded-2xl border-black/5 bg-neutral-50 px-6 font-bold focus:ring-4 focus:ring-blue-500/5 transition-all"
                    value={formData.apiKey}
                    onChange={(e) => setFormData({...formData, apiKey: e.target.value})}
                    required
                  />
                  <Shield className="absolute right-6 top-1/2 -translate-y-1/2 size-4 text-neutral-200" />
                </div>
                <p className="text-[9px] font-bold text-neutral-300 ml-1 italic flex items-center gap-1">
                   <Shield className="size-2" /> Your keys are encrypted and stored securely.
                </p>
              </div>

              <div className="pt-4 flex gap-4">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 h-14 rounded-2xl font-bold uppercase tracking-widest text-xs"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSaving}
                  className="flex-1 h-14 rounded-2xl premium-gradient font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/20 border-none"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Connect Plugin"}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

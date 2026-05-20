"use client";

import React, { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  RefreshCw, 
  Plus, 
  Trash2, 
  Edit3, 
  RotateCcw, 
  Copy, 
  Check, 
  CreditCard,
  Lock,
  ExternalLink,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface PaymentGateway {
  id: string;
  name: string;
  provider: string;
  publishableKey?: string;
  secretKey: string;
  webhookSecret?: string;
  config?: any;
  rotationLimit: number;
  paymentCount: number;
  totalPayments: number;
  isActive: boolean;
  createdAt: string;
}

export default function PaymentGatewaysPage() {
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGateway, setEditingGateway] = useState<PaymentGateway | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formProvider, setFormProvider] = useState("stripe");
  const [formPublishableKey, setFormPublishableKey] = useState("");
  const [formSecretKey, setFormSecretKey] = useState("");
  const [formWebhookSecret, setFormWebhookSecret] = useState("");
  const [formRotationLimit, setFormRotationLimit] = useState(10);
  const [formIsActive, setFormIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchGateways = async () => {
    try {
      const { data } = await apiClient.get("/admin/payment-gateways");
      if (data.gateways) {
        setGateways(data.gateways);
      }
    } catch (error) {
      toast.error("Failed to load payment gateways");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGateways();
  }, []);

  const openAddDialog = () => {
    setEditingGateway(null);
    setFormName("");
    setFormProvider("stripe");
    setFormPublishableKey("");
    setFormSecretKey("");
    setFormWebhookSecret("");
    setFormRotationLimit(10);
    setFormIsActive(true);
    setDialogOpen(true);
  };

  const openEditDialog = (gw: PaymentGateway) => {
    setEditingGateway(gw);
    setFormName(gw.name);
    setFormProvider(gw.provider);
    setFormPublishableKey(gw.publishableKey || "");
    setFormSecretKey(gw.secretKey);
    setFormWebhookSecret(gw.webhookSecret || "");
    setFormRotationLimit(gw.rotationLimit);
    setFormIsActive(gw.isActive);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formSecretKey.trim()) {
      toast.error("Name and Secret API Key are required.");
      return;
    }

    setSubmitting(true);
    const payload = {
      name: formName,
      provider: formProvider,
      publishableKey: formPublishableKey || null,
      secretKey: formSecretKey,
      webhookSecret: formWebhookSecret || null,
      rotationLimit: formRotationLimit,
      isActive: formIsActive
    };

    try {
      if (editingGateway) {
        await apiClient.patch(`/admin/payment-gateways/${editingGateway.id}`, payload);
        toast.success("Payment gateway updated successfully");
      } else {
        await apiClient.post("/admin/payment-gateways", payload);
        toast.success("New payment gateway added successfully");
      }
      setDialogOpen(false);
      fetchGateways();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save gateway configuration");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you absolutely sure you want to delete this payment gateway configuration?")) {
      return;
    }

    try {
      await apiClient.delete(`/admin/payment-gateways/${id}`);
      toast.success("Gateway configuration deleted successfully");
      fetchGateways();
    } catch (error) {
      toast.error("Failed to delete payment gateway");
    }
  };

  const handleToggleActive = async (gw: PaymentGateway, checked: boolean) => {
    try {
      await apiClient.patch(`/admin/payment-gateways/${gw.id}`, { isActive: checked });
      toast.success(`${gw.name} is now ${checked ? "Active" : "Inactive"}`);
      setGateways(prev => prev.map(item => item.id === gw.id ? { ...item, isActive: checked } : item));
    } catch (error) {
      toast.error("Failed to update gateway status");
    }
  };

  const handleResetCounter = async (id: string) => {
    try {
      await apiClient.post(`/admin/payment-gateways/${id}/reset`);
      toast.success("Transaction cycle counter has been reset to 0");
      fetchGateways();
    } catch (error) {
      toast.error("Failed to reset cycle counter");
    }
  };

  const copyWebhookUrl = (id: string) => {
    const baseUrl = window.location.origin.replace("3000", "5000"); // Standard local dynamic replacement
    const url = `${baseUrl}/api/payments/webhook?gatewayId=${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("Webhook endpoint URL copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2500);
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Payment Gateways</h2>
          <p className="text-sm text-neutral-500 font-medium">Configure Stripe account rotation limits, manage webhook endpoints, and balance volume distributions dynamically.</p>
        </div>
        <Button 
          onClick={openAddDialog} 
          className="h-12 px-6 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 font-bold gap-2 self-start shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="h-4 w-4" />
          Add Gateway
        </Button>
      </div>

      {gateways.length === 0 ? (
        <Card className="border border-dashed border-neutral-200 shadow-none rounded-3xl bg-neutral-50/50">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="size-16 rounded-2xl bg-neutral-100 flex items-center justify-center">
              <CreditCard className="size-8 text-neutral-400" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h3 className="text-base font-bold text-neutral-900">No Custom Gateways Yet</h3>
              <p className="text-xs text-neutral-400 font-medium">By default, transactions route using the environment fallback credentials. Add gateways to start rotation balancing.</p>
            </div>
            <Button onClick={openAddDialog} variant="outline" className="rounded-xl border-neutral-200 font-bold hover:bg-white">
              Add Stripe Gateway
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {gateways.map((gw) => {
            const usagePercent = Math.min(100, (gw.paymentCount / gw.rotationLimit) * 100);
            
            return (
              <Card key={gw.id} className={cn(
                "border shadow-sm rounded-3xl overflow-hidden bg-white transition-all duration-300 hover:shadow-md",
                gw.isActive ? "border-neutral-200" : "border-neutral-100 opacity-75"
              )}>
                <CardHeader className="p-6 border-b border-black/5 bg-neutral-50/50 flex flex-row items-center justify-between space-y-0">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-neutral-950">{gw.name}</span>
                      <Badge className={cn(
                        "text-[9px] uppercase font-extrabold tracking-widest px-2 py-0.5 rounded-full border-none",
                        gw.provider === "stripe" ? "bg-indigo-50 text-indigo-600" : "bg-neutral-100 text-neutral-600"
                      )}>
                        {gw.provider}
                      </Badge>
                    </div>
                    <span className="text-[10px] text-neutral-400 font-mono block">ID: {gw.id}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Label htmlFor={`active-switch-${gw.id}`} className="sr-only">Active Toggle</Label>
                    <Switch
                      id={`active-switch-${gw.id}`}
                      checked={gw.isActive}
                      onCheckedChange={(checked) => handleToggleActive(gw, checked)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Rotation limits status */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-neutral-600">
                      <span className="flex items-center gap-1.5"><TrendingUp className="size-3.5 text-blue-500" /> Cycle Progress</span>
                      <span>{gw.paymentCount} / {gw.rotationLimit} payments</span>
                    </div>
                    <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          usagePercent >= 90 ? "bg-amber-500" : "bg-blue-600"
                        )}
                        style={{ width: `${usagePercent}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-neutral-400 font-medium">
                      <span>Rotation limit: {gw.rotationLimit}</span>
                      <span>Lifetime payments: {gw.totalPayments}</span>
                    </div>
                  </div>

                  {/* Webhook Endpoint block */}
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-extrabold text-neutral-400 tracking-wider">Webhook Endpoint URL</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="size-7 hover:bg-neutral-200/50 rounded-lg text-neutral-500"
                        onClick={() => copyWebhookUrl(gw.id)}
                      >
                        {copiedId === gw.id ? <Check className="size-3.5 text-green-600" /> : <Copy className="size-3.5" />}
                      </Button>
                    </div>
                    <div className="font-mono text-[10px] break-all select-all p-2 bg-white rounded-lg border border-neutral-200 text-neutral-600">
                      .../api/payments/webhook?gatewayId={gw.id}
                    </div>
                  </div>

                  {/* Config parameters indicators */}
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="flex items-center gap-2 text-neutral-500">
                      <Lock className="size-3.5 text-neutral-300" />
                      <span>Webhook Secret: {gw.webhookSecret ? "Configured" : "None"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-500">
                      <Lock className="size-3.5 text-neutral-300" />
                      <span>API Keys: Encrypted</span>
                    </div>
                  </div>

                  {/* Actions buttons panel */}
                  <div className="pt-4 border-t border-black/5 flex items-center justify-between">
                    <Button 
                      variant="ghost" 
                      onClick={() => handleResetCounter(gw.id)}
                      className="text-neutral-500 hover:text-neutral-900 rounded-xl hover:bg-neutral-50 font-bold text-xs gap-1.5 h-10 px-3"
                    >
                      <RotateCcw className="size-3.5" />
                      Reset Cycle
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openEditDialog(gw)}
                        className="size-10 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
                      >
                        <Edit3 className="size-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(gw.id)}
                        className="size-10 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Dynamic Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl rounded-3xl p-8 bg-white border border-black/5 shadow-2xl">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl font-bold text-neutral-950">
              {editingGateway ? "Edit Gateway Details" : "Add Payment Gateway"}
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-400 font-medium">
              Enter your API keys and cycle rotation limits. Ensure webhook signatures match for dynamic validation.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="form-name" className="text-[10px] uppercase font-black text-black/40 tracking-wider">Gateway Configuration Name</Label>
                <Input 
                  id="form-name"
                  value={formName} 
                  onChange={e => setFormName(e.target.value)}
                  placeholder="e.g. Primary US Account"
                  className="h-11 rounded-xl bg-neutral-50 border-black/5 font-bold"
                  required
                />
              </div>

              {/* Provider & Rotation Limit grid */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <Label htmlFor="form-provider" className="text-[10px] uppercase font-black text-black/40 tracking-wider">Provider Type</Label>
                  <select
                    id="form-provider"
                    value={formProvider}
                    onChange={e => setFormProvider(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-neutral-50 border border-black/5 text-sm font-bold text-neutral-700 outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="stripe">Stripe</option>
                    <option value="paypal">PayPal</option>
                    <option value="razorpay">Razorpay</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="form-rotation" className="text-[10px] uppercase font-black text-black/40 tracking-wider">Rotation Transaction Limit</Label>
                  <Input 
                    id="form-rotation"
                    value={formRotationLimit} 
                    onChange={e => setFormRotationLimit(parseInt(e.target.value, 10) || 10)}
                    type="number"
                    min="1"
                    className="h-11 rounded-xl bg-neutral-50 border-black/5 font-bold"
                    required
                  />
                </div>
              </div>

              {/* Publishable API Key */}
              <div className="space-y-1.5">
                <Label htmlFor="form-pk" className="text-[10px] uppercase font-black text-black/40 tracking-wider">Publishable API Key (optional)</Label>
                <Input 
                  id="form-pk"
                  value={formPublishableKey} 
                  onChange={e => setFormPublishableKey(e.target.value)}
                  placeholder="pk_test_..."
                  className="h-11 rounded-xl bg-neutral-50 border-black/5 font-mono text-xs"
                />
              </div>

              {/* Secret API Key */}
              <div className="space-y-1.5">
                <Label htmlFor="form-sk" className="text-[10px] uppercase font-black text-black/40 tracking-wider">Secret API Key / Token</Label>
                <Input 
                  id="form-sk"
                  value={formSecretKey} 
                  onChange={e => setFormSecretKey(e.target.value)}
                  type="password"
                  placeholder="sk_test_..."
                  className="h-11 rounded-xl bg-neutral-50 border-black/5 font-mono text-xs"
                  required
                />
              </div>

              {/* Webhook Secret Signature */}
              <div className="space-y-1.5">
                <Label htmlFor="form-wh" className="text-[10px] uppercase font-black text-black/40 tracking-wider">Webhook Signing Secret (optional)</Label>
                <Input 
                  id="form-wh"
                  value={formWebhookSecret} 
                  onChange={e => setFormWebhookSecret(e.target.value)}
                  type="password"
                  placeholder="whsec_..."
                  className="h-11 rounded-xl bg-neutral-50 border-black/5 font-mono text-xs"
                />
              </div>

              {/* Active Toggle Switch */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 border border-black/5">
                <div className="space-y-0.5">
                  <Label htmlFor="form-active" className="text-xs font-bold text-neutral-900">Enable Active Rotation</Label>
                  <p className="text-[10px] text-neutral-400 font-medium">When disabled, transactions will skip this gateway cycle.</p>
                </div>
                <Switch
                  id="form-active"
                  checked={formIsActive}
                  onCheckedChange={setFormIsActive}
                />
              </div>
            </div>

            <DialogFooter className="gap-2 pt-4 border-t border-black/5">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setDialogOpen(false)} 
                className="h-11 rounded-xl border-neutral-200 font-bold hover:bg-neutral-50"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={submitting} 
                className="h-11 px-8 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 font-bold gap-2 shadow-md"
              >
                {submitting ? <RefreshCw className="size-4 animate-spin" /> : null}
                {submitting ? "Saving Config..." : (editingGateway ? "Update Gateway" : "Create Gateway")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

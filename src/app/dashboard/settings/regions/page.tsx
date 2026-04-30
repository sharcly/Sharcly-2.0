"use client";

import React, { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Globe, RefreshCw, Trash2, MapPin, Loader2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function RegionsPage() {
  const [regions, setRegions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    currencyCode: "USD",
    taxRate: 0,
    countries: [] as string[]
  });
  const [countryInput, setCountryInput] = useState("");

  const fetchRegions = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/settings/regions");
      setRegions(response.data.regions || []);
    } catch (error) {
      toast.error("Failed to load regions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  const handleAddCountry = () => {
    if (!countryInput.trim()) return;
    if (formData.countries.includes(countryInput.trim())) {
      return toast.error("Country already added");
    }
    setFormData({
      ...formData,
      countries: [...formData.countries, countryInput.trim()]
    });
    setCountryInput("");
  };

  const removeCountry = (name: string) => {
    setFormData({
      ...formData,
      countries: formData.countries.filter(c => c !== name)
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.currencyCode) {
      return toast.error("Name and Currency are required");
    }

    try {
      setIsSaving(true);
      await apiClient.post("/settings/regions", formData);
      toast.success("Region created successfully");
      setIsModalOpen(false);
      setFormData({ name: "", currencyCode: "USD", taxRate: 0, countries: [] });
      fetchRegions();
    } catch (error) {
      toast.error("Failed to create region");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this region?")) return;
    
    try {
      await apiClient.delete(`/settings/regions/${id}`);
      toast.success("Region deleted");
      fetchRegions();
    } catch (error) {
      toast.error("Failed to delete region");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Regional Zones</h2>
          <p className="text-sm text-neutral-500 font-medium">Configure shipping destinations and regional commerce rules.</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="h-11 px-6 rounded-xl premium-gradient font-bold shadow-lg gap-2 border-none"
        >
          <Plus className="h-4 w-4" /> Add Region
        </Button>
      </div>

      <Card className="border-black/5 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardHeader className="p-6 border-b border-black/5">
           <CardTitle className="text-lg font-bold">Active Markets</CardTitle>
        </CardHeader>
        <Table>
          <TableHeader className="bg-neutral-50/50">
            <TableRow className="border-black/5">
              <TableHead className="pl-6 py-4 font-black uppercase text-[10px] tracking-widest text-black/40">Market Name</TableHead>
              <TableHead className="py-4 font-black uppercase text-[10px] tracking-widest text-black/40">Currency</TableHead>
              <TableHead className="py-4 font-black uppercase text-[10px] tracking-widest text-black/40">Tax Rate</TableHead>
              <TableHead className="py-4 font-black uppercase text-[10px] tracking-widest text-black/40">Countries</TableHead>
              <TableHead className="pr-6 text-right py-4 font-black uppercase text-[10px] tracking-widest text-black/40">Manage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10"><RefreshCw className="h-6 w-6 animate-spin mx-auto text-neutral-200" /></TableCell></TableRow>
            ) : regions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-20 text-center">
                   <div className="size-16 rounded-3xl bg-neutral-50 flex items-center justify-center mx-auto mb-4 border border-black/5">
                      <Globe className="h-8 w-8 text-neutral-200" />
                   </div>
                   <p className="text-sm font-bold text-neutral-400">No regional markets configured yet.</p>
                </TableCell>
              </TableRow>
            ) : regions.map(region => (
              <TableRow key={region.id} className="border-black/5 hover:bg-neutral-50/50 transition-colors">
                <TableCell className="pl-6 py-5 font-bold flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-emerald-500" /> {region.name}
                </TableCell>
                <TableCell className="py-5 font-black text-xs">{region.currencyCode}</TableCell>
                <TableCell className="py-5 font-bold text-xs text-neutral-400">{Number(region.taxRate)}%</TableCell>
                <TableCell className="py-5">
                   <div className="flex flex-wrap gap-1">
                      {region.countries?.slice(0, 3).map((c: string) => (
                        <span key={c} className="text-[10px] bg-neutral-100 px-2 py-0.5 rounded-full font-bold">{c}</span>
                      ))}
                      {region.countries?.length > 3 && (
                        <span className="text-[10px] text-neutral-400 font-bold">+{region.countries.length - 3} more</span>
                      )}
                   </div>
                </TableCell>
                <TableCell className="pr-6 text-right">
                  <Button 
                    onClick={() => handleDelete(region.id)}
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 rounded-lg hover:bg-rose-50 text-rose-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Dialog for Adding Region */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden bg-white">
          <div className="h-2 bg-emerald-500 w-full" />
          <div className="p-8">
            <DialogHeader className="mb-8">
              <DialogTitle className="text-2xl font-black tracking-tight">Add New Region</DialogTitle>
              <DialogDescription className="text-neutral-500 font-medium mt-1">
                Define a new geographic market with custom tax and currency rules.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Region Name</Label>
                  <Input 
                    placeholder="e.g. Europe, North America"
                    className="h-12 rounded-xl border-black/5 bg-neutral-50 px-4 font-bold"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Currency Code</Label>
                  <Input 
                    placeholder="e.g. USD, EUR, GBP"
                    className="h-12 rounded-xl border-black/5 bg-neutral-50 px-4 font-bold"
                    value={formData.currencyCode}
                    onChange={(e) => setFormData({...formData, currencyCode: e.target.value.toUpperCase()})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Default Tax Rate (%)</Label>
                <Input 
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="h-12 rounded-xl border-black/5 bg-neutral-50 px-4 font-bold"
                  value={formData.taxRate}
                  onChange={(e) => setFormData({...formData, taxRate: Number(e.target.value)})}
                />
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Included Countries</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Type country name..."
                    className="h-12 rounded-xl border-black/5 bg-neutral-50 px-4 font-bold flex-1"
                    value={countryInput}
                    onChange={(e) => setCountryInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCountry())}
                  />
                  <Button type="button" onClick={handleAddCountry} className="h-12 w-12 rounded-xl bg-black text-white p-0">
                    <Plus className="size-5" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 pt-2">
                   {formData.countries.map(country => (
                      <Badge key={country} className="bg-neutral-100 text-neutral-900 border-none px-3 py-1.5 rounded-xl font-bold flex items-center gap-2">
                        {country}
                        <button type="button" onClick={() => removeCountry(country)} className="text-neutral-400 hover:text-rose-500">
                           <X className="size-3" />
                        </button>
                      </Badge>
                   ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 h-12 rounded-xl font-bold"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSaving}
                  className="flex-1 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-600/20 border-none"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Region"}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


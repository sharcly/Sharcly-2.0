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
import { Plus, Globe, RefreshCw, Trash2, MapPin } from "lucide-react";

export default function RegionsPage() {
  const [regions, setRegions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchRegions = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get("/settings/regions");
      setRegions(data.regions || []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Regional Zones</h2>
          <p className="text-sm text-neutral-500 font-medium">Configure shipping destinations and regional commerce rules.</p>
        </div>
        <Button className="h-11 px-6 rounded-xl premium-gradient font-bold shadow-lg gap-2">
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
              <TableHead className="pr-6 text-right py-4 font-black uppercase text-[10px] tracking-widest text-black/40">Manage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-10"><RefreshCw className="h-6 w-6 animate-spin mx-auto text-neutral-200" /></TableCell></TableRow>
            ) : regions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-20 text-center">
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
                <TableCell className="pr-6 text-right">
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-rose-50 text-rose-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-8">
         <Card className="border-black/5 shadow-sm rounded-2xl bg-neutral-900 text-white p-8">
            <div className="space-y-4">
               <div className="size-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Globe className="h-6 w-6" />
               </div>
               <div className="space-y-1">
                  <h3 className="text-lg font-bold">Global Reach</h3>
                  <p className="text-neutral-400 text-xs font-medium leading-relaxed">
                     Expand your store's footprint by defining international regions. Each region can have its own local currency and tax implications.
                  </p>
               </div>
            </div>
         </Card>
         <Card className="border-black/5 shadow-sm rounded-2xl bg-white p-8 border border-dashed border-neutral-200 flex flex-col items-center justify-center text-center">
            <div className="space-y-2">
               <p className="text-sm font-bold text-neutral-400 italic">"Markets define your growth boundary."</p>
               <div className="flex gap-1 justify-center">
                  {[1,2,3].map(i => <div key={i} className="size-1 rounded-full bg-neutral-100" />)}
               </div>
            </div>
         </Card>
      </div>
    </div>
  );
}

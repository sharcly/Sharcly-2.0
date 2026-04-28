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
import { Plus, Trash2, Type as TypeIcon, RefreshCw, Layers } from "lucide-react";

export default function ProductTypesPage() {
  const [types, setTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newType, setNewType] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get("/products/types");
      setTypes(data.types || []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newType) return;
    try {
      await apiClient.post("/products/types", { name: newType });
      setNewType("");
      fetchData();
      toast.success("Product type registered");
    } catch (error) {
      toast.error("Failed to add type");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Product Types</h2>
        <p className="text-sm text-neutral-500 font-medium">Standardize your catalog with broad product classifications.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <Card className="lg:col-span-8 border-black/5 shadow-sm rounded-2xl overflow-hidden bg-white">
          <CardHeader className="p-6 border-b border-black/5">
             <CardTitle className="text-lg font-bold">Registry Directory</CardTitle>
          </CardHeader>
          <Table>
            <TableHeader className="bg-neutral-50/50">
              <TableRow className="border-black/5">
                <TableHead className="pl-6 py-4 font-black uppercase text-[10px] tracking-widest text-black/40">Class Name</TableHead>
                <TableHead className="py-4 font-black uppercase text-[10px] tracking-widest text-black/40">Usage Count</TableHead>
                <TableHead className="pr-6 text-right py-4 font-black uppercase text-[10px] tracking-widest text-black/40">Manage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={3} className="text-center py-10"><RefreshCw className="h-6 w-6 animate-spin mx-auto text-neutral-200" /></TableCell></TableRow>
              ) : types.length === 0 ? (
                <TableRow><TableCell colSpan={3} className="text-center py-10 text-neutral-400 font-medium">No types defined yet.</TableCell></TableRow>
              ) : types.map(type => (
                <TableRow key={type.id} className="border-black/5 hover:bg-neutral-50/50 transition-colors">
                  <TableCell className="pl-6 py-4 font-bold flex items-center gap-3">
                    <Layers className="h-4 w-4 text-purple-500" /> {type.name}
                  </TableCell>
                  <TableCell className="py-4 text-xs font-bold text-neutral-400">0 Items linked</TableCell>
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

        <Card className="lg:col-span-4 border-black/5 shadow-sm rounded-2xl overflow-hidden bg-white h-fit sticky top-0">
          <CardHeader className="p-6 border-b border-black/5 bg-purple-600 text-white">
             <CardTitle className="text-lg font-bold">New Classification</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleCreate} className="space-y-4">
               <div className="space-y-2">
                 <Label className="text-[10px] uppercase font-black text-black/40 tracking-[0.1em]">Class Label</Label>
                 <Input 
                   value={newType} 
                   onChange={e => setNewType(e.target.value)}
                   placeholder="e.g. Footwear" 
                   className="h-11 rounded-xl bg-neutral-50 border-black/5 font-bold"
                 />
               </div>
               <Button type="submit" className="w-full h-11 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-lg gap-2">
                 <Plus className="h-4 w-4" /> Initialize Class
               </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

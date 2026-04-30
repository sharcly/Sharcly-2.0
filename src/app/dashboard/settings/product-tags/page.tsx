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
import { Plus, Trash2, Tag as TagIcon, RefreshCw } from "lucide-react";

export default function ProductTagsPage() {
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTag, setNewTag] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get("/products/tags");
      setTags(data.tags || []);
    } catch (error) {
      // If endpoint doesn't exist yet, we'll keep empty
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag) return;
    try {
      await apiClient.post("/products/tags", { name: newTag });
      setNewTag("");
      fetchData();
      toast.success("Product tag added to registry");
    } catch (error) {
      toast.error("Failed to add tag");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Product Tags</h2>
        <p className="text-sm text-neutral-500 font-medium">Create and manage granular labels for your items.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <Card className="lg:col-span-8 border-black/5 shadow-sm rounded-2xl overflow-hidden bg-white">
          <CardHeader className="p-6 border-b border-black/5">
             <CardTitle className="text-lg font-bold">Active Tags</CardTitle>
          </CardHeader>
          <Table>
            <TableHeader className="bg-neutral-50/50">
              <TableRow className="border-black/5">
                <TableHead className="pl-6 py-4 font-black uppercase text-[10px] tracking-widest text-black/40">Tag Label</TableHead>
                <TableHead className="py-4 font-black uppercase text-[10px] tracking-widest text-black/40">Registered On</TableHead>
                <TableHead className="pr-6 text-right py-4 font-black uppercase text-[10px] tracking-widest text-black/40">Manage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={3} className="text-center py-10"><RefreshCw className="h-6 w-6 animate-spin mx-auto text-neutral-200" /></TableCell></TableRow>
              ) : tags.length === 0 ? (
                <TableRow><TableCell colSpan={3} className="text-center py-10 text-neutral-400 font-medium">No tags registered in the system.</TableCell></TableRow>
              ) : tags.map(tag => (
                <TableRow key={tag.id} className="border-black/5 hover:bg-neutral-50/50 transition-colors">
                  <TableCell className="pl-6 py-4 font-bold flex items-center gap-3">
                    <TagIcon className="h-4 w-4 text-blue-500" /> {tag.name}
                  </TableCell>
                  <TableCell className="py-4 text-xs text-neutral-400">{new Date(tag.createdAt).toLocaleDateString()}</TableCell>
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
          <CardHeader className="p-6 border-b border-black/5 bg-neutral-900 text-white">
             <CardTitle className="text-lg font-bold">Add Tag</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleCreate} className="space-y-4">
               <div className="space-y-2">
                 <Label className="text-[10px] uppercase font-black text-black/40 tracking-[0.1em]">Label Name</Label>
                 <Input 
                   value={newTag} 
                   onChange={e => setNewTag(e.target.value)}
                   placeholder="e.g. Eco-Friendly" 
                   className="h-11 rounded-xl bg-neutral-50 border-black/5 font-bold"
                 />
               </div>
               <Button type="submit" className="w-full h-11 rounded-xl premium-gradient font-bold shadow-lg gap-2">
                 <Plus className="h-4 w-4" /> Register Tag
               </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

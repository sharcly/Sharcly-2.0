"use client";

import { useEffect, useState, useCallback } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  FileEdit, 
  Trash2, 
  User as UserIcon,
  Search,
  MessageSquare,
  RefreshCcw,
  AlertCircle,
  Star,
  Quote
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { TestimonialForm } from "@/components/dashboard/testimonials/testimonial-form";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string | null;
  message: string;
  rating?: number | null;
  image?: string | null;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardTestimonialsPage() {
  const [loading, setLoading] = useState(true);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [search, setSearch] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState<Testimonial | null>(null);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    try {
      // In a real app, we'd add filtering to the backend. 
      // For now, we'll filter client-side if needed, but the backend is new so it's empty anyway.
      const response = await apiClient.get("/testimonials/admin");
      setTestimonials(response.data.data || []);
    } catch (error: any) {
      toast.error("Failed to load community voices");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const handleDelete = async () => {
    if (!testimonialToDelete) return;
    try {
      await apiClient.delete(`/testimonials/${testimonialToDelete.id}`);
      toast.success("Voice successfully removed from history");
      fetchTestimonials();
    } catch (error: any) {
      toast.error("Failed to eliminate testimonial");
    } finally {
      setIsDeleteDialogOpen(false);
      setTestimonialToDelete(null);
    }
  };

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (editingTestimonial) {
        await apiClient.put(`/testimonials/${editingTestimonial.id}`, data);
        toast.success("Testimonial authority updated successfully");
      } else {
        await apiClient.post("/testimonials", data);
        toast.success("New community voice established");
      }
      setIsFormOpen(false);
      setEditingTestimonial(null);
      fetchTestimonials();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to process testimonial");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTestimonials = testimonials.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.message.toLowerCase().includes(search.toLowerCase()) ||
    t.company?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-heading font-black tracking-tighter text-[#062D1B]">Testimonial Archive</h1>
          <p className="text-muted-foreground italic font-medium opacity-60 max-w-md">Curating authentic experiences that define the Sharcly standard.</p>
        </div>
        <Button 
          onClick={() => {
            setEditingTestimonial(null);
            setIsFormOpen(true);
          }}
          className="gap-4 rounded-[1.5rem] h-14 px-8 bg-[#062D1B] hover:bg-[#083a23] text-white shadow-2xl shadow-[#062D1B]/20 font-black uppercase tracking-[0.2em] text-[10px] transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="h-4 w-4" /> Add Testimonial
        </Button>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
         {[
           { label: "Total Archive", value: testimonials.length, icon: MessageSquare },
           { label: "Featured Excellence", value: testimonials.filter(t => t.featured).length, icon: Star },
           { label: "High Ratings", value: testimonials.filter(t => (t.rating || 0) >= 4.5).length, icon: Quote },
           { label: "Latest Entry", value: testimonials.length > 0 ? new Date(testimonials[0].createdAt).toLocaleDateString() : "N/A", icon: RefreshCcw }
         ].map((stat, i) => (
           <Card key={i} className="rounded-[2.5rem] border-none shadow-organic bg-white/60 backdrop-blur-xl overflow-hidden hover:shadow-2xl transition-all duration-500 group">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                 <CardTitle className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">{stat.label}</CardTitle>
                 <stat.icon className="size-4 text-[#062D1B]/20 group-hover:text-[#062D1B] transition-colors duration-500" />
              </CardHeader>
              <CardContent>
                 <div className="text-3xl font-black text-[#062D1B] tracking-tighter">{stat.value}</div>
              </CardContent>
           </Card>
         ))}
      </div>

      <Card className="rounded-[3rem] border-none shadow-organic bg-white/80 backdrop-blur-2xl overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 border-b border-gray-100/50 bg-gray-50/30">
           <div className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-[#062D1B] flex items-center justify-center shadow-lg shadow-[#062D1B]/10">
                 <Quote className="size-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-black tracking-tight text-[#062D1B]">Experience Registry</CardTitle>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-40">System-wide Authority</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => fetchTestimonials()} className="h-10 w-10 rounded-full hover:bg-white hover:shadow-sm">
                 <RefreshCcw className={cn("size-4 text-[#062D1B]/30", loading && "animate-spin")} />
              </Button>
           </div>
           <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#062D1B]/20" />
              <Input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search the narrative..." 
                className="pl-12 h-14 rounded-2xl bg-white/50 border-gray-100 shadow-sm focus:bg-white transition-all font-medium" 
              />
           </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow className="hover:bg-transparent border-gray-100">
                  <TableHead className="pl-8 py-5 font-black uppercase text-[9px] tracking-[0.2em] text-muted-foreground">Author & Voice</TableHead>
                  <TableHead className="py-5 font-black uppercase text-[9px] tracking-[0.2em] text-muted-foreground">Context</TableHead>
                  <TableHead className="py-5 font-black uppercase text-[9px] tracking-[0.2em] text-muted-foreground">Rating</TableHead>
                  <TableHead className="py-5 font-black uppercase text-[9px] tracking-[0.2em] text-muted-foreground">Priority</TableHead>
                  <TableHead className="text-right pr-8 py-5 font-black uppercase text-[9px] tracking-[0.2em] text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  [1, 2, 3, 4].map((i) => (
                    <TableRow key={i} className="border-gray-50">
                      <TableCell className="pl-8 py-6"><Skeleton className="h-4 w-48 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                      <TableCell className="pr-8 text-right"><Skeleton className="h-10 w-10 ml-auto rounded-xl" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredTestimonials.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center">
                       <div className="flex flex-col items-center justify-center gap-4 py-20 opacity-20">
                          <MessageSquare className="size-16" />
                          <p className="text-xl font-heading font-black tracking-tight italic">No voices found in the registry.</p>
                       </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTestimonials.map((testimonial) => (
                    <TableRow key={testimonial.id} className="border-gray-50 group hover:bg-gray-50/50 transition-all duration-300">
                      <TableCell className="pl-8 py-8">
                         <div className="flex items-start gap-4">
                            <div className="size-12 rounded-2xl bg-[#062D1B]/5 border border-[#062D1B]/5 flex items-center justify-center text-[#062D1B] font-black shadow-sm group-hover:bg-[#062D1B] group-hover:text-white transition-all duration-500">
                               {testimonial.image ? (
                                 <img src={testimonial.image} alt={testimonial.name} className="size-full object-cover rounded-2xl" />
                               ) : (
                                 <span>{testimonial.name[0]}</span>
                               )}
                            </div>
                            <div className="flex flex-col gap-1">
                               <span className="font-black text-base tracking-tighter text-[#062D1B]">{testimonial.name}</span>
                               <p className="text-xs text-muted-foreground/60 line-clamp-1 italic max-w-xs">"{testimonial.message}"</p>
                            </div>
                         </div>
                      </TableCell>
                      <TableCell>
                         <div className="flex flex-col gap-1">
                            <span className="text-sm font-bold text-[#062D1B]/80">{testimonial.role}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">{testimonial.company || "General"}</span>
                         </div>
                      </TableCell>
                      <TableCell>
                         <div className="flex items-center gap-1">
                            <Star className="size-3 fill-amber-400 text-amber-400" />
                            <span className="text-sm font-black text-[#062D1B]">{testimonial.rating || 5}</span>
                         </div>
                      </TableCell>
                      <TableCell>
                        {testimonial.featured ? (
                          <Badge className="bg-[#062D1B] text-white border-none rounded-full px-4 py-1.5 font-black text-[9px] uppercase tracking-[0.2em] shadow-lg shadow-[#062D1B]/20">
                            Featured
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-400 border-none rounded-full px-4 py-1.5 font-black text-[9px] uppercase tracking-[0.2em]">
                            Standard
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right pr-8">
                         <div className="flex justify-end gap-3">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => {
                                setEditingTestimonial(testimonial);
                                setIsFormOpen(true);
                              }}
                              className="h-12 w-12 rounded-2xl hover:bg-white border border-transparent hover:border-gray-100 shadow-sm transition-all group/edit"
                            >
                               <FileEdit className="h-4 w-4 text-[#062D1B]/40 group-hover:text-[#062D1B] transition-colors" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => {
                                setTestimonialToDelete(testimonial);
                                setIsDeleteDialogOpen(true);
                              }}
                              className="h-12 w-12 rounded-2xl hover:bg-rose-50 border border-transparent hover:border-rose-100 shadow-sm transition-all group/delete"
                            >
                               <Trash2 className="h-4 w-4 text-rose-500/30 group-hover:text-rose-500 transition-colors" />
                            </Button>
                         </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Testimonial Management Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[80vw] md:max-w-[700px] rounded-[2rem] max-h-[88vh] flex flex-col p-0 overflow-hidden border-none shadow-sharcly bg-white">
          <div className="flex flex-col h-[700px] max-h-[80vh] overflow-hidden">
            <DialogHeader className="p-8 pb-4 space-y-4 shrink-0">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                   <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-xl bg-[#062D1B]/10 text-[#062D1B] flex items-center justify-center">
                         <Quote className="h-4 w-4" />
                      </div>
                      <DialogTitle className="text-xl font-heading font-black tracking-tight text-[#062D1B]">
                        {editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}
                      </DialogTitle>
                   </div>
                   <DialogDescription className="text-muted-foreground/60 text-[10px] font-bold uppercase tracking-widest pl-11">
                    {editingTestimonial ? `Updating testimonial from ${editingTestimonial.name}` : "Create a new customer testimonial"}
                   </DialogDescription>
                </div>
              </div>
              <Separator className="bg-black/[0.03]" />
            </DialogHeader>

            <TestimonialForm 
              initialData={editingTestimonial} 
              onSubmit={handleFormSubmit}
              isLoading={isSubmitting}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-[2rem] p-0 overflow-hidden border-none shadow-sharcly bg-white">
           <div className="p-8 space-y-6 text-center">
              <div className="size-16 rounded-3xl bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-lg shadow-red-500/10">
                 <AlertCircle className="size-8" />
              </div>
              <div className="space-y-2">
                 <h2 className="text-xl font-black tracking-tight text-[#062D1B]">Delete Testimonial?</h2>
                 <p className="text-[11px] font-medium text-muted-foreground/60 px-4 leading-relaxed">
                    Are you sure you want to delete the testimonial from <span className="text-[#062D1B] font-black uppercase italic">"{testimonialToDelete?.name}"</span>?
                 </p>
              </div>
              <div className="flex flex-col gap-3">
                 <Button 
                    onClick={handleDelete}
                    className="h-12 rounded-2xl bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-500/20 font-black text-[10px] uppercase tracking-widest gap-2"
                 >
                    Confirm Elimination <Trash2 className="size-4" />
                 </Button>
                 <Button 
                    variant="ghost" 
                    onClick={() => setIsDeleteDialogOpen(false)}
                    className="h-12 rounded-2xl font-black text-[9px] uppercase tracking-widest text-muted-foreground/20 hover:text-[#062D1B]"
                 >
                    Cancel
                 </Button>
              </div>
           </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  HelpCircle, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  XCircle,
  GripVertical,
  Save,
  X,
  Loader2,
  Filter,
  MessageCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { apiClient } from "@/lib/api-client";

interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
}

export default function FaqDashboard() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Partial<Faq> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchFaqs = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get("/faqs");
      if (response.data.success) {
        setFaqs(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch FAQs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleSave = async () => {
    if (!editingFaq?.question || !editingFaq?.answer) return;
    setIsSaving(true);
    try {
      if (editingFaq.id) {
        await apiClient.put(`/faqs/${editingFaq.id}`, editingFaq);
      } else {
        await apiClient.post("/faqs", editingFaq);
      }
      setIsModalOpen(false);
      fetchFaqs();
    } catch (error) {
      console.error("Failed to save FAQ:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      await apiClient.delete(`/faqs/${id}`);
      fetchFaqs();
    } catch (error) {
      console.error("Failed to delete FAQ:", error);
    }
  };

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-50/50 p-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="size-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
                <HelpCircle className="text-white h-5 w-5" />
              </div>
              <h1 className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400">Content Management</h1>
            </div>
            <h2 className="text-4xl font-black tracking-tight text-neutral-900">Knowledge Base / FAQs</h2>
            <p className="text-neutral-500 font-medium text-sm">Manage the questions and answers displayed on the public help center.</p>
          </div>

          <Button 
            onClick={() => {
              setEditingFaq({ question: "", answer: "", category: "General", order: 0, isActive: true });
              setIsModalOpen(true);
            }}
            className="h-14 px-8 bg-neutral-900 hover:bg-black text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-black/10 gap-3"
          >
            <Plus className="size-5" /> Add New FAQ
          </Button>
        </div>

        {/* Search & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="md:col-span-2 relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-neutral-400" />
              <input 
                type="text"
                placeholder="Search questions or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-16 bg-white border border-neutral-100 rounded-[1.5rem] pl-14 pr-6 font-bold text-neutral-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all shadow-sm"
              />
           </div>
           <div className="bg-white border border-neutral-100 rounded-[1.5rem] p-4 flex items-center justify-around shadow-sm">
              <div className="text-center">
                 <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Total</p>
                 <p className="text-xl font-black text-neutral-900">{faqs.length}</p>
              </div>
              <div className="h-8 w-px bg-neutral-100" />
              <div className="text-center">
                 <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Active</p>
                 <p className="text-xl font-black text-emerald-600">{faqs.filter(f => f.isActive).length}</p>
              </div>
           </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {isLoading ? (
            [1, 2, 3].map(i => (
              <Skeleton key={i} className="h-24 w-full rounded-3xl" />
            ))
          ) : filteredFaqs.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-neutral-200">
               <div className="size-16 rounded-3xl bg-neutral-50 flex items-center justify-center mx-auto mb-4 text-neutral-300">
                  <MessageCircle className="size-8" />
               </div>
               <p className="font-black uppercase tracking-widest text-neutral-400 text-xs">No FAQs found matching your criteria</p>
            </div>
          ) : (
            filteredFaqs.map((faq) => (
              <motion.div
                layout
                key={faq.id}
                className="bg-white border border-neutral-100 rounded-3xl p-6 flex items-center gap-6 group hover:shadow-xl hover:shadow-black/5 transition-all duration-300"
              >
                <div className="size-10 bg-neutral-50 rounded-xl flex items-center justify-center text-neutral-300 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                   <GripVertical className="size-5" />
                </div>
                
                <div className="flex-1 space-y-1">
                   <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                         {faq.category || "General"}
                      </span>
                      {!faq.isActive && (
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
                           Hidden
                        </span>
                      )}
                   </div>
                   <h4 className="text-lg font-black text-neutral-900 tracking-tight">{faq.question}</h4>
                   <p className="text-sm text-neutral-500 font-medium line-clamp-1">{faq.answer}</p>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <Button 
                     variant="ghost" 
                     size="icon" 
                     onClick={() => {
                       setEditingFaq(faq);
                       setIsModalOpen(true);
                     }}
                     className="size-12 rounded-2xl hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900"
                   >
                      <Edit2 className="size-4" />
                   </Button>
                   <Button 
                     variant="ghost" 
                     size="icon" 
                     onClick={() => handleDelete(faq.id)}
                     className="size-12 rounded-2xl hover:bg-rose-50 text-neutral-400 hover:text-rose-500"
                   >
                      <Trash2 className="size-4" />
                   </Button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl rounded-[2.5rem] border-none p-0 bg-white shadow-2xl overflow-hidden">
          <div className="bg-neutral-900 p-8 text-white">
            <h2 className="text-2xl font-black tracking-tight">{editingFaq?.id ? "Edit FAQ" : "New Question"}</h2>
            <p className="text-white/40 text-xs font-bold mt-1">Help your customers find answers quickly.</p>
          </div>
          
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Category</Label>
                <Input 
                  value={editingFaq?.category} 
                  onChange={(e) => setEditingFaq({...editingFaq, category: e.target.value})}
                  placeholder="e.g. Shipping"
                  className="h-14 bg-neutral-50 border-none rounded-xl font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Display Order</Label>
                <Input 
                  type="number"
                  value={editingFaq?.order} 
                  onChange={(e) => setEditingFaq({...editingFaq, order: parseInt(e.target.value)})}
                  placeholder="0"
                  className="h-14 bg-neutral-50 border-none rounded-xl font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Question</Label>
              <Input 
                value={editingFaq?.question} 
                onChange={(e) => setEditingFaq({...editingFaq, question: e.target.value})}
                placeholder="How do I track my order?"
                className="h-14 bg-neutral-50 border-none rounded-xl font-bold text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Answer</Label>
              <Textarea 
                value={editingFaq?.answer} 
                onChange={(e) => setEditingFaq({...editingFaq, answer: e.target.value})}
                placeholder="Provide a detailed answer..."
                className="min-h-[150px] bg-neutral-50 border-none rounded-2xl font-bold p-6"
              />
            </div>

            <div className="flex items-center justify-between p-6 bg-neutral-50 rounded-2xl">
               <div className="space-y-0.5">
                  <p className="text-sm font-black text-neutral-900">Active Status</p>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Visible on the public site</p>
               </div>
               <Switch 
                 checked={editingFaq?.isActive} 
                 onCheckedChange={(checked) => setEditingFaq({...editingFaq, isActive: checked})}
               />
            </div>
          </div>

          <DialogFooter className="p-8 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between gap-4">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] text-neutral-400">
               Discard
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="h-14 px-10 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-600/20 gap-3 flex-1"
            >
              {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-5" />}
              {editingFaq?.id ? "Update FAQ" : "Publish FAQ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

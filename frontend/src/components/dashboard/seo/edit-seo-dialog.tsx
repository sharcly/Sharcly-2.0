"use client";

import { useEffect, useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { Globe, Shield, Search, Image as ImageIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface EditSeoDialogProps {
  seo: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditSeoDialog({ seo, isOpen, onClose, onSuccess }: EditSeoDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    pageSlug: "",
    title: "",
    description: "",
    keywords: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    canonicalUrl: "",
    robots: "index, follow",
  });

  useEffect(() => {
    if (seo) {
      setFormData({
        pageSlug: seo.pageSlug || "",
        title: seo.title || "",
        description: seo.description || "",
        keywords: seo.keywords || "",
        ogTitle: seo.ogTitle || "",
        ogDescription: seo.ogDescription || "",
        ogImage: seo.ogImage || "",
        canonicalUrl: seo.canonicalUrl || "",
        robots: seo.robots || "index, follow",
      });
    } else {
       setFormData({
        pageSlug: "",
        title: "",
        description: "",
        keywords: "",
        ogTitle: "",
        ogDescription: "",
        ogImage: "",
        canonicalUrl: "",
        robots: "index, follow",
      });
    }
  }, [seo, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.put("/seo", formData);
      toast.success("SEO metadata updated successfully");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("SEO update error:", error);
      toast.error(error.response?.data?.message || "Failed to update SEO settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-background/95 backdrop-blur-2xl border-white/5 shadow-2xl rounded-[2rem] overflow-hidden">
        <DialogHeader className="p-2">
          <div className="flex items-center gap-3 mb-2">
             <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Globe className="h-5 w-5 text-primary" />
             </div>
             <div>
                <DialogTitle className="text-xl font-bold tracking-tight">
                  {seo ? "Edit Page SEO" : "Add Page SEO"}
                </DialogTitle>
                <DialogDescription className="text-xs uppercase font-black tracking-widest opacity-40">
                  Target: {formData.pageSlug || "New Page"}
                </DialogDescription>
             </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/5 p-1 rounded-xl mb-6">
              <TabsTrigger value="general" className="rounded-lg font-black text-[10px] uppercase tracking-widest gap-2">
                 <Search className="h-3 w-3" /> Search Meta
              </TabsTrigger>
              <TabsTrigger value="social" className="rounded-lg font-black text-[10px] uppercase tracking-widest gap-2">
                 <Globe className="h-3 w-3" /> Social & Robots
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6 pt-2">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-[0.2em] opacity-40">Page Slug (Identifier)</Label>
                <Input 
                  value={formData.pageSlug}
                  onChange={(e) => setFormData({...formData, pageSlug: e.target.value})}
                  placeholder="e.g., home, products, about"
                  disabled={!!seo}
                  className="h-12 bg-white/5 border-white/10 rounded-xl font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-[0.2em] opacity-40">Meta Title</Label>
                <Input 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="The page title shown in search results"
                  className="h-12 bg-white/5 border-white/10 rounded-xl font-medium"
                />
                <div className="flex justify-end">
                   <span className={cn("text-[10px] font-bold", formData.title.length > 60 ? "text-rose-500" : "text-primary/30")}>
                      {formData.title.length} / 60 chars
                   </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-[0.2em] opacity-40">Meta Description</Label>
                <Textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="A concise summary of the page content"
                  className="min-h-[100px] bg-white/5 border-white/10 rounded-xl font-medium resize-none"
                />
                 <div className="flex justify-end">
                   <span className={cn("text-[10px] font-bold", formData.description.length > 160 ? "text-rose-500" : "text-primary/30")}>
                      {formData.description.length} / 160 chars
                   </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-[0.2em] opacity-40">Keywords (Comma separated)</Label>
                <Input 
                  value={formData.keywords}
                  onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                  placeholder="e.g., wellness, sleep, premium extras"
                  className="h-12 bg-white/5 border-white/10 rounded-xl font-medium"
                />
              </div>
            </TabsContent>

            <TabsContent value="social" className="space-y-6 pt-2">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-[0.2em] opacity-40">OG Title</Label>
                    <Input 
                      value={formData.ogTitle}
                      onChange={(e) => setFormData({...formData, ogTitle: e.target.value})}
                      placeholder="Title for social sharing"
                      className="h-12 bg-white/5 border-white/10 rounded-xl font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-[0.2em] opacity-40">OG Image URL</Label>
                    <Input 
                      value={formData.ogImage}
                      onChange={(e) => setFormData({...formData, ogImage: e.target.value})}
                      placeholder="URL to social preview image"
                      className="h-12 bg-white/5 border-white/10 rounded-xl font-medium"
                    />
                  </div>
               </div>

               <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-[0.2em] opacity-40">OG Description</Label>
                <Textarea 
                  value={formData.ogDescription}
                  onChange={(e) => setFormData({...formData, ogDescription: e.target.value})}
                  placeholder="Description for social sharing"
                  className="min-h-[80px] bg-white/5 border-white/10 rounded-xl font-medium resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-[0.2em] opacity-40">Robots Directive</Label>
                  <Input 
                    value={formData.robots}
                    onChange={(e) => setFormData({...formData, robots: e.target.value})}
                    placeholder="index, follow"
                    className="h-12 bg-white/5 border-white/10 rounded-xl font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-[0.2em] opacity-40">Canonical URL</Label>
                  <Input 
                    value={formData.canonicalUrl}
                    onChange={(e) => setFormData({...formData, canonicalUrl: e.target.value})}
                    placeholder="https://sharcly.com/..."
                    className="h-12 bg-white/5 border-white/10 rounded-xl font-medium"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="pt-4 border-t border-white/5">
            <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl font-bold uppercase tracking-widest text-[10px]">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="rounded-xl premium-gradient px-8 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">
              {loading ? "Saving..." : "Save SEO Settings"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader2, 
  Sparkles, 
  Image as ImageIcon, 
  Calendar, 
  Globe, 
  FileText, 
  ChevronRight, 
  Lock,
  Unlock,
  Eye,
  Settings2,
  Rocket,
  Search,
  Share2,
  CheckCircle2,
  ArrowRight,
  PenTool
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogEditorProps {
  blog?: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function BlogEditor({ blog, isOpen, onClose, onSuccess }: BlogEditorProps) {
  const [loading, setLoading] = useState(false);
  const [isSlugLocked, setIsSlugLocked] = useState(true);
  const [activeTab, setActiveTab] = useState<'content' | 'settings' | 'seo'>('content');
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    status: "DRAFT",
    publishedAt: "",
    metaTitle: "",
    metaDescription: "",
    category: "WELLNESS",
    tags: "",
    authorName: "Scarly Team"
  });

  const seoStrength = useMemo(() => {
    let score = 0;
    if (formData.metaTitle.length >= 30 && formData.metaTitle.length <= 60) score += 40;
    if (formData.metaDescription.length >= 120 && formData.metaDescription.length <= 160) score += 40;
    if (formData.featuredImage) score += 20;
    return score;
  }, [formData.metaTitle, formData.metaDescription, formData.featuredImage]);

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || "",
        slug: blog.slug || "",
        excerpt: blog.excerpt || "",
        content: blog.content || "",
        featuredImage: blog.featuredImage || "",
        status: blog.status || "DRAFT",
        publishedAt: blog.publishedAt ? new Date(blog.publishedAt).toISOString().slice(0, 16) : "",
        metaTitle: blog.metaTitle || "",
        metaDescription: blog.metaDescription || "",
        category: blog.category || "WELLNESS",
        tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : (blog.tags || ""),
        authorName: blog.author?.name || "Scarly Team"
      });
      setIsSlugLocked(true);
    } else {
      setFormData({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        featuredImage: "",
        status: "DRAFT",
        publishedAt: "",
        metaTitle: "",
        metaDescription: "",
        category: "GUIDES",
        tags: "",
        authorName: "Scarly Team"
      });
      setIsSlugLocked(false);
    }
  }, [blog]);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-")
      .slice(0, 80);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({ 
      ...prev, 
      title, 
      slug: (blog || isSlugLocked) ? prev.slug : generateSlug(title),
      metaTitle: blog ? prev.metaTitle : title 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const processedTags = formData.tags ? formData.tags.split(",").map(t => t.trim()) : [];
      const payload = { ...formData, tags: processedTags };

      if (blog) {
        await apiClient.patch(`/blogs/${blog.id}`, payload);
        toast.success("Blog updated");
      } else {
        await apiClient.post("/blogs", payload);
        toast.success("New blog published");
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[1200px] w-[98vw] h-[95vh] p-0 rounded-[3rem] border-none shadow-3xl overflow-hidden bg-white">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          
          {/* Natural Header */}
          <header className="px-12 py-10 flex justify-between items-end border-b border-gray-100 bg-white shrink-0">
             <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                   <div className="size-8 rounded-lg bg-[#062D1B] flex items-center justify-center text-white"><PenTool className="size-4" /></div>
                   <span className="text-[10px] font-bold uppercase tracking-widest text-[#062D1B]/40">Scarly Blog Editor</span>
                </div>
                <DialogTitle className="text-4xl font-black tracking-tighter italic font-serif">
                   {formData.title || (blog ? "Edit Post" : "Write a New Story")}
                </DialogTitle>
             </div>
             <div className="flex items-center gap-4">
                <Button type="button" variant="ghost" onClick={onClose} className="rounded-full h-14 px-8 font-bold text-xs">Cancel</Button>
                <Button type="submit" disabled={loading} className="rounded-full h-14 px-12 bg-[#062D1B] text-white font-bold text-xs shadow-xl flex gap-3">
                   {loading ? <Loader2 className="size-4 animate-spin" /> : <Rocket className="size-4" />}
                   {blog ? "Save Changes" : "Publish Story"}
                </Button>
             </div>
          </header>

          <div className="flex flex-1 overflow-hidden">
             
             {/* Simple Sidebar Navigation */}
             <aside className="w-72 border-r border-gray-100 bg-gray-50/30 p-10 space-y-12 shrink-0">
                <nav className="flex flex-col gap-2">
                   {[
                     { id: 'content', label: 'Writer', icon: FileText },
                     { id: 'settings', label: 'Settings', icon: Settings2 },
                     { id: 'seo', label: 'Google Search', icon: Search }
                   ].map((tab) => (
                     <button
                       key={tab.id}
                       type="button"
                       onClick={() => setActiveTab(tab.id as any)}
                       className={cn(
                         "flex items-center gap-4 h-14 px-6 rounded-2xl font-bold text-sm transition-all",
                         activeTab === tab.id ? "bg-white text-[#062D1B] shadow-sm border border-gray-100" : "text-gray-400 hover:text-gray-600"
                       )}
                     >
                       <tab.icon className="size-4" /> {tab.label}
                     </button>
                   ))}
                </nav>

                <div className="space-y-4 pt-10 border-t border-gray-100">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">SEO Quality</p>
                   <div className="space-y-3">
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                         <div style={{ width: `${seoStrength}%` }} className={cn("h-full transition-all duration-700", seoStrength > 80 ? 'bg-emerald-500' : 'bg-amber-500')} />
                      </div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{seoStrength > 80 ? 'Ready' : 'Needs attention'}</p>
                   </div>
                </div>
             </aside>

             <main className="flex-1 overflow-y-auto p-16">
                <AnimatePresence mode="wait">
                   {activeTab === 'content' && (
                     <motion.div key="content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 max-w-4xl mx-auto">
                        <div className="space-y-10">
                           <div className="space-y-3">
                              <Label className="text-xs font-bold text-gray-400 ml-1">Write your title here</Label>
                              <Input 
                                required
                                value={formData.title}
                                onChange={handleTitleChange}
                                placeholder="E.g. 5 Benefits of Natural Wellness"
                                className="h-20 rounded-3xl bg-transparent border-gray-100 shadow-sm px-8 text-2xl font-bold focus:border-[#062D1B] transition-all"
                              />
                           </div>
                           <div className="space-y-3">
                              <Label className="text-xs font-bold text-gray-400 ml-1">The main content</Label>
                              <Textarea 
                                required
                                value={formData.content}
                                onChange={(e) => setFormData({...formData, content: e.target.value})}
                                className="min-h-[500px] rounded-[3rem] bg-transparent border-gray-100 shadow-sm p-10 text-xl font-medium leading-relaxed resize-none font-serif"
                                placeholder="Start writing your story..."
                              />
                           </div>
                        </div>
                     </motion.div>
                   )}

                   {activeTab === 'settings' && (
                     <motion.div key="settings" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                        <div className="space-y-10">
                           <div className="p-10 rounded-[3rem] bg-white border border-gray-100 shadow-sm space-y-8">
                              <h3 className="text-lg font-bold">Image & Media</h3>
                              <div className="space-y-6">
                                 <div className="space-y-2">
                                    <Label className="text-xs font-medium text-gray-400">Featured Image URL</Label>
                                    <Input value={formData.featuredImage} onChange={(e) => setFormData({...formData, featuredImage: e.target.value})} className="h-12 rounded-xl border-gray-100" placeholder="https://..." />
                                 </div>
                                 <div className="aspect-video rounded-3xl bg-gray-50 overflow-hidden relative border border-gray-100">
                                    {formData.featuredImage ? <img src={formData.featuredImage} className="absolute inset-0 w-full h-full object-cover" /> : null}
                                 </div>
                              </div>
                           </div>
                           <div className="p-10 rounded-[3rem] bg-white border border-gray-100 shadow-sm space-y-8">
                              <h3 className="text-lg font-bold">Publishing</h3>
                              <div className="space-y-6">
                                 <div className="space-y-2">
                                    <Label className="text-xs font-medium text-gray-400 flex justify-between">Slug <span>/blog/{formData.slug}</span></Label>
                                    <div className="relative group">
                                       <Input value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} disabled={isSlugLocked} className="h-12 rounded-xl border-gray-100 px-10" />
                                       <button type="button" onClick={() => setIsSlugLocked(!isSlugLocked)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
                                          {isSlugLocked ? <Lock className="size-4" /> : <Unlock className="size-4" />}
                                       </button>
                                    </div>
                                 </div>
                                 <div className="space-y-2">
                                    <Label className="text-xs font-medium text-gray-400">Schedule Date</Label>
                                    <Input type="datetime-local" value={formData.publishedAt} onChange={(e) => setFormData({...formData, publishedAt: e.target.value})} className="h-12 rounded-xl border-gray-100" />
                                 </div>
                                 <div className="space-y-2">
                                    <Label className="text-xs font-medium text-gray-400">Post Status</Label>
                                    <Select value={formData.status} onValueChange={(val) => setFormData({...formData, status: val})}>
                                       <SelectTrigger className="h-12 rounded-xl border-gray-100"><SelectValue /></SelectTrigger>
                                       <SelectContent>
                                          <SelectItem value="DRAFT">Draft</SelectItem>
                                          <SelectItem value="PUBLISHED">Published</SelectItem>
                                          <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                                       </SelectContent>
                                    </Select>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div className="space-y-10">
                           <div className="p-10 rounded-[3rem] bg-white border border-gray-100 shadow-sm space-y-8">
                              <h3 className="text-lg font-bold">Details</h3>
                              <div className="space-y-6">
                                 <div className="space-y-2">
                                    <Label className="text-xs font-medium text-gray-400">Category</Label>
                                    <Select value={formData.category} onValueChange={(val) => setFormData({...formData, category: val})}>
                                       <SelectTrigger className="h-12 rounded-xl border-gray-100"><SelectValue /></SelectTrigger>
                                       <SelectContent>
                                          <SelectItem value="WELLNESS">Wellness</SelectItem>
                                          <SelectItem value="GUIDES">Guides</SelectItem>
                                          <SelectItem value="NEWS">News</SelectItem>
                                       </SelectContent>
                                    </Select>
                                 </div>
                                 <div className="space-y-2">
                                    <Label className="text-xs font-medium text-gray-400">Author</Label>
                                    <Input value={formData.authorName} onChange={(e) => setFormData({...formData, authorName: e.target.value})} className="h-12 rounded-xl border-gray-100" />
                                 </div>
                                 <div className="space-y-2">
                                    <Label className="text-xs font-medium text-gray-400">Tags</Label>
                                    <Input value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} className="h-12 rounded-xl border-gray-100" placeholder="cbd, natural, life" />
                                 </div>
                                 <div className="space-y-2">
                                    <Label className="text-xs font-medium text-gray-400">Excerpt</Label>
                                    <Textarea value={formData.excerpt} onChange={(e) => setFormData({...formData, excerpt: e.target.value})} className="min-h-[140px] rounded-xl border-gray-100 p-4 text-sm" placeholder="A short description..." />
                                 </div>
                              </div>
                           </div>
                        </div>
                     </motion.div>
                   )}

                   {activeTab === 'seo' && (
                     <motion.div key="seo" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12 max-w-3xl mx-auto">
                        <div className="p-12 rounded-[3.5rem] bg-white border border-gray-100 shadow-sm space-y-10">
                           <h3 className="text-xl font-bold">Google & Search Engine Optimization</h3>
                           <div className="space-y-8">
                              <div className="space-y-2">
                                 <div className="flex justify-between text-xs font-medium text-gray-400 px-1">
                                    <span>SEO Title</span>
                                    <span>{formData.metaTitle.length}/60</span>
                                 </div>
                                 <Input value={formData.metaTitle} onChange={(e) => setFormData({...formData, metaTitle: e.target.value})} className="h-14 rounded-xl border-gray-100 font-bold" />
                              </div>
                              <div className="space-y-2">
                                 <div className="flex justify-between text-xs font-medium text-gray-400 px-1">
                                    <span>SEO Description</span>
                                    <span>{formData.metaDescription.length}/160</span>
                                 </div>
                                 <Textarea value={formData.metaDescription} onChange={(e) => setFormData({...formData, metaDescription: e.target.value})} className="min-h-[180px] rounded-2xl border-gray-100 p-6 text-sm" />
                              </div>
                           </div>
                        </div>
                        <div className="p-8 rounded-[3rem] bg-[#062D1B] text-white space-y-8">
                           <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Google Preview</p>
                           <div className="space-y-3">
                              <p className="text-xs text-emerald-400">www.sharcly.com › blog › {formData.slug}</p>
                              <h4 className="text-xl font-bold">{formData.metaTitle || "Post Title"}</h4>
                              <p className="text-xs opacity-60 leading-relaxed line-clamp-3">{formData.metaDescription || "Enter a meta description to see how this post will look in search results."}</p>
                           </div>
                        </div>
                     </motion.div>
                   )}
                </AnimatePresence>
             </main>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

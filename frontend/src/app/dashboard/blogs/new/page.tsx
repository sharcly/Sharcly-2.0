"use client";

import { useState, useMemo } from "react";
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
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader2, 
  Image as ImageIcon, 
  FileText, 
  Lock,
  Unlock,
  Settings2,
  Search,
  CheckCircle2,
  ArrowLeft,
  PenTool,
  Save,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { RichTextEditor } from "@/components/dashboard/blog/rich-text-editor";

export default function NewBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isSlugLocked, setIsSlugLocked] = useState(false);
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
    category: "GUIDES",
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
      slug: isSlugLocked ? prev.slug : generateSlug(title),
      metaTitle: title 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const processedTags = formData.tags ? formData.tags.split(",").map(t => t.trim()) : [];
      const payload = { ...formData, tags: processedTags };

      await apiClient.post("/blogs", payload);
      toast.success("Blog post created successfully");
      router.push("/dashboard/blogs");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFA] pb-24">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-3xl border-b border-gray-100 px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-6">
           <Button asChild variant="ghost" className="size-10 rounded-full p-0">
              <Link href="/dashboard/blogs"><ArrowLeft className="size-5" /></Link>
           </Button>
           <div className="h-6 w-px bg-gray-100" />
           <div className="flex items-center gap-3">
              <PenTool className="size-4 text-[#062D1B]/40" />
              <h1 className="text-xl font-bold tracking-tight">Create New Blog</h1>
           </div>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="ghost" asChild className="rounded-full px-6 font-bold text-xs"><Link href="/dashboard/blogs">Discard</Link></Button>
           <Button onClick={handleSubmit} disabled={loading} className="rounded-full px-10 bg-[#062D1B] text-white font-bold text-xs shadow-xl flex gap-2">
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              Publish Story
           </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-[1400px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Side Navigation */}
          <aside className="lg:col-span-3 space-y-8 lg:sticky lg:top-32 h-fit">
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
                      "flex items-center gap-4 h-16 px-8 rounded-3xl font-bold text-sm transition-all text-left",
                      activeTab === tab.id ? "bg-white text-[#062D1B] shadow-sm border border-gray-100" : "text-gray-400 hover:text-gray-600"
                    )}
                  >
                    <tab.icon className="size-5" /> {tab.label}
                  </button>
                ))}
             </nav>

             <div className="p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm space-y-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">SEO Quality</p>
                <div className="space-y-4">
                   <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                      <div style={{ width: `${seoStrength}%` }} className={cn("h-full transition-all duration-700", seoStrength > 80 ? 'bg-emerald-500' : 'bg-amber-500')} />
                   </div>
                   <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest">
                      <span className="opacity-30">Strength</span>
                      <span className={cn(seoStrength > 80 ? 'text-emerald-500' : 'text-amber-500')}>{seoStrength}%</span>
                   </div>
                </div>
             </div>
          </aside>

          {/* Editor Area */}
          <main className="lg:col-span-9">
             <AnimatePresence mode="wait">
                {activeTab === 'content' && (
                  <motion.div key="content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                     <div className="space-y-4">
                        <Label className="text-xs font-bold text-gray-400 ml-4">Title of your story</Label>
                        <Input 
                          value={formData.title}
                          onChange={handleTitleChange}
                          placeholder="E.g. The Best Way to Use CBD"
                          className="h-24 rounded-[3rem] bg-white border-gray-100 shadow-sm px-10 text-3xl font-black font-serif italic focus:border-[#062D1B] transition-all"
                        />
                     </div>
                     <div className="space-y-4">
                        <Label className="text-xs font-bold text-gray-400 ml-4">Write your content here</Label>
                        <RichTextEditor 
                          content={formData.content}
                          onChange={(content) => setFormData({...formData, content})}
                        />
                     </div>
                  </motion.div>
                )}

                {activeTab === 'settings' && (
                  <motion.div key="settings" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="space-y-10">
                        <div className="p-10 rounded-[3rem] bg-white border border-gray-100 shadow-sm space-y-8">
                           <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                              <ImageIcon className="size-5 text-gray-300" />
                              <h3 className="text-lg font-bold">Image & Media</h3>
                           </div>
                           <div className="space-y-6">
                              <div className="space-y-2">
                                 <Label className="text-[10px] font-bold uppercase text-gray-400">Featured Image URL</Label>
                                 <Input value={formData.featuredImage} onChange={(e) => setFormData({...formData, featuredImage: e.target.value})} className="h-14 rounded-2xl border-gray-100" placeholder="https://..." />
                              </div>
                              <div className="aspect-video rounded-[2.5rem] bg-gray-50 overflow-hidden border border-gray-50">
                                 {formData.featuredImage ? <img src={formData.featuredImage} className="w-full h-full object-cover" /> : null}
                              </div>
                           </div>
                        </div>
                        <div className="p-10 rounded-[3rem] bg-white border border-gray-100 shadow-sm space-y-8">
                           <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                              <Lock className="size-5 text-gray-300" />
                              <h3 className="text-lg font-bold">Settings</h3>
                           </div>
                           <div className="space-y-6">
                              <div className="space-y-2">
                                 <Label className="text-[10px] font-bold uppercase text-gray-400 flex justify-between">Permalink <span>/blog/{formData.slug}</span></Label>
                                 <div className="relative group">
                                    <Input value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} disabled={isSlugLocked} className="h-14 rounded-2xl border-gray-100 px-12" />
                                    <button type="button" onClick={() => setIsSlugLocked(!isSlugLocked)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                                       {isSlugLocked ? <Lock className="size-4" /> : <Unlock className="size-4" />}
                                    </button>
                                 </div>
                              </div>
                              <div className="space-y-2">
                                 <Label className="text-[10px] font-bold uppercase text-gray-400">Status</Label>
                                 <Select value={formData.status} onValueChange={(val) => setFormData({...formData, status: val})}>
                                    <SelectTrigger className="h-14 rounded-2xl border-gray-100 font-bold"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-2xl border-gray-100">
                                       <SelectItem value="DRAFT">Draft</SelectItem>
                                       <SelectItem value="PUBLISHED">Published</SelectItem>
                                       <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                                    </SelectContent>
                                 </Select>
                              </div>
                              <div className="space-y-2">
                                 <Label className="text-[10px] font-bold uppercase text-gray-400">Schedule Date</Label>
                                 <Input type="datetime-local" value={formData.publishedAt} onChange={(e) => setFormData({...formData, publishedAt: e.target.value})} className="h-14 rounded-2xl border-gray-100 font-bold" />
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="space-y-10">
                        <div className="p-10 rounded-[3rem] bg-white border border-gray-100 shadow-sm space-y-10">
                           <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                              <Globe className="size-5 text-gray-300" />
                              <h3 className="text-lg font-bold">Post Details</h3>
                           </div>
                           <div className="space-y-8">
                              <div className="space-y-3">
                                 <Label className="text-[10px] font-bold uppercase text-gray-400">Category</Label>
                                 <Select value={formData.category} onValueChange={(val) => setFormData({...formData, category: val})}>
                                    <SelectTrigger className="h-14 rounded-2xl border-gray-100 font-bold"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-2xl border-gray-100">
                                       <SelectItem value="WELLNESS">Wellness</SelectItem>
                                       <SelectItem value="GUIDES">Guides</SelectItem>
                                       <SelectItem value="NEWS">News</SelectItem>
                                    </SelectContent>
                                 </Select>
                              </div>
                              <div className="space-y-3">
                                 <Label className="text-[10px] font-bold uppercase text-gray-400">Tags</Label>
                                 <Input value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} className="h-14 rounded-2xl border-gray-100 font-bold" placeholder="wellness, scarly, etc." />
                              </div>
                              <div className="space-y-3">
                                 <Label className="text-[10px] font-bold uppercase text-gray-400">Excerpt</Label>
                                 <Textarea value={formData.excerpt} onChange={(e) => setFormData({...formData, excerpt: e.target.value})} className="min-h-[160px] rounded-3xl border-gray-100 p-6 text-sm font-medium leading-relaxed resize-none" placeholder="Short summary..." />
                              </div>
                           </div>
                        </div>
                     </div>
                  </motion.div>
                )}

                {activeTab === 'seo' && (
                  <motion.div key="seo" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12 max-w-4xl mx-auto">
                     <div className="p-12 rounded-[4rem] bg-white border border-gray-100 shadow-sm space-y-12">
                        <div className="space-y-2">
                           <h3 className="text-2xl font-bold">Search Optimization</h3>
                           <p className="text-sm text-gray-400">Control how your post appears on Google.</p>
                        </div>
                        <div className="space-y-8">
                           <div className="space-y-4">
                              <div className="flex justify-between px-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                 <span>SEO Title</span>
                                 <span>{formData.metaTitle.length}/60</span>
                              </div>
                              <Input value={formData.metaTitle} onChange={(e) => setFormData({...formData, metaTitle: e.target.value})} className="h-16 rounded-2xl border-gray-100 bg-gray-50/50 px-8 font-bold" />
                           </div>
                           <div className="space-y-4">
                              <div className="flex justify-between px-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                 <span>SEO Description</span>
                                 <span>{formData.metaDescription.length}/160</span>
                              </div>
                              <Textarea value={formData.metaDescription} onChange={(e) => setFormData({...formData, metaDescription: e.target.value})} className="min-h-[200px] rounded-[2.5rem] border-gray-100 bg-gray-50/50 p-10 text-sm font-bold leading-relaxed resize-none" />
                           </div>
                        </div>
                     </div>

                     <div className="p-10 rounded-[3rem] bg-[#062D1B] text-white space-y-10 shadow-2xl">
                        <CheckCircle2 className="size-8 opacity-20" />
                        <div className="space-y-4">
                           <p className="text-xs text-emerald-400">www.sharcly.com › blog › {formData.slug}</p>
                           <h4 className="text-2xl font-bold italic font-serif leading-snug">{formData.metaTitle || "Your Blog Title"}</h4>
                           <p className="text-sm opacity-50 leading-relaxed font-medium line-clamp-3">{formData.metaDescription || "Your blog summary will appear here for search engines."}</p>
                        </div>
                     </div>
                  </motion.div>
                )}
             </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}

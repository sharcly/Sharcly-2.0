"use client";

import { useEffect, useState } from "react";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { Globe, ChevronRight, Check, X, ShieldCheck, Search, Image as ImageIcon, FileCode, Network, Link as LinkIcon, Database } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EditSeoDrawerProps {
  seo: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditSeoDrawer({ seo, isOpen, onClose, onSuccess }: EditSeoDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("search");
  const [sitemapPreview, setSitemapPreview] = useState("");
  const [robotsPreview, setRobotsPreview] = useState("");
  
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

  const PAGES = [
    { id: "home", label: "Home", group: "System" },
    { id: "products", label: "Shop", group: "System" },
    { id: "about", label: "About", group: "Company" },
    { id: "wholesale", label: "Wholesale", group: "Company" },
    { id: "blog", label: "Journal", group: "Content" },
    { id: "contact", label: "Contact", group: "Company" },
    { id: "lab-results", label: "Purity Labs", group: "Trust" },
    { id: "faqs", label: "Support", group: "Trust" },
    { id: "privacy", label: "Privacy", group: "Legal" },
    { id: "terms", label: "Terms", group: "Legal" },
  ];

  useEffect(() => {
    const fetchContext = async () => {
      try {
        const [pRes, sRes, rRes] = await Promise.all([
          apiClient.get("/products"),
          apiClient.get("/seo/sitemap.xml"),
          apiClient.get("/seo/robots.txt")
        ]);
        setProducts(pRes.data.products || []);
        setSitemapPreview(typeof sRes.data === 'string' ? sRes.data : JSON.stringify(sRes.data, null, 2));
        setRobotsPreview(rRes.data);
      } catch (err) {
        console.error("Failed to fetch SEO context", err);
      }
    };
    if (isOpen) fetchContext();
  }, [isOpen]);

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
    if (!formData.pageSlug) {
      toast.error("Select Target Path");
      return;
    }
    setLoading(true);
    try {
      await apiClient.put("/seo", formData);
      toast.success("SEO Architecture Updated");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error("Update Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="right"
        className="!min-w-[800px] !max-w-[800px] !w-[800px] border-l border-neutral-100 bg-white p-0 overflow-hidden flex flex-col font-sans"
      >
        {/* HEADER: Minimal & High-End */}
        <div className="px-10 py-8 border-b border-neutral-100 flex items-center justify-between bg-white">
           <div className="flex items-center gap-5">
              <div className="size-11 rounded-xl bg-[#0f2318] flex items-center justify-center">
                 <Globe className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                 <h2 className="text-xl font-bold tracking-tight text-neutral-900 font-heading">
                    Meta Architecture
                 </h2>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mt-0.5">
                    {seo ? `Editing Path: /${formData.pageSlug}` : "New Endpoint Blueprint"}
                 </p>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <button onClick={onClose} className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors">Cancel</button>
              <button 
                onClick={handleSubmit} 
                disabled={loading || activeTab === "sitemap" || activeTab === "robots"}
                className={cn(
                    "h-10 px-8 rounded-xl bg-[#0f2318] text-white font-bold uppercase tracking-widest text-[10px] shadow-lg active:scale-95 transition-all",
                    (activeTab === "sitemap" || activeTab === "robots") && "opacity-20 grayscale cursor-not-allowed"
                )}
              >
                {loading ? "Saving..." : "Save Meta"}
              </button>
           </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* TAB NAVIGATION: Thin & Professional */}
          <div className="px-10 pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="flex gap-10 border-b border-neutral-100 rounded-none bg-transparent h-auto p-0 mb-0">
                    <TabsTrigger value="search" className="rounded-none border-b-2 border-transparent px-0 py-4 font-bold text-[11px] uppercase tracking-widest data-[state=active]:border-[#0f2318] data-[state=active]:text-[#0f2318] bg-transparent shadow-none transition-all gap-2">
                        Index
                    </TabsTrigger>
                    <TabsTrigger value="social" className="rounded-none border-b-2 border-transparent px-0 py-4 font-bold text-[11px] uppercase tracking-widest data-[state=active]:border-[#0f2318] data-[state=active]:text-[#0f2318] bg-transparent shadow-none transition-all gap-2">
                        Social
                    </TabsTrigger>
                    <TabsTrigger value="sitemap" className="rounded-none border-b-2 border-transparent px-0 py-4 font-bold text-[11px] uppercase tracking-widest data-[state=active]:border-[#0f2318] data-[state=active]:text-[#0f2318] bg-transparent shadow-none transition-all gap-2">
                        Sitemap
                    </TabsTrigger>
                    <TabsTrigger value="robots" className="rounded-none border-b-2 border-transparent px-0 py-4 font-bold text-[11px] uppercase tracking-widest data-[state=active]:border-[#0f2318] data-[state=active]:text-[#0f2318] bg-transparent shadow-none transition-all gap-2">
                        Robots
                    </TabsTrigger>
                </TabsList>
            </Tabs>
          </div>

          <ScrollArea className="flex-1">
            <div className="px-10 py-10 space-y-12 pb-24">
              
              {activeTab === "search" && (
                <div className="space-y-10 animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                                <LinkIcon className="size-3" /> Target Path
                            </Label>
                            <Select 
                                value={formData.pageSlug || ""} 
                                onValueChange={(v) => setFormData({...formData, pageSlug: v})}
                                disabled={!!seo}
                            >
                                <SelectTrigger className="h-11 border-neutral-100 rounded-xl text-neutral-900 font-bold px-4 focus:ring-1 focus:ring-[#0f2318] transition-all bg-neutral-50/50">
                                    <SelectValue placeholder="Select Slug..." />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-neutral-100 text-neutral-900 rounded-xl shadow-2xl max-h-[400px]">
                                    <div className="px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-neutral-300">SYSTEM</div>
                                    {PAGES.map((page) => (
                                        <SelectItem key={page.id} value={page.id} className="font-bold py-2 focus:bg-neutral-50 cursor-pointer px-4">
                                            {page.label}
                                        </SelectItem>
                                    ))}
                                    <div className="px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-neutral-300 border-t border-neutral-50 mt-2">PRODUCTS</div>
                                    {products.map((p) => (
                                        <SelectItem key={p.id} value={p.slug} className="font-bold py-2 focus:bg-neutral-50 cursor-pointer px-4">
                                            {p.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                                <Search className="size-3" /> Search Title
                            </Label>
                            <Input 
                                value={formData.title || ""}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                placeholder="Primary Meta Title"
                                className="h-11 border-neutral-100 rounded-xl font-bold text-neutral-900 px-4 focus:ring-1 focus:ring-[#0f2318] bg-neutral-50/50"
                            />
                            <div className="flex justify-end">
                                <span className={cn("text-[9px] font-bold uppercase tracking-tighter", formData.title.length > 60 ? "text-rose-500" : "text-neutral-300")}>
                                    {formData.title.length} / 60
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Meta Description (Search Snippet)</Label>
                        <Textarea 
                            value={formData.description || ""}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Brief summary of the page for search engines..."
                            className="min-h-[140px] border-neutral-100 rounded-2xl font-medium text-neutral-700 p-5 focus:ring-1 focus:ring-[#0f2318] bg-neutral-50/50 resize-none leading-relaxed"
                        />
                        <div className="flex justify-end">
                            <span className={cn("text-[9px] font-bold uppercase tracking-tighter", formData.description.length > 160 ? "text-rose-500" : "text-neutral-300")}>
                                {formData.description.length} / 160
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Semantic Keywords</Label>
                        <Input 
                            value={formData.keywords || ""}
                            onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                            placeholder="cbd, botanical, wellness, sleep..."
                            className="h-11 border-neutral-100 rounded-xl font-bold text-neutral-900 px-4 bg-neutral-50/50"
                        />
                    </div>
                </div>
              )}

              {activeTab === "social" && (
                <div className="space-y-10 animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">OG Title</Label>
                            <Input 
                                value={formData.ogTitle || ""}
                                onChange={(e) => setFormData({...formData, ogTitle: e.target.value})}
                                placeholder="Social Share Title"
                                className="h-11 border-neutral-100 rounded-xl font-bold text-neutral-900 px-4 bg-neutral-50/50"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Robots Policy</Label>
                            <Input 
                                value={formData.robots || ""}
                                onChange={(e) => setFormData({...formData, robots: e.target.value})}
                                placeholder="index, follow"
                                className="h-11 border-neutral-100 rounded-xl font-bold text-neutral-900 px-4 bg-neutral-50/50"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Share Asset (OG Image)</Label>
                        <div className="flex gap-6 items-center p-6 bg-neutral-50/50 rounded-2xl border border-neutral-50">
                            <div className="size-24 rounded-xl bg-white border border-neutral-100 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                                {formData.ogImage ? <img src={formData.ogImage} className="size-full object-cover" /> : <ImageIcon className="size-8 text-neutral-100" />}
                            </div>
                            <div className="flex-1 space-y-2">
                                <Input 
                                    value={formData.ogImage || ""}
                                    onChange={(e) => setFormData({...formData, ogImage: e.target.value})}
                                    placeholder="https://sharcly.com/og-asset.jpg"
                                    className="h-10 border-transparent bg-transparent rounded-none font-bold text-[#0f2318] text-xs px-0 focus:ring-0"
                                />
                                <p className="text-[9px] font-bold text-neutral-300 uppercase tracking-widest">Recommended: 1200x630px</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Canonical Path</Label>
                        <Input 
                            value={formData.canonicalUrl || ""}
                            onChange={(e) => setFormData({...formData, canonicalUrl: e.target.value})}
                            placeholder="https://sharcly.com/..."
                            className="h-11 border-neutral-100 rounded-xl font-medium text-neutral-400 italic px-4 bg-neutral-50/50"
                        />
                    </div>
                </div>
              )}

              {activeTab === "sitemap" && (
                <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="flex items-center justify-between border-b border-neutral-50 pb-6">
                        <div className="space-y-1">
                            <h3 className="text-sm font-bold text-neutral-900">Search Manifest (XML)</h3>
                            <p className="text-[10px] font-medium text-neutral-400">Live generated feed for search engines.</p>
                        </div>
                        <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 px-3 py-1 rounded-lg font-bold text-[9px] uppercase tracking-widest">Auto-Sync Active</Badge>
                    </div>
                    <div className="bg-[#0f2318] rounded-2xl p-8 overflow-hidden shadow-xl relative">
                        <div className="absolute top-4 right-4 text-[8px] font-black uppercase tracking-[0.2em] text-emerald-400/20">Feed Preview</div>
                        <pre className="text-emerald-400/80 font-mono text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-[500px] custom-scrollbar">
                            {sitemapPreview || "Syncing manifest..."}
                        </pre>
                    </div>
                </div>
              )}

              {activeTab === "robots" && (
                <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="flex items-center justify-between border-b border-neutral-50 pb-6">
                        <div className="space-y-1">
                            <h3 className="text-sm font-bold text-neutral-900">Crawler Directives</h3>
                            <p className="text-[10px] font-medium text-neutral-400">Manage infrastructure visibility.</p>
                        </div>
                    </div>
                    <div className="bg-neutral-900 rounded-2xl p-10 overflow-hidden shadow-lg border border-neutral-800">
                        <pre className="text-neutral-300 font-mono text-sm leading-relaxed">
                            {robotsPreview || "Fetching policy..."}
                        </pre>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-5 bg-neutral-50/50 rounded-xl border border-neutral-50">
                          <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Indexing Policy</p>
                          <p className="text-xs font-bold text-neutral-900 flex items-center gap-2">
                             <Check className="size-3 text-emerald-500" /> Permissive
                          </p>
                       </div>
                       <div className="p-5 bg-neutral-50/50 rounded-xl border border-neutral-50">
                          <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Manifest</p>
                          <p className="text-xs font-bold text-neutral-900 flex items-center gap-2">
                             <Check className="size-3 text-emerald-500" /> Linked
                          </p>
                       </div>
                    </div>
                </div>
              )}

            </div>
          </ScrollArea>
        </div>

        {/* FOOTER: Minimal & Utility focused */}
        <div className="px-10 py-8 border-t border-neutral-100 flex items-center gap-6 bg-neutral-50/30 sticky bottom-0 z-10">
           <div className="flex items-center gap-4 flex-1">
              <div className="size-10 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                 <ShieldCheck className="size-5 text-emerald-600" />
              </div>
              <div>
                 <p className="text-[11px] font-bold text-neutral-900 uppercase tracking-tight">Search Verified</p>
                 <p className="text-[9px] text-neutral-400 font-medium">Valid Metadata Architecture</p>
              </div>
           </div>
           <Button 
            onClick={handleSubmit} 
            disabled={loading || activeTab === "sitemap" || activeTab === "robots"}
            className="h-11 px-10 rounded-xl bg-[#0f2318] text-white font-bold uppercase tracking-widest text-[10px] shadow-lg active:scale-95 transition-all flex items-center gap-2"
           >
             {loading ? "Saving..." : "Deploy Metadata"}
             {!loading && <ChevronRight className="h-4 w-4" />}
           </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

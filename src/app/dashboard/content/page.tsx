"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { 
  Loader2, 
  Save, 
  Layout, 
  FileText, 
  Globe, 
  Search, 
  Image as ImageIcon,
  MousePointer2,
  ListRestart,
  Code2,
  Settings2,
  Terminal,
  Activity,
  Eye,
  EyeOff,
  Truck,
  ShieldCheck
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { motion, AnimatePresence } from "framer-motion";

const PAGES = [
  { id: "home", label: "Home Page", path: "/" },
  { id: "products", label: "Products Catalog", path: "/products" },
  { id: "about", label: "About Us", path: "/about" },
  { id: "wholesale", label: "Wholesale Partner", path: "/wholesale" },
  { id: "blog", label: "Blog Listing", path: "/blog" },
  { id: "contact", label: "Contact Us", path: "/contact" },
  { id: "chill", label: "Chill Series Landing", path: "/chill" },
  { id: "lift", label: "Lift Series Landing", path: "/lift" },
  { id: "balance", label: "Balance Series Landing", path: "/balance" },
  { id: "sleep", label: "Sleep Series Landing", path: "/sleep" },
  { id: "vapes", label: "Vape Series Landing", path: "/vapes" },
  { id: "lab-results", label: "Lab Results", path: "/lab-results" },
  { id: "faqs", label: "FAQs Support", path: "/faqs" },
  { id: "privacy", label: "Privacy Policy", path: "/privacy" },
  { id: "terms", label: "Terms of Service", path: "/terms" },
  { id: "shipping", label: "Shipping & Returns", path: "/shipping" },
  { id: "cookies", label: "Cookie Policy", path: "/cookies" },
];

function ContentManagementContent() {
  const searchParams = useSearchParams();
  const [activePage, setActivePage] = useState("home");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const pageParam = searchParams.get("p");
    if (pageParam && PAGES.some(p => p.id === pageParam)) {
      setActivePage(pageParam);
    }
  }, [searchParams]);
  
  // Content and SEO data
  const [cmsContent, setCmsContent] = useState<any>({});
  const [seoData, setSeoData] = useState<any>({
    title: "",
    description: "",
    keywords: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    canonicalUrl: "",
    robots: "index, follow",
    structuredData: ""
  });

  const [globalSeo, setGlobalSeo] = useState<any>({
    siteName: "Sharcly",
    siteDescription: "",
    googleAnalyticsId: "",
    facebookPixelId: "",
    googleSiteVerification: "",
    robotsTxt: "User-agent: *\nAllow: /",
    sitemapUrl: "/sitemap.xml"
  });
  const [showKlaviyoKey, setShowKlaviyoKey] = useState(false);

  const fetchData = async (page: string) => {
    setIsLoading(true);
    try {
      const [cmsRes, seoRes, globalRes] = await Promise.all([
        apiClient.get(`/cms/${page}`).catch(() => ({ data: { content: {} } })),
        apiClient.get(`/seo/page/${page}`).catch(() => ({ data: { seo: null } })),
        apiClient.get(`/seo/global/settings`).catch(() => ({ data: { settings: {} } }))
      ]);

      setCmsContent(cmsRes.data.content || {});
      setGlobalSeo(globalRes.data.settings || globalSeo);
      
      const seo = seoRes.data.seo;
      if (seo) {
        setSeoData({
          title: seo.title || "",
          description: seo.description || "",
          keywords: seo.keywords || "",
          ogTitle: seo.ogTitle || "",
          ogDescription: seo.ogDescription || "",
          ogImage: seo.ogImage || "",
          canonicalUrl: seo.canonicalUrl || "",
          robots: seo.robots || "index, follow",
          structuredData: seo.structuredData || ""
        });
      } else {
        setSeoData({
          title: "",
          description: "",
          keywords: "",
          ogTitle: "",
          ogDescription: "",
          ogImage: "",
          canonicalUrl: "",
          robots: "index, follow",
          structuredData: ""
        });
      }
    } catch (error) {
      toast.error("Failed to load page data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activePage);
  }, [activePage]);

  const handleCmsUpdate = (section: string, key: string, value: string) => {
    setCmsContent((prev: any) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [key]: value
      }
    }));
  };

  const handleSeoUpdate = (key: string, value: string) => {
    setSeoData((prev: any) => ({
      ...prev,
      [key]: value
    }));
  };

  const saveAll = async () => {
    setIsSaving(true);
    try {
      // Prepare CMS updates
      const cmsUpdates: any[] = [];
      Object.keys(cmsContent).forEach((section) => {
        Object.keys(cmsContent[section]).forEach((key) => {
          cmsUpdates.push({
            section,
            key,
            value: String(cmsContent[section][key]),
            type: "text"
          });
        });
      });

      // Save CMS, SEO, and Global
      await Promise.all([
        apiClient.patch("/cms", { page: activePage, updates: cmsUpdates }),
        apiClient.put("/seo", { ...seoData, pageSlug: activePage }),
        apiClient.put("/seo/global/settings", globalSeo)
      ]);

      toast.success(`${PAGES.find(p => p.id === activePage)?.label} and Global settings synced!`);
    } catch (error) {
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-40">
      {/* Sleek Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-black/5 pb-8">
        <div className="space-y-1.5">
           <h1 className="text-3xl font-bold tracking-tight text-[#062D1B]">Experience Manager</h1>
           <p className="text-xs font-medium text-black/40">Architect site narrative and global technical authority.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex flex-col gap-1.5 w-full sm:w-64">
            <Select value={activePage} onValueChange={setActivePage}>
              <SelectTrigger className="h-10 rounded-lg bg-black/[0.03] border-black/5 font-bold text-black px-4">
                <SelectValue placeholder="Select Page" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-black/5 shadow-xl">
                {PAGES.map((page) => (
                  <SelectItem key={page.id} value={page.id} className="font-bold py-2 px-4 focus:bg-[#062D1B]/5 cursor-pointer text-xs">
                    {page.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            disabled={isSaving || isLoading} 
            onClick={saveAll}
            className="h-10 px-8 font-bold uppercase tracking-wider text-[10px] rounded-lg bg-[#062D1B] text-white hover:bg-[#084228] transition-all shadow-sm w-full sm:w-auto"
          >
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Sync System
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <div className="flex items-center justify-between mb-8 bg-black/[0.02] p-1 rounded-xl border border-black/5">
            <TabsList className="h-12 bg-transparent rounded-lg p-0 gap-1 w-full lg:w-auto">
              <TabsTrigger value="content" className="flex-1 lg:flex-none rounded-lg h-10 px-8 font-bold uppercase text-[9px] tracking-widest data-[state=active]:bg-white data-[state=active]:text-[#062D1B] data-[state=active]:shadow-sm transition-all text-black/40">
                Experience
              </TabsTrigger>
              <TabsTrigger value="seo" className="flex-1 lg:flex-none rounded-lg h-10 px-8 font-bold uppercase text-[9px] tracking-widest data-[state=active]:bg-white data-[state=active]:text-[#062D1B] data-[state=active]:shadow-sm transition-all text-black/40">
                Visibility
              </TabsTrigger>
              <TabsTrigger value="global" className="flex-1 lg:flex-none rounded-lg h-10 px-8 font-bold uppercase text-[9px] tracking-widest data-[state=active]:bg-white data-[state=active]:text-[#062D1B] data-[state=active]:shadow-sm transition-all text-black/40">
                Global Admin
              </TabsTrigger>
            </TabsList>
        </div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-60 bg-white border border-black/5 rounded-2xl shadow-sm"
            >
              <Loader2 className="h-10 w-10 text-[#062D1B]/20 animate-spin" />
              <p className="text-[#062D1B]/20 font-bold uppercase tracking-[0.3em] text-[9px] mt-6">Initializing Synthesis...</p>
            </motion.div>
          ) : (
            <div className="space-y-12">
              <TabsContent value="content" className="space-y-10 focus-visible:outline-none">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* Hero Settings */}
                  <Card className="rounded-2xl border-black/5 shadow-sharcly bg-white overflow-hidden">
                    <CardHeader className="bg-black/[0.01] border-b border-black/5 p-8">
                       <div className="size-12 rounded-xl bg-[#F0FDF4] flex items-center justify-center mb-4 text-[#062D1B]">
                          <ImageIcon className="h-5 w-5" />
                       </div>
                       <CardTitle className="text-lg font-bold text-black">Hero Architecture</CardTitle>
                       <CardDescription className="text-black/40 text-xs font-medium">Coordinate the central visual for {activePage}.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                       <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-widest text-black/30">Executive Heading</Label>
                          <Input 
                            value={cmsContent.hero?.title || ""} 
                            onChange={(e) => handleCmsUpdate("hero", "title", e.target.value)}
                            className="h-12 rounded-lg bg-black/[0.03] border-none font-bold text-lg px-6 focus:ring-2 focus:ring-[#062D1B]/10 transition-all text-black"
                          />
                       </div>
                       <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-widest text-black/30">Contextual Narrative</Label>
                          <Textarea 
                            value={cmsContent.hero?.tagline || ""} 
                            onChange={(e) => handleCmsUpdate("hero", "tagline", e.target.value)}
                            className="min-h-[140px] rounded-lg bg-black/[0.03] border-none font-medium text-sm px-6 py-4 focus:ring-2 focus:ring-[#062D1B]/10 transition-all text-black/60 leading-relaxed"
                          />
                       </div>
                       <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-widest text-black/30">Asset Pointer (URL)</Label>
                          <Input 
                            value={cmsContent.hero?.bg_image || ""} 
                            onChange={(e) => handleCmsUpdate("hero", "bg_image", e.target.value)}
                            className="h-10 rounded-lg bg-black/[0.03] border-none font-medium px-4 italic text-black/40"
                          />
                       </div>
                    </CardContent>
                  </Card>

                  {/* Page Specific Logic */}
                  {activePage === "home" ? (
                    <Card className="rounded-2xl border-black/5 shadow-sharcly bg-white overflow-hidden">
                      <CardHeader className="bg-black/[0.01] border-b border-black/5 p-8">
                         <div className="size-12 rounded-xl bg-[#F0FDF4] flex items-center justify-center mb-4 text-[#062D1B]">
                            <ListRestart className="h-5 w-5" />
                         </div>
                         <CardTitle className="text-lg font-bold text-black">Rhythm & Logic</CardTitle>
                         <CardDescription className="text-black/40 text-xs font-medium">The narrative flow of your digital flagship.</CardDescription>
                      </CardHeader>
                      <CardContent className="p-8 space-y-6">
                         <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-black/30">Philosophy Header</Label>
                            <Input 
                              value={cmsContent.philosophy?.title || ""} 
                              onChange={(e) => handleCmsUpdate("philosophy", "title", e.target.value)}
                              className="h-10 rounded-lg bg-black/[0.03] border-none font-bold text-sm px-4 focus:ring-2 focus:ring-[#062D1B]/10 transition-all text-black"
                            />
                         </div>
                         <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-black/30">Philosophy Copy</Label>
                            <Textarea 
                              value={cmsContent.philosophy?.description || ""} 
                              onChange={(e) => handleCmsUpdate("philosophy", "description", e.target.value)}
                              className="min-h-[120px] rounded-lg bg-black/[0.03] border-none font-medium text-xs px-4 py-3 focus:ring-2 focus:ring-[#062D1B]/10 transition-all text-black/60"
                            />
                         </div>
                         <div className="bg-[#062D1B] p-6 rounded-xl space-y-4">
                            <Label className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">B2B Strategy Header</Label>
                            <Input 
                              value={cmsContent.partners?.cta_title || ""} 
                              onChange={(e) => handleCmsUpdate("partners", "cta_title", e.target.value)}
                              className="bg-white/10 border-white/10 h-10 rounded-lg text-white font-bold px-4 text-xs focus:bg-white/20 border-none"
                            />
                         </div>
                      </CardContent>
                    </Card>
                  ) : activePage === "about" ? (
                    <Card className="rounded-2xl border-black/5 shadow-sharcly bg-white overflow-hidden">
                      <CardHeader className="bg-black/[0.01] border-b border-black/5 p-8">
                         <CardTitle className="text-lg font-bold text-black">Mission & Values</CardTitle>
                      </CardHeader>
                      <CardContent className="p-8 space-y-6">
                         <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-black/30">Mission Title</Label>
                            <Input 
                              value={cmsContent.mission?.title || ""} 
                              onChange={(e) => handleCmsUpdate("mission", "title", e.target.value)}
                              className="h-10 bg-black/[0.03] border-none rounded-lg font-bold px-4 text-sm"
                            />
                         </div>
                         <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-black/30">Mission Description</Label>
                            <Textarea 
                              value={cmsContent.mission?.description || ""} 
                              onChange={(e) => handleCmsUpdate("mission", "description", e.target.value)}
                              className="min-h-[100px] bg-black/[0.03] border-none rounded-lg px-4 py-3 text-xs"
                            />
                         </div>
                      </CardContent>
                    </Card>
                  ) : activePage === "shipping" ? (
                    <Card className="rounded-2xl border-black/5 shadow-sharcly bg-white overflow-hidden lg:col-span-2">
                      <CardHeader className="bg-black/[0.01] border-b border-black/5 p-8">
                         <CardTitle className="text-lg font-bold text-black">Logistics & Policy Blocks</CardTitle>
                         <CardDescription className="text-black/40 text-xs font-medium">Manage the detailed information blocks on the shipping page.</CardDescription>
                      </CardHeader>
                      <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                         {/* Shipping Policy */}
                         <div className="space-y-4 p-6 bg-black/[0.01] rounded-xl border border-black/5">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#062D1B]">Block 01: Shipping Policy</p>
                            <div className="space-y-2">
                               <Label className="text-[9px] font-bold uppercase tracking-widest text-black/20">Section Title</Label>
                               <Input 
                                 value={cmsContent.shipping?.title || ""} 
                                 onChange={(e) => handleCmsUpdate("shipping", "title", e.target.value)}
                                 className="h-10 bg-white border-black/5 rounded-lg font-bold text-xs"
                               />
                            </div>
                            <div className="space-y-2">
                               <Label className="text-[9px] font-bold uppercase tracking-widest text-black/20">Policy Content</Label>
                               <Textarea 
                                 value={cmsContent.shipping?.description || ""} 
                                 onChange={(e) => handleCmsUpdate("shipping", "description", e.target.value)}
                                 className="min-h-[80px] bg-white border-black/5 rounded-lg text-xs"
                               />
                            </div>
                         </div>

                         {/* Returns & Refunds */}
                         <div className="space-y-4 p-6 bg-black/[0.01] rounded-xl border border-black/5">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#062D1B]">Block 02: Returns & Refunds</p>
                            <div className="space-y-2">
                               <Label className="text-[9px] font-bold uppercase tracking-widest text-black/20">Section Title</Label>
                               <Input 
                                 value={cmsContent.returns?.title || ""} 
                                 onChange={(e) => handleCmsUpdate("returns", "title", e.target.value)}
                                 className="h-10 bg-white border-black/5 rounded-lg font-bold text-xs"
                               />
                            </div>
                            <div className="space-y-2">
                               <Label className="text-[9px] font-bold uppercase tracking-widest text-black/20">Return Guidelines</Label>
                               <Textarea 
                                 value={cmsContent.returns?.description || ""} 
                                 onChange={(e) => handleCmsUpdate("returns", "description", e.target.value)}
                                 className="min-h-[80px] bg-white border-black/5 rounded-lg text-xs"
                               />
                            </div>
                         </div>
                      </CardContent>
                    </Card>
                  ) : activePage === "privacy" || activePage === "terms" || activePage === "cookies" ? (
                    <Card className="rounded-2xl border-black/5 shadow-sharcly bg-white overflow-hidden lg:col-span-2">
                      <CardHeader className="bg-black/[0.01] border-b border-black/5 p-8">
                         <div className="size-12 rounded-xl bg-[#F0FDF4] flex items-center justify-center mb-4 text-[#062D1B]">
                            <ShieldCheck className="h-5 w-5" />
                         </div>
                         <CardTitle className="text-lg font-bold text-black">
                           {activePage === "privacy" ? "Privacy Protocol" : activePage === "terms" ? "Legal Framework" : "Cookie Consent"}
                         </CardTitle>
                         <CardDescription className="text-black/40 text-xs font-medium">
                           Architect the legal narrative for your digital authority.
                         </CardDescription>
                      </CardHeader>
                      <CardContent className="p-8">
                         <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-black/30">Main Policy Content</Label>
                            <Textarea 
                              value={cmsContent.legal?.body || ""} 
                              onChange={(e) => handleCmsUpdate("legal", "body", e.target.value)}
                              placeholder="Paste your legal text here..."
                              className="min-h-[500px] rounded-lg bg-black/[0.03] border-none font-medium text-xs px-6 py-6 focus:ring-2 focus:ring-[#062D1B]/10 transition-all text-black/70 leading-relaxed"
                            />
                         </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-20 bg-white/40 border border-dashed border-black/10 rounded-2xl text-center">
                       <Terminal className="size-20 text-[#062D1B]/5 mb-8" />
                       <h3 className="text-xl font-bold text-black/20">Schema Module <br />Deactivated</h3>
                       <p className="text-[10px] font-bold uppercase tracking-widest text-black/10 mt-6 leading-loose px-10">Advanced interface configuration <br/>pending for {activePage}</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="seo" className="space-y-12 focus-visible:outline-none">
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-10">
                        <Card className="rounded-2xl border-black/5 shadow-sharcly bg-white overflow-hidden">
                           <CardHeader className="bg-black/[0.01] border-b border-black/5 p-8">
                              <div className="flex items-center justify-between">
                                 <CardTitle className="text-sm font-bold text-black">Search Blueprint</CardTitle>
                                 <Badge className="bg-emerald-50 text-emerald-700 border-none font-bold text-[8px] px-2 py-0.5 uppercase tracking-widest">Active Indexing</Badge>
                              </div>
                           </CardHeader>
                           <CardContent className="p-8 space-y-6">
                              <div className="space-y-2">
                                 <Label className="text-[10px] font-bold uppercase tracking-widest text-black/30">Meta Title Protocol</Label>
                                 <div className="relative">
                                    <Input 
                                      value={seoData.title} 
                                      onChange={(e) => handleSeoUpdate("title", e.target.value)}
                                      className="h-10 rounded-lg bg-black/[0.03] border-none font-bold text-sm px-4 pr-12 focus:ring-2 focus:ring-[#062D1B]/10 text-black"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-black/20 font-mono text-[9px]">{seoData.title.length}/60</div>
                                 </div>
                              </div>
                              <div className="space-y-2">
                                 <Label className="text-[10px] font-bold uppercase tracking-widest text-black/30">Meta Narrative</Label>
                                 <div className="relative">
                                   <Textarea 
                                     value={seoData.description} 
                                     onChange={(e) => handleSeoUpdate("description", e.target.value)}
                                     className="min-h-[100px] rounded-lg bg-black/[0.03] border-none font-medium text-xs px-4 py-3 focus:ring-2 focus:ring-[#062D1B]/10 text-black/60 leading-relaxed"
                                   />
                                   <div className="absolute right-4 bottom-3 text-black/20 font-mono text-[9px]">{seoData.description.length}/160</div>
                                 </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-black/30">Robots</Label>
                                    <Select value={seoData.robots} onValueChange={(v) => handleSeoUpdate("robots", v)}>
                                       <SelectTrigger className="h-10 rounded-lg bg-black/[0.03] border-none font-bold text-black px-4 text-xs">
                                          <SelectValue />
                                       </SelectTrigger>
                                       <SelectContent className="rounded-lg border-black/5">
                                          <SelectItem value="index, follow" className="text-xs">Index, Follow</SelectItem>
                                          <SelectItem value="noindex, follow" className="text-xs">No Index, Follow</SelectItem>
                                       </SelectContent>
                                    </Select>
                                 </div>
                                 <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-black/30">Canonical</Label>
                                    <Input 
                                       value={seoData.canonicalUrl} 
                                       onChange={(e) => handleSeoUpdate("canonicalUrl", e.target.value)}
                                       className="h-10 rounded-lg bg-black/[0.03] border-none px-4 text-xs text-black font-medium"
                                       placeholder="https://sharcly.com/..."
                                    />
                                 </div>
                              </div>
                           </CardContent>
                        </Card>

                        <Card className="rounded-2xl border-black/5 shadow-sharcly bg-white overflow-hidden">
                           <CardHeader className="bg-[#062D1B] p-8 text-white">
                              <CardTitle className="text-sm font-bold tracking-tight">OpenGraph Logic</CardTitle>
                              <CardDescription className="text-white/40 text-[11px] font-medium">Social visibility overrides for {activePage}.</CardDescription>
                           </CardHeader>
                           <CardContent className="p-8 space-y-6">
                              <div className="space-y-2">
                                 <Label className="text-[10px] font-bold uppercase tracking-widest text-black/30">Social Title</Label>
                                 <Input 
                                   value={seoData.ogTitle} 
                                   onChange={(e) => handleSeoUpdate("ogTitle", e.target.value)}
                                   className="h-10 rounded-lg bg-black/[0.03] border-none font-bold text-sm px-4"
                                 />
                              </div>
                              <div className="space-y-2">
                                 <Label className="text-[10px] font-bold uppercase tracking-widest text-black/30">OG Image URL</Label>
                                 <Input 
                                   value={seoData.ogImage} 
                                   onChange={(e) => handleSeoUpdate("ogImage", e.target.value)}
                                   className="h-10 rounded-lg bg-black/[0.03] border-none font-medium px-4 text-xs italic text-black/40"
                                 />
                              </div>
                              <div className="space-y-2 pt-4 border-t border-black/5">
                                 <Label className="text-[10px] font-bold uppercase tracking-widest text-black/30">Structured Logic (JSON-LD)</Label>
                                 <div className="relative">
                                    <Textarea 
                                      value={seoData.structuredData} 
                                      onChange={(e) => handleSeoUpdate("structuredData", e.target.value)}
                                      className="min-h-[180px] rounded-lg bg-black/[0.03] border-none font-mono text-[10px] p-4 text-black/80 focus:bg-white"
                                      placeholder='{"@context": "https://schema.org"}'
                                    />
                                 </div>
                              </div>
                           </CardContent>
                        </Card>
                    </div>

                    {/* Live Search Preview Sticky */}
                    <div className="space-y-10">
                       <div className="sticky top-10 space-y-10">
                           <Card className="rounded-2xl border-black/5 shadow-xl bg-[#062D1B] text-white overflow-hidden border border-white/5">
                              <CardHeader className="bg-white/5 p-8 flex flex-row items-center gap-3">
                                 <Globe className="h-5 w-5 text-[#F0FDF4]" />
                                 <CardTitle className="text-lg font-bold">Search Preview</CardTitle>
                              </CardHeader>
                              <CardContent className="p-8 space-y-8">
                                 <div className="space-y-3">
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-white/40 italic">Mobile Simulator</p>
                                    <div className="bg-white p-6 rounded-xl shadow-lg">
                                       <p className="text-[9px] text-black/40 mb-1 truncate">sharcly.com {activePage !== 'home' ? `› ${activePage}` : ''}</p>
                                       <h3 className="text-[#1a0dab] text-lg font-medium mb-1 leading-tight line-clamp-2 hover:underline cursor-pointer">{seoData.title || "Sharcly | Wellness"}</h3>
                                       <p className="text-[#4d5156] text-[11px] leading-relaxed line-clamp-3 italic opacity-70">
                                          {seoData.description || "Sharcly is your premium destination for high-quality wellness products."}
                                       </p>
                                    </div>
                                 </div>
                                 <div className="space-y-3 pt-6 border-t border-white/10">
                                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-lg">
                                       <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">Technical Health</span>
                                       <span className="text-[10px] font-bold text-emerald-400">OPTIMAL</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-lg">
                                       <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">Graph Coverage</span>
                                       <span className="text-[10px] font-bold text-amber-400">92%</span>
                                    </div>
                                 </div>
                              </CardContent>
                           </Card>
                       </div>
                    </div>
                 </div>
              </TabsContent>

              <TabsContent value="global" className="space-y-10 focus-visible:outline-none">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <Card className="rounded-2xl border-black/5 shadow-sharcly bg-white overflow-hidden">
                       <CardHeader className="bg-black/[0.01] p-8 border-b border-black/5">
                          <Settings2 className="h-6 w-6 text-[#062D1B] mb-4" />
                          <CardTitle className="text-lg font-bold text-black leading-none">Global Technical</CardTitle>
                          <CardDescription className="text-black/40 text-xs font-medium">Coordinate site-wide analytics and crawling authority.</CardDescription>
                       </CardHeader>
                       <CardContent className="p-8 space-y-8">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-black/30">Site Name</Label>
                                <Input 
                                  value={globalSeo.siteName} 
                                  onChange={(e) => setGlobalSeo({...globalSeo, siteName: e.target.value})}
                                  className="h-10 rounded-lg bg-black/[0.03] border-none font-bold text-sm px-4"
                                />
                             </div>
                             <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-black/30">Sitemap URL</Label>
                                <Input 
                                  value={globalSeo.sitemapUrl} 
                                  onChange={(e) => setGlobalSeo({...globalSeo, sitemapUrl: e.target.value})}
                                  className="h-10 rounded-lg bg-black/[0.03] border-none font-medium px-4 text-xs"
                                />
                             </div>
                          </div>
                          <div className="space-y-2">
                             <Label className="text-[10px] font-bold uppercase tracking-widest text-black/30">Robots.txt</Label>
                             <Textarea 
                               value={globalSeo.robotsTxt} 
                               onChange={(e) => setGlobalSeo({...globalSeo, robotsTxt: e.target.value})}
                               className="min-h-[160px] rounded-lg bg-black/[0.03] border-none font-mono text-xs p-6 text-black/70"
                             />
                          </div>
                       </CardContent>
                    </Card>

                    <Card className="rounded-2xl border-black/5 shadow-sharcly bg-white overflow-hidden">
                       <CardHeader className="bg-[#062D1B] p-8 text-white">
                          <Activity className="h-6 w-6 mb-4" />
                          <CardTitle className="text-lg font-bold leading-none">Audit & Analytics</CardTitle>
                          <CardDescription className="text-white/40 text-xs font-medium">Injection points for tracking pixels and verification codes.</CardDescription>
                       </CardHeader>
                       <CardContent className="p-8 space-y-8">
                          <div className="space-y-2">
                             <Label className="text-[10px] font-bold uppercase tracking-widest text-black/30">Google Analytics 4 ID</Label>
                             <Input 
                               value={globalSeo.googleAnalyticsId} 
                               onChange={(e) => setGlobalSeo({...globalSeo, googleAnalyticsId: e.target.value})}
                               className="h-10 rounded-lg bg-black/[0.03] border-none font-bold text-sm px-4"
                               placeholder="G-XXXXXXXXXX"
                             />
                          </div>
                          <div className="space-y-2">
                             <Label className="text-[10px] font-bold uppercase tracking-widest text-black/30">Facebook Pixel ID</Label>
                             <Input 
                               value={globalSeo.facebookPixelId} 
                               onChange={(e) => setGlobalSeo({...globalSeo, facebookPixelId: e.target.value})}
                               className="h-10 rounded-lg bg-black/[0.03] border-none font-bold text-sm px-4"
                             />
                          </div>
                          <div className="space-y-2">
                             <Label className="text-[10px] font-bold uppercase tracking-widest text-black/30">Site Verification</Label>
                             <Input 
                               value={globalSeo.googleSiteVerification} 
                               onChange={(e) => setGlobalSeo({...globalSeo, googleSiteVerification: e.target.value})}
                               className="h-10 rounded-lg bg-black/[0.03] border-none px-4 text-xs italic"
                             />
                          </div>

                          <div className="pt-8 border-t border-black/5 space-y-6">
                             <p className="text-xs font-bold uppercase tracking-widest text-[#062D1B]">Klaviyo Marketing Engine</p>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                   <Label className="text-[10px] font-bold uppercase tracking-widest text-black/30">Public API Key</Label>
                                   <Input 
                                     value={globalSeo.klaviyoPublicKey} 
                                     onChange={(e) => setGlobalSeo({...globalSeo, klaviyoPublicKey: e.target.value})}
                                     className="h-10 rounded-lg bg-black/[0.03] border-none px-4 font-bold text-xs"
                                   />
                                </div>
                                <div className="space-y-2">
                                   <Label className="text-[10px] font-bold uppercase tracking-widest text-black/30">Private API Key</Label>
                                   <div className="relative">
                                     <Input 
                                       type={showKlaviyoKey ? "text" : "password"}
                                       value={globalSeo.klaviyoPrivateKey} 
                                       onChange={(e) => setGlobalSeo({...globalSeo, klaviyoPrivateKey: e.target.value})}
                                       className="h-10 rounded-lg bg-black/[0.03] border-none px-4 pr-10 font-bold text-xs"
                                     />
                                     <button
                                       type="button"
                                       onClick={() => setShowKlaviyoKey(!showKlaviyoKey)}
                                       className="absolute right-3 top-1/2 -translate-y-1/2 text-black/20 hover:text-black transition-colors"
                                     >
                                       {showKlaviyoKey ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
                                     </button>
                                   </div>
                                </div>
                             </div>
                          </div>
                       </CardContent>
                    </Card>
                 </div>
              </TabsContent>
            </div>
          )}
        </AnimatePresence>
      </Tabs>
    </div>
  );
}

import { Suspense } from "react";

export default function ContentManagementPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-60">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-[10px] font-black uppercase tracking-widest text-primary/20">Loading Experience Manager...</p>
      </div>
    }>
      <ContentManagementContent />
    </Suspense>
  );
}

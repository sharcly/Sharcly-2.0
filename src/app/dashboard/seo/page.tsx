"use client";

import { useEffect, useState } from "react";
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
  Globe,
  Search,
  Zap,
  Layout,
  BarChart3,
  ShieldCheck,
  Settings2,
  Activity,
  ChevronRight,
  Database,
  ArrowUpRight,
  Monitor,
  LayoutGrid
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { apiClient } from "@/lib/api-client";
import { EditSeoDrawer } from "@/components/dashboard/seo/edit-seo-drawer";
import { toast } from "sonner";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function SeoManagerPage() {
  const [loading, setLoading] = useState(true);
  const [seoEntries, setSeoEntries] = useState<any[]>([]);
  const [globalSettings, setGlobalSettings] = useState<any>({
    siteName: "",
    siteDescription: "",
    googleAnalyticsId: "",
    facebookPixelId: "",
    googleSiteVerification: "",
    klaviyoPublicKey: "",
    robotsTxt: "",
    sitemapUrl: "/sitemap.xml"
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedSeo, setSelectedSeo] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSavingGlobal, setIsSavingGlobal] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [seoRes, globalRes] = await Promise.all([
        apiClient.get("/seo"),
        apiClient.get("/seo/global/settings")
      ]);
      setSeoEntries(seoRes.data.seoEntries || []);
      setGlobalSettings(globalRes.data.settings || {
        ...globalSettings,
        siteName: "Sharcly",
        sitemapUrl: "/sitemap.xml"
      });
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Could not load SEO data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveGlobal = async () => {
    setIsSavingGlobal(true);
    try {
      await apiClient.put("/seo/global/settings", globalSettings);
      toast.success("Global SEO Architecture Synchronized");
    } catch (error) {
      console.error("Global save failed:", error);
      toast.error("Failed to save global settings");
    } finally {
      setIsSavingGlobal(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this SEO entry?")) return;
    try {
      await apiClient.delete(`/seo/${id}`);
      toast.success("SEO Entry Purged");
      fetchData();
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete entry");
    }
  };

  const handleEdit = (seo: any) => {
    setSelectedSeo(seo);
    setIsDrawerOpen(true);
  };

  const handleCreate = () => {
    setSelectedSeo(null);
    setIsDrawerOpen(true);
  };

  const getStatusBadge = (seo: any) => {
    const hasTitle = !!seo.title;
    const hasDesc = !!seo.description;
    
    if (hasTitle && hasDesc) {
      return <Badge variant="outline" className="rounded-lg bg-emerald-50 border-emerald-100 text-[9px] font-bold text-emerald-600 uppercase tracking-widest px-3 py-1">Optimized</Badge>;
    }
    
    return <Badge variant="outline" className="rounded-lg bg-amber-50 border-amber-100 text-[9px] font-bold text-amber-600 uppercase tracking-widest px-3 py-1">Incomplete</Badge>;
  };

  const calculateScore = (seo: any) => {
    let score = 0;
    if (seo.title) score += 30;
    if (seo.description) score += 30;
    if (seo.ogImage) score += 20;
    if (seo.ogTitle) score += 10;
    if (seo.keywords) score += 10;
    return score;
  };

  const filteredEntries = seoEntries.filter(entry => 
    entry.pageSlug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (entry.title && entry.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 font-heading">Search Intelligence</h1>
          <p className="text-sm text-neutral-500 font-medium">Coordinate site search authority and metadata.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button 
            onClick={handleCreate} 
            className="h-10 md:h-12 px-6 rounded-xl bg-[#0f2318] text-white font-bold shadow-lg gap-2 flex-1 sm:flex-none active:scale-95 transition-all"
          >
            <Plus className="h-5 w-5" /> Architect Meta
          </Button>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-4">
         <Card className="rounded-3xl border-black/5 shadow-sharcly bg-white">
            <CardHeader className="pb-2">
               <CardTitle className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Authority Health</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-3xl font-bold text-neutral-900">
                  {seoEntries.length > 0 
                    ? Math.round(seoEntries.reduce((acc, curr) => acc + calculateScore(curr), 0) / seoEntries.length) 
                    : 0}%
               </div>
               <div className="flex items-center gap-2 mt-2">
                  <div className="size-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-tight">Optimal Indexing</span>
               </div>
            </CardContent>
         </Card>
         <Card className="rounded-3xl border-black/5 shadow-sharcly bg-white">
            <CardHeader className="pb-2">
               <CardTitle className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Total Blueprints</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-3xl font-bold text-neutral-900">{seoEntries.length}</div>
               <p className="text-[10px] text-neutral-400 font-bold mt-2 uppercase tracking-tight">Active Page Slugs</p>
            </CardContent>
         </Card>
         <Card className="rounded-3xl border-black/5 shadow-sharcly bg-white">
            <CardHeader className="pb-2">
               <CardTitle className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Critical Audit</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-3xl font-bold text-rose-500">
                  {seoEntries.filter(s => calculateScore(s) < 50).length}
               </div>
               <p className="text-[10px] text-neutral-400 font-bold mt-2 uppercase tracking-tight">Low Score Slugs</p>
            </CardContent>
         </Card>
         <Card className="rounded-3xl border-black/5 shadow-sharcly bg-[#0f2318] text-white overflow-hidden">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Globe className="size-5 text-emerald-400 opacity-50" />
                  <ArrowUpRight className="size-4 text-white/40" />
                </div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">Index Endpoint</p>
                <p className="text-sm font-bold text-white truncate">sharcly.io/sitemap.xml</p>
            </CardContent>
         </Card>
      </div>

      <Tabs defaultValue="pages" className="w-full">
        <ScrollArea className="w-full">
          <TabsList className="bg-neutral-100/50 p-1.5 rounded-2xl h-auto border border-black/5 mb-10 min-w-max flex">
            <TabsTrigger value="pages" className="rounded-xl px-8 py-4 font-bold text-sm data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:text-[#0f2318] transition-all gap-2">
              <LayoutGrid className="h-4 w-4" /> Page Metadata
            </TabsTrigger>
            <TabsTrigger value="global" className="rounded-xl px-8 py-4 font-bold text-sm data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:text-[#0f2318] transition-all gap-2">
              <Monitor className="h-4 w-4" /> Global Config
            </TabsTrigger>
          </TabsList>
        </ScrollArea>

        <TabsContent value="pages" className="focus-visible:outline-none">
          <Card className="rounded-3xl border-black/5 shadow-sharcly bg-white overflow-hidden">
            <CardHeader className="p-8 border-b border-black/5 flex flex-row items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight">Meta Index</CardTitle>
                <CardDescription className="text-xs font-medium text-neutral-500">Fine-tune search visibility for all page routes.</CardDescription>
              </div>
              <div className="relative w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-300" />
                <Input 
                  placeholder="Search blueprints..." 
                  className="pl-12 h-12 rounded-2xl border-black/5 bg-neutral-50 font-medium" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="w-full">
                <Table>
                  <TableHeader className="bg-neutral-50/50">
                    <TableRow className="border-black/5 hover:bg-transparent">
                      <TableHead className="pl-8 py-5 font-black uppercase text-[10px] tracking-widest text-black/40">Blueprint Path</TableHead>
                      <TableHead className="py-5 font-black uppercase text-[10px] tracking-widest text-black/40">Meta Title</TableHead>
                      <TableHead className="py-5 font-black uppercase text-[10px] tracking-widest text-black/40">SEO Score</TableHead>
                      <TableHead className="py-5 font-black uppercase text-[10px] tracking-widest text-black/40">Status</TableHead>
                      <TableHead className="pr-8 text-right py-5 font-black uppercase text-[10px] tracking-widest text-black/40">Manage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? [1, 2, 3, 4, 5].map(i => (
                      <TableRow key={i} className="border-black/5">
                        <TableCell colSpan={5} className="p-6"><Skeleton className="h-12 w-full rounded-2xl" /></TableCell>
                      </TableRow>
                    )) : filteredEntries.map((seo) => {
                      const score = calculateScore(seo);
                      return (
                        <TableRow key={seo.id} className="border-black/5 hover:bg-neutral-50/50 transition-all group">
                          <TableCell className="pl-8 py-6">
                            <div className="flex flex-col gap-1">
                                <span className="font-bold text-neutral-900 text-base">
                                  /{seo.pageSlug === "/" || seo.pageSlug === "home" ? "" : seo.pageSlug}
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                                  {seo.pageSlug === "/" || seo.pageSlug === "home" ? "ROOT NODE" : "DYNAMIC SLUG"}
                                </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm font-medium text-neutral-500 line-clamp-1 max-w-xs">{seo.title || "Meta Title Undefined"}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                                <div className="h-1.5 w-12 rounded-full bg-neutral-100 overflow-hidden shadow-inner border border-black/5">
                                  <div 
                                    className={cn(
                                      "h-full transition-all duration-1000",
                                      score > 80 ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : score > 50 ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" : "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
                                    )} 
                                    style={{ width: `${score}%` }} 
                                  />
                                </div>
                                <span className={cn(
                                  "text-[10px] font-black",
                                  score > 80 ? "text-emerald-500" : score > 50 ? "text-amber-500" : "text-rose-500"
                                )}>
                                  {score}%
                                </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(seo)}
                          </TableCell>
                          <TableCell className="text-right pr-8">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-10 w-10 rounded-xl hover:bg-[#0f2318]/5 text-neutral-300 hover:text-[#0f2318]"
                                  onClick={() => handleEdit(seo)}
                                >
                                  <FileEdit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-10 w-10 rounded-xl hover:bg-rose-50 text-neutral-300 hover:text-rose-500"
                                  onClick={() => handleDelete(seo.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="global" className="focus-visible:outline-none">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="rounded-3xl border-black/5 shadow-sharcly bg-white overflow-hidden">
                <CardHeader className="p-8 border-b border-black/5 bg-neutral-50/50">
                   <Settings2 className="h-6 w-6 text-neutral-900 mb-4" />
                   <CardTitle className="text-2xl font-bold tracking-tight">Global Meta</CardTitle>
                   <CardDescription className="text-xs font-medium text-neutral-500">Configure system-wide search authority.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Site Authority Name</Label>
                         <Input 
                           value={globalSettings.siteName || ""} 
                           onChange={(e) => setGlobalSettings({...globalSettings, siteName: e.target.value})}
                           className="h-12 rounded-xl bg-neutral-50 border-black/5 font-bold text-neutral-900"
                         />
                      </div>
                      <div className="space-y-2">
                         <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Discovery Sitemap</Label>
                         <Input 
                           value={globalSettings.sitemapUrl || ""} 
                           onChange={(e) => setGlobalSettings({...globalSettings, sitemapUrl: e.target.value})}
                           className="h-12 rounded-xl bg-neutral-50 border-black/5 font-medium text-neutral-500 text-xs italic"
                         />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Robots.txt Directives</Label>
                      <Textarea 
                        value={globalSettings.robotsTxt || ""} 
                        onChange={(e) => setGlobalSettings({...globalSettings, robotsTxt: e.target.value})}
                        className="min-h-[180px] rounded-xl bg-neutral-50 border-black/5 font-mono text-xs p-6 text-neutral-700 focus:bg-white transition-colors resize-none"
                      />
                   </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-black/5 shadow-sharcly bg-[#0f2318] text-white overflow-hidden h-fit">
                <CardHeader className="p-8 border-b border-white/5 bg-black/20">
                   <Activity className="h-6 w-6 text-emerald-400 mb-4" />
                   <CardTitle className="text-2xl font-bold tracking-tight">Audit & Pixels</CardTitle>
                   <CardDescription className="text-white/40 text-xs font-medium">Injection points for tracking and verification.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                   <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Google Analytics 4 ID</Label>
                      <Input 
                        value={globalSettings.googleAnalyticsId || ""} 
                        onChange={(e) => setGlobalSettings({...globalSettings, googleAnalyticsId: e.target.value})}
                        className="h-12 rounded-xl bg-white/5 border-white/10 font-bold text-emerald-400"
                        placeholder="G-XXXXXXXXXX"
                      />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Facebook Pixel</Label>
                         <Input 
                           value={globalSettings.facebookPixelId || ""} 
                           onChange={(e) => setGlobalSettings({...globalSettings, facebookPixelId: e.target.value})}
                           className="h-12 rounded-xl bg-white/5 border-white/10 font-bold text-white"
                         />
                      </div>
                      <div className="space-y-2">
                         <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Console Code</Label>
                         <Input 
                           value={globalSettings.googleSiteVerification || ""} 
                           onChange={(e) => setGlobalSettings({...globalSettings, googleSiteVerification: e.target.value})}
                           className="h-12 rounded-xl bg-white/5 border-white/10 font-medium text-white/40 text-xs italic"
                         />
                      </div>
                   </div>

                   <div className="pt-8 border-t border-white/5 space-y-6">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Marketing Core</p>
                      <div className="space-y-2">
                         <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Klaviyo API Key</Label>
                         <Input 
                           value={globalSettings.klaviyoPublicKey || ""} 
                           onChange={(e) => setGlobalSettings({...globalSettings, klaviyoPublicKey: e.target.value})}
                           className="h-12 rounded-xl bg-white/5 border-white/10 font-bold text-white text-xs"
                         />
                      </div>
                   </div>

                   <div className="pt-4 flex justify-end">
                      <Button 
                        onClick={handleSaveGlobal}
                        disabled={isSavingGlobal}
                        className="w-full h-14 rounded-2xl bg-white text-[#0f2318] hover:bg-emerald-50 font-black uppercase tracking-widest text-xs shadow-2xl shadow-black/20 active:scale-95 transition-all"
                      >
                        {isSavingGlobal ? "SYNCHRONIZING..." : "SYNC GLOBAL AUTHORITY"}
                      </Button>
                   </div>
                </CardContent>
              </Card>
           </div>
        </TabsContent>
      </Tabs>

      <EditSeoDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        seo={selectedSeo}
        onSuccess={fetchData}
      />
    </div>
  );
}

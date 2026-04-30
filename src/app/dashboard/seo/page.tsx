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
  ShieldCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { apiClient } from "@/lib/api-client";
import { EditSeoDialog } from "@/components/dashboard/seo/edit-seo-dialog";
import { toast } from "sonner";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
    robotsTxt: ""
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
      setGlobalSettings(globalRes.data.settings || {});
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
      toast.success("Global SEO settings saved");
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
      toast.success("SEO entry deleted");
      fetchData();
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete entry");
    }
  };

  const handleEdit = (seo: any) => {
    setSelectedSeo(seo);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedSeo(null);
    setIsDialogOpen(true);
  };

  const getStatusBadge = (seo: any) => {
    const hasTitle = !!seo.title;
    const hasDesc = !!seo.description;
    const hasOg = !!seo.ogImage;
    
    if (hasTitle && hasDesc && hasOg) {
      return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 rounded-full px-3 py-1 font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5 w-fit">
        Optimized
      </Badge>;
    }
    
    return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 rounded-full px-3 py-1 font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5 w-fit">
      Needs Attention
    </Badge>;
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
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">SEO Manager</h1>
          <p className="text-muted-foreground">Manage your site's search engine visibility and metadata.</p>
        </div>
        <Button onClick={handleCreate} className="gap-2 rounded-2xl h-12 px-6 premium-gradient shadow-lg">
          <Plus className="h-4 w-4" /> Add Page Meta
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
         <Card className="glass-card">
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Global Health</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-3xl font-black text-blue-500">
                  {seoEntries.length > 0 
                    ? Math.round(seoEntries.reduce((acc, curr) => acc + calculateScore(curr), 0) / seoEntries.length) 
                    : 0}%
               </div>
               <p className="text-xs text-emerald-500 font-bold mt-1">System Wide Average</p>
            </CardContent>
         </Card>
         <Card className="glass-card">
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Total Indexed</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-3xl font-black text-purple-500">{seoEntries.length}</div>
               <p className="text-xs text-muted-foreground font-bold mt-1">Managed slugs</p>
            </CardContent>
         </Card>
         <Card className="glass-card">
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Critical Pages</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-3xl font-black text-rose-500">
                  {seoEntries.filter(s => calculateScore(s) < 50).length}
               </div>
               <p className="text-xs text-muted-foreground font-bold mt-1">Requiring immediate audit</p>
            </CardContent>
         </Card>
      </div>

      <Tabs defaultValue="pages" className="w-full">
        <TabsList className="bg-white/5 p-1 rounded-2xl mb-8">
          <TabsTrigger value="pages" className="rounded-xl px-8 py-3 font-black text-[10px] uppercase tracking-widest gap-2 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
             <Layout className="h-3 w-3" /> Page Metadata
          </TabsTrigger>
          <TabsTrigger value="global" className="rounded-xl px-8 py-3 font-black text-[10px] uppercase tracking-widest gap-2 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
             <Globe className="h-3 w-3" /> Global Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Card className="glass-card overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                  <CardTitle className="text-xl font-black">Page Metadata</CardTitle>
              </div>
              <div className="relative w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search pages..." 
                    className="pl-10 h-11 rounded-xl bg-white/5 border-white/10" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-white/5 border-b border-white/5">
                  <TableRow className="hover:bg-transparent border-white/5">
                    <TableHead className="pl-6 py-4 font-black uppercase text-[10px] tracking-widest">Page & Path</TableHead>
                    <TableHead className="py-4 font-black uppercase text-[10px] tracking-widest">SEO Title</TableHead>
                    <TableHead className="py-4 font-black uppercase text-[10px] tracking-widest">SEO Score</TableHead>
                    <TableHead className="py-4 font-black uppercase text-[10px] tracking-widest">Status</TableHead>
                    <TableHead className="text-right pr-6 py-4 font-black uppercase text-[10px] tracking-widest">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    [1, 2, 3].map((i) => (
                      <TableRow key={i} className="border-white/5">
                        <TableCell className="pl-6"><Skeleton className="h-4 w-48 rounded-full" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-64 rounded-full" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-12 rounded-full" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                        <TableCell className="pr-6 text-right"><Skeleton className="h-10 w-10 ml-auto rounded-xl" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    filteredEntries.map((seo) => {
                      const score = calculateScore(seo);
                      return (
                        <TableRow key={seo.id} className="border-white/5 group hover:bg-white/5 transition-all duration-300">
                          <TableCell className="pl-6 py-6">
                            <div className="flex flex-col gap-1">
                                <span className="font-bold text-sm tracking-tight capitalize">
                                  {seo.pageSlug === "/" || seo.pageSlug === "home" ? "Home Page" : seo.pageSlug}
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-30">
                                  {seo.pageSlug === "/" || seo.pageSlug === "home" ? "/" : `/${seo.pageSlug}`}
                                </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm font-medium text-muted-foreground line-clamp-1 max-w-xs">{seo.title || "No title set"}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                                <div className={cn(
                                  "h-1.5 w-12 rounded-full overflow-hidden bg-white/5",
                                )}>
                                  <div 
                                    className={cn(
                                      "h-full rounded-full transition-all duration-1000",
                                      score > 80 ? "bg-emerald-500" : score > 50 ? "bg-amber-500" : "bg-rose-500"
                                    )} 
                                    style={{ width: `${score}%` }} 
                                  />
                                </div>
                                <span className={cn(
                                  "text-xs font-black",
                                  score > 80 ? "text-emerald-500" : score > 50 ? "text-amber-500" : "text-rose-500"
                                )}>
                                  {score}
                                </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(seo)}
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <div className="flex justify-end gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-10 w-10 rounded-xl hover:bg-white/10 group"
                                  onClick={() => handleEdit(seo)}
                                >
                                  <FileEdit className="h-4 w-4 group-hover:text-primary transition-colors" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-10 w-10 rounded-xl hover:bg-rose-500/10 group"
                                  onClick={() => handleDelete(seo.id)}
                                >
                                  <Trash2 className="h-4 w-4 group-hover:text-rose-500 transition-colors" />
                                </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                  {!loading && filteredEntries.length === 0 && (
                    <TableRow>
                       <TableCell colSpan={5} className="text-center py-20 opacity-30 font-black uppercase tracking-widest text-xs">
                          No SEO metadata found
                       </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="global" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
           <Card className="glass-card">
              <CardHeader className="border-b border-white/5 pb-8">
                 <CardTitle className="text-xl font-bold tracking-tight">Site-Wide SEO Configuration</CardTitle>
                 <p className="text-sm text-muted-foreground">Manage global identifiers, tracking pixels, and search console verification.</p>
              </CardHeader>
              <CardContent className="pt-8 space-y-12">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                       <h3 className="text-xs font-black uppercase tracking-widest text-primary/40 flex items-center gap-2">
                          <BarChart3 className="h-3 w-3" /> Basic Information
                       </h3>
                       <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Site Name</Label>
                            <Input 
                              value={globalSettings.siteName}
                              onChange={(e) => setGlobalSettings({...globalSettings, siteName: e.target.value})}
                              className="h-12 bg-white/5 border-white/10 rounded-xl"
                            />
                          </div>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <h3 className="text-xs font-black uppercase tracking-widest text-blue-500/40 flex items-center gap-2">
                          <Zap className="h-3 w-3" /> Tracking & Pixels
                       </h3>
                       <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Google Analytics (G-XXXXX)</Label>
                            <Input 
                              value={globalSettings.googleAnalyticsId}
                              onChange={(e) => setGlobalSettings({...globalSettings, googleAnalyticsId: e.target.value})}
                              className="h-12 bg-white/5 border-white/10 rounded-xl"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Facebook Pixel ID</Label>
                            <Input 
                              value={globalSettings.facebookPixelId}
                              onChange={(e) => setGlobalSettings({...globalSettings, facebookPixelId: e.target.value})}
                              className="h-12 bg-white/5 border-white/10 rounded-xl"
                            />
                          </div>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <h3 className="text-xs font-black uppercase tracking-widest text-emerald-500/40 flex items-center gap-2">
                          <Search className="h-3 w-3" /> Console Verification
                       </h3>
                       <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Google Search Console</Label>
                            <Input 
                              value={globalSettings.googleSiteVerification}
                              onChange={(e) => setGlobalSettings({...globalSettings, googleSiteVerification: e.target.value})}
                              className="h-12 bg-white/5 border-white/10 rounded-xl"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Klaviyo Public API Key</Label>
                            <Input 
                              value={globalSettings.klaviyoPublicKey}
                              onChange={(e) => setGlobalSettings({...globalSettings, klaviyoPublicKey: e.target.value})}
                              className="h-12 bg-white/5 border-white/10 rounded-xl"
                            />
                          </div>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <h3 className="text-xs font-black uppercase tracking-widest text-amber-500/40 flex items-center gap-2">
                          <ShieldCheck className="h-3 w-3" /> Search Directives
                       </h3>
                       <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Robots.txt Content</Label>
                          <Textarea 
                            value={globalSettings.robotsTxt}
                            onChange={(e) => setGlobalSettings({...globalSettings, robotsTxt: e.target.value})}
                            className="min-h-[100px] bg-white/5 border-white/10 rounded-xl resize-none"
                            placeholder="User-agent: * Allow: /"
                          />
                       </div>
                    </div>
                 </div>

                 <div className="pt-8 border-t border-white/5 flex justify-end">
                    <Button 
                      onClick={handleSaveGlobal}
                      disabled={isSavingGlobal}
                      className="h-14 px-12 rounded-2xl premium-gradient font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/20"
                    >
                      {isSavingGlobal ? "Syncing..." : "Update Global Settings"}
                    </Button>
                 </div>
              </CardContent>
           </Card>
        </TabsContent>
      </Tabs>

      <EditSeoDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        seo={selectedSeo}
        onSuccess={fetchData}
      />
    </div>
  );
}

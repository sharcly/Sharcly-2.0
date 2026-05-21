"use client";

import { useState, useEffect, useRef } from "react";
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
  Plus,
  Trash2,
  LayoutGrid,
  ShieldCheck,
  ChevronDown,
  Compass,
  BookOpen,
  MessageSquare,
  BadgeCheck,
  Sparkles
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { motion, AnimatePresence } from "framer-motion";
import { RichTextEditor } from "@/components/dashboard/blog/rich-text-editor";

const PAGES = [
  { id: "home", label: "Home Page", path: "/" },
  { id: "products", label: "Products Catalog", path: "/products" },
  { id: "about", label: "About Us", path: "/about" },
  { id: "wholesale", label: "Wholesale Partner", path: "/wholesale" },
  { id: "blog", label: "Blog Listing", path: "/blog" },
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

const PAGE_ICONS: Record<string, React.ReactNode> = {
  home: <Globe className="w-4 h-4 text-emerald-600" />,
  products: <LayoutGrid className="w-4 h-4 text-emerald-600" />,
  about: <Compass className="w-4 h-4 text-emerald-600" />,
  wholesale: <BadgeCheck className="w-4 h-4 text-emerald-600" />,
  blog: <BookOpen className="w-4 h-4 text-emerald-600" />,
  "lab-results": <ShieldCheck className="w-4 h-4 text-emerald-600" />,
  faqs: <MessageSquare className="w-4 h-4 text-emerald-600" />,
  
  chill: <Sparkles className="w-4 h-4 text-amber-500" />,
  lift: <Sparkles className="w-4 h-4 text-purple-500" />,
  balance: <Sparkles className="w-4 h-4 text-orange-500" />,
  sleep: <Sparkles className="w-4 h-4 text-blue-500" />,
  vapes: <Sparkles className="w-4 h-4 text-gray-700" />,
  
  privacy: <FileText className="w-4 h-4 text-gray-500" />,
  terms: <FileText className="w-4 h-4 text-gray-500" />,
  shipping: <FileText className="w-4 h-4 text-gray-500" />,
  cookies: <FileText className="w-4 h-4 text-gray-500" />,
};

const PAGE_CATEGORIES = [
  {
    id: "core",
    title: "Core Pages",
    icon: <Globe className="w-3.5 h-3.5 text-emerald-600" />,
    pages: ["home", "products", "about", "wholesale", "blog", "lab-results", "faqs"]
  },
  {
    id: "series",
    title: "Series Landings",
    icon: <Sparkles className="w-3.5 h-3.5 text-amber-500" />,
    pages: ["chill", "lift", "balance", "sleep", "vapes"]
  },
  {
    id: "legal",
    title: "Legal & Policies",
    icon: <FileText className="w-3.5 h-3.5 text-gray-500" />,
    pages: ["privacy", "terms", "shipping", "cookies"]
  }
];


const DEFAULT_HERO_JSON = JSON.stringify({
  announcement: {
    text: "21+ · Farm Bill Compliant · Free Shipping $50+"
  },
  kicker: "Premium Hemp-Derived Wellness",
  headline: {
    line1: "Balance is Where",
    highlight: "Better Living",
    line2: "Begins."
  },
  subheadline: "Clean, lab-verified hemp-derived products — crafted for people who take their wellness as seriously as their ambitions.",
  cta: {
    primary: {
      label: "Explore Products",
      link: "/products"
    },
    secondary: {
      label: "Our Story",
      link: "/about"
    }
  },
  media: {
    videoUrl: "/assets/main-hero.mp4",
    label: "Sharcly · Premium Hemp Collection"
  },
  badges: [
    {
      type: "coa",
      title: "Lab Verified",
      description: "COA available for every batch"
    },
    {
      type: "reviews",
      rating: 4.9,
      totalReviews: 2400
    }
  ],
  series: ["Chill", "Lift", "Balance", "Sleep", "Vape"],
  marquee: [
    "Better Sleep",
    "Lab Verified",
    "Plant-Based",
    "Clean Sourced",
    "Balanced Living",
    "Unwind Naturally",
    "Daily Reset",
    "Farm Bill Compliant",
    "USDA Organic",
    "COA Every Batch"
  ]
}, null, 2);

const DEFAULT_SERIES_JSON = JSON.stringify([
  {
    label: "Chill Series",
    tag: "Delta-8",
    description: "Dial it down, stay in control.",
    imageUrl: "https://i.postimg.cc/9QhwmspG/delta-8-lifestyle.jpg",
    to: "/products?series=chill",
    number: "01"
  },
  {
    label: "Lift Series",
    tag: "Delta-9",
    description: "Lock in with zero noise.",
    imageUrl: "https://i.postimg.cc/gcLxvGth/Delta-9-THC-30-MG-Lifestyle.jpg",
    to: "/products?series=lift",
    number: "02"
  },
  {
    label: "Balance Series",
    tag: "CBD",
    description: "Stay steady, all day.",
    imageUrl: "https://i.postimg.cc/FF6KRw9Z/CBD-Gummies-50-MG-Grapes-Lifestyle.jpg",
    to: "/products?series=balance",
    number: "03"
  },
  {
    label: "Entourage Series",
    tag: "Full Spectrum",
    description: "Whole plant, full effect.",
    imageUrl: "https://i.postimg.cc/jdQdX2HN/Full-Spectrum-Lifestyle.jpg",
    to: "/products?series=full-spectrum",
    number: "04"
  },
  {
    label: "Sleep Series",
    tag: "CBN · Delta-9",
    description: "Power down and drift easy.",
    imageUrl: "https://i.postimg.cc/Ls0s1Wt4/Dream-Lifestyle.jpg",
    to: "/products?series=sleep",
    number: "05"
  },
  {
    label: "Vape Series",
    tag: "Vape",
    description: "Fast hits with a clean feel.",
    imageUrl: "https://i.postimg.cc/43wfTSLb/Chill-Vape.jpg",
    to: "/products?series=vapes",
    number: "06"
  }
], null, 2);

function ContentManagementContent() {
  const searchParams = useSearchParams();
  const [activePage, setActivePage] = useState("home");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setDropdownOpen(false);
    setSearchQuery("");
  }, [activePage]);

  const activePageData = PAGES.find(p => p.id === activePage) || PAGES[0];

  useEffect(() => {
    const pageParam = searchParams.get("p");
    if (pageParam && PAGES.some(p => p.id === pageParam)) {
      setActivePage(pageParam);
    }
  }, [searchParams]);

  // Content and SEO data
  const [cmsContent, setCmsContent] = useState<any>({});

  // Helpers for JSON-based CMS content
  const getHeroJson = () => {
    try { return JSON.parse(cmsContent.hero?.json_data || DEFAULT_HERO_JSON); }
    catch { return JSON.parse(DEFAULT_HERO_JSON); }
  };

  const updateHeroJson = (updater: (data: any) => void) => {
    const data = getHeroJson();
    updater(data);
    handleCmsUpdate("hero", "json_data", JSON.stringify(data, null, 2));
  };

  const getSeriesJson = () => {
    try { return JSON.parse(cmsContent.series?.json_data || DEFAULT_SERIES_JSON); }
    catch { return JSON.parse(DEFAULT_SERIES_JSON); }
  };

  const updateSeriesJson = (updater: (data: any[]) => void) => {
    const data = getSeriesJson();
    updater(data);
    handleCmsUpdate("series", "json_data", JSON.stringify(data, null, 2));
  };
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
      const gSeo = globalRes.data.settings;
      if (gSeo && Object.keys(gSeo).length > 0) {
        setGlobalSeo({
          siteName: gSeo.siteName || "Sharcly",
          siteDescription: gSeo.siteDescription || "",
          googleAnalyticsId: gSeo.googleAnalyticsId || "",
          facebookPixelId: gSeo.facebookPixelId || "",
          klaviyoPublicKey: gSeo.klaviyoPublicKey || "",
          klaviyoPrivateKey: gSeo.klaviyoPrivateKey || "",
          googleSiteVerification: gSeo.googleSiteVerification || "",
          robotsTxt: gSeo.robotsTxt || "User-agent: *\nAllow: /",
          sitemapUrl: gSeo.sitemapUrl || "/sitemap.xml"
        });
      }

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
        apiClient.post("/cms/update", { page: activePage, updates: cmsUpdates }),
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
    <div className="space-y-10 max-w-7xl mx-auto pb-40">
      {/* Dynamic Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 bg-white/40 backdrop-blur-3xl p-10 rounded-[3rem] border border-black/5 shadow-organic selection:bg-primary/10">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="px-5 py-1.5 rounded-full bg-primary/5 text-primary border-none font-black text-[10px] uppercase tracking-[0.3em] italic">Live Digital Nexus</Badge>
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => <div key={i} className="size-6 rounded-full border-2 border-white bg-sage/40" />)}
            </div>
          </div>
          <h1 className="text-5xl font-heading font-black tracking-tighter text-primary leading-none">Experience Manager</h1>
          <p className="text-primary/40 font-medium text-lg">Architect site narrative and global technical authority.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div ref={dropdownRef} className="relative w-full sm:w-72">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center justify-between w-full h-12 px-4 bg-white/80 hover:bg-white border border-black/5 hover:border-black/10 rounded-xl shadow-sm text-left transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#062D1B]/10"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex-shrink-0 size-7 rounded-lg bg-sage/5 border border-[#062D1B]/5 flex items-center justify-center">
                  {PAGE_ICONS[activePageData.id] || <Globe className="w-4 h-4 text-emerald-600" />}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[7.5px] text-primary/30 font-black uppercase tracking-[0.2em] leading-none mb-0.5">Active Context</span>
                  <span className="text-xs font-black text-primary truncate leading-tight">{activePageData.label}</span>
                </div>
              </div>
              <motion.div
                animate={{ rotate: dropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0 ml-2"
              >
                <ChevronDown className="w-4 h-4 text-primary/40" />
              </motion.div>
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute top-14 left-0 right-0 sm:left-auto sm:w-[320px] bg-white border border-black/10 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col max-h-[400px] focus:outline-none"
                >
                  {/* Search Header */}
                  <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-black/5 bg-black/[0.01]">
                    <Search className="w-3.5 h-3.5 text-primary/30 flex-shrink-0" />
                    <input
                      type="text"
                      className="w-full bg-transparent border-none outline-none text-xs text-primary font-bold placeholder:text-primary/30"
                      placeholder="Search or filter pages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                  </div>

                  {/* Options List */}
                  <div className="overflow-y-auto p-2 max-h-[300px] scrollbar-thin">
                    {(() => {
                      const filtered = PAGES.filter(p =>
                        p.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.path.toLowerCase().includes(searchQuery.toLowerCase())
                      );

                      if (filtered.length === 0) {
                        return (
                          <div className="py-8 px-4 text-center text-primary/30 font-bold text-xs uppercase tracking-wider">
                            No matching pages
                          </div>
                        );
                      }

                      if (searchQuery.trim() !== "") {
                        return (
                          <div className="space-y-0.5">
                            {filtered.map(p => (
                              <button
                                key={p.id}
                                type="button"
                                onClick={() => setActivePage(p.id)}
                                className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-left transition-all ${
                                  activePage === p.id
                                    ? "bg-[#062D1B]/5 text-primary"
                                    : "hover:bg-[#062D1B]/5 text-primary/70 hover:text-primary"
                                }`}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="flex-shrink-0 size-7 rounded-md bg-sage/5 border border-primary/5 flex items-center justify-center">
                                    {PAGE_ICONS[p.id] || <Globe className="w-3.5 h-3.5 text-emerald-600" />}
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                    <span className="text-xs font-bold truncate">{p.label}</span>
                                    <span className="text-[9px] font-mono text-primary/40 truncate">{p.path}</span>
                                  </div>
                                </div>
                                {activePage === p.id && (
                                  <div className="size-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                                )}
                              </button>
                            ))}
                          </div>
                        );
                      }

                      return PAGE_CATEGORIES.map(category => {
                        const catPages = filtered.filter(p => category.pages.includes(p.id));
                        if (catPages.length === 0) return null;

                        return (
                          <div key={category.id} className="mb-3 last:mb-0">
                            <div className="flex items-center gap-2 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-primary/30">
                              {category.icon}
                              <span>{category.title}</span>
                            </div>
                            <div className="space-y-0.5">
                              {catPages.map(p => (
                                <button
                                  key={p.id}
                                  type="button"
                                  onClick={() => setActivePage(p.id)}
                                  className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-left transition-all ${
                                    activePage === p.id
                                      ? "bg-[#062D1B]/5 text-primary"
                                      : "hover:bg-[#062D1B]/5 text-primary/70 hover:text-primary"
                                  }`}
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="flex-shrink-0 size-7 rounded-md bg-sage/5 border border-primary/5 flex items-center justify-center">
                                      {PAGE_ICONS[p.id] || <Globe className="w-3.5 h-3.5 text-emerald-600" />}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                      <span className="text-xs font-bold truncate">{p.label}</span>
                                      <span className="text-[9px] font-mono text-primary/40 truncate">{p.path}</span>
                                    </div>
                                  </div>
                                  {activePage === p.id && (
                                    <div className="size-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>

                  {/* Dropdown Footer */}
                  <div className="px-4 py-2 border-t border-black/5 bg-black/[0.01] text-[8px] text-center font-bold uppercase tracking-wider text-primary/20">
                    Select page context to customize content
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
        <div className="flex items-center justify-between mb-12 bg-white/20 p-2 rounded-[2.5rem] border border-black/5">
          <TabsList className="h-20 bg-transparent rounded-3xl p-0 gap-2 w-full lg:w-auto">
            <TabsTrigger value="content" className="flex-1 lg:flex-none rounded-[1.5rem] h-16 px-12 font-black uppercase text-[10px] tracking-[0.3em] data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-organic transition-all">
              Experience
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex-1 lg:flex-none rounded-[1.5rem] h-16 px-12 font-black uppercase text-[10px] tracking-[0.3em] data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-organic transition-all">
              Visibility
            </TabsTrigger>
            <TabsTrigger value="global" className="flex-1 lg:flex-none rounded-[1.5rem] h-16 px-12 font-black uppercase text-[10px] tracking-[0.3em] data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-organic transition-all">
              Global Admin
            </TabsTrigger>
          </TabsList>
        </div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-60 bg-white/30 backdrop-blur-md rounded-[4rem] border border-dashed border-black/10"
            >
              <Loader2 className="h-10 w-10 text-[#062D1B]/20 animate-spin" />
              <p className="text-[#062D1B]/20 font-bold uppercase tracking-[0.3em] text-[9px] mt-6">Initializing Synthesis...</p>
            </motion.div>
          ) : (
            <div className="space-y-12">
              <TabsContent value="content" className="space-y-10 focus-visible:outline-none">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* Hero Settings */}
                  {activePage !== "home" && !["privacy", "terms", "cookies"].includes(activePage) && (
                    <Card className="rounded-[3rem] border-none shadow-organic bg-white/80 backdrop-blur-xl overflow-hidden">
                      <CardHeader className="bg-sage/5 border-b border-black/5 p-10">
                        <div className="size-16 rounded-3xl bg-white shadow-sharcly flex items-center justify-center mb-6">
                          <ImageIcon className="h-7 w-7 text-primary" />
                        </div>
                        <CardTitle className="text-2xl font-black tracking-tight text-primary">Hero Architecture</CardTitle>
                        <CardDescription className="text-primary/40 font-medium">Coordinate the central visual for {activePage}.</CardDescription>
                      </CardHeader>
                      <CardContent className="p-10 space-y-10">
                        <div className="space-y-4">
                          <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/30 ml-2">Executive Heading</Label>
                          <Input
                            value={cmsContent.hero?.title || ""}
                            onChange={(e) => handleCmsUpdate("hero", "title", e.target.value)}
                            className="h-12 rounded-lg bg-black/[0.03] border-none font-bold text-lg px-6 focus:ring-2 focus:ring-[#062D1B]/10 transition-all text-black"
                          />
                        </div>
                        <div className="space-y-4">
                          <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/30 ml-2">Contextual Narrative</Label>
                          <Textarea
                            value={cmsContent.hero?.tagline || ""}
                            onChange={(e) => handleCmsUpdate("hero", "tagline", e.target.value)}
                            className="min-h-[140px] rounded-lg bg-black/[0.03] border-none font-medium text-sm px-6 py-4 focus:ring-2 focus:ring-[#062D1B]/10 transition-all text-black/60 leading-relaxed"
                          />
                        </div>
                        <div className="space-y-4">
                          <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/30 ml-2">Asset Pointer (URL)</Label>
                          <Input
                            value={cmsContent.hero?.bg_image || ""}
                            onChange={(e) => handleCmsUpdate("hero", "bg_image", e.target.value)}
                            className="h-10 rounded-lg bg-black/[0.03] border-none font-medium px-4 italic text-black/40"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Page Specific Logic */}
                  {activePage === "home" ? (
                    <div className="space-y-10 lg:col-span-2">
                      {/* Interactive Hero Form */}
                      <Card className="rounded-[3rem] border-none shadow-organic bg-white/80 backdrop-blur-xl overflow-hidden">
                        <CardHeader className="bg-sage/5 border-b border-black/5 p-10 flex flex-row items-center justify-between">
                          <div>
                            <div className="size-16 rounded-3xl bg-white shadow-sharcly flex items-center justify-center mb-6">
                              <ImageIcon className="h-7 w-7 text-primary" />
                            </div>
                            <CardTitle className="text-2xl font-black tracking-tight text-primary">Hero Configuration</CardTitle>
                            <CardDescription className="text-primary/40 font-medium">Manage the copy, buttons, and media of your homepage hero.</CardDescription>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCmsUpdate("hero", "json_data", DEFAULT_HERO_JSON)}
                            className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40 hover:text-primary transition-colors mt-auto"
                          >
                            Reset to Defaults
                          </button>
                        </CardHeader>
                        <CardContent className="p-10 space-y-10">
                          {(() => {
                            const heroData = getHeroJson();
                            return (
                              <div className="space-y-10">
                                {/* Group 1: Announcement & Intro Kicker */}
                                <div className="space-y-6 p-8 rounded-[2rem] border border-black/5 bg-black/[0.01]">
                                  <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                                      <Sparkles className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <h4 className="text-xs font-black uppercase tracking-wider text-primary">Announcement & Intro</h4>
                                      <p className="text-[10px] text-primary/40 font-medium">Header and teaser text displayed at the absolute top of the page.</p>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                      <Label className="text-[10px] font-black uppercase tracking-wider text-primary/50 ml-1">Announcement Pill Text</Label>
                                      <Input
                                        value={heroData.announcement?.text || ""}
                                        onChange={(e) => updateHeroJson(d => { d.announcement = d.announcement || {}; d.announcement.text = e.target.value; })}
                                        className="h-11 rounded-xl border border-black/10 bg-white hover:border-black/20 focus:border-[#062D1B] focus:ring-2 focus:ring-[#062D1B]/5 px-4 text-xs font-bold text-black transition-all"
                                        placeholder="e.g. 21+ · Farm Bill Compliant"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-[10px] font-black uppercase tracking-wider text-primary/50 ml-1">Teaser Kicker</Label>
                                      <Input
                                        value={heroData.kicker || ""}
                                        onChange={(e) => updateHeroJson(d => { d.kicker = e.target.value; })}
                                        className="h-11 rounded-xl border border-black/10 bg-white hover:border-black/20 focus:border-[#062D1B] focus:ring-2 focus:ring-[#062D1B]/5 px-4 text-xs font-bold text-black transition-all"
                                        placeholder="e.g. Premium Hemp-Derived Wellness"
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Group 2: Headline & Subheadline */}
                                <div className="space-y-6 p-8 rounded-[2rem] border border-black/5 bg-black/[0.01]">
                                  <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                                      <Layout className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <h4 className="text-xs font-black uppercase tracking-wider text-primary">Main Headline Copy</h4>
                                      <p className="text-[10px] text-primary/40 font-medium">The hero statement, featuring an emphasized highlighted word.</p>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-wider text-primary/50 ml-1">Headline Segments</Label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                      <div className="space-y-1">
                                        <span className="text-[9px] font-semibold text-primary/30 ml-1">First Line</span>
                                        <Input
                                          placeholder="Line 1"
                                          value={heroData.headline?.line1 || ""}
                                          onChange={(e) => updateHeroJson(d => { d.headline = d.headline || {}; d.headline.line1 = e.target.value; })}
                                          className="h-11 rounded-xl border border-black/10 bg-white hover:border-black/20 focus:border-[#062D1B] focus:ring-2 focus:ring-[#062D1B]/5 px-4 text-xs font-bold text-black transition-all"
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <span className="text-[9px] font-bold text-[#E8C547]/80 ml-1">Highlighted Word</span>
                                        <Input
                                          placeholder="Gold Emphasized Word"
                                          value={heroData.headline?.highlight || ""}
                                          onChange={(e) => updateHeroJson(d => { d.headline = d.headline || {}; d.headline.highlight = e.target.value; })}
                                          className="h-11 rounded-xl border border-[#E8C547]/30 bg-white hover:border-[#E8C547]/50 focus:border-[#E8C547] focus:ring-2 focus:ring-[#E8C547]/5 px-4 text-xs font-bold text-[#E8C547] transition-all"
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <span className="text-[9px] font-semibold text-primary/30 ml-1">Second Line</span>
                                        <Input
                                          placeholder="Line 2"
                                          value={heroData.headline?.line2 || ""}
                                          onChange={(e) => updateHeroJson(d => { d.headline = d.headline || {}; d.headline.line2 = e.target.value; })}
                                          className="h-11 rounded-xl border border-black/10 bg-white hover:border-black/20 focus:border-[#062D1B] focus:ring-2 focus:ring-[#062D1B]/5 px-4 text-xs font-bold text-black transition-all"
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="space-y-2 pt-2 border-t border-black/5">
                                    <Label className="text-[10px] font-black uppercase tracking-wider text-primary/50 ml-1">Subheadline Narrative</Label>
                                    <Textarea
                                      value={heroData.subheadline || ""}
                                      onChange={(e) => updateHeroJson(d => { d.subheadline = e.target.value; })}
                                      className="min-h-[100px] rounded-xl border border-black/10 bg-white hover:border-black/20 focus:border-[#062D1B] focus:ring-2 focus:ring-[#062D1B]/5 px-4 py-3 text-xs font-semibold text-black transition-all leading-relaxed"
                                      placeholder="Write a descriptive subheadline..."
                                    />
                                  </div>
                                </div>

                                {/* Group 3: Primary & Secondary CTA Actions */}
                                <div className="space-y-6 p-8 rounded-[2rem] border border-black/5 bg-black/[0.01]">
                                  <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                                      <MousePointer2 className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <h4 className="text-xs font-black uppercase tracking-wider text-primary">Interactive CTAs</h4>
                                      <p className="text-[10px] text-primary/40 font-medium">Modify button labels and target links for your visitors.</p>
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-5 rounded-xl border border-black/5 bg-white space-y-4 shadow-sm">
                                      <span className="text-[10px] font-black uppercase tracking-widest text-[#062D1B] bg-[#062D1B]/5 px-2 py-0.5 rounded">Primary Button</span>
                                      <div className="space-y-3">
                                        <div className="space-y-1">
                                          <span className="text-[9px] font-semibold text-primary/30 ml-1">Button Label</span>
                                          <Input
                                            value={heroData.cta?.primary?.label || ""}
                                            onChange={(e) => updateHeroJson(d => { d.cta = d.cta || {}; d.cta.primary = d.cta.primary || {}; d.cta.primary.label = e.target.value; })}
                                            className="h-10 rounded-xl border border-black/10 bg-white hover:border-black/20 focus:border-[#062D1B] focus:ring-2 focus:ring-[#062D1B]/5 px-4 text-xs font-bold text-black transition-all"
                                          />
                                        </div>
                                        <div className="space-y-1">
                                          <span className="text-[9px] font-semibold text-primary/30 ml-1">Button Link</span>
                                          <Input
                                            value={heroData.cta?.primary?.link || ""}
                                            onChange={(e) => updateHeroJson(d => { d.cta = d.cta || {}; d.cta.primary = d.cta.primary || {}; d.cta.primary.link = e.target.value; })}
                                            className="h-10 rounded-xl border border-black/10 bg-white hover:border-black/20 focus:border-[#062D1B] focus:ring-2 focus:ring-[#062D1B]/5 px-4 text-xs font-semibold text-black/60 font-mono transition-all"
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    <div className="p-5 rounded-xl border border-black/5 bg-white space-y-4 shadow-sm">
                                      <span className="text-[10px] font-black uppercase tracking-widest text-primary/45 bg-black/[0.03] px-2 py-0.5 rounded">Secondary Button</span>
                                      <div className="space-y-3">
                                        <div className="space-y-1">
                                          <span className="text-[9px] font-semibold text-primary/30 ml-1">Button Label</span>
                                          <Input
                                            value={heroData.cta?.secondary?.label || ""}
                                            onChange={(e) => updateHeroJson(d => { d.cta = d.cta || {}; d.cta.secondary = d.cta.secondary || {}; d.cta.secondary.label = e.target.value; })}
                                            className="h-10 rounded-xl border border-black/10 bg-white hover:border-black/20 focus:border-[#062D1B] focus:ring-2 focus:ring-[#062D1B]/5 px-4 text-xs font-bold text-black transition-all"
                                          />
                                        </div>
                                        <div className="space-y-1">
                                          <span className="text-[9px] font-semibold text-primary/30 ml-1">Button Link</span>
                                          <Input
                                            value={heroData.cta?.secondary?.link || ""}
                                            onChange={(e) => updateHeroJson(d => { d.cta = d.cta || {}; d.cta.secondary = d.cta.secondary || {}; d.cta.secondary.link = e.target.value; })}
                                            className="h-10 rounded-xl border border-black/10 bg-white hover:border-black/20 focus:border-[#062D1B] focus:ring-2 focus:ring-[#062D1B]/5 px-4 text-xs font-semibold text-black/60 font-mono transition-all"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Group 4: Media URL & Configuration */}
                                <div className="space-y-6 p-8 rounded-[2rem] border border-black/5 bg-black/[0.01]">
                                  <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                                      <ImageIcon className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <h4 className="text-xs font-black uppercase tracking-wider text-primary">Hero Media Assets</h4>
                                      <p className="text-[10px] text-primary/40 font-medium">Link video background or splash images to the hero section.</p>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                      <Label className="text-[10px] font-black uppercase tracking-wider text-primary/50 ml-1">Media URL (Video or Image path)</Label>
                                      <Input
                                        value={heroData.media?.videoUrl || heroData.media?.imageUrl || ""}
                                        onChange={(e) => updateHeroJson(d => { d.media = d.media || {}; d.media.videoUrl = e.target.value; delete d.media.imageUrl; })}
                                        className="h-11 rounded-xl border border-black/10 bg-white hover:border-black/20 focus:border-[#062D1B] focus:ring-2 focus:ring-[#062D1B]/5 px-4 text-xs font-semibold text-black/60 font-mono transition-all"
                                        placeholder="/assets/main-hero.mp4"
                                      />
                                      <p className="text-[9px] text-primary/30 font-medium ml-1">Supports relative public directory files or absolute links.</p>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-[10px] font-black uppercase tracking-wider text-primary/50 ml-1">Accessibility Overlay Label</Label>
                                      <Input
                                        value={heroData.media?.label || ""}
                                        onChange={(e) => updateHeroJson(d => { d.media = d.media || {}; d.media.label = e.target.value; })}
                                        className="h-11 rounded-xl border border-black/10 bg-white hover:border-black/20 focus:border-[#062D1B] focus:ring-2 focus:ring-[#062D1B]/5 px-4 text-xs font-bold text-black transition-all"
                                        placeholder="e.g. Sharcly · Premium Hemp Collection"
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Group 5: Marquees & Tags lists */}
                                <div className="space-y-6 p-8 rounded-[2rem] border border-black/5 bg-black/[0.01]">
                                  <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                                      <ListRestart className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <h4 className="text-xs font-black uppercase tracking-wider text-primary">Lists & Tag Arrays</h4>
                                      <p className="text-[10px] text-primary/40 font-medium">Manage comma-separated text loops that scroll or filter on screen.</p>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                      <Label className="text-[10px] font-black uppercase tracking-wider text-primary/50 ml-1">Marquee Ticker (Comma Separated)</Label>
                                      <Textarea
                                        value={(heroData.marquee || []).join(", ")}
                                        onChange={(e) => updateHeroJson(d => { d.marquee = e.target.value.split(",").map(s => s.trim()).filter(Boolean); })}
                                        className="min-h-[90px] rounded-xl border border-black/10 bg-white hover:border-black/20 focus:border-[#062D1B] focus:ring-2 focus:ring-[#062D1B]/5 px-4 py-3 text-xs font-semibold text-black transition-all leading-relaxed"
                                        placeholder="Sleep, Lab Verified, Plant-Based..."
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-[10px] font-black uppercase tracking-wider text-primary/50 ml-1">Hero Featured Series (Comma Separated)</Label>
                                      <Textarea
                                        value={(heroData.series || []).join(", ")}
                                        onChange={(e) => updateHeroJson(d => { d.series = e.target.value.split(",").map(s => s.trim()).filter(Boolean); })}
                                        className="min-h-[90px] rounded-xl border border-black/10 bg-white hover:border-black/20 focus:border-[#062D1B] focus:ring-2 focus:ring-[#062D1B]/5 px-4 py-3 text-xs font-semibold text-black transition-all leading-relaxed"
                                        placeholder="Chill, Lift, Balance, Sleep, Vape"
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Group 6: Verification & Trust Badges */}
                                <div className="space-y-6 p-8 rounded-[2rem] border border-black/5 bg-black/[0.01]">
                                  <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                                      <ShieldCheck className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <h4 className="text-xs font-black uppercase tracking-wider text-primary">Trust & Credibility Badges</h4>
                                      <p className="text-[10px] text-primary/40 font-medium">Manage customer trust indicators, certificates, and ratings.</p>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-5 rounded-xl border border-black/5 bg-white space-y-4 shadow-sm">
                                      <span className="text-[10px] font-black uppercase tracking-widest text-[#062D1B] bg-[#062D1B]/5 px-2 py-0.5 rounded">Lab/COA Badge</span>
                                      <div className="space-y-3">
                                        <div className="space-y-1">
                                          <span className="text-[9px] font-semibold text-primary/30 ml-1">Badge Title</span>
                                          <Input
                                            value={heroData.badges?.find((b: any) => b.type === "coa")?.title || ""}
                                            onChange={(e) => updateHeroJson(d => {
                                              d.badges = d.badges || [];
                                              let b = d.badges.find((x: any) => x.type === "coa");
                                              if (!b) { b = { type: "coa" }; d.badges.push(b); }
                                              b.title = e.target.value;
                                            })}
                                            className="h-10 rounded-xl border border-black/10 bg-white hover:border-black/20 focus:border-[#062D1B] focus:ring-2 focus:ring-[#062D1B]/5 px-4 text-xs font-bold text-black transition-all"
                                            placeholder="e.g. Lab Verified"
                                          />
                                        </div>
                                        <div className="space-y-1">
                                          <span className="text-[9px] font-semibold text-primary/30 ml-1">Subtext / Description</span>
                                          <Input
                                            value={heroData.badges?.find((b: any) => b.type === "coa")?.description || ""}
                                            onChange={(e) => updateHeroJson(d => {
                                              d.badges = d.badges || [];
                                              let b = d.badges.find((x: any) => x.type === "coa");
                                              if (!b) { b = { type: "coa" }; d.badges.push(b); }
                                              b.description = e.target.value;
                                            })}
                                            className="h-10 rounded-xl border border-black/10 bg-white hover:border-black/20 focus:border-[#062D1B] focus:ring-2 focus:ring-[#062D1B]/5 px-4 text-xs font-semibold text-black/75 transition-all"
                                            placeholder="e.g. COA available for every batch"
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    <div className="p-5 rounded-xl border border-black/5 bg-white space-y-4 shadow-sm">
                                      <span className="text-[10px] font-black uppercase tracking-widest text-[#062D1B] bg-[#062D1B]/5 px-2 py-0.5 rounded">Reviews Badge</span>
                                      <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-4">
                                          <div className="space-y-1">
                                            <span className="text-[9px] font-semibold text-primary/30 ml-1">Rating Score</span>
                                            <Input
                                              type="number"
                                              step="0.1"
                                              value={heroData.badges?.find((b: any) => b.type === "reviews")?.rating || ""}
                                              onChange={(e) => updateHeroJson(d => {
                                                d.badges = d.badges || [];
                                                let b = d.badges.find((x: any) => x.type === "reviews");
                                                if (!b) { b = { type: "reviews" }; d.badges.push(b); }
                                                b.rating = parseFloat(e.target.value) || 0;
                                              })}
                                              className="h-10 rounded-xl border border-black/10 bg-white hover:border-black/20 focus:border-[#062D1B] focus:ring-2 focus:ring-[#062D1B]/5 px-4 text-xs font-bold text-black transition-all"
                                              placeholder="4.9"
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <span className="text-[9px] font-semibold text-primary/30 ml-1">Total Reviews</span>
                                            <Input
                                              type="number"
                                              value={heroData.badges?.find((b: any) => b.type === "reviews")?.totalReviews || ""}
                                              onChange={(e) => updateHeroJson(d => {
                                                d.badges = d.badges || [];
                                                let b = d.badges.find((x: any) => x.type === "reviews");
                                                if (!b) { b = { type: "reviews" }; d.badges.push(b); }
                                                b.totalReviews = parseInt(e.target.value) || 0;
                                              })}
                                              className="h-10 rounded-xl border border-black/10 bg-white hover:border-black/20 focus:border-[#062D1B] focus:ring-2 focus:ring-[#062D1B]/5 px-4 text-xs font-bold text-black transition-all"
                                              placeholder="2400"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </CardContent>
                      </Card>

                      {/* Interactive Series Form */}
                      <Card className="rounded-[3rem] border-none shadow-organic bg-white/80 backdrop-blur-xl overflow-hidden">
                        <CardHeader className="bg-sage/5 border-b border-black/5 p-10 flex flex-row items-center justify-between">
                          <div>
                            <div className="size-16 rounded-3xl bg-white shadow-sharcly flex items-center justify-center mb-6">
                              <LayoutGrid className="h-7 w-7 text-primary" />
                            </div>
                            <CardTitle className="text-2xl font-black tracking-tight text-primary">Curated Collections</CardTitle>
                            <CardDescription className="text-primary/40 font-medium">Manage the 'Shop by Series' cards on the home page.</CardDescription>
                          </div>
                          <div className="flex flex-col gap-4 items-end">
                            <Button
                              type="button"
                              onClick={() => updateSeriesJson(d => {
                                d.push({
                                  label: "New Series",
                                  tag: "New",
                                  description: "Description here.",
                                  imageUrl: "",
                                  to: "/products",
                                  number: `0${d.length + 1}`
                                });
                              })}
                              className="rounded-xl h-11 px-5 bg-[#062D1B] hover:bg-[#084228] text-white font-bold uppercase tracking-wider text-[10px] shadow-sm transition-all"
                            >
                              <Plus className="w-4 h-4 mr-2" /> Add New Series Card
                            </Button>
                            <button
                              type="button"
                              onClick={() => handleCmsUpdate("series", "json_data", DEFAULT_SERIES_JSON)}
                              className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40 hover:text-primary transition-colors"
                            >
                              Reset to Defaults
                            </button>
                          </div>
                        </CardHeader>
                        <CardContent className="p-10 space-y-8">
                          {(() => {
                            const seriesData = getSeriesJson();
                            return seriesData.map((item: any, index: number) => (
                              <div key={index} className="p-8 rounded-[2rem] bg-black/[0.01] border border-black/5 relative group transition-all hover:border-black/10 hover:bg-white/50">
                                {/* Header block with Index Badge and Delete action */}
                                <div className="flex items-center justify-between mb-6 pb-4 border-b border-black/5">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-[#062D1B] px-2.5 py-1 rounded-lg border border-emerald-100">
                                      Series #{item.number || `0${index + 1}`}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => updateSeriesJson(d => { d.splice(index, 1); })}
                                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50/50 rounded-lg transition-colors flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider"
                                  >
                                    <Trash2 className="w-4 h-4" /> Remove
                                  </button>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                                  {/* Column 1: Image Preview */}
                                  <div className="lg:col-span-1 flex flex-col gap-3">
                                    <span className="text-[9px] font-black uppercase tracking-wider text-primary/45 ml-1">Card Preview</span>
                                    <div className="relative aspect-[4/3] rounded-2xl bg-black/[0.02] border border-black/5 overflow-hidden flex items-center justify-center group/img">
                                      {item.imageUrl ? (
                                        <img
                                          src={item.imageUrl}
                                          alt={item.label || "Series Image"}
                                          className="object-cover w-full h-full"
                                          onError={(e) => {
                                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80";
                                          }}
                                        />
                                      ) : (
                                        <div className="flex flex-col items-center justify-center p-4 text-center">
                                          <ImageIcon className="w-8 h-8 text-primary/20 mb-2" />
                                          <span className="text-[8px] font-bold text-primary/30 uppercase tracking-wider">No Image Configured</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Column 2: Form inputs */}
                                  <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                      <Label className="text-[10px] font-black uppercase tracking-wider text-primary/50 ml-1">Card Heading</Label>
                                      <Input
                                        value={item.label || ""}
                                        onChange={(e) => updateSeriesJson(d => { d[index].label = e.target.value; })}
                                        className="h-11 rounded-xl border border-black/10 bg-white hover:border-black/20 focus:border-[#062D1B] focus:ring-2 focus:ring-[#062D1B]/5 px-4 text-xs font-bold text-black transition-all"
                                        placeholder="e.g. Chill Series"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-[10px] font-black uppercase tracking-wider text-primary/50 ml-1">Category Tag</Label>
                                      <Input
                                        value={item.tag || ""}
                                        onChange={(e) => updateSeriesJson(d => { d[index].tag = e.target.value; })}
                                        className="h-11 rounded-xl border border-black/10 bg-white hover:border-black/20 focus:border-[#062D1B] focus:ring-2 focus:ring-[#062D1B]/5 px-4 text-xs font-bold text-black transition-all"
                                        placeholder="e.g. Relax"
                                      />
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                      <Label className="text-[10px] font-black uppercase tracking-wider text-primary/50 ml-1">Short Description</Label>
                                      <Input
                                        value={item.description || ""}
                                        onChange={(e) => updateSeriesJson(d => { d[index].description = e.target.value; })}
                                        className="h-11 rounded-xl border border-black/10 bg-white hover:border-black/20 focus:border-[#062D1B] focus:ring-2 focus:ring-[#062D1B]/5 px-4 text-xs font-semibold text-black transition-all"
                                        placeholder="e.g. Find your calm with our premium selection"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-[10px] font-black uppercase tracking-wider text-primary/50 ml-1">Image URL</Label>
                                      <Input
                                        value={item.imageUrl || ""}
                                        onChange={(e) => updateSeriesJson(d => { d[index].imageUrl = e.target.value; })}
                                        className="h-11 rounded-xl border border-black/10 bg-white hover:border-black/20 focus:border-[#062D1B] focus:ring-2 focus:ring-[#062D1B]/5 px-4 text-xs font-semibold text-black/60 font-mono transition-all"
                                        placeholder="https://..."
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-[10px] font-black uppercase tracking-wider text-primary/50 ml-1">Navigation Target (URL/Link)</Label>
                                      <Input
                                        value={item.to || ""}
                                        onChange={(e) => updateSeriesJson(d => { d[index].to = e.target.value; })}
                                        className="h-11 rounded-xl border border-black/10 bg-white hover:border-black/20 focus:border-[#062D1B] focus:ring-2 focus:ring-[#062D1B]/5 px-4 text-xs font-semibold text-black/60 font-mono transition-all"
                                        placeholder="/products?series=chill"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ));
                          })()}
                        </CardContent>
                      </Card>

                      <Card className="rounded-[3rem] border-none shadow-organic bg-white/80 backdrop-blur-xl overflow-hidden">
                        <CardHeader className="bg-sage/5 border-b border-black/5 p-10">
                          <div className="size-16 rounded-3xl bg-white shadow-sharcly flex items-center justify-center mb-6">
                            <ListRestart className="h-7 w-7 text-primary" />
                          </div>
                          <CardTitle className="text-2xl font-black tracking-tight text-primary">Rhythm & Narrative</CardTitle>
                          <CardDescription className="text-primary/40 font-medium">The philosophical flow of your digital flagship.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-10 space-y-8">
                          <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/30 ml-2">Philosophy Header</Label>
                            <Input
                              value={cmsContent.philosophy?.title || ""}
                              onChange={(e) => handleCmsUpdate("philosophy", "title", e.target.value)}
                              className="h-10 rounded-lg bg-black/[0.03] border-none font-bold text-sm px-4 focus:ring-2 focus:ring-[#062D1B]/10 transition-all text-black"
                            />
                          </div>
                          <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/30 ml-2">Philosophy Copy</Label>
                            <Textarea
                              value={cmsContent.philosophy?.description || ""}
                              onChange={(e) => handleCmsUpdate("philosophy", "description", e.target.value)}
                              className="min-h-[120px] rounded-lg bg-black/[0.03] border-none font-medium text-xs px-4 py-3 focus:ring-2 focus:ring-[#062D1B]/10 transition-all text-black/60"
                            />
                          </div>
                          <div className="bg-primary p-8 rounded-[2rem] space-y-6">
                            <Label className="text-[9px] font-black uppercase tracking-[0.5em] text-white/40">B2B Strategy Header</Label>
                            <Input
                              value={cmsContent.partners?.cta_title || ""}
                              onChange={(e) => handleCmsUpdate("partners", "cta_title", e.target.value)}
                              className="bg-white/10 border-white/10 h-10 rounded-lg text-white font-bold px-4 text-xs focus:bg-white/20 border-none"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : activePage === "about" ? (
                    <Card className="rounded-[3rem] border-none shadow-organic bg-white/80 backdrop-blur-xl overflow-hidden">
                      <CardHeader className="bg-sage/5 border-b border-black/5 p-10">
                        <CardTitle className="text-2xl font-black tracking-tight text-primary">Mission & Values</CardTitle>
                      </CardHeader>
                      <CardContent className="p-10 space-y-8">
                        <div className="space-y-4">
                          <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/30 ml-2">Mission Title</Label>
                          <Input
                            value={cmsContent.mission?.title || ""}
                            onChange={(e) => handleCmsUpdate("mission", "title", e.target.value)}
                            className="h-14 bg-sage/5 border-none rounded-xl font-bold px-6"
                          />
                        </div>
                        <div className="space-y-4">
                          <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/30 ml-2">Mission Description</Label>
                          <Textarea
                            value={cmsContent.mission?.description || ""}
                            onChange={(e) => handleCmsUpdate("mission", "description", e.target.value)}
                            className="min-h-[120px] bg-sage/5 border-none rounded-xl px-6 py-4"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ) : activePage === "shipping" ? (
                    <Card className="rounded-[3rem] border-none shadow-organic bg-white/80 backdrop-blur-xl overflow-hidden lg:col-span-2">
                      <CardHeader className="bg-sage/5 border-b border-black/5 p-10">
                        <CardTitle className="text-2xl font-black tracking-tight text-primary">Logistics & Policy Blocks</CardTitle>
                        <CardDescription className="text-primary/40 font-medium">Manage the detailed information blocks on the shipping page.</CardDescription>
                      </CardHeader>
                      <CardContent className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Shipping Policy */}
                        <div className="space-y-6 p-8 bg-neutral-50 rounded-[2rem]">
                          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 italic">Block 01: Shipping Policy</p>
                          <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-primary/30 ml-1">Section Title</Label>
                            <Input
                              value={cmsContent.shipping?.title || ""}
                              onChange={(e) => handleCmsUpdate("shipping", "title", e.target.value)}
                              className="h-12 bg-white border-none rounded-xl font-bold"
                            />
                          </div>
                          <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-primary/30 ml-1">Policy Content</Label>
                            <Textarea
                              value={cmsContent.shipping?.description || ""}
                              onChange={(e) => handleCmsUpdate("shipping", "description", e.target.value)}
                              className="min-h-[100px] bg-white border-none rounded-xl"
                            />
                          </div>
                        </div>

                        {/* Returns & Refunds */}
                        <div className="space-y-6 p-8 bg-neutral-50 rounded-[2rem]">
                          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 italic">Block 02: Returns & Refunds</p>
                          <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-primary/30 ml-1">Section Title</Label>
                            <Input
                              value={cmsContent.returns?.title || ""}
                              onChange={(e) => handleCmsUpdate("returns", "title", e.target.value)}
                              className="h-12 bg-white border-none rounded-xl font-bold"
                            />
                          </div>
                          <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-primary/30 ml-1">Return Guidelines</Label>
                            <Textarea
                              value={cmsContent.returns?.description || ""}
                              onChange={(e) => handleCmsUpdate("returns", "description", e.target.value)}
                              className="min-h-[100px] bg-white border-none rounded-xl"
                            />
                          </div>
                        </div>

                        {/* Tracking Info */}
                        <div className="space-y-6 p-8 bg-neutral-50 rounded-[2rem]">
                          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 italic">Block 03: Tracking</p>
                          <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-primary/30 ml-1">Section Title</Label>
                            <Input
                              value={cmsContent.tracking?.title || ""}
                              onChange={(e) => handleCmsUpdate("tracking", "title", e.target.value)}
                              className="h-12 bg-white border-none rounded-xl font-bold"
                            />
                          </div>
                          <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-primary/30 ml-1">Tracking Description</Label>
                            <Textarea
                              value={cmsContent.tracking?.description || ""}
                              onChange={(e) => handleCmsUpdate("tracking", "description", e.target.value)}
                              className="min-h-[100px] bg-white border-none rounded-xl"
                            />
                          </div>
                        </div>

                        {/* Guarantee */}
                        <div className="space-y-6 p-8 bg-neutral-50 rounded-[2rem]">
                          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 italic">Block 04: Quality Guarantee</p>
                          <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-primary/30 ml-1">Section Title</Label>
                            <Input
                              value={cmsContent.guarantee?.title || ""}
                              onChange={(e) => handleCmsUpdate("guarantee", "title", e.target.value)}
                              className="h-12 bg-white border-none rounded-xl font-bold"
                            />
                          </div>
                          <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-primary/30 ml-1">Guarantee Content</Label>
                            <Textarea
                              value={cmsContent.guarantee?.description || ""}
                              onChange={(e) => handleCmsUpdate("guarantee", "description", e.target.value)}
                              className="min-h-[100px] bg-white border-none rounded-xl"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : activePage === "privacy" || activePage === "terms" || activePage === "cookies" ? (
                    <Card className="rounded-[3rem] border-none shadow-organic bg-white/80 backdrop-blur-xl overflow-hidden lg:col-span-2">
                      <CardHeader className="bg-primary/5 border-b border-black/5 p-10">
                        <div className="size-16 rounded-3xl bg-white shadow-sharcly flex items-center justify-center mb-6">
                          <ShieldCheck className="h-7 w-7 text-primary" />
                        </div>
                        <CardTitle className="text-2xl font-black tracking-tight text-primary">
                          {activePage === "privacy" ? "Privacy Protocol" : activePage === "terms" ? "Legal Framework" : "Cookie Consent"}
                        </CardTitle>
                        <CardDescription className="text-primary/40 font-medium">
                          Architect the legal narrative for your digital authority.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-10 space-y-10">
                        <div className="space-y-4">
                          <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/30 ml-2">Main Policy Content</Label>
                          <RichTextEditor
                            content={cmsContent.legal?.body || ""}
                            onChange={(val) => handleCmsUpdate("legal", "body", val)}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-20 bg-white/40 border border-dashed border-black/10 rounded-[3rem] text-center">
                      <Terminal className="size-20 text-primary/5 mb-8" />
                      <h3 className="text-3xl font-heading font-black text-primary/10 tracking-tighter">Schema Module <br />Deactivated</h3>
                      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/10 mt-6 leading-loose px-10">Advanced interface configuration <br />pending for {activePage}</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="seo" className="space-y-12 focus-visible:outline-none">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  <div className="lg:col-span-2 space-y-10">
                    <Card className="rounded-[3rem] border-none shadow-organic bg-white/90 overflow-hidden">
                      <CardHeader className="bg-primary/5 p-10">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-2xl font-black tracking-tight text-primary">Search Blueprint</CardTitle>
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-black text-[9px] px-4 py-1.5 uppercase tracking-widest">Active Indexing</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-10 space-y-10">
                        <div className="space-y-4">
                          <Label className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/30 ml-2">Meta Title Protocol</Label>
                          <div className="relative">
                            <Input
                              value={seoData.title}
                              onChange={(e) => handleSeoUpdate("title", e.target.value)}
                              className="h-16 rounded-[1.25rem] bg-sage/5 border-none font-black text-xl px-8 pr-16 focus:bg-white text-primary"
                            />
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-primary/40 font-mono text-xs">{seoData.title.length}/60</div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <Label className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/30 ml-2">Meta Narrative (Description)</Label>
                          <div className="relative">
                            <Textarea
                              value={seoData.description}
                              onChange={(e) => handleSeoUpdate("description", e.target.value)}
                              className="min-h-[140px] rounded-[1.5rem] bg-sage/5 border-none font-medium text-base px-8 py-8 focus:bg-white transition-all text-primary/60 leading-relaxed"
                            />
                            <div className="absolute right-6 bottom-6 text-primary/40 font-mono text-xs text-right">{seoData.description.length}/160</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/30 ml-2">Robots Intelligence</Label>
                            <Select value={seoData.robots} onValueChange={(v) => handleSeoUpdate("robots", v)}>
                              <SelectTrigger className="h-16 rounded-[1.25rem] bg-sage/5 border-none font-black text-primary px-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="rounded-2xl border-black/5">
                                <SelectItem value="index, follow" className="font-bold">Index, Follow</SelectItem>
                                <SelectItem value="noindex, follow" className="font-bold">No Index, Follow</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/30 ml-2">Canonical Authority</Label>
                            <Input
                              value={seoData.canonicalUrl}
                              onChange={(e) => handleSeoUpdate("canonicalUrl", e.target.value)}
                              className="h-16 rounded-[1.25rem] bg-sage/5 border-none px-8 italic text-primary font-medium"
                              placeholder="https://scarly.com/..."
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="rounded-[3rem] border-none shadow-organic bg-white/90 overflow-hidden">
                      <CardHeader className="bg-primary p-10 text-white">
                        <CardTitle className="text-2xl font-black tracking-tight">OpenGraph Graphing</CardTitle>
                        <CardDescription className="text-white/40 font-medium">Social visibility overrides for {activePage}.</CardDescription>
                      </CardHeader>
                      <CardContent className="p-10 space-y-8">
                        <div className="space-y-4">
                          <Label className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/30 ml-2">Social Edge Title</Label>
                          <Input
                            value={seoData.ogTitle}
                            onChange={(e) => handleSeoUpdate("ogTitle", e.target.value)}
                            className="h-16 rounded-[1.25rem] bg-sage/5 border-none font-black text-xl px-8"
                          />
                        </div>
                        <div className="space-y-4">
                          <Label className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/30 ml-2">Graph Asset URL (OG Image)</Label>
                          <Input
                            value={seoData.ogImage}
                            onChange={(e) => handleSeoUpdate("ogImage", e.target.value)}
                            className="h-16 rounded-[1.25rem] bg-sage/5 border-none font-medium px-8 italic text-primary/40"
                          />
                        </div>
                        <div className="space-y-4 pt-6 border-t border-black/5">
                          <Label className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/30 ml-2">JSON-LD Structured Logic</Label>
                          <div className="relative">
                            <Code2 className="absolute top-6 left-6 h-5 w-5 text-primary/20" />
                            <Textarea
                              value={seoData.structuredData}
                              onChange={(e) => handleSeoUpdate("structuredData", e.target.value)}
                              className="min-h-[250px] pl-16 rounded-[1.5rem] bg-black/[0.02] border-none font-mono text-xs p-8 text-primary/80 focus:bg-white"
                              placeholder='{"@context": "https://schema.org", "@type": "Store"...}'
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Live Search Preview Sticky */}
                  <div className="space-y-10">
                    <div className="sticky top-10 space-y-10">
                      <Card className="rounded-[3rem] border-none shadow-2xl bg-emerald-950 text-white overflow-hidden border border-white/5">
                        <CardHeader className="bg-white/5 p-10 flex flex-row items-center gap-4">
                          <Globe className="h-6 w-6 text-accent" />
                          <CardTitle className="text-xl">Search Nexus Live</CardTitle>
                        </CardHeader>
                        <CardContent className="p-10 space-y-12">
                          <div className="space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent/60 italic">Google Mobile Simulator</p>
                            <div className="bg-white p-8 rounded-[2rem] shadow-organic">
                              <p className="text-[10px] text-primary/40 mb-2 truncate">scarly.com {activePage !== 'home' ? `› ${activePage}` : ''}</p>
                              <h3 className="text-[#1a0dab] text-xl font-medium mb-2 leading-tight line-clamp-2 hover:underline cursor-pointer">{seoData.title || "Sharcly | Premium Wellness Essentials"}</h3>
                              <p className="text-[#4d5156] text-xs leading-relaxed line-clamp-3 italic opacity-70">
                                {seoData.description || "Sharcly is your premium destination for high-quality wellness products and essentials. Built for those who value performance and quality."}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-4 pt-8 border-t border-white/10">
                            <div className="flex justify-between items-center bg-white/5 p-5 rounded-2xl">
                              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Technical Health</span>
                              <span className="text-xs font-black text-emerald-400">OPTIMAL</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/5 p-5 rounded-2xl">
                              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Graph Coverage</span>
                              <span className="text-xs font-black text-amber-400">92%</span>
                            </div>
                          </div>
                          <p className="text-[9px] text-white/20 font-medium italic text-center">Crawler algorithms favor concise, relevant metadata with specific keyword clusters.</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="global" className="space-y-10 focus-visible:outline-none">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <Card className="rounded-[3.5rem] border-none shadow-organic bg-white overflow-hidden">
                    <CardHeader className="bg-primary/5 p-12 border-b border-black/5">
                      <Settings2 className="h-10 w-10 text-primary mb-6" />
                      <CardTitle className="text-3xl font-black tracking-tight text-primary leading-none mb-3">Global Technical</CardTitle>
                      <CardDescription className="text-primary/40 font-medium">Coordinate site-wide analytics and crawling authority.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-12 space-y-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                          <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/30 ml-2">Site Authority Name</Label>
                          <Input
                            value={globalSeo.siteName}
                            onChange={(e) => setGlobalSeo({ ...globalSeo, siteName: e.target.value })}
                            className="h-16 rounded-2xl bg-sage/5 border-none font-black text-xl px-8"
                          />
                        </div>
                        <div className="space-y-4">
                          <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/30 ml-2">Discovery Sitemap URL</Label>
                          <Input
                            value={globalSeo.sitemapUrl}
                            onChange={(e) => setGlobalSeo({ ...globalSeo, sitemapUrl: e.target.value })}
                            className="h-16 rounded-2xl bg-sage/5 border-none font-bold px-8"
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/30 ml-2">Crawler Directives (Robots.txt)</Label>
                        <Textarea
                          value={globalSeo.robotsTxt}
                          onChange={(e) => setGlobalSeo({ ...globalSeo, robotsTxt: e.target.value })}
                          className="min-h-[220px] rounded-[2rem] bg-black/[0.03] border-none font-mono text-sm p-10 text-primary/70"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-[3.5rem] border-none shadow-organic bg-white overflow-hidden">
                    <CardHeader className="bg-accent p-12 text-white">
                      <Activity className="h-10 w-10 mb-6" />
                      <CardTitle className="text-3xl font-black tracking-tight leading-none mb-3">Audit & Analytics</CardTitle>
                      <CardDescription className="text-white/40 font-medium">Injection points for tracking pixels and verification codes.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-12 space-y-10">
                      <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/30 ml-2">Google Analytics 4 ID</Label>
                        <Input
                          value={globalSeo.googleAnalyticsId}
                          onChange={(e) => setGlobalSeo({ ...globalSeo, googleAnalyticsId: e.target.value })}
                          className="h-16 rounded-2xl bg-sage/5 border-none font-black text-xl px-8"
                          placeholder="G-XXXXXXXXXX"
                        />
                      </div>
                      <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/30 ml-2">Facebook Meta Pixel ID</Label>
                        <Input
                          value={globalSeo.facebookPixelId}
                          onChange={(e) => setGlobalSeo({ ...globalSeo, facebookPixelId: e.target.value })}
                          className="h-16 rounded-2xl bg-sage/5 border-none font-black text-xl px-8"
                        />
                      </div>
                      <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/30 ml-2">Google Site Verification</Label>
                        <Input
                          value={globalSeo.googleSiteVerification}
                          onChange={(e) => setGlobalSeo({ ...globalSeo, googleSiteVerification: e.target.value })}
                          className="h-16 rounded-2xl bg-sage/5 border-none px-8 font-medium italic"
                        />
                      </div>

                      <div className="pt-10 border-t border-black/5 space-y-8">
                        <p className="text-sm font-black uppercase tracking-[0.3em] text-primary underline decoration-emerald-500 decoration-4 underline-offset-8">Klaviyo Marketing Engine</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/30 ml-2">Public API Key (Site ID)</Label>
                            <Input
                              value={globalSeo.klaviyoPublicKey}
                              onChange={(e) => setGlobalSeo({ ...globalSeo, klaviyoPublicKey: e.target.value })}
                              className="h-14 rounded-xl bg-primary/5 border-none px-6 font-bold"
                              placeholder="e.g. ABCDEF"
                            />
                          </div>
                          <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/30 ml-2">Private API Key</Label>
                            <div className="relative">
                              <Input
                                type={showKlaviyoKey ? "text" : "password"}
                                value={globalSeo.klaviyoPrivateKey}
                                onChange={(e) => setGlobalSeo({ ...globalSeo, klaviyoPrivateKey: e.target.value })}
                                className="h-14 rounded-xl bg-primary/5 border-none px-6 pr-12 font-bold"
                                placeholder="pk_..."
                              />
                              <button
                                type="button"
                                onClick={() => setShowKlaviyoKey(!showKlaviyoKey)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/30 hover:text-primary transition-colors"
                              >
                                {showKlaviyoKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
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

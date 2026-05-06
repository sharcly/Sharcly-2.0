"use client";

import { useState, useEffect } from "react";
import { 
  Save, 
  Loader2, 
  Layout, 
  Type, 
  Quote, 
  User, 
  Sparkles,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api-client";
import { motion } from "framer-motion";

export function ContentManagement() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState({
    heroTitle: "Grow with Sharcly.",
    heroSubtitle: "Access high-precision botanical products for your retail space. We provide the quality, you provide the experience.",
    testimonialQuote: "Sharcly doesn't just sell products; they build relationships. Their support team and product quality are second to none in this industry.",
    testimonialAuthor: "Global Retail Director",
    testimonialRole: "Pure Wellness Network"
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await apiClient.get("/cms/wholesale");
        if (response.data.success && response.data.data) {
          const data = response.data.data;
          setContent({
            heroTitle: data.hero?.title || content.heroTitle,
            heroSubtitle: data.hero?.subtitle || content.heroSubtitle,
            testimonialQuote: data.testimonial?.quote || content.testimonialQuote,
            testimonialAuthor: data.testimonial?.author || content.testimonialAuthor,
            testimonialRole: data.testimonial?.role || content.testimonialRole,
          });
        }
      } catch (error) {
        console.error("Failed to fetch CMS content:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = [
        { page: "wholesale", section: "hero", key: "title", value: content.heroTitle },
        { page: "wholesale", section: "hero", key: "subtitle", value: content.heroSubtitle },
        { page: "wholesale", section: "testimonial", key: "quote", value: content.testimonialQuote },
        { page: "wholesale", section: "testimonial", key: "author", value: content.testimonialAuthor },
        { page: "wholesale", section: "testimonial", key: "role", value: content.testimonialRole },
      ];
      await apiClient.post("/cms/update", { items: payload });
      alert("Content updated successfully!");
    } catch (error) {
      console.error("Failed to update CMS content:", error);
      alert("Failed to update content. Check console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="h-40 bg-white rounded-[2.5rem] border border-neutral-100 animate-pulse" />
        <div className="h-60 bg-white rounded-[2.5rem] border border-neutral-100 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-4xl">
      {/* Hero Section Management */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
             <Layout className="size-5" />
          </div>
          <div>
             <h3 className="text-xl font-black tracking-tight text-neutral-900">Hero Section</h3>
             <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Main headline and introduction</p>
          </div>
        </div>

        <div className="p-8 bg-white rounded-[2.5rem] border border-neutral-100 shadow-sm space-y-8">
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Main Headline</Label>
            <Input 
              value={content.heroTitle}
              onChange={(e) => setContent({...content, heroTitle: e.target.value})}
              className="h-16 bg-neutral-50 border-none rounded-2xl font-black text-xl px-6"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Sub-headline / Description</Label>
            <Textarea 
              value={content.heroSubtitle}
              onChange={(e) => setContent({...content, heroSubtitle: e.target.value})}
              className="min-h-[120px] bg-neutral-50 border-none rounded-3xl font-bold p-6 text-neutral-600"
            />
          </div>
        </div>
      </section>

      {/* Testimonial Management */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
             <Quote className="size-5" />
          </div>
          <div>
             <h3 className="text-xl font-black tracking-tight text-neutral-900">Partner Spotlight</h3>
             <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Featured quote at the bottom</p>
          </div>
        </div>

        <div className="p-8 bg-white rounded-[2.5rem] border border-neutral-100 shadow-sm space-y-8">
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">The Quote</Label>
            <Textarea 
              value={content.testimonialQuote}
              onChange={(e) => setContent({...content, testimonialQuote: e.target.value})}
              className="min-h-[100px] bg-neutral-50 border-none rounded-3xl font-bold p-6 text-neutral-600 italic"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Author Name</Label>
              <Input 
                value={content.testimonialAuthor}
                onChange={(e) => setContent({...content, testimonialAuthor: e.target.value})}
                className="h-14 bg-neutral-50 border-none rounded-2xl font-bold px-6"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Role / Company</Label>
              <Input 
                value={content.testimonialRole}
                onChange={(e) => setContent({...content, testimonialRole: e.target.value})}
                className="h-14 bg-neutral-50 border-none rounded-2xl font-bold px-6"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="pt-6 border-t border-neutral-100 flex items-center justify-between">
         <div className="flex items-center gap-3 text-neutral-400">
            <Info className="size-4" />
            <p className="text-[10px] font-black uppercase tracking-widest">Changes are reflected instantly on the public site</p>
         </div>
         <Button 
           onClick={handleSave}
           disabled={isSaving}
           className="h-16 px-12 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-emerald-600/20 gap-3"
         >
           {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-5" />}
           Save All Changes
         </Button>
      </div>
    </div>
  );
}

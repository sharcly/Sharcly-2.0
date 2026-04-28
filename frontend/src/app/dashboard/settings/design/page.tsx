"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Palette, Layout, MousePointer2, Check, Loader2, Save } from "lucide-react";
import { cn } from "@/lib/utils";

const THEME_PRESETS = [
  {
    id: "noir",
    name: "Nike Noir",
    description: "Bold, high-contrast, professional.",
    primary: "#000000",
    secondary: "#ffffff",
    radius: "0rem",
    navbar: "transparent"
  },
  {
    id: "sage",
    name: "Sharcly Organic",
    description: "Deep forest greens and soft sage.",
    primary: "#062D1B",
    secondary: "#F0FDF4",
    radius: "1.5rem",
    navbar: "transparent"
  },
  {
    id: "luxury",
    name: "Midnight Gold",
    description: "Deep navy with elegant accents.",
    primary: "#0A192F",
    secondary: "#F3E5AB",
    radius: "1rem",
    navbar: "solid"
  }
];

export default function DesignSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    primaryColor: "#000000",
    secondaryColor: "#ffffff",
    buttonRadius: "2rem",
    siteTheme: "light",
    navbarStyle: "transparent",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get("/settings");
      if (data.success) {
        setSettings({
          primaryColor: data.settings.primaryColor || "#000000",
          secondaryColor: data.settings.secondaryColor || "#ffffff",
          buttonRadius: data.settings.buttonRadius || "2rem",
          siteTheme: data.settings.siteTheme || "light",
          navbarStyle: data.settings.navbarStyle || "transparent",
        });
      }
    } catch (error) {
      toast.error("Failed to load design settings");
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (preset: typeof THEME_PRESETS[0]) => {
    setSettings({
      ...settings,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      buttonRadius: preset.radius,
      navbarStyle: preset.navbar
    });
    toast.success(`Theme preset "${preset.name}" applied (Save to commit)`);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClient.put("/settings", settings);
      toast.success("Theme and brand styling updated");
      // Refresh to apply theme via ThemeProvider
      window.location.reload();
    } catch (error) {
      toast.error("Failed to save design settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 text-neutral-200 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900">Design & Themes</h2>
        <p className="text-sm text-neutral-500 font-medium">Customize your store's visual identity, colors, and interface styles.</p>
      </div>

      {/* Preset Library */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
           <Palette className="size-5 text-neutral-400" />
           <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400">Theme Library</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {THEME_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              className={cn(
                "group text-left p-6 rounded-3xl border-2 transition-all duration-300 bg-white",
                settings.primaryColor === preset.primary && settings.buttonRadius === preset.radius
                  ? "border-black shadow-xl scale-[1.02]"
                  : "border-black/5 hover:border-black/20"
              )}
            >
              <div className="flex justify-between items-start mb-6">
                 <div className="flex gap-2">
                    <div className="size-8 rounded-full border border-black/10" style={{ backgroundColor: preset.primary }} />
                    <div className="size-8 rounded-full border border-black/10" style={{ backgroundColor: preset.secondary }} />
                 </div>
                 {settings.primaryColor === preset.primary && <Check className="size-5 stroke-[3]" />}
              </div>
              <h4 className="font-bold text-lg mb-1">{preset.name}</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">{preset.description}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Custom Styles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <Card className="border-black/5 shadow-sm rounded-3xl overflow-hidden bg-white">
          <CardHeader className="p-8 border-b border-black/5">
            <CardTitle className="text-xl font-bold">Base Colors</CardTitle>
            <CardDescription className="text-xs">Precisely define your brand's core color palette.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-black/40">Primary Brand Color</Label>
              <div className="flex gap-4">
                 <input 
                   type="color" 
                   value={settings.primaryColor}
                   onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                   className="size-14 rounded-xl cursor-pointer border-none p-0 bg-transparent shrink-0" 
                 />
                 <Input 
                   value={settings.primaryColor}
                   onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                   className="h-14 rounded-xl bg-neutral-50 border-black/5 font-bold uppercase" 
                 />
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-black/40">Secondary / Background Tint</Label>
              <div className="flex gap-4">
                 <input 
                   type="color" 
                   value={settings.secondaryColor}
                   onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                   className="size-14 rounded-xl cursor-pointer border-none p-0 bg-transparent shrink-0" 
                 />
                 <Input 
                   value={settings.secondaryColor}
                   onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                   className="h-14 rounded-xl bg-neutral-50 border-black/5 font-bold uppercase" 
                 />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-black/5 shadow-sm rounded-3xl overflow-hidden bg-white">
          <CardHeader className="p-8 border-b border-black/5">
            <CardTitle className="text-xl font-bold">Interface Parameters</CardTitle>
            <CardDescription className="text-xs">Adjust the structural feel of your website components.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                 <MousePointer2 className="size-4 text-neutral-400" />
                 <Label className="text-[10px] font-black uppercase tracking-widest text-black/40">Button & Card Corner Radius</Label>
              </div>
              <select 
                value={settings.buttonRadius}
                onChange={(e) => setSettings({...settings, buttonRadius: e.target.value})}
                className="w-full h-14 rounded-xl bg-neutral-50 border-black/5 px-4 font-bold outline-none"
              >
                <option value="0rem">Sharp (0px)</option>
                <option value="0.5rem">Soft (8px)</option>
                <option value="1rem">Rounded (16px)</option>
                <option value="2rem">Pill (32px)</option>
              </select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                 <Layout className="size-4 text-neutral-400" />
                 <Label className="text-[10px] font-black uppercase tracking-widest text-black/40">Navbar Rendering Mode</Label>
              </div>
              <div className="flex gap-4 p-1 bg-neutral-50 rounded-2xl border border-black/5">
                 {["transparent", "solid"].map((mode) => (
                   <button
                     key={mode}
                     onClick={() => setSettings({...settings, navbarStyle: mode})}
                     className={cn(
                       "flex-1 h-12 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                       settings.navbarStyle === mode ? "bg-white shadow-sm text-black" : "text-black/30 hover:text-black"
                     )}
                   >
                     {mode}
                   </button>
                 ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end pt-12 border-t border-black/5">
         <Button onClick={handleSave} disabled={saving} className="h-16 px-16 rounded-3xl bg-black text-white hover:bg-neutral-800 transition-all font-bold gap-4 shadow-2xl">
            {saving ? <Loader2 className="size-5 animate-spin" /> : <Save className="size-5" />}
            COMMMIT DESIGN SYSTEM
         </Button>
      </div>
    </div>
  );
}

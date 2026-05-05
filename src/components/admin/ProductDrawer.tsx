"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
   X,
   Check,
   ChevronRight,
   Image as ImageIcon,
   Plus,
   Trash2,
   GripVertical,
   Star,
   Lock,
   Unlock,
   Info,
   ArrowRight,
   Monitor,
   LayoutGrid,
   Truck,
   Globe,
   Settings,
   HelpCircle,
   Archive,
   Save,
   Clock,
   FileText,
   ChevronDown,
   Share2,
   List,
   ShieldCheck,
   Zap,
   ArrowLeft
} from "lucide-react";
import { sanitizeHtml } from "@/lib/sanitize";
import { toast } from "sonner";
import Image from "next/image";
import { getImageUrl } from "@/lib/image-utils";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "@/lib/api-client";

/**
 * UTILS
 */
const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(" ");

const Label = ({ children, className }: any) => (
   <label className={cn("text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-2", className)}>
      {children}
   </label>
);

const Button = ({ children, onClick, variant = "primary", className, icon: Icon }: any) => (
   <button
      onClick={onClick}
      className={cn(
         "h-12 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2",
         variant === "primary" ? "bg-[#0f2318] text-white hover:opacity-90 active:scale-95 shadow-lg shadow-[#0f2318]/20" : "border border-neutral-200 text-neutral-600 hover:bg-neutral-50 active:scale-95",
         className
      )}
   >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
   </button>
);

const Field = ({ label, children, required, hint }: any) => (
   <div className="space-y-2">
      <div className="flex justify-between items-center">
         <Label>{label} {required && <span className="text-rose-500">*</span>}</Label>
         {hint && (
            <div className="group relative">
               <HelpCircle className="h-3.5 w-3.5 text-neutral-300" />
               <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-neutral-900 text-white text-[9px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  {hint}
               </div>
            </div>
         )}
      </div>
      {children}
   </div>
);

const FormSection = ({ title, id, children }: { title: string; id: string; children: React.ReactNode }) => (
   <div id={id} className="scroll-mt-24 pt-16 first:pt-0 border-t first:border-t-0 border-neutral-100">
      <h3 className="text-xl font-bold font-heading text-neutral-900 mb-6 flex items-center gap-3">
         <span className="size-1.5 bg-emerald-500 rounded-full" />
         {title}
      </h3>
      <div className="space-y-10">{children}</div>
   </div>
);

/**
 * MAIN COMPONENT
 */
export default function ProductDrawer({
   isOpen,
   onClose,
   onSave,
   initialData,
   categories = [],
   collections = [],
   tags = [],
   types = []
}: any) {
   // Navigation State REMOVED
   const [isCreatingCategory, setIsCreatingCategory] = useState(false);
   const [newCatName, setNewCatName] = useState("");

   // Form State
   const [form, setForm] = useState<any>({
      name: "",
      sku: "",
      price: "",
      stock: "0",
      description: "",
      categoryId: "",
      typeId: "",
      tags: [],
      collections: [],
      status: "Published",
      thumbnail: null,
      galleryFiles: [],
      variants: [
         { title: "Pack of 1", sku: "", price: "", stock: 0, image: null },
         { title: "Pack of 3", sku: "", price: "", stock: 0, image: null },
         { title: "Pack of 5", sku: "", price: "", stock: 0, image: null }
      ],
      // Storefront features
      subtitle: "", // Narrative Section Heading
      contentSections: [], // Highlights list
      metadata: [], // Specifications table
      isAuthenticated: true,

      // SEO Fields
      metaTitle: "",
      metaDescription: "",
      keywords: [],
      canonicalUrl: "",
      ogImage: null,
      changefreq: "monthly"
   });

   const updateForm = (updates: any) => setForm((prev: any) => ({ ...prev, ...updates }));

   // Sync logic
   useEffect(() => {
      if (isOpen) {
         if (initialData) {
            setForm({
               ...initialData,
               name: initialData.name || "",
               sku: initialData.sku || "",
               price: initialData.price || "",
               stock: initialData.stock || "0",
               categoryId: initialData.categoryId || "",
               typeId: initialData.typeId || "",
               tags: Array.isArray(initialData.tags) ? initialData.tags.map((t: any) => typeof t === 'string' ? t : t.id) : [],
               collections: Array.isArray(initialData.collections) ? initialData.collections.map((c: any) => typeof c === 'string' ? c : c.id) : [],
               subtitle: initialData.subtitle || "",
               isAuthenticated: initialData.isAuthenticated !== undefined ? initialData.isAuthenticated : true,
               variants: initialData.variants?.length > 0 ? initialData.variants : [],
               contentSections: initialData.contentSections || [],
               metadata: initialData.metadata || [],
               // SEO Sync
               metaTitle: initialData.metaTitle || "",
               metaDescription: initialData.metaDescription || "",
               keywords: Array.isArray(initialData.keywords) ? initialData.keywords : (typeof initialData.keywords === 'string' ? initialData.keywords.split(',').map((s: string) => s.trim()) : []),
               canonicalUrl: initialData.canonicalUrl || "",
               ogImage: initialData.ogImage || null,
               changefreq: initialData.changefreq || "monthly"
            });
         } else {
            setForm({
               name: "",
               sku: "",
               price: "",
               stock: "0",
               description: "",
               categoryId: "",
               typeId: "",
               tags: [],
               collections: [],
               status: "Published",
               thumbnail: null,
               galleryFiles: [],
               variants: [
                  { title: "Pack of 1", sku: "", price: "", stock: 0, image: null },
                  { title: "Pack of 3", sku: "", price: "", stock: 0, image: null },
                  { title: "Pack of 5", sku: "", price: "", stock: 0, image: null }
               ],
               subtitle: "",
               contentSections: ["99.8% Synthesis Purity", "Ethanol-Free Extraction", "Terpene Matrix Locked", "Certified Organic Base"],
               metadata: [
                  { key: "Archive ID", value: "" },
                  { key: "Sourcing", value: "Oregon Heritage Organic" },
                  { key: "Potency", value: "1500mg Matrix" },
                  { key: "Carrier", value: "MCT / Coconut Pure" },
                  { key: "Verification", value: "QR-Batch v2.4" },
                  { key: "Shelf Life", value: "24 Months" }
               ],
               isAuthenticated: true,
               metaTitle: "",
               metaDescription: "",
               keywords: [],
               canonicalUrl: "",
               ogImage: null,
               changefreq: "monthly"
            });
         }
      }
   }, [initialData, isOpen]);

   // scrollToSection REMOVED

   const handleCreateCategory = async () => {
      if (!newCatName) return;
      try {
         const res = await apiClient.post("/products/categories", { name: newCatName });
         toast.success("Category created successfully");
         updateForm({ categoryId: res.data.category.id });
         setIsCreatingCategory(false);
         setNewCatName("");
      } catch (err) { toast.error("Failed to create category"); }
   };

   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 z-[100] flex justify-end">
         <style dangerouslySetInnerHTML={{
            __html: sanitizeHtml(`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@100..1000&family=Sora:wght@100..800&display=swap');
        .font-sans { font-family: 'DM Sans', sans-serif; }
        .font-heading { font-family: 'Sora', sans-serif; }
      `)
         }} />

         {/* BACKDROP */}
         <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={onClose} />

         {/* DRAWER */}
         <div className="relative w-full md:w-[60vw] lg:w-[55vw] h-full bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-500 font-sans">

            {/* SIDEBAR TABS REMOVED */}

            {/* CONTENT */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
               {/* STICKY HEADER */}
               <div className="sticky top-0 z-10 bg-white border-b border-neutral-100 px-8 py-4 flex items-center justify-between">
                  <h2 className="text-xl font-heading font-black text-[#0f2318]">Product Editorial</h2>
                  <div className="flex items-center gap-3">
                     <Button onClick={onClose} variant="ghost" className="px-4">Discard</Button>
                     <Button onClick={() => onSave(form)}>Save Changes</Button>
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto px-8 py-12 space-y-24 scroll-smooth">
                  <div className="max-w-3xl mx-auto space-y-24 pb-20">

                     <FormSection title="Core Information" id="basic">
                        {/* <div className="grid grid-cols-1 md:grid-cols-1 gap-8"> */}
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                           <Field label="Product Name" required>
                              <input
                                 value={form.name}
                                 onChange={e => updateForm({ name: e.target.value })}
                                 placeholder="Product name..."
                                 className="w-full h-12 px-5 bg-white border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none font-bold text-sm"
                              />
                           </Field>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           <Field label="SKU / Ident">
                              <input value={form.sku || ""} onChange={e => updateForm({ sku: e.target.value })} placeholder="SKU-..." className="w-full h-12 px-5 bg-white border border-neutral-200 rounded-xl outline-none font-bold text-sm" />
                           </Field>
                           <Field label="Base Price ($)" required>
                              <input type="number" value={form.price} onChange={e => updateForm({ price: e.target.value })} placeholder="0.00" className="w-full h-12 px-5 bg-white border border-neutral-200 rounded-xl outline-none font-bold text-sm" />
                           </Field>
                           <Field label="Stock Status">
                              <input type="number" value={form.stock} onChange={e => updateForm({ stock: e.target.value })} placeholder="0" className="w-full h-12 px-5 bg-white border border-neutral-200 rounded-xl outline-none font-bold text-sm" />
                           </Field>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                           <ShieldCheck className="h-5 w-5 text-emerald-600" />
                           <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">Mark as Authenticated</span>
                           <button
                              onClick={() => updateForm({ isAuthenticated: !form.isAuthenticated })}
                              className={cn("ml-auto size-10 rounded-lg flex items-center justify-center transition-all", form.isAuthenticated ? "bg-emerald-600 text-white" : "bg-neutral-200 text-neutral-400")}
                           >
                              {form.isAuthenticated ? <Check size={16} /> : <X size={16} />}
                           </button>
                        </div>
                        </div>
                     </FormSection>

                     <FormSection title="Organization" id="organization">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <Field label="Category" required hint="Select at least one category for your product.">
                              <div className="flex gap-2">
                                 <select
                                    value={form.categoryId}
                                    onChange={e => updateForm({ categoryId: e.target.value })}
                                    className="flex-1 h-12 px-5 bg-white border border-neutral-200 rounded-xl outline-none font-bold appearance-none text-sm"
                                 >
                                    <option value="">Select Category...</option>
                                    {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                 </select>
                                 <button onClick={() => setIsCreatingCategory(true)} className="size-12 bg-neutral-100 rounded-xl flex items-center justify-center text-neutral-400 hover:text-emerald-500 transition-colors"><Plus size={16} /></button>
                              </div>
                           </Field>
                           <Field label="Product Type">
                              <select
                                 value={form.typeId}
                                 onChange={e => updateForm({ typeId: e.target.value })}
                                 className="w-full h-12 px-5 bg-white border border-neutral-200 rounded-xl outline-none font-bold appearance-none text-sm"
                              >
                                 <option value="">Select Type...</option>
                                 {types.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
                              </select>
                           </Field>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                           <Field label="Collections">
                              <div className="flex flex-wrap gap-2 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                                 {collections.map((col: any) => (
                                    <button
                                       key={col.id}
                                       onClick={() => {
                                          const newCols = form.collections.includes(col.id)
                                             ? form.collections.filter((id: string) => id !== col.id)
                                             : [...form.collections, col.id];
                                          updateForm({ collections: newCols });
                                       }}
                                       className={cn(
                                          "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                          form.collections.includes(col.id) ? "bg-emerald-600 text-white shadow-md" : "bg-white text-neutral-400 border border-neutral-100 hover:text-neutral-900"
                                       )}
                                    >
                                       {col.name}
                                    </button>
                                 ))}
                                 {collections.length === 0 && <span className="text-[10px] font-bold text-neutral-300 italic">No collections available</span>}
                              </div>
                           </Field>
                           <Field label="Tags">
                              <div className="flex flex-wrap gap-2 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                                 {tags.map((tag: any) => (
                                    <button
                                       key={tag.id}
                                       onClick={() => {
                                          const newTags = form.tags.includes(tag.id)
                                             ? form.tags.filter((id: string) => id !== tag.id)
                                             : [...form.tags, tag.id];
                                          updateForm({ tags: newTags });
                                       }}
                                       className={cn(
                                          "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                          form.tags.includes(tag.id) ? "bg-indigo-600 text-white shadow-md" : "bg-white text-neutral-400 border border-neutral-100 hover:text-neutral-900"
                                       )}
                                    >
                                       {tag.name}
                                    </button>
                                 ))}
                                 {tags.length === 0 && <span className="text-[10px] font-bold text-neutral-300 italic">No tags available</span>}
                              </div>
                           </Field>
                        </div>
                     </FormSection>

                     <FormSection title="Images & Gallery" id="media">
                        <div className="space-y-8">
                           <Field label="Main Hero Image">
                              <label className="group relative size-32 bg-neutral-50 border-2 border-dashed border-neutral-200 rounded-xl flex items-center justify-center cursor-pointer hover:border-emerald-500 transition-all overflow-hidden">
                                 {form.thumbnail ? (
                                    <Image src={typeof form.thumbnail === 'string' ? getImageUrl(form.thumbnail) : URL.createObjectURL(form.thumbnail)} fill className="object-cover" alt="Main" />
                                 ) : <Plus className="text-neutral-300" />}
                                 <input type="file" className="hidden" onChange={e => updateForm({ thumbnail: e.target.files?.[0] })} />
                              </label>
                           </Field>
                           <Field label="Lifestyle Gallery">
                              <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                                 {(form.galleryFiles || []).map((f: any, i: number) => (
                                    <div key={i} className="relative aspect-square bg-neutral-100 rounded-xl overflow-hidden border border-neutral-100 group">
                                       <Image src={typeof f === 'string' ? `${process.env.NEXT_PUBLIC_API_URL}/images/${f}` : URL.createObjectURL(f)} fill className="object-cover" alt="Gallery" />
                                       <button onClick={() => updateForm({ galleryFiles: form.galleryFiles.filter((_: any, idx: number) => idx !== i) })} className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all"><X size={12} /></button>
                                    </div>
                                 ))}
                                 <label className="aspect-square border-2 border-dashed border-neutral-200 rounded-xl flex items-center justify-center text-neutral-300 cursor-pointer hover:border-emerald-500 transition-all font-sans text-[10px] font-bold uppercase tracking-widest flex-col gap-1">
                                    <Plus size={16} /> Add
                                    <input type="file" multiple className="hidden" onChange={e => updateForm({ galleryFiles: [...(form.galleryFiles || []), ...Array.from(e.target.files || [])] })} />
                                 </label>
                              </div>
                           </Field>
                        </div>
                     </FormSection>

                     <FormSection title="Product Variants" id="variants">
                        <div className="space-y-4">
                           {(form.variants || []).map((v: any, i: number) => (
                              <div key={i} className="p-4 bg-neutral-50 rounded-xl border border-neutral-100 flex gap-4 items-center relative group">
                                 <button onClick={() => updateForm({ variants: form.variants.filter((_: any, idx: number) => idx !== i) })} className="absolute top-2 right-2 p-1.5 text-neutral-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14} /></button>
                                 <label className="relative size-16 bg-white border border-neutral-100 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden shrink-0">
                                    {v.image ? <Image src={typeof v.image === 'string' ? `${process.env.NEXT_PUBLIC_API_URL}/images/${v.image}` : URL.createObjectURL(v.image)} fill className="object-cover" alt="V" /> : <Plus size={16} className="text-neutral-200" />}
                                    <input type="file" className="hidden" onChange={e => {
                                       const n = [...form.variants]; n[i].image = e.target.files?.[0]; updateForm({ variants: n });
                                    }} />
                                 </label>
                                 <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <input value={v.title} onChange={e => { const n = [...form.variants]; n[i].title = e.target.value; updateForm({ variants: n }); }} placeholder="Pack of 1..." className="h-10 px-3 bg-white border border-transparent rounded-lg outline-none font-bold text-xs" />
                                    <input value={v.sku || ""} onChange={e => { const n = [...form.variants]; n[i].sku = e.target.value; updateForm({ variants: n }); }} placeholder="SKU" className="h-10 px-3 bg-white border border-transparent rounded-lg outline-none font-bold text-xs" />
                                    <input type="number" value={v.price} onChange={e => { const n = [...form.variants]; n[i].price = e.target.value; updateForm({ variants: n }); }} placeholder="Price" className="h-10 px-3 bg-white border border-transparent rounded-lg outline-none font-bold text-xs" />
                                    <input type="number" value={v.stock} onChange={e => { const n = [...form.variants]; n[i].stock = e.target.value; updateForm({ variants: n }); }} placeholder="Stock" className="h-10 px-3 bg-white border border-transparent rounded-lg outline-none font-bold text-xs" />
                                 </div>
                              </div>
                           ))}
                           <button onClick={() => updateForm({ variants: [...form.variants, { title: "", sku: "", price: "", stock: 0, image: null }] })} className="w-full py-3 border-2 border-dashed border-neutral-100 rounded-xl text-[10px] font-black uppercase text-neutral-300 hover:text-emerald-500 hover:border-emerald-500 transition-all font-sans">+ Add another variant</button>
                        </div>
                     </FormSection>

                     <FormSection title="Storefront Story" id="narrative">
                        <div className="space-y-6">
                           <Field label="Detailed Page Description">
                              <textarea
                                 value={form.description}
                                 onChange={e => updateForm({ description: e.target.value })}
                                 placeholder="Primary product description..."
                                 className="w-full min-h-[100px] p-5 bg-white border border-neutral-200 rounded-xl outline-none font-medium leading-relaxed text-sm"
                              />
                           </Field>

                           <div className="pt-6 border-t border-neutral-100 space-y-6">
                              <div className="flex items-center gap-3">
                                 <Zap className="h-4 w-4 text-indigo-500" />
                                 <h4 className="text-sm font-bold font-heading">Narrative & Highlights</h4>
                              </div>
                              <Field label="Section Header (e.g. 'The Precision Synthesis')">
                                 <input value={form.subtitle} onChange={e => updateForm({ subtitle: e.target.value })} placeholder="Custom narrative header..." className="w-full h-10 px-4 bg-neutral-50 border border-transparent rounded-lg outline-none font-bold italic text-xs" />
                              </Field>

                              <Field label="Key Product Highlights (Bullet Points)">
                                 <div className="space-y-2">
                                    {(form.contentSections || []).map((point: string, i: number) => (
                                       <div key={i} className="flex gap-2">
                                          <div className="size-10 bg-neutral-100 rounded-lg flex items-center justify-center shrink-0"><Check size={14} className="text-emerald-500" /></div>
                                          <input
                                             value={point}
                                             onChange={e => { const n = [...form.contentSections]; n[i] = e.target.value; updateForm({ contentSections: n }); }}
                                             className="flex-1 h-10 px-4 bg-neutral-50 rounded-lg outline-none font-bold text-xs"
                                          />
                                          <button onClick={() => updateForm({ contentSections: form.contentSections.filter((_: any, idx: number) => idx !== i) })} className="p-2 text-neutral-300 hover:text-rose-500"><Trash2 size={14} /></button>
                                       </div>
                                    ))}
                                    <button onClick={() => updateForm({ contentSections: [...form.contentSections, ""] })} className="text-[10px] font-black uppercase text-indigo-500 hover:underline">+ Add Highlight</button>
                                 </div>
                              </Field>
                           </div>
                        </div>
                     </FormSection>

                     <FormSection title="Full Specifications" id="specs">
                        <div className="grid grid-cols-2 gap-3">
                           {(form.metadata || []).map((m: any, i: number) => (
                              <div key={i} className="flex gap-2 p-3 bg-neutral-50 rounded-xl border border-neutral-100 group relative">
                                 <button onClick={() => updateForm({ metadata: form.metadata.filter((_: any, idx: number) => idx !== i) })} className="absolute -top-1 -right-1 p-1 bg-white shadow-sm rounded-full text-rose-500 border border-neutral-100 opacity-0 group-hover:opacity-100 transition-all"><X size={10} /></button>
                                 <div className="flex-1">
                                    <input value={m.key} onChange={e => { const n = [...form.metadata]; n[i].key = e.target.value; updateForm({ metadata: n }); }} className="w-full text-[9px] font-black uppercase text-neutral-400 bg-transparent outline-none" placeholder="Label..." />
                                    <input value={m.value} onChange={e => { const n = [...form.metadata]; n[i].value = e.target.value; updateForm({ metadata: n }); }} className="w-full text-xs font-bold text-neutral-900 bg-transparent outline-none" placeholder="Value..." />
                                 </div>
                              </div>
                           ))}
                           <button onClick={() => updateForm({ metadata: [...form.metadata, { key: "", value: "" }] })} className="h-16 border-2 border-dashed border-neutral-100 rounded-xl flex items-center justify-center text-[9px] font-black uppercase text-neutral-300 hover:text-emerald-500 transition-all">+ Add Row</button>
                        </div>
                     </FormSection>

                     <FormSection title="Search Engine Optimization" id="seo">
                        <div className="space-y-8">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <Field label="Page Title (SEO)">
                                 <input value={form.metaTitle} onChange={e => updateForm({ metaTitle: e.target.value })} className="w-full h-10 px-4 bg-white border border-neutral-200 rounded-lg outline-none font-bold text-xs" />
                              </Field>
                              <Field label="Canonical URL">
                                 <input value={form.canonicalUrl} onChange={e => updateForm({ canonicalUrl: e.target.value })} className="w-full h-10 px-4 bg-white border border-neutral-200 rounded-lg outline-none font-bold text-xs" />
                              </Field>
                           </div>
                           <Field label="Meta Description">
                              <textarea value={form.metaDescription} onChange={e => updateForm({ metaDescription: e.target.value })} className="w-full min-h-[80px] p-5 bg-white border border-neutral-200 rounded-xl outline-none font-medium text-xs leading-relaxed" />
                           </Field>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <Field label="Keywords">
                                 <input value={Array.isArray(form.keywords) ? form.keywords.join(", ") : form.keywords} onChange={e => updateForm({ keywords: e.target.value.split(",").map((s: string) => s.trim()) })} className="w-full h-12 px-5 bg-white border border-neutral-200 rounded-xl outline-none font-bold text-sm" />
                              </Field>
                              <Field label="Social Image (OG)">
                                 <div className="flex items-center gap-4">
                                    <label className="relative size-16 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-center cursor-pointer overflow-hidden">
                                       {form.ogImage ? <Image src={typeof form.ogImage === 'string' ? getImageUrl(form.ogImage) : URL.createObjectURL(form.ogImage)} fill className="object-cover" alt="OG" /> : <Plus className="text-neutral-300" />}
                                       <input type="file" className="hidden" onChange={e => updateForm({ ogImage: e.target.files?.[0] })} />
                                    </label>
                                    <span className="text-[10px] font-bold text-neutral-400">Share Preview</span>
                                 </div>
                              </Field>
                           </div>
                        </div>
                     </FormSection>

                  </div>
               </div>
            </div>

            {/* CATEGORY MODAL */}
            <AnimatePresence>
               {isCreatingCategory && (
                  <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={() => setIsCreatingCategory(false)} />
                     <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-sm bg-white rounded-[2rem] p-8 space-y-6 font-sans">
                        <h3 className="text-xl font-bold font-heading">New Category</h3>
                        <input autoFocus value={newCatName} onChange={e => setNewCatName(e.target.value)} className="w-full h-14 px-6 bg-neutral-50 rounded-2xl border border-neutral-100 outline-none font-bold" placeholder="Name..." />
                        <div className="flex gap-3 pt-2">
                           <button onClick={() => setIsCreatingCategory(false)} className="flex-1 py-3 text-neutral-400 font-bold text-xs">Back</button>
                           <button onClick={handleCreateCategory} className="flex-1 py-3 bg-[#0f2318] text-white font-bold text-xs rounded-xl">Save</button>
                        </div>
                     </motion.div>
                  </div>
               )}
            </AnimatePresence>

         </div>
      </div>
   );
}

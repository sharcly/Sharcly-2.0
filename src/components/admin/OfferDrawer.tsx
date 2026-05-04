"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Check, 
  Gift, 
  Plus, 
  Trash2, 
  Info, 
  Settings, 
  Save, 
  FileText, 
  Smile,
  ImageIcon,
  Type
} from "lucide-react";
import { sanitizeHtml } from "@/lib/sanitize";
import { toast } from "sonner";
import Image from "next/image";
import { getImageUrl } from "@/lib/image-utils";
import { motion, AnimatePresence } from "framer-motion";

/**
 * UTILS
 */
const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(" ");

const Label = ({ children, className }: any) => (
  <label className={cn("text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-2", className)}>
    {children}
  </label>
);

const Button = ({ children, onClick, variant = "primary", className, icon: Icon, type = "button" }: any) => (
  <button
    type={type}
    onClick={onClick}
    className={cn(
      "h-12 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2",
      variant === "primary" ? "bg-[#0f2318] text-white hover:opacity-90 active:scale-95 shadow-lg shadow-[#0f2318]/20" : "border border-neutral-200 text-neutral-600 hover:bg-neutral-50 active:scale-95",
      variant === "ghost" ? "border-none bg-transparent hover:bg-neutral-50" : "",
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
           <Info className="h-3.5 w-3.5 text-neutral-300" />
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
export default function OfferDrawer({
  isOpen,
  onClose,
  onSave,
  initialData
}: any) {
  // Navigation State REMOVED

  // Form State
  const [form, setForm] = useState<any>({
    title: "",
    subtitle: "",
    description: "",
    discount: "",
    discountType: "FIXED",
    image: "",
    step2Title: "",
    step2Text: "",
    footerText: "",
    isActive: true,
    options: []
  });

  const updateForm = (updates: any) => setForm((prev: any) => ({ ...prev, ...updates }));

  // Sync logic
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setForm({
          ...initialData,
          title: initialData.title || "",
          subtitle: initialData.subtitle || "",
          description: initialData.description || "",
          discount: initialData.discount?.toString() || "",
          discountType: initialData.discountType || "FIXED",
          image: initialData.image || "",
          imageFile: null,
          step2Title: initialData.step2Title || "",
          step2Text: initialData.step2Text || "",
          footerText: initialData.footerText || "",
          isActive: initialData.isActive ?? true,
          options: initialData.options || []
        });
      } else {
        setForm({
          title: "",
          subtitle: "",
          description: "",
          discount: "",
          discountType: "FIXED",
          image: "",
          imageFile: null,
          step2Title: "",
          step2Text: "",
          footerText: "",
          isActive: true,
          options: [
            { label: "BLAST OFF / STRONG EUPHORIA", icon: "🚀" },
            { label: "SLEEP / INSOMNIA", icon: "😴" },
            { label: "STRESS / ANXIOUSNESS", icon: "😌" },
            { label: "SORENESS / DISCOMFORT", icon: "🦴" }
          ]
        });
      }
    }
  }, [initialData, isOpen]);

  // scrollToSection REMOVED

  const addOption = () => {
    updateForm({
      options: [...form.options, { label: "", icon: "✨" }]
    });
  };

  const updateOption = (index: number, field: "label" | "icon", value: string) => {
    const newOptions = [...form.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    updateForm({ options: newOptions });
  };

  const removeOption = (index: number) => {
    updateForm({
      options: form.options.filter((_: any, i: number) => i !== index)
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <style dangerouslySetInnerHTML={{ __html: sanitizeHtml(`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@100..1000&family=Sora:wght@100..800&display=swap');
        .font-sans { font-family: 'DM Sans', sans-serif; }
        .font-heading { font-family: 'Sora', sans-serif; }
      `)}} />

      {/* BACKDROP */}
      <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={onClose} />

      {/* DRAWER */}
      <div className="relative w-full md:w-[60vw] lg:w-[50vw] h-full bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-500 font-sans">
        
        {/* SIDEBAR TABS REMOVED */}

        {/* CONTENT */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* STICKY HEADER */}
          <div className="sticky top-0 z-10 bg-white border-b border-neutral-100 px-8 py-4 flex items-center justify-between">
            <h2 className="text-xl font-heading font-black text-[#0f2318]">Offer Editorial</h2>
            <div className="flex items-center gap-3">
              <Button onClick={onClose} variant="ghost" className="px-4">Discard</Button>
              <Button onClick={() => onSave(form)}>Save Changes</Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-12 space-y-24 scroll-smooth">
            <div className="max-w-3xl mx-auto space-y-24 pb-20">

              <FormSection title="Welcome Screen" id="welcome">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Field label="Main Title" required>
                    <input 
                      value={form.title} 
                      onChange={e => updateForm({ title: e.target.value })}
                      placeholder="e.g. You've Got A $20 Gift Card"
                      className="w-full h-12 px-5 bg-white border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none font-bold text-sm" 
                    />
                  </Field>
                  <Field label="Subtitle">
                    <input 
                      value={form.subtitle} 
                      onChange={e => updateForm({ subtitle: e.target.value })}
                      placeholder="e.g. What Are You Mainly Here For?"
                      className="w-full h-12 px-5 bg-white border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none font-bold text-sm" 
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Field label="Discount Amount" required>
                    <div className="flex gap-2">
                      <input 
                        type="number"
                        value={form.discount} 
                        onChange={e => updateForm({ discount: e.target.value })}
                        placeholder="20"
                        className="flex-1 h-12 px-5 bg-white border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none font-bold text-sm" 
                      />
                      <select 
                        value={form.discountType}
                        onChange={e => updateForm({ discountType: e.target.value })}
                        className="w-32 h-12 px-4 bg-white border border-neutral-200 rounded-xl outline-none font-bold appearance-none text-sm"
                      >
                        <option value="FIXED">Fixed ($)</option>
                        <option value="PERCENTAGE">Percent (%)</option>
                      </select>
                    </div>
                  </Field>
                  <Field label="Popup Image">
                    <div className="flex items-center gap-6">
                      <label className="group relative size-32 bg-neutral-50 border-2 border-dashed border-neutral-200 rounded-[2rem] flex items-center justify-center cursor-pointer hover:border-emerald-500 transition-all overflow-hidden shrink-0">
                        {form.imageFile ? (
                          <Image src={URL.createObjectURL(form.imageFile)} fill className="object-cover" alt="Preview" />
                        ) : form.image ? (
                          <Image src={getImageUrl(form.image)} fill className="object-cover" alt="Current" />
                        ) : (
                          <Plus className="text-neutral-300" />
                        )}
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={e => updateForm({ imageFile: e.target.files?.[0] })} 
                        />
                      </label>
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-neutral-900">Upload Media</div>
                        <p className="text-[10px] text-neutral-400 font-medium max-w-[120px]">Recommended: 800x800px PNG or JPG.</p>
                        {form.image && !form.imageFile && (
                          <button 
                            type="button" 
                            onClick={() => updateForm({ image: "" })} 
                            className="text-[10px] font-black uppercase text-rose-500 hover:underline"
                          >
                            Remove Current
                          </button>
                        )}
                      </div>
                    </div>
                  </Field>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <Label>User Options (Interest Selection)</Label>
                    <button onClick={addOption} className="text-[10px] font-black uppercase text-emerald-600 hover:underline flex items-center gap-1">
                      <Plus size={12} /> Add Option
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {form.options.map((option: any, index: number) => (
                      <div key={index} className="flex gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100 group">
                        <div className="relative w-20">
                          <input 
                            value={option.icon}
                            onChange={e => updateOption(index, "icon", e.target.value)}
                            className="w-full h-11 text-center bg-white border border-transparent rounded-xl outline-none font-bold"
                            placeholder="🚀"
                          />
                        </div>
                        <input 
                          value={option.label}
                          onChange={e => updateOption(index, "label", e.target.value)}
                          className="flex-1 h-11 px-4 bg-white border border-transparent rounded-xl outline-none font-bold text-sm"
                          placeholder="Option Label..."
                        />
                        <button onClick={() => removeOption(index)} className="p-3 text-neutral-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <Field label="Footer Reject Text">
                  <input 
                    value={form.footerText} 
                    onChange={e => updateForm({ footerText: e.target.value })}
                    placeholder="e.g. No, I'd rather pay full price"
                    className="w-full h-12 px-5 bg-white border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none font-bold text-sm" 
                  />
                </Field>
              </FormSection>

              <FormSection title="Claim Screen" id="claim">
                <div className="space-y-8">
                  <Field label="Claim Title">
                    <input 
                      value={form.step2Title} 
                      onChange={e => updateForm({ step2Title: e.target.value })}
                      placeholder="e.g. Claim Your $20 Gift Card"
                      className="w-full h-12 px-5 bg-white border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none font-bold text-sm" 
                    />
                  </Field>
                  <Field label="Claim Helper Text">
                    <input 
                      value={form.step2Text} 
                      onChange={e => updateForm({ step2Text: e.target.value })}
                      placeholder="e.g. (There's no catch, use it anytime!)"
                      className="w-full h-12 px-5 bg-white border border-neutral-200 rounded-xl focus:border-emerald-500 outline-none font-bold text-sm" 
                    />
                  </Field>
                </div>
              </FormSection>

              <FormSection title="Offer Settings" id="settings">
                <div className="space-y-8">
                  <Field label="Internal Description" required hint="Internal notes about this offer.">
                    <textarea 
                      value={form.description}
                      onChange={e => updateForm({ description: e.target.value })}
                      placeholder="Internal notes about this offer..."
                      className="w-full min-h-[100px] p-5 bg-white border border-neutral-200 rounded-xl outline-none font-medium leading-relaxed text-sm" 
                    />
                  </Field>

                  <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <Gift className="h-6 w-6 text-emerald-600" />
                    <div className="flex-1">
                      <div className="text-sm font-bold text-emerald-900 uppercase tracking-widest">Active Status</div>
                      <div className="text-xs text-emerald-600/70 font-medium">Toggle whether this offer is visible to customers</div>
                    </div>
                    <button 
                      onClick={() => updateForm({ isActive: !form.isActive })}
                      className={cn("size-10 rounded-lg flex items-center justify-center transition-all shadow-sm", form.isActive ? "bg-emerald-600 text-white" : "bg-white text-neutral-300")}
                    >
                       {form.isActive ? <Check /> : <X />}
                    </button>
                  </div>
                </div>
              </FormSection>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

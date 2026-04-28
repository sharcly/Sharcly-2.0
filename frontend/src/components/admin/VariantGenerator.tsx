"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, RefreshCw, Star } from "lucide-react";

interface Option {
  id: string;
  title: string;
  values: string;
}

interface Variant {
  title: string;
  sku: string;
  price: number;
  inventoryQuantity: number;
  options: Record<string, string>;
}

interface VariantGeneratorProps {
  productName: string;
  onVariantsChange: (variants: Variant[], options: {title: string, values: string[]}[]) => void;
  initialOptions?: {title: string, values: string[]}[];
  initialVariants?: Variant[];
}

export function VariantGenerator({ 
  productName, 
  onVariantsChange, 
  initialOptions, 
  initialVariants 
}: VariantGeneratorProps) {
  const [options, setOptions] = useState<Option[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    if (initialOptions && initialOptions.length > 0) {
      setOptions(initialOptions.map((o, i) => ({
        id: Math.random().toString(36).substr(2, 9),
        title: o.title,
        values: o.values.join(", ")
      })));
    }
    if (initialVariants && initialVariants.length > 0) {
      setVariants(initialVariants);
      setGenerated(true);
    }
  }, [initialOptions, initialVariants]);

  const addOption = () => {
    setOptions([...options, { id: Math.random().toString(36).substr(2, 9), title: "", values: "" }]);
  };

  const removeOption = (id: string) => {
    setOptions(options.filter(o => o.id !== id));
  };

  const updateOption = (id: string, field: keyof Option, value: string) => {
    setOptions(options.map(o => o.id === id ? { ...o, [field]: value } : o));
  };

  const generateVariants = () => {
    const validOptions = options.filter(o => o.title.trim() && o.values.trim());
    
    if (validOptions.length === 0) {
      const defaultVariant = {
        title: "Default Variant",
        sku: `${productName.substring(0, 3).toUpperCase()}-DEF`,
        price: 0,
        inventoryQuantity: 0,
        options: {}
      };
      setVariants([defaultVariant]);
      onVariantsChange([defaultVariant], []);
      setGenerated(true);
      return;
    }

    const optionsLists = validOptions.map(o => ({
      title: o.title.trim(),
      values: o.values.split(",").map(v => v.trim()).filter(v => v)
    }));

    const getCombinations = (index: number): Record<string, string>[] => {
      if (index === optionsLists.length) return [{ text: "" } as any];
      const option = optionsLists[index];
      const sub = getCombinations(index + 1);
      const res: Record<string, string>[] = [];
      
      for (const val of option.values) {
        for (const s of sub) {
          const combo = { [option.title]: val, ...s };
          delete (combo as any).text;
          res.push(combo);
        }
      }
      return res;
    };

    const combos = getCombinations(0);
    const newVariants = combos.map((combo, idx) => {
      const vTitle = Object.values(combo).join(" / ");
      const skuSuffix = Object.values(combo).map(v => v.substring(0, 2).toUpperCase()).join("-");
      return {
        title: vTitle,
        sku: `${productName.substring(0, 3).toUpperCase()}-${skuSuffix}-${Math.floor(1000 + Math.random() * 9000)}`,
        price: 0,
        inventoryQuantity: 0,
        options: combo
      };
    });

    setVariants(newVariants);
    onVariantsChange(newVariants, optionsLists);
    setGenerated(true);
  };

  const updateVariant = (idx: number, field: keyof Variant, value: any) => {
    const updated = [...variants];
    updated[idx] = { ...updated[idx], [field]: value };
    setVariants(updated);
    
    const validOptions = options.filter(o => o.title.trim() && o.values.trim()).map(o => ({
      title: o.title.trim(),
      values: o.values.split(",").map(v => v.trim()).filter(v => v)
    }));
    onVariantsChange(updated, validOptions);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
        <p className="text-xs text-indigo-700/80 mb-4 font-medium italic">Define product options to automatically generate variants.</p>
        
        <div className="space-y-3 mb-4">
          {options.map((opt) => (
            <div key={opt.id} className="flex flex-col sm:flex-row gap-3">
              <input 
                placeholder="Option Name (e.g. Size)" 
                value={opt.title} 
                onChange={(e) => updateOption(opt.id, "title", e.target.value)}
                className="w-full sm:w-[200px] px-3 py-2.5 text-sm border border-gray-200 shadow-sm rounded-lg focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 focus:outline-none transition"
              />
              <input 
                placeholder="Values (comma separated) e.g. Small, Medium" 
                value={opt.values} 
                onChange={(e) => updateOption(opt.id, "values", e.target.value)}
                className="flex-1 px-3 py-2.5 text-sm border border-gray-200 shadow-sm rounded-lg focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 focus:outline-none transition"
              />
              <button 
                type="button" 
                onClick={() => removeOption(opt.id)} 
                className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg font-semibold text-sm transition"
              >
                Remove
              </button>
            </div>
          ))}
          <button 
            type="button" 
            onClick={addOption} 
            className="text-[13px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 w-fit rounded-lg py-1 px-2 border border-transparent hover:border-indigo-100 hover:bg-indigo-50/30 transition-all"
          >
            <Plus className="h-4 w-4" /> Add Option
          </button>
        </div>

        <button 
          type="button" 
          onClick={generateVariants} 
          className="px-5 py-2.5 text-[13px] bg-white border border-indigo-200 rounded-lg font-bold text-indigo-800 hover:bg-indigo-50 transition shadow-sm flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" /> Generate Variants
        </button>
      </div>

      {generated && variants.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
             <h3 className="text-sm font-bold text-gray-900 tracking-tight">Generated Variants <span className="inline-flex items-center justify-center bg-gray-100 text-gray-600 rounded-full h-5 px-2 ml-1 text-[11px] font-bold">{variants.length}</span></h3>
             <p className="text-xs text-gray-500 italic">Adjust SKU and price before saving.</p>
          </div>
          
          <div className="space-y-3">
            {variants.map((v, i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm items-start sm:items-center group hover:border-indigo-200 transition-colors">
                <div className="min-w-[150px] font-bold text-gray-900 text-sm">{v.title}</div>
                <div className="flex-1 w-full grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">SKU</label>
                    <input 
                      value={v.sku} 
                      onChange={(e) => updateVariant(i, "sku", e.target.value)} 
                      placeholder="Variant SKU" 
                      className="w-full px-3 py-2 text-sm border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-500 bg-gray-50/50 outline-none font-mono" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Price</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">$</span>
                      <input 
                        type="number" 
                        step="0.01" 
                        value={v.price} 
                        onChange={(e) => updateVariant(i, "price", parseFloat(e.target.value) || 0)} 
                        placeholder="0.00" 
                        className="w-full pl-7 pr-3 py-2 text-sm border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-500 font-bold bg-gray-50/50 outline-none" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

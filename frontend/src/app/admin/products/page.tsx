"use client";

import React, { useState, useMemo } from "react";
import { 
  Package, 
  RefreshCcw, 
  Search, 
  Plus, 
  Trash2, 
  LayoutGrid, 
  Boxes, 
  Tag, 
  X 
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  emoji: string;
}

const INITIAL_PRODUCTS: Product[] = [
  { id: "1", name: "Premium Silk Scarf", category: "Accessories", price: 120, stock: 15, emoji: "🧣" },
  { id: "2", name: "Organic Face Cream", category: "Beauty", price: 85, stock: 5, emoji: "🧴" },
  { id: "3", name: "Artisan Leather Wallet", category: "Leather Goods", price: 150, stock: 0, emoji: "👛" },
  { id: "4", name: "Japanese Matcha Set", category: "Teaware", price: 95, stock: 24, emoji: "🍵" },
  { id: "5", name: "Hand-poured Candle", category: "Home Deco", price: 45, stock: 42, emoji: "🕯️" },
  { id: "6", name: "Velvet Night Mask", category: "Wellness", price: 30, stock: 8, emoji: "🌙" },
];

export default function ProductDashboard() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [activeTab, setActiveTab] = useState("All Products");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- Add Form State ---
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("Accessories");
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("");
  const [newEmoji, setNewEmoji] = useState("📦");

  // --- Logic ---
  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const removeProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPrice || !newStock) return;

    const newProd: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: newName,
      category: newCategory,
      price: parseFloat(newPrice),
      stock: parseInt(newStock),
      emoji: newEmoji
    };

    setProducts([newProd, ...products]);
    setIsModalOpen(false);
    // Reset form
    setNewName("");
    setNewPrice("");
    setNewStock("");
    setNewEmoji("📦");
  };

  const getStockStatus = (count: number) => {
    if (count === 0) return { label: "Out of Stock", color: "text-red-500 bg-red-50 border-red-100" };
    if (count < 10) return { label: "Low Stock", color: "text-orange-500 bg-orange-50 border-orange-100" };
    return { label: `${count} in stock`, color: "text-emerald-600 bg-emerald-50 border-emerald-100" };
  };

  return (
    <div className="min-h-screen bg-[#f4f4f0] text-[#0f2318] p-4 sm:p-10 font-sans">
      <style jsx global>{`
        h1, h2, h3, .heading-serif {
          font-family: Georgia, serif;
        }
      `}</style>

      {/* --- Page Header --- */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight">Products</h1>
          <p className="text-gray-500 font-medium">Manage your store products and inventory.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-3 bg-white hover:bg-gray-50 rounded-full shadow-sm border border-gray-100 transition-all active:scale-95">
            <RefreshCcw className="h-5 w-5 text-gray-400" />
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-8 py-3.5 bg-[#0f2318] hover:bg-[#1a3a29] text-white font-bold rounded-full shadow-xl shadow-[#0f2318]/20 transition-all hover:-translate-y-0.5 active:scale-95"
          >
            <Plus className="h-5 w-5" /> Add Product
          </button>
        </div>
      </div>

      {/* --- Tab Navigation --- */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="inline-flex flex-wrap p-2 bg-white/40 backdrop-blur-sm border border-white/50 rounded-[2rem] shadow-sm">
          {[
            { name: "All Products", icon: Package },
            { name: "Inventory", icon: Boxes },
            { name: "Categories", icon: LayoutGrid },
            { name: "Collections", icon: Tag },
          ].map((tab) => {
            const isActive = activeTab === tab.name;
            return (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`
                  flex items-center gap-3 px-8 py-4 rounded-[1.5rem] font-bold text-[13px] transition-all duration-300
                  ${isActive 
                    ? "bg-[#0f2318] text-white shadow-2xl shadow-[#0f2318]/40 -translate-y-0.5" 
                    : "text-gray-400 hover:text-[#0f2318] hover:bg-white/50"
                  }
                `}
              >
                <tab.icon className={cn(
                  "h-5 w-5 transition-transform duration-300",
                  isActive ? "text-emerald-400 scale-110" : "text-gray-300"
                )} />
                <span className="tracking-tight">{tab.name}</span>
                {isActive && (
                   <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* --- Main Card --- */}
      <div className="max-w-7xl mx-auto bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200 border border-white/50 overflow-hidden">
        {/* Card Header */}
        <div className="px-8 py-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-50">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">All Products</h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Manage your product catalog.</p>
          </div>
          <div className="relative group w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-[#0f2318] transition-colors" />
            <input 
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-[#0f2318] transition-all outline-none"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/50">
                <th className="pl-10 pr-6 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.25em]">Thumbnail</th>
                <th className="px-6 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.25em]">Product Specification</th>
                <th className="px-6 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.25em]">Collection</th>
                <th className="px-6 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.25em]">List Price</th>
                <th className="px-6 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.25em]">Inventory Status</th>
                <th className="pl-6 pr-10 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.25em] text-right">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {filteredProducts.map((p) => {
                const stock = getStockStatus(p.stock);
                return (
                  <tr key={p.id} className="group hover:bg-neutral-50/50 transition-all duration-300">
                    <td className="pl-10 pr-6 py-8">
                       <div className="relative">
                          <div className="w-20 h-20 bg-[#f4f4f0] rounded-[2rem] flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform duration-500 cursor-pointer">
                            {p.emoji}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md border border-neutral-100 opacity-0 group-hover:opacity-100 transition-opacity">
                             <Plus className="h-3 w-3 text-[#0f2318]" />
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-8">
                      <div className="flex flex-col gap-1">
                        <div className="text-lg font-heading font-black text-[#0f2318] group-hover:text-emerald-700 transition-colors cursor-pointer">{p.name}</div>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-mono font-bold text-neutral-300 uppercase tracking-widest bg-neutral-50 px-2 py-0.5 rounded">SKU-{p.id.toUpperCase()}</span>
                           <span className="h-1 w-1 rounded-full bg-neutral-200" />
                           <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest italic">Standard Edition</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-8">
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-neutral-100 text-[#0f2318] text-[11px] font-black rounded-xl shadow-sm group-hover:border-emerald-200 group-hover:bg-emerald-50/50 transition-all">
                        <Tag className="h-3 w-3 text-emerald-500" />
                        {p.category}
                      </span>
                    </td>
                    <td className="px-6 py-8">
                      <div className="flex flex-col">
                        <span className="text-2xl font-heading font-black text-[#0f2318]">€{p.price.toFixed(2)}</span>
                        <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Excl. Tax</span>
                      </div>
                    </td>
                    <td className="px-6 py-8">
                      <div className="space-y-2">
                        <div className={cn(
                          "inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-[0.1em] shadow-sm",
                          stock.color
                        )}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                          {stock.label}
                        </div>
                        <div className="w-32 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                           <div 
                             className={cn("h-full transition-all duration-1000", p.stock === 0 ? "bg-red-500" : "bg-emerald-500")} 
                             style={{ width: `${Math.min(p.stock * 2, 100)}%` }}
                           />
                        </div>
                      </div>
                    </td>
                    <td className="pl-6 pr-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="h-12 w-12 bg-white border border-neutral-100 rounded-2xl flex items-center justify-center text-neutral-400 hover:text-emerald-600 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/10 transition-all">
                           <RefreshCcw className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => removeProduct(p.id)}
                          className="h-12 w-12 bg-white border border-neutral-100 rounded-2xl flex items-center justify-center text-neutral-400 hover:text-rose-500 hover:border-rose-200 hover:shadow-lg hover:shadow-rose-500/10 transition-all"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-500">
                       <div className="w-20 h-20 bg-neutral-50 rounded-[2.5rem] flex items-center justify-center">
                          <Search className="h-8 w-8 text-neutral-200" />
                       </div>
                       <div className="space-y-1">
                          <p className="text-lg font-heading font-black text-neutral-900">No matching products</p>
                          <p className="text-sm font-medium text-neutral-400">Try adjusting your filters or search terms.</p>
                       </div>
                       <button onClick={() => setSearchQuery("")} className="mt-4 px-6 py-2.5 bg-[#0f2318] text-white text-[11px] font-black uppercase tracking-widest rounded-xl">Clear All Filters</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Add Product Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-[#0f2318]/90 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-500">
            {/* Modal Header */}
            <div className="bg-[#0f2318] p-10 relative">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20 blur-2xl" />
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <h2 className="text-4xl font-serif text-white tracking-tight">Add Product</h2>
              <p className="text-emerald-400/70 text-sm font-medium mt-1">Populate your luxury catalog.</p>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleAddProduct} className="p-10 space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-4">Product Name</label>
                  <input 
                    autoFocus
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g., Cashmere Sweater"
                    className="w-full h-16 rounded-full border-gray-100 bg-gray-50/50 px-8 text-sm outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-[#0f2318] transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-4">Category</label>
                    <select 
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full h-16 rounded-full border-gray-100 bg-gray-50/50 px-8 text-sm outline-none cursor-pointer focus:bg-white focus:border-[#0f2318] appearance-none"
                    >
                      {["Accessories", "Beauty", "Leather Goods", "Teaware", "Home Deco", "Wellness"].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-4">Symbol / Emoji</label>
                    <input 
                      value={newEmoji}
                      onChange={(e) => setNewEmoji(e.target.value)}
                      placeholder="📦"
                      className="w-full h-16 rounded-full border-gray-100 bg-gray-50/50 px-8 text-xl text-center outline-none focus:bg-white focus:border-[#0f2318]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-4">Price (€)</label>
                    <input 
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full h-16 rounded-full border-gray-100 bg-gray-50/50 px-8 text-sm outline-none font-bold focus:bg-white focus:border-[#0f2318]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-4">Stock Amount</label>
                    <input 
                      type="number"
                      required
                      min="0"
                      value={newStock}
                      onChange={(e) => setNewStock(e.target.value)}
                      placeholder="20"
                      className="w-full h-16 rounded-full border-gray-100 bg-gray-50/50 px-8 text-sm outline-none focus:bg-white focus:border-[#0f2318]"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-4 pt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 h-16 rounded-full text-gray-400 font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-2 grow h-16 rounded-full bg-[#0f2318] hover:bg-[#1a3a29] text-white font-bold shadow-xl shadow-[#0f2318]/20 active:scale-95 transition-all"
                >
                  Add to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

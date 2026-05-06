"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Command } from "cmdk";
import { 
  Search, 
  ShoppingBag, 
  Users, 
  ClipboardList, 
  Settings,
  LayoutDashboard,
  Package,
  User,
  ExternalLink,
  Loader2,
  Clock
} from "lucide-react";
import { useRouter } from "next/navigation";
import { navigationConfig } from "@/config/navigation.config";
import { useAuth } from "@/context/auth-context";
import { apiClient } from "@/lib/api-client";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ products: any[], orders: any[], users: any[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults(null);
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.get(`/search/admin?q=${encodeURIComponent(searchQuery)}`);
      if (response.data.success) {
        setResults(response.data.results);
      }
    } catch (error) {
      console.error("Admin search failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) handleSearch(query);
      else setResults(null);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  if (!user) return null;

  const handleSelect = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <Command.Dialog 
      open={open} 
      onOpenChange={setOpen} 
      label="Universal Admin Search"
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 pointer-events-none"
    >
      <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-md animate-in fade-in duration-300 pointer-events-auto" onClick={() => setOpen(false)} />
      
      <div className="relative w-full max-w-2xl bg-white rounded-[2rem] overflow-hidden border border-neutral-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] animate-in zoom-in-95 duration-300 pointer-events-auto flex flex-col">
        <div className="flex items-center border-b border-neutral-100 px-6 h-16 shrink-0">
          <Search className="h-5 w-5 text-neutral-400 mr-4" />
          <Command.Input 
            autoFocus
            placeholder="Search products, orders, customers, or navigate pages..." 
            value={query}
            onValueChange={setQuery}
            className="flex-1 bg-transparent border-none outline-none text-base placeholder:text-neutral-300 h-full font-medium"
          />
          <div className="flex items-center gap-3">
             {loading && <Loader2 className="size-4 animate-spin text-emerald-500" />}
             <div className="bg-neutral-100 rounded-lg px-2 py-1 text-[10px] font-black text-neutral-400 tracking-widest border border-neutral-200">
                ESC
             </div>
          </div>
        </div>

        <Command.List className="max-h-[450px] overflow-y-auto p-3 custom-scrollbar">
          <Command.Empty className="py-12 text-center flex flex-col items-center gap-3">
             <div className="size-12 rounded-2xl bg-neutral-50 flex items-center justify-center">
                <Search className="size-6 text-neutral-200" />
             </div>
             <p className="text-sm font-bold text-neutral-400">No matching records found.</p>
          </Command.Empty>

          {/* Navigation Results */}
          <Command.Group heading="Navigation" className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">
            {navigationConfig
                .filter(item => item.allowedRoles.includes(user.role))
                .filter(item => !query || item.label.toLowerCase().includes(query.toLowerCase()))
                .slice(0, 4)
                .map((item) => (
              <Command.Item
                key={item.href}
                value={`page-${item.label}`}
                className="flex items-center gap-4 px-4 py-3.5 rounded-2xl cursor-pointer aria-selected:bg-emerald-50 aria-selected:text-emerald-900 transition-all duration-200 group border border-transparent aria-selected:border-emerald-100 mb-1"
                onSelect={() => handleSelect(item.href)}
              >
                <div className="size-9 rounded-xl bg-neutral-100 flex items-center justify-center group-aria-selected:bg-white transition-colors">
                    <item.icon className="h-4 w-4 text-neutral-400 group-aria-selected:text-emerald-600" />
                </div>
                <span className="text-sm font-bold tracking-tight">{item.label}</span>
                <Badge className="ml-auto opacity-0 group-aria-selected:opacity-100 transition-opacity" />
              </Command.Item>
            ))}
          </Command.Group>

          {results && (
            <>
              {/* Product Results */}
              {results.products.length > 0 && (
                <Command.Group heading="Products" className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 mt-4 mb-2">
                  {results.products.map((p) => (
                    <Command.Item
                      key={p.id}
                      value={`product-${p.name}`}
                      className="flex items-center gap-4 px-4 py-3.5 rounded-2xl cursor-pointer aria-selected:bg-emerald-50 aria-selected:text-emerald-900 transition-all duration-200 group border border-transparent aria-selected:border-emerald-100 mb-1"
                      onSelect={() => handleSelect(`/dashboard/products/edit/${p.id}`)}
                    >
                      <div className="size-9 rounded-xl bg-neutral-100 flex items-center justify-center group-aria-selected:bg-white">
                        <Package className="h-4 w-4 text-neutral-400 group-aria-selected:text-emerald-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold tracking-tight">{p.name}</span>
                        <span className="text-[10px] text-neutral-400 uppercase font-black tracking-widest">{p.sku || "No SKU"}</span>
                      </div>
                      <span className="ml-auto text-[10px] font-black uppercase bg-neutral-100 px-2 py-0.5 rounded text-neutral-400 group-aria-selected:bg-white group-aria-selected:text-emerald-600">
                        {p.status}
                      </span>
                    </Command.Item>
                  ))}
                </Command.Group>
              )}

              {/* Order Results */}
              {results.orders.length > 0 && (
                <Command.Group heading="Orders" className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 mt-4 mb-2">
                  {results.orders.map((o) => (
                    <Command.Item
                      key={o.id}
                      value={`order-${o.id}`}
                      className="flex items-center gap-4 px-4 py-3.5 rounded-2xl cursor-pointer aria-selected:bg-emerald-50 aria-selected:text-emerald-900 transition-all duration-200 group border border-transparent aria-selected:border-emerald-100 mb-1"
                      onSelect={() => handleSelect(`/dashboard/orders/${o.id}`)}
                    >
                      <div className="size-9 rounded-xl bg-neutral-100 flex items-center justify-center group-aria-selected:bg-white">
                        <ClipboardList className="h-4 w-4 text-neutral-400 group-aria-selected:text-emerald-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold tracking-tight">Order #{o.id.slice(0, 8)}...</span>
                        <span className="text-[10px] text-neutral-400 uppercase font-black tracking-widest">{o.user?.email}</span>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="text-xs font-black text-neutral-900 group-aria-selected:text-emerald-900">${Number(o.totalAmount).toFixed(2)}</p>
                        <p className="text-[9px] text-neutral-400 uppercase font-black">{format(new Date(o.createdAt), "MMM dd")}</p>
                      </div>
                    </Command.Item>
                  ))}
                </Command.Group>
              )}

              {/* User Results */}
              {results.users.length > 0 && (
                <Command.Group heading="Customers" className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 mt-4 mb-2">
                  {results.users.map((u) => (
                    <Command.Item
                      key={u.id}
                      value={`user-${u.email}`}
                      className="flex items-center gap-4 px-4 py-3.5 rounded-2xl cursor-pointer aria-selected:bg-emerald-50 aria-selected:text-emerald-900 transition-all duration-200 group border border-transparent aria-selected:border-emerald-100 mb-1"
                      onSelect={() => handleSelect(`/dashboard/customers/${u.id}`)}
                    >
                      <div className="size-9 rounded-xl bg-neutral-100 flex items-center justify-center group-aria-selected:bg-white">
                        <User className="h-4 w-4 text-neutral-400 group-aria-selected:text-emerald-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold tracking-tight">{u.name || "Unnamed"}</span>
                        <span className="text-[10px] text-neutral-400 font-bold">{u.email}</span>
                      </div>
                      <span className="ml-auto text-[10px] font-black uppercase tracking-widest text-neutral-400 opacity-60">
                        {u.userRole?.name}
                      </span>
                    </Command.Item>
                  ))}
                </Command.Group>
              )}
            </>
          )}
        </Command.List>

        <div className="bg-neutral-50 border-t border-neutral-100 p-4 flex items-center justify-between text-[10px] font-bold text-neutral-400 px-8 shrink-0">
           <div className="flex items-center gap-6 uppercase tracking-[0.1em]">
              <span className="flex items-center gap-2"><kbd className="bg-white px-1.5 py-0.5 rounded border border-neutral-200 text-[9px] font-black text-neutral-400 shadow-sm">↑↓</kbd> Navigate</span>
              <span className="flex items-center gap-2"><kbd className="bg-white px-1.5 py-0.5 rounded border border-neutral-200 text-[9px] font-black text-neutral-400 shadow-sm">↵</kbd> Select</span>
           </div>
           <div className="uppercase tracking-[0.2em] text-emerald-600/60 flex items-center gap-2">
              <Clock className="size-3" />
              Real-time Intelligence
           </div>
        </div>
      </div>
    </Command.Dialog>
  );
}

function Badge({ className }: { className?: string }) {
    return (
        <div className={cn("px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase tracking-widest", className)}>
            Navigate
        </div>
    );
}

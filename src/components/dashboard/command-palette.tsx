"use client";

import React, { useEffect, useState } from "react";
import { Command } from "cmdk";
import { 
  Search, 
  ShoppingBag, 
  Users, 
  ClipboardList, 
  BookOpen, 
  MessageSquare,
  Settings,
  LayoutDashboard
} from "lucide-react";
import { useRouter } from "next/navigation";
import { navigationConfig } from "@/config/navigation.config";
import { useAuth } from "@/context/auth-context";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
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

  if (!user) return null;

  const handleSelect = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <Command.Dialog 
      open={open} 
      onOpenChange={setOpen} 
      label="Global Command Palette"
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 pointer-events-none"
    >
      <div className="fixed inset-0 bg-background/40 backdrop-blur-xl animate-in fade-in duration-300 pointer-events-auto" onClick={() => setOpen(false)} />
      
      <div className="relative w-full max-w-xl glass-card overflow-hidden border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300 pointer-events-auto">
        <div className="flex items-center border-b border-white/5 px-4 h-14">
          <Search className="h-5 w-5 text-muted-foreground mr-3" />
          <Command.Input 
            autoFocus
            placeholder="Type a command or search..." 
            className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/50 h-full"
          />
          <div className="bg-white/5 border border-white/10 rounded px-1.5 py-0.5 text-[10px] font-black text-muted-foreground tracking-widest">
            ESC
          </div>
        </div>

        <Command.List className="max-h-[300px] overflow-y-auto p-2">
          <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
            No results found.
          </Command.Empty>

          <Command.Group heading="Navigation" className="px-2 py-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-1">
            {navigationConfig.filter(item => item.allowedRoles.includes(user.role)).map((item) => (
              <Command.Item
                key={item.href}
                className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer aria-selected:bg-primary/10 aria-selected:text-primary transition-all duration-200 group"
                onSelect={() => handleSelect(item.href)}
              >
                <item.icon className="h-4 w-4 text-muted-foreground group-aria-selected:text-primary" />
                <span className="text-sm font-bold tracking-tight">{item.label}</span>
                <span className="ml-auto text-[10px] text-muted-foreground opacity-0 group-aria-selected:opacity-100 transition-opacity">GO TO</span>
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group heading="Actions" className="px-2 py-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mt-2 mb-1">
             <Command.Item
                className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer aria-selected:bg-primary/10 aria-selected:text-primary transition-all duration-200 group"
                onSelect={() => setOpen(false)}
              >
                <Settings className="h-4 w-4 text-muted-foreground group-aria-selected:text-primary" />
                <span className="text-sm font-bold tracking-tight">Open Settings</span>
              </Command.Item>
          </Command.Group>
        </Command.List>

        <div className="bg-white/5 border-t border-white/5 p-3 flex items-center justify-between text-[10px] font-bold text-muted-foreground/40 px-5">
           <div className="flex items-center gap-4 uppercase tracking-[0.1em]">
              <span className="flex items-center gap-1.5"><kbd className="bg-white/5 px-1.5 py-0.5 rounded border border-white/10 text-[9px] font-black text-muted-foreground/60">↑↓</kbd> Navigate</span>
              <span className="flex items-center gap-1.5"><kbd className="bg-white/5 px-1.5 py-0.5 rounded border border-white/10 text-[9px] font-black text-muted-foreground/60">↵</kbd> Select</span>
           </div>
           <div className="uppercase tracking-[0.1em]">Sharcly Smart Search</div>
        </div>
      </div>
    </Command.Dialog>
  );
}

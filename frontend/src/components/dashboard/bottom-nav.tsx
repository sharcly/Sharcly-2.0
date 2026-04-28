"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home as HomeIcon, 
  Search as SearchIcon, 
  User as UserIcon,
  ShoppingCart as CartIcon,
  LayoutGrid,
  Sparkles,
  Zap,
  Wind,
  Target,
  Info,
  Beaker,
  BookOpen,
  HelpCircle,
  Mail,
  Building2,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    { label: "Home", href: "/", icon: HomeIcon },
    { label: "Category", isDrawer: true, icon: LayoutGrid },
    { label: "Search", href: "/search", icon: SearchIcon },
    { label: "Account", href: user ? "/dashboard" : "/login", icon: UserIcon },
    { label: "Cart", href: "/cart", icon: CartIcon },
  ];

  return (
    <div className="md:hidden fixed bottom-6 left-0 right-0 z-50 px-4 pointer-events-none">
      <nav className="glass-card rounded-3xl h-18 flex items-center justify-around px-2 shadow-[0_20px_50px_rgba(0,0,0,0.3)] pointer-events-auto border border-white/5 mx-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          if (item.isDrawer) {
            return (
              <Sheet key={item.label}>
                <SheetTrigger asChild>
                  <button className="flex flex-col items-center justify-center gap-1.5 transition-all duration-300 w-14 h-full rounded-2xl active:scale-90 text-muted-foreground hover:text-primary">
                    <item.icon className="h-5 w-5" />
                    <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
                  </button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh] rounded-t-[2.5rem] border-t border-primary/10 glass p-0 overflow-hidden">
                  <div className="h-full bg-background/50 backdrop-blur-3xl flex flex-col">
                    <div className="p-8 border-b border-primary/5 flex items-center justify-between">
                       <h2 className="text-xl font-black tracking-tighter uppercase">Market Taxonomy</h2>
                       <div className="h-1 w-12 bg-primary/20 rounded-full" />
                    </div>
                    <ScrollArea className="flex-1 p-8">
                       <div className="space-y-10 pb-20">
                          <div className="space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40">Exclusive Series</p>
                            <div className="grid grid-cols-2 gap-3">
                               {[
                                 { name: "Chill", icon: Sparkles, color: "text-sky-400", href: "/products/series-chill" },
                                 { name: "Lift", icon: Zap, color: "text-orange-400", href: "/products/series-lift" },
                                 { name: "Entourage", icon: Wind, color: "text-emerald-400", href: "/products/series-entourage" },
                                 { name: "Balance", icon: Target, color: "text-purple-400", href: "/products/series-balance" }
                               ].map((series) => (
                                 <Link key={series.name} href={series.href} className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col gap-2 group active:scale-95 transition-all">
                                    <series.icon className={cn("h-5 w-5", series.color)} />
                                    <span className="text-sm font-black tracking-tight">{series.name}</span>
                                 </Link>
                               ))}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40">Form Factors</p>
                            <div className="space-y-1">
                               <Link href="/products/gummies" className="flex items-center justify-between p-4 rounded-2xl hover:bg-primary/5 transition-colors">
                                  <span className="font-bold">Gummies</span>
                                  <ChevronRight className="h-4 w-4 text-primary/40" />
                               </Link>
                               <Link href="/products/vapes" className="flex items-center justify-between p-4 rounded-2xl hover:bg-primary/5 transition-colors">
                                  <span className="font-bold">Vapes</span>
                                  <ChevronRight className="h-4 w-4 text-primary/40" />
                                </Link>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40">Knowledge</p>
                            <div className="grid grid-cols-3 gap-2">
                               <Link href="/about" className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-primary/5 border border-primary/5">
                                  <Info className="h-4 w-4 text-primary" />
                                  <span className="text-[9px] font-black uppercase">About</span>
                               </Link>
                               <Link href="/lab-results" className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-primary/5 border border-primary/5">
                                  <Beaker className="h-4 w-4 text-primary" />
                                  <span className="text-[9px] font-black uppercase text-center">Labs</span>
                               </Link>
                               <Link href="/blog" className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-primary/5 border border-primary/5">
                                  <BookOpen className="h-4 w-4 text-primary" />
                                  <span className="text-[9px] font-black uppercase">Journal</span>
                               </Link>
                            </div>
                          </div>
                       </div>
                    </ScrollArea>
                  </div>
                </SheetContent>
              </Sheet>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href!}
              className={cn(
                "flex flex-col items-center justify-center gap-1.5 transition-all duration-300 w-14 h-full rounded-2xl relative",
                isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
              {isActive && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-primary rounded-full blur-[2px]" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

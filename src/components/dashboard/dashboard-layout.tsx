"use client";

import { Sidebar, DashboardNav } from "./sidebar";
import { MobileBottomNav } from "./bottom-nav";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Bell, 
  Search, 
  Settings, 
  ShieldCheck, 
  Activity, 
  FlaskConical, 
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  ShoppingBag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CommandPalette } from "./command-palette";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login");
      } else if (user.role === "user") {
        router.push("/");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-white text-[#062D1B]">
        <div className="flex flex-col items-center gap-10">
          <div className="size-20 p-5 rounded-[2.5rem] bg-emerald-50 border border-emerald-100 shadow-sharcly flex items-center justify-center">
             <ShoppingBag className="size-10 text-emerald-800" />
          </div>
          <div className="flex flex-col items-center gap-4">
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-900/40">Initializing Sharcly</p>
             <div className="h-1.5 w-48 bg-emerald-50 overflow-hidden rounded-full border border-emerald-100/50 relative">
                <motion.div 
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  className="absolute inset-y-0 w-1/2 bg-emerald-500"
                />
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F9FAFB] text-foreground overflow-hidden font-body selection:bg-primary/10">
      <Sidebar />
      <CommandPalette />
      
      <main className="flex-1 flex flex-col min-w-0 h-full relative z-10">
        {/* Workspace Signature Header */}
        <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-black/5 bg-white/80 backdrop-blur-3xl z-30 shrink-0">
          <div className="flex items-center gap-4 md:gap-6 min-w-0">
             <div className="hidden lg:block">
                <Breadcrumbs />
             </div>
             <div className="lg:hidden flex items-center gap-3">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-10 rounded-xl hover:bg-black/5 lg:hidden border border-black/[0.03]">
                       <Menu className="size-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="p-0 bg-[#111827] border-white/5 w-[280px]">
                    <SheetHeader className="sr-only">
                      <SheetTitle>Navigation Menu</SheetTitle>
                    </SheetHeader>
                    <DashboardNav onItemClick={() => setIsMobileMenuOpen(false)} />
                  </SheetContent>
                </Sheet>
                <div className="h-6 w-px bg-black/[0.05] md:hidden" />
                <Activity className="size-5 text-black" />
                <span className="font-heading text-lg md:text-xl font-bold tracking-tight text-black truncate">{title || user.role}</span>
             </div>
          </div>

          <div className="flex items-center gap-8 shrink-0">
            {/* Search Bar */}
            <div 
              className="hidden md:flex items-center gap-3 px-4 h-10 rounded-lg bg-black/[0.03] border border-black/5 text-black/40 cursor-pointer hover:bg-black/[0.06] transition-all group w-[280px]" 
              onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
            >
              <Search className="h-4 w-4 group-hover:text-emerald-600 transition-colors" />
              <span className="text-xs font-medium flex-1">Search for anything...</span>
              <div className="flex items-center gap-1 opacity-60">
                <kbd className="bg-white rounded px-1.5 py-0.5 text-[10px] font-bold border border-black/5 text-black">⌘</kbd>
                <kbd className="bg-white rounded px-1.5 py-0.5 text-[10px] font-bold border border-black/5 text-black">K</kbd>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative size-9 rounded-lg hover:bg-black/[0.03] text-black/40 hover:text-black transition-colors group">
                <Bell className="h-4 w-4" />
                <span className="absolute top-2.5 right-2.5 size-1.5 bg-blue-500 rounded-full ring-2 ring-white" />
              </Button>
              
              <Button variant="ghost" size="icon" className="size-9 rounded-lg hover:bg-black/[0.03] text-black/40 hover:text-black transition-colors hidden lg:flex">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="h-8 w-px bg-black/[0.05]" />
            
            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="flex items-center gap-3 group cursor-pointer hover:bg-black/[0.02] p-1.5 rounded-xl transition-all border-none bg-transparent outline-none ring-0">
                  <div className="text-right hidden xl:block">
                    <p className="text-sm font-semibold text-black">{user.name}</p>
                    <p className="text-[10px] text-black/30 font-medium uppercase tracking-wider text-right">{user.role}</p>
                  </div>
                  <div className="size-9 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                      {user.name?.[0]}
                  </div>
                  <ChevronDown className="size-4 text-black/20 group-hover:text-black/40 transition-colors" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl border-black/5 p-2 shadow-2xl">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="px-3 py-2 text-[10px] uppercase font-black text-black/40">Account Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-black/5" />
                  <DropdownMenuItem asChild className="rounded-xl py-3 cursor-pointer focus:bg-black/5 font-bold gap-3">
                    <Link href="/dashboard/settings/profile">
                      <User className="size-4" /> My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl py-3 cursor-pointer focus:bg-black/5 font-bold gap-3">
                    <Link href="/dashboard/settings">
                      <Settings className="size-4" /> Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-black/5" />
                  <DropdownMenuItem 
                    onSelect={() => logout()} 
                    className="rounded-xl py-3 cursor-pointer focus:bg-rose-50 focus:text-rose-500 font-bold gap-3 text-rose-500"
                  >
                    <LogOut className="size-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 custom-scrollbar pb-32 h-full">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-7xl h-full"
          >
            {children}
          </motion.div>
        </div>
      </main>


    </div>
  );
}


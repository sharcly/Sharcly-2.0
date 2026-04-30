"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  FlaskConical,
  Activity,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/auth-context";
import { getVisibleNavItems } from "@/lib/permissions";

interface SidebarProps {
  className?: string;
}

interface DashboardNavProps {
  isCollapsed?: boolean;
  onItemClick?: () => void;
}

export function DashboardNav({ isCollapsed = false, onItemClick }: DashboardNavProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!user) return null;

  const navItems = getVisibleNavItems(user.role);
  const groupedNavItems = navItems.reduce((acc, item) => {
    const category = item.category || "General";
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, typeof navItems>);

  return (
    <div className="flex flex-col h-full bg-[#111827] border-black/5 relative group/sidebar rounded-r-3xl md:rounded-none">
      {/* Branding */}
      <div className={cn(
        "flex items-center px-6 h-20 mb-2 border-b border-white/5 overflow-hidden transition-all duration-300 group/brand",
        isCollapsed ? "justify-center" : "justify-start"
      )}>
        <motion.div
          layout
          className="flex items-center w-full"
        >
          {isCollapsed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="size-10 rounded-xl bg-gradient-to-br from-blue-600/20 to-blue-400/5 border border-white/10 flex items-center justify-center font-heading text-xl font-bold text-white shadow-lg shadow-blue-500/5 shrink-0 ring-1 ring-white/5 group-hover/brand:shadow-blue-500/20 group-hover/brand:scale-105 transition-all duration-500"
            >
              S
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center"
            >
              <img
                src="https://cdn.mignite.app/ws/works_01KM0WR2ZSKYNHV0ZE2MPNM9EF/final-Logo-1--01KM5Y2NCW8720B30G9G0XW18Y.png"
                alt="Sharcly"
                className="h-25 w-auto brightness-0 invert opacity-90 group-hover/brand:opacity-100 transition-opacity"
              />
            </motion.div>
          )}
        </motion.div>
      </div>

      <ScrollArea className="flex-1 min-h-0 px-4">
        <div className="space-y-8 py-6 pb-5">
          {Object.entries(groupedNavItems).map(([category, items]) => (
            <div key={category} className="space-y-6">
              {!isCollapsed && (
                <div className="px-4 mb-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-white/20">
                    {category}
                  </p>
                </div>
              )}
              <div className="space-y-2">
                {items.map((item) => {
                  const isActive = item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname === item.href || pathname?.startsWith(item.href + "/");
                  return (
                    <Button
                      key={item.href}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-3 transition-all duration-300 group relative h-10 mb-1",
                        isCollapsed ? "px-0 justify-center" : "px-4 rounded-xl",
                        isActive
                          ? "bg-white/[0.1] text-white shadow-[inset_0_0_10px_rgba(255,255,255,0.02)] hover:bg-white/[0.14]"
                          : "text-zinc-500 hover:bg-white/[0.05] hover:text-white"
                      )}
                      asChild
                      onClick={onItemClick}
                    >
                      <Link href={item.href} className="flex items-center w-full">
                        <item.icon className={cn(
                          "size-4 shrink-0 transition-all duration-300",
                          isActive ? "text-blue-400 scale-110" : "group-hover:text-white group-hover:scale-110"
                        )} />
                        {!isCollapsed && (
                          <span className={cn(
                            "text-sm font-medium transition-all duration-300 ml-1",
                            isActive ? "text-white translate-x-1" : "text-zinc-500 group-hover:text-white group-hover:translate-x-1"
                          )}>
                            {item.label}
                          </span>
                        )}
                        {isCollapsed && (
                          <div className="absolute left-full ml-4 opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 bg-[#0a0a0c] text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest whitespace-nowrap border border-white/10 transition-all duration-300 pointer-events-none z-50 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                            {item.label}
                            <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#0a0a0c] border-l border-b border-white/10 rotate-45" />
                          </div>
                        )}
                        {isActive && (
                          <div className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full shadow-[4px_0_15px_rgba(59,130,246,0.8)]" />
                        )}
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* User Section */}
      <div className="p-4 mt-auto border-t border-white/5">
        <Link
          href="/dashboard/settings"
          className={cn(
            "flex items-center gap-3 p-2 rounded-xl transition-all duration-300 hover:bg-white/[0.06] group/settings mb-2",
            isCollapsed ? "justify-center" : "px-3"
          )}
        >
          <div className="size-8 rounded-lg bg-white/5 border border-white/10 text-zinc-500 flex items-center justify-center shrink-0 group-hover/settings:text-white group-hover/settings:bg-white/10 group-hover/settings:scale-110 transition-all duration-300">
            <Settings className="size-4" />
          </div>
          {isCollapsed && (
            <div className="absolute left-full ml-4 opacity-0 translate-x-[-10px] group-hover/settings:opacity-100 group-hover/settings:translate-x-0 bg-[#0a0a0c] text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest whitespace-nowrap border border-white/10 transition-all duration-300 pointer-events-none z-50 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              Workspace Settings
              <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#0a0a0c] border-l border-b border-white/10 rotate-45" />
            </div>
          )}
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-zinc-400 group-hover/settings:text-white group-hover:translate-x-0.5 transition-all duration-300">Workspace Settings</span>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/10 group-hover/settings:text-white/30 transition-colors">Operational Keys</span>
            </div>
          )}
        </Link>

        <Link
          href="/dashboard/settings"
          className={cn(
            "flex items-center gap-3 p-2 rounded-xl transition-all duration-300 hover:bg-white/[0.06] group/user",
            isCollapsed ? "justify-center" : "px-3"
          )}
        >
          {/* <div className="size-8 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(59,130,246,0.3)] shrink-0 group-hover/user:scale-110 group-hover/user:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-500">
            {user.name?.[0]?.toUpperCase() || "U"}
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-zinc-200 truncate group-hover/user:text-white group-hover:translate-x-0.5 transition-all duration-300">{user.name}</span>
              <span className="text-[10px] font-medium text-white/20 uppercase tracking-wider group-hover/user:text-blue-400/60 transition-colors">My Profile</span>
            </div>
          )} */}
        </Link>

        {!isCollapsed && (
          <Button
            variant="ghost"
            className="w-full mt-4 h-9 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 text-[10px] font-bold uppercase tracking-widest justify-start px-3 gap-3 transition-all duration-300 group/logout"
            onClick={logout}
          >
            <LogOut className="h-4 w-4 transition-transform group-hover/logout:-translate-x-0.5" />
            <span>Sign Out</span>
          </Button>
        )}
      </div>
    </div>
  );
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <aside
      className={cn(
        "hidden md:block transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] z-40 h-screen sticky top-0",
        isCollapsed ? "w-20" : "w-64",
        className
      )}
    >
      <DashboardNav isCollapsed={isCollapsed} />
      <Button
        variant="outline"
        size="icon"
        className="absolute -right-5 top-12 size-10 rounded-full border border-black/5 bg-white text-primary shadow-sharcly z-50 hover:bg-primary hover:text-white transition-all duration-500 hover:scale-110"
        onClick={toggleSidebar}
      >
        {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
      </Button>
    </aside>
  );
}


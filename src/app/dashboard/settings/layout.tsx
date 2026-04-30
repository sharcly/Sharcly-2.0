"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ArrowLeft, 
  Store, 
  Users, 
  Globe, 
  Receipt, 
  RotateCcw, 
  Undo2, 
  Share2, 
  Tag, 
  MapPin, 
  Type,
  ChevronRight,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const settingsGroups = [
  {
    title: "Store Settings",
    items: [
      { label: "Profile", href: "/dashboard/settings/profile", icon: User },
      { label: "Business Details", href: "/dashboard/settings/store", icon: Store },
      { label: "Design & Themes", href: "/dashboard/settings/design", icon: Globe },
      { label: "Shipping Rates", href: "/dashboard/settings/shipping", icon: MapPin },
      { label: "Tax Configuration", href: "/dashboard/settings/taxes", icon: Receipt },
    ]
  },
  {
    title: "Platform",
    items: [
      { label: "User Management", href: "/dashboard/settings/users", icon: Users },
      { label: "Store Regions", href: "/dashboard/settings/regions", icon: Globe },
      { label: "API Integrations", href: "/dashboard/settings/integrations", icon: Share2 },
    ]
  }
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      {/* Settings Header */}
      <div className="flex items-center gap-6 py-10 border-b border-black/5 mb-8">
        <Button variant="ghost" size="icon" asChild className="rounded-2xl hover:bg-black/5 size-12 transition-all border border-black/5">
          <Link href="/dashboard">
            <ArrowLeft className="h-5 w-5 text-neutral-400" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Settings</h1>
          <p className="text-sm text-neutral-400 font-medium mt-1">Manage your store preferences and account security.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 flex-1 overflow-hidden">
        {/* Settings Sidebar */}
        <aside className="w-full lg:w-80 shrink-0">
          <ScrollArea className="w-full lg:h-full lg:pr-6">
            <div className="flex lg:flex-col gap-10 pb-8">
              {settingsGroups.map((group) => (
                <div key={group.title} className="space-y-4">
                  <div className="px-4">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-300">
                      {group.title}
                    </p>
                  </div>
                  <nav className="flex lg:flex-col gap-1 lg:space-y-1">
                    {group.items.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 px-4 py-2.5 lg:py-3 lg:justify-between rounded-xl transition-all duration-300 group whitespace-nowrap lg:whitespace-normal",
                            isActive 
                              ? "bg-white shadow-sm ring-1 ring-black/5 text-neutral-900" 
                              : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
                          )}
                        >
                          <div className="flex items-center gap-3 md:gap-4">
                            <item.icon className={cn(
                              "size-4 md:size-5 transition-colors",
                              isActive ? "text-blue-600" : "text-neutral-300 group-hover:text-neutral-600"
                            )} />
                            <span className="text-xs md:text-sm font-bold">{item.label}</span>
                          </div>
                          {isActive && <ChevronRight className="hidden lg:block h-4 w-4 text-neutral-300" />}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              ))}
            </div>
          </ScrollArea>
        </aside>

        {/* Settings Content */}
        <main className="flex-1 overflow-y-auto lg:pr-4 custom-scrollbar pb-10">
           <div className="max-w-4xl mx-auto">
             {children}
           </div>
        </main>
      </div>
    </div>
  );
}


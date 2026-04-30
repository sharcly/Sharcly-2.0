"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export function Breadcrumbs() {
  const pathname = usePathname();
  if (pathname === "/" || pathname === "/dashboard") return null;

  const paths = pathname.split("/").filter(Boolean);

  return (
    <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-6">
      <Link 
        href="/dashboard" 
        className="hover:text-primary transition-colors flex items-center gap-1.5"
      >
        <Home className="h-3 w-3" />
        <span>Home</span>
      </Link>
      
      {paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join("/")}`;
        const isLast = index === paths.length - 1;
        const label = path.replace(/-/g, " ");

        if (path === "dashboard") return null;

        return (
          <React.Fragment key={href}>
            <ChevronRight className="h-3 w-3 opacity-30" />
            {isLast ? (
              <span className="text-primary font-black tracking-[0.2em]">{label}</span>
            ) : (
              <Link href={href} className="hover:text-primary transition-colors">
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

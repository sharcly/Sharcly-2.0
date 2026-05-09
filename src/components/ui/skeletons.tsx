"use client";

import React from "react";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────
   Base pulse shimmer — Dark Botanical theme
 ───────────────────────────────────────── */
function Shimmer({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-[rgba(239,248,238,0.035)]",
        "before:absolute before:inset-0 before:-translate-x-full",
        "before:bg-gradient-to-r before:from-transparent before:via-white/[0.08] before:to-transparent",
        "before:animate-[shimmer_1.5s_infinite]",
        className
      )}
      style={style}
    />
  );
}

/* ─────────────────────────────────────────
   Product Card Skeleton
   Matches ProductCard layout exactly
 ───────────────────────────────────────── */
export function ProductCardSkeleton({ viewMode = "grid" }: { viewMode?: "grid" | "list" }) {
  const isList = viewMode === "list";
  return (
    <div className={cn(
      "flex bg-[var(--card)] border border-[var(--border)] rounded-[20px] overflow-hidden",
      isList ? "flex-col sm:flex-row min-h-[180px]" : "flex-col h-full"
    )}>
      {/* Image zone */}
      <div className={cn(
        "relative bg-[linear-gradient(145deg,rgba(8,47,29,0.3),rgba(4,14,7,0.5))]",
        isList ? "aspect-square sm:aspect-auto sm:w-[240px] shrink-0" : "aspect-square w-full"
      )}>
        <Shimmer className="absolute inset-0 rounded-none opacity-40" />
        {/* Series Badge placeholder */}
        <div className="absolute top-[13px] left-[13px]">
          <Shimmer className="h-5 w-16 rounded-full" />
        </div>
      </div>

      {/* Card body */}
      <div className={cn(
        "p-[18px] pb-[16px] flex flex-col gap-[10px] relative z-[1] flex-1",
        isList ? "border-t sm:border-t-0 sm:border-l border-[var(--border)]" : "border-t border-[var(--border)]"
      )}>
        <div className="flex flex-col gap-[10px] flex-1">
          <div className="flex justify-between items-start gap-2">
            <Shimmer className="h-4 w-3/4 rounded-lg" />
            <Shimmer className="h-6 w-12 rounded-lg" />
          </div>
          
          {/* Star ratings placeholder */}
          <div className="flex items-center gap-1">
             <Shimmer className="h-3 w-20 rounded" />
             <Shimmer className="h-3 w-8 rounded" />
          </div>

          {isList && (
            <div className="space-y-2 mt-2">
              <Shimmer className="h-3 w-full rounded" />
              <Shimmer className="h-3 w-4/5 rounded" />
            </div>
          )}
        </div>

        {/* Footer row: Potency + ATC */}
        <div className="mt-auto pt-[10px] border-t border-[var(--border)] flex justify-between items-center gap-2">
          <Shimmer className="h-3 w-24 rounded" />
          <Shimmer className="h-8 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Product Grid Skeleton
 ───────────────────────────────────────── */
export function ProductGridSkeleton({ count = 8, viewMode = "grid" }: { count?: number; viewMode?: "grid" | "list" }) {
  return (
    <div className={cn(
      "grid gap-6 md:gap-8",
      viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
    )}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <ProductCardSkeleton viewMode={viewMode} />
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   Product Detail Page Skeleton
   Refined to match the 7:5 layout
 ───────────────────────────────────────── */
export function ProductDetailSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2">
        <Shimmer className="h-3 w-16 rounded" />
        <Shimmer className="h-3 w-4 rounded" />
        <Shimmer className="h-3 w-24 rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        {/* LEFT: Gallery (7 cols) */}
        <div className="lg:col-span-7 flex flex-col md:flex-row gap-4">
          {/* Thumbnails */}
          <div className="hidden md:flex flex-col gap-2.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <Shimmer key={i} className="w-[72px] h-[72px] rounded-xl" />
            ))}
          </div>
          {/* Main Card */}
          <Shimmer className="flex-1 aspect-[1/1.1] rounded-[24px]" />
          {/* Mobile Thumbnails */}
          <div className="flex md:hidden gap-2.5 pt-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Shimmer key={i} className="size-16 rounded-xl" />
            ))}
          </div>
        </div>

        {/* RIGHT: Info Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-8">
          {/* Status Pills */}
          <div className="flex gap-3">
            <Shimmer className="h-7 w-24 rounded-full" />
            <Shimmer className="h-7 w-28 rounded-full" />
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-3">
            <Shimmer className="h-12 w-full rounded-xl" />
            <Shimmer className="h-12 w-4/5 rounded-xl" />
            <Shimmer className="h-4 w-48 rounded" />
          </div>

          {/* Rating Row */}
          <div className="flex items-center gap-3 pb-6 border-b border-white/5">
            <Shimmer className="h-5 w-24 rounded" />
            <Shimmer className="h-5 w-16 rounded" />
            <div className="w-px h-4 bg-white/5" />
            <Shimmer className="h-5 w-20 rounded" />
          </div>

          {/* Price Block */}
          <div className="space-y-2">
            <Shimmer className="h-14 w-32 rounded-xl" />
            <Shimmer className="h-3 w-48 rounded" />
          </div>

          {/* Description Card */}
          <Shimmer className="h-24 w-full rounded-2xl" />

          {/* Configuration Selector */}
          <div className="space-y-4">
            <Shimmer className="h-3 w-28 rounded" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Shimmer key={i} className="h-16 rounded-xl" />
              ))}
            </div>
          </div>

          {/* Quantity + Add to Cart Row */}
          <div className="flex items-center gap-3">
            <Shimmer className="w-32 h-13 rounded-xl shrink-0" />
            <Shimmer className="flex-1 h-13 rounded-xl" />
            <Shimmer className="size-13 rounded-xl shrink-0" />
          </div>

          {/* Trust Chips Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <Shimmer className="size-8 rounded-lg shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Shimmer className="h-2.5 w-3/4 rounded" />
                  <Shimmer className="h-2 w-1/2 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Dashboard / Utility Skeletons
 ───────────────────────────────────────── */
export function OrderRowSkeleton() {
  return (
    <tr className="border-b border-white/5">
      <td className="px-10 py-8"><Shimmer className="h-3.5 w-28 rounded-md" /></td>
      <td className="px-10 py-8"><Shimmer className="h-3.5 w-24 rounded-md" /></td>
      <td className="px-10 py-8"><Shimmer className="h-6 w-20 rounded-full" /></td>
      <td className="px-10 py-8"><Shimmer className="h-3.5 w-16 rounded-md" /></td>
      <td className="px-10 py-8 text-right flex justify-end"><Shimmer className="h-3.5 w-16 rounded-md" /></td>
    </tr>
  );
}

export function OrderTableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="bg-[#0d2518] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#040e07]/50 border-b border-white/5">
            <tr>
              {["Reference", "Date", "Status", "Investment", "Actions"].map((h) => (
                <th key={h} className="px-10 py-6">
                  <Shimmer className="h-2.5 w-16 rounded" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {Array.from({ length: rows }).map((_, i) => (
              <OrderRowSkeleton key={i} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Shimmer className="aspect-[16/9] rounded-[1.5rem] w-full" />
      <div className="space-y-2.5 px-1">
        <div className="flex gap-2 items-center">
          <Shimmer className="h-5 w-16 rounded-full" />
          <Shimmer className="h-3 w-20 rounded" />
        </div>
        <Shimmer className="h-5 w-full rounded-lg" />
        <Shimmer className="h-5 w-4/5 rounded-lg" />
        <Shimmer className="h-3.5 w-2/3 rounded" />
      </div>
    </div>
  );
}

export function BlogGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <BlogCardSkeleton />
        </div>
      ))}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl p-6 border border-white/5 bg-white/[0.03]">
      <div className="flex items-start justify-between mb-4">
        <Shimmer className="h-3 w-24 rounded" />
        <Shimmer className="size-9 rounded-xl" />
      </div>
      <Shimmer className="h-8 w-32 rounded-lg mb-2" />
      <Shimmer className="h-3 w-20 rounded" />
    </div>
  );
}

export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="border-b border-white/5">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <Shimmer className={cn("h-3.5 rounded-md", i === 0 ? "w-32" : i === cols - 1 ? "w-16" : "w-24")} />
        </td>
      ))}
    </tr>
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/5 bg-white/[0.02]">
      <table className="w-full">
        <thead className="border-b border-white/5">
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="px-6 py-4 text-left">
                <Shimmer className="h-2.5 w-20 rounded" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {Array.from({ length: rows }).map((_, i) => (
            <TableRowSkeleton key={i} cols={cols} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AccountProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <Shimmer className="size-20 rounded-full shrink-0" />
        <div className="space-y-2 flex-1">
          <Shimmer className="h-6 w-48 rounded-lg" />
          <Shimmer className="h-3.5 w-36 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Shimmer className="h-3 w-16 rounded" />
            <Shimmer className="h-12 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

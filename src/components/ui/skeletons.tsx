"use client";

import React from "react";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────
   Base pulse shimmer — Dark Botanical theme
───────────────────────────────────────── */
function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl",
        "before:absolute before:inset-0 before:-translate-x-full",
        "before:bg-gradient-to-r before:from-transparent before:via-white/[0.04] before:to-transparent",
        "before:animate-[shimmer_1.8s_infinite]",
        className
      )}
      style={{ background: "rgba(239,248,238,0.04)" }}
    />
  );
}

/* ─────────────────────────────────────────
   Product Card Skeleton
   Matches ProductCard aspect-[4/5] layout
───────────────────────────────────────── */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col h-full">
      {/* Image area */}
      <Shimmer className="aspect-[4/5] rounded-[20px] mb-5 w-full" />
      {/* Name */}
      <Shimmer className="h-4 w-3/4 rounded-lg mb-2" />
      {/* Price */}
      <Shimmer className="h-3.5 w-1/3 rounded-lg" />
    </div>
  );
}

/* ─────────────────────────────────────────
   Product Grid Skeleton (8 cards)
───────────────────────────────────────── */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-in fade-in"
          style={{ animationDelay: `${i * 40}ms`, animationFillMode: "both" }}
        >
          <ProductCardSkeleton />
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   Order Row Skeleton — for order history table
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

/* ─────────────────────────────────────────
   Blog Card Skeleton — matches blog grid layout
───────────────────────────────────────── */
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
        <div
          key={i}
          className="animate-in fade-in"
          style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
        >
          <BlogCardSkeleton />
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   Dashboard Stats Skeleton — 4 stat cards
───────────────────────────────────────── */
export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl p-6 border border-white/5" style={{ background: "rgba(239,248,238,0.03)" }}>
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

/* ─────────────────────────────────────────
   Dashboard Table Row Skeleton
───────────────────────────────────────── */
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
    <div className="rounded-2xl overflow-hidden border border-white/5" style={{ background: "rgba(239,248,238,0.02)" }}>
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

/* ─────────────────────────────────────────
   Account Page Skeleton — profile info
───────────────────────────────────────── */
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

/* ─────────────────────────────────────────
   Product Detail Page Skeleton
   Mirrors: gallery | thumbnails | badge | title | price |
            description | variant grid | qty+CTA | promises | tabs
───────────────────────────────────────── */
export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

      {/* LEFT: Gallery */}
      <div className="space-y-3">
        {/* Main image */}
        <Shimmer
          className="aspect-square w-full rounded-[20px]"
          style={{ border: '1px solid rgba(239,248,238,0.06)' } as React.CSSProperties}
        />
        {/* Thumbnails row */}
        <div className="flex justify-center gap-3 pt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Shimmer key={i} className="size-16 md:size-20 rounded-xl shrink-0" />
          ))}
        </div>
      </div>

      {/* RIGHT: Info Panel */}
      <div className="space-y-8 lg:pt-2">

        {/* Badge line: dot + "In Stock · Lab Verified" */}
        <div className="flex items-center gap-2">
          <div
            className="size-1.5 rounded-full"
            style={{ background: 'rgba(232,197,71,0.3)' }}
          />
          <Shimmer className="h-3 w-36 rounded-full" />
        </div>

        {/* Title */}
        <div className="space-y-3">
          <Shimmer className="h-9 w-4/5 rounded-xl" />
          <Shimmer className="h-9 w-3/5 rounded-xl" />
          {/* Subtitle / variant name */}
          <Shimmer className="h-4 w-32 rounded-lg" />
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-3">
          <Shimmer className="h-9 w-28 rounded-xl" />
          <Shimmer className="h-3 w-8 rounded" />
        </div>

        {/* Divider */}
        <div className="h-px" style={{ background: 'rgba(239,248,238,0.06)' }} />

        {/* Description */}
        <div className="space-y-2">
          <Shimmer className="h-3.5 w-full rounded" />
          <Shimmer className="h-3.5 w-full rounded" />
          <Shimmer className="h-3.5 w-4/5 rounded" />
        </div>

        {/* Configuration label */}
        <div className="space-y-3">
          <Shimmer className="h-3 w-24 rounded" />
          {/* 2-col variant grid */}
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Shimmer
                key={i}
                className="h-14 rounded-xl"
                style={{ border: '1px solid rgba(239,248,238,0.06)' } as React.CSSProperties}
              />
            ))}
          </div>
        </div>

        {/* Quantity + Add to Cart */}
        <div className="space-y-3">
          <Shimmer className="h-3 w-16 rounded" />
          <div className="flex items-center gap-3">
            {/* Qty stepper */}
            <Shimmer
              className="w-36 h-13 rounded-xl shrink-0"
              style={{ border: '1px solid rgba(239,248,238,0.08)' } as React.CSSProperties}
            />
            {/* CTA button */}
            <Shimmer className="flex-1 h-13 rounded-xl" style={{ background: 'rgba(232,197,71,0.15)' } as React.CSSProperties} />
          </div>
        </div>

        {/* Promise cards — 2x2 grid */}
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 p-3 rounded-xl"
              style={{ background: 'rgba(239,248,238,0.03)', border: '1px solid rgba(239,248,238,0.06)' }}
            >
              <Shimmer className="size-8 rounded-lg shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Shimmer className="h-2.5 w-3/4 rounded" />
                <Shimmer className="h-2 w-1/2 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Share button */}
        <Shimmer className="h-3 w-32 rounded" />
      </div>
    </div>
  );
}

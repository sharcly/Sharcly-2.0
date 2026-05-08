"use client";

import { cn } from "@/lib/utils";

interface BlogSkeletonProps {
  viewMode: "grid" | "list";
}

export function BlogSkeleton({ viewMode }: BlogSkeletonProps) {
  const isGrid = viewMode === "grid";

  return (
    <div className={isGrid ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-8"}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className={cn(
            "bg-white/5 rounded-[2.5rem] border border-white/5 p-6 space-y-6",
            !isGrid && "col-span-full flex flex-col md:flex-row gap-8"
          )}
          style={{ backgroundColor: 'rgba(239,248,238,0.03)', border: '1px solid rgba(239,248,238,0.06)' }}
        >
          <div 
            className={cn(
              isGrid ? "aspect-[16/10] w-full" : "w-full md:w-2/5 aspect-[16/10] md:min-h-[240px]"
            )}
            style={{ background: 'linear-gradient(135deg, rgba(239,248,238,0.04) 0%, rgba(239,248,238,0.08) 100%)' }}
          />
          <div className="flex-1 p-6 md:p-8 space-y-4">
            <div className="h-3 w-1/3 rounded-full" style={{ backgroundColor: 'rgba(239,248,238,0.06)' }} />
            <div className="h-6 w-full rounded-lg" style={{ backgroundColor: 'rgba(239,248,238,0.05)' }} />
            <div className="h-4 w-4/5 rounded-lg" style={{ backgroundColor: 'rgba(239,248,238,0.04)' }} />
            <div className="h-4 w-2/3 rounded-lg" style={{ backgroundColor: 'rgba(239,248,238,0.03)' }} />
            <div className="h-3 w-1/4 rounded-full" style={{ backgroundColor: 'rgba(239,248,238,0.05)' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

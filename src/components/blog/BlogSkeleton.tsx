"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface BlogSkeletonProps {
  viewMode: "grid" | "list";
}

export function BlogSkeleton({ viewMode }: BlogSkeletonProps) {
  const isGrid = viewMode === "grid";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className={cn(
            "bg-white/5 rounded-[2.5rem] border border-white/5 p-6 space-y-6",
            !isGrid && "col-span-full flex flex-col md:flex-row gap-8"
          )}
        >
          <Skeleton className={cn(
            "rounded-[2rem]",
            isGrid ? "aspect-[16/10] w-full" : "w-full md:w-2/5 aspect-[16/10]"
          )} />
          <div className="flex-1 space-y-4 py-4">
            <Skeleton className="h-4 w-1/4 rounded-full" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-4 w-1/3 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { BlogCard } from "./BlogCard";
import { Skeleton } from "@/components/ui/skeleton";

interface RelatedPostsProps {
  currentBlogId: string;
  category?: string;
  tags?: string[];
}

export function RelatedPosts({ currentBlogId, category, tags }: RelatedPostsProps) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        // Simple strategy: fetch by category
        const response = await apiClient.get(`/blogs`, {
          params: {
            category: category,
            status: "PUBLISHED",
            limit: 5,
          },
        });
        
        // Filter out current post and limit to 3-4
        const filtered = (response.data.blogs || [])
          .filter((p: any) => p.id !== currentBlogId)
          .slice(0, 3);
          
        setPosts(filtered);
      } catch (error) {
        console.error("Failed to fetch related narratives");
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, [currentBlogId, category]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/5 rounded-[2.5rem] border border-white/5 p-6 space-y-6">
            <Skeleton className="aspect-[4/3] w-full rounded-[2rem]" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-1/4 rounded-full" />
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) return null;

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-6">
        <h2 className="text-4xl font-bold tracking-tighter text-white">
          Related <span className="italic font-serif opacity-40">Narratives</span>
        </h2>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {posts.map((post) => (
          <BlogCard key={post.id} blog={post} viewMode="grid" />
        ))}
      </div>
    </div>
  );
}

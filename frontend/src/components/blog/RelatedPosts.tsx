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
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48 w-full rounded-[2.5rem]" />
        ))}
      </div>
    );
  }

  if (posts.length === 0) return null;

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-6">
        <h2 className="text-4xl font-bold tracking-tighter text-[#0d2719]">
          Related <span className="italic font-serif opacity-40">Narratives</span>
        </h2>
        <div className="h-px flex-1 bg-[#0d2719]/10" />
      </div>

      <div className="grid grid-cols-1 gap-8">
        {posts.map((post) => (
          <BlogCard key={post.id} blog={post} viewMode="list" />
        ))}
      </div>
    </div>
  );
}

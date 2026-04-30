"use client";

import { useEffect, useState, useCallback } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  FileEdit, 
  Trash2, 
  User as UserIcon,
  Search,
  BookOpen,
  RefreshCcw,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function DashboardBlogsPage() {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<any>(null);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/blogs?search=${search}`);
      setBlogs(response.data.blogs || []);
    } catch (error: any) {
      toast.error("Failed to load articles from the archive");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleDelete = async () => {
    if (!blogToDelete) return;
    try {
      await apiClient.delete(`/blogs/${blogToDelete.id}`);
      toast.success("Article successfully removed from archive");
      fetchBlogs();
    } catch (error: any) {
      toast.error("Failed to eliminate article");
    } finally {
      setIsDeleteDialogOpen(false);
      setBlogToDelete(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 rounded-full px-3 py-1 font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5 w-fit">
          Published
        </Badge>;
      case "DRAFT":
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 rounded-full px-3 py-1 font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5 w-fit">
          Draft
        </Badge>;
      case "SCHEDULED":
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 rounded-full px-3 py-1 font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5 w-fit">
          Scheduled
        </Badge>;
      default:
        return <Badge className="bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20 rounded-full px-3 py-1 font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5 w-fit">
          {status}
        </Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Blog Management</h1>
          <p className="text-muted-foreground italic font-serif opacity-60 text-sm">Write and manage your stories for the community.</p>
        </div>
        <Button 
          asChild
          className="gap-2 rounded-2xl h-12 px-6 bg-[#062D1B] text-white shadow-lg font-bold"
        >
          <Link href="/dashboard/blogs/new">
            <Plus className="h-4 w-4" /> Add New Post
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
         <Card className="glass-card">
            <CardHeader className="pb-2">
               <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Stories</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-3xl font-black">{blogs.length}</div>
            </CardContent>
         </Card>
         <Card className="glass-card">
            <CardHeader className="pb-2">
               <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Published</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-3xl font-black">{blogs.filter(b => b.status === "PUBLISHED").length}</div>
            </CardContent>
         </Card>
         <Card className="glass-card">
            <CardHeader className="pb-2">
               <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Drafts</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-3xl font-black">{blogs.filter(b => b.status === "DRAFT").length}</div>
            </CardContent>
         </Card>
         <Card className="glass-card">
            <CardHeader className="pb-2">
               <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Scheduled Execution</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-3xl font-black">{blogs.filter(b => b.status === "SCHEDULED").length}</div>
            </CardContent>
         </Card>
      </div>

      <Card className="glass-card overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
           <div>
              <CardTitle className="text-xl font-black flex items-center gap-3">
                 Archive Registry
                 <Button variant="ghost" size="icon" onClick={() => fetchBlogs()} className="h-8 w-8 rounded-full">
                    <RefreshCcw className={cn("size-4 opacity-30", loading && "animate-spin")} />
                 </Button>
              </CardTitle>
           </div>
           <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search the archive..." 
                className="pl-10 h-11 rounded-xl bg-white focus:ring-0 border-gray-100 shadow-sm" 
              />
           </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="hover:bg-transparent border-gray-100">
                <TableHead className="pl-6 py-4 font-black uppercase text-[10px] tracking-widest">Article</TableHead>
                <TableHead className="py-4 font-black uppercase text-[10px] tracking-widest">Author</TableHead>
                <TableHead className="py-4 font-black uppercase text-[10px] tracking-widest">Date</TableHead>
                <TableHead className="py-4 font-black uppercase text-[10px] tracking-widest">Status</TableHead>
                <TableHead className="text-right pr-6 py-4 font-black uppercase text-[10px] tracking-widest">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [1, 2, 3, 4].map((i) => (
                  <TableRow key={i} className="border-gray-50">
                    <TableCell className="pl-6"><Skeleton className="h-4 w-64 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell className="pr-6 text-right"><Skeleton className="h-10 w-10 ml-auto rounded-xl" /></TableCell>
                  </TableRow>
                ))
              ) : blogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center text-muted-foreground italic font-serif">
                     No stories found in the archive.
                  </TableCell>
                </TableRow>
              ) : (
                blogs.map((blog) => (
                  <TableRow key={blog.id} className="border-gray-50 group hover:bg-gray-50/30 transition-all duration-300">
                    <TableCell className="pl-6 py-6">
                       <div className="flex flex-col gap-1">
                          <span className="font-bold text-sm tracking-tight text-[#062D1B] group-hover:text-[#062D1B] transition-colors">{blog.title}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-20">/{blog.slug}</span>
                       </div>
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-[#062D1B]/10 flex items-center justify-center">
                             <UserIcon className="h-3 w-3 text-[#062D1B]" />
                          </div>
                          <span className="text-sm font-medium">{blog.author?.name || "Team"}</span>
                       </div>
                    </TableCell>
                    <TableCell className="text-gray-400 text-xs font-medium">
                       {new Date(blog.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(blog.status)}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                       <div className="flex justify-end gap-2">
                          <Button 
                            asChild
                            variant="ghost" 
                            size="icon" 
                            className="h-10 w-10 rounded-xl hover:bg-white group border border-transparent hover:border-gray-100 shadow-sm"
                          >
                             <Link href={`/dashboard/blogs/${blog.id}/edit`}>
                                <FileEdit className="h-4 w-4 group-hover:text-[#062D1B] transition-colors" />
                             </Link>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => {
                              setBlogToDelete(blog);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="h-10 w-10 rounded-xl hover:bg-rose-50/10 group"
                          >
                             <Trash2 className="h-4 w-4 group-hover:text-rose-500 transition-colors" />
                          </Button>
                       </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="rounded-[2rem] border-white/5 bg-black/90 backdrop-blur-3xl shadow-2xl">
          <DialogHeader>
            <div className="flex items-center gap-4 text-rose-500 mb-2">
               <AlertCircle className="size-6" />
               <DialogTitle className="text-xl font-black">Delete Post</DialogTitle>
            </div>
            <DialogDescription className="text-muted-foreground">
              This action will permanently remove <span className="font-bold text-white">"{blogToDelete?.title}"</span>. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="p-4 bg-white/5 rounded-3xl mt-4 flex flex-row gap-2">
            <Button 
                variant="ghost" 
                onClick={() => setIsDeleteDialogOpen(false)}
                className="flex-1 rounded-2xl h-11 border-white/10 bg-transparent font-bold"
            >
                Cancel
            </Button>
            <Button 
              onClick={handleDelete}
              className="flex-1 rounded-2xl h-11 bg-rose-500 text-white hover:bg-rose-600 font-bold"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

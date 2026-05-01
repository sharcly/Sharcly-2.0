"use client";

import { useEffect, useState, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  MoreHorizontal,
  Plus,
  Pencil,
  Trash2,
  Package,
  Search,
  Layers,
  Tag,
  BarChart3,
  RefreshCw,
  Save,
  Clock,
  FileText,
  ChevronDown,
  Box,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ProductDrawer from "@/components/admin/ProductDrawer";

export default function DashboardProductsPage() {
  const [activeTab, setActiveTab] = useState("all-products");
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isAddOpen, setIsAddOpen] = useState(false); // keeping for backward compatibility if needed, but will move to drawerOpen

  // Form States
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [productForm, setProductForm] = useState({
    name: "", slug: "", sku: "", description: "", price: "", stock: "", categoryId: "", typeId: "", tags: [] as string[]
  });

  const [categoryForm, setCategoryForm] = useState({ name: "", slug: "", description: "" });
  const [collectionForm, setCollectionForm] = useState({ name: "", slug: "", description: "" });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, cRes, colRes, tRes, tyRes] = await Promise.all([
        apiClient.get("/products"),
        apiClient.get("/products/categories"),
        apiClient.get("/products/collections"),
        apiClient.get("/products/tags"),
        apiClient.get("/products/types")
      ]);
      setProducts(pRes.data.products);
      setCategories(cRes.data.categories || []);
      setCollections(colRes.data.collections || []);
      setTags(tRes.data.tags || []);
      setTypes(tyRes.data.types || []);
    } catch (error: any) {
      toast.error("Failed to load store data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Product Actions
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFiles || selectedFiles.length === 0) return toast.error("Please select product images");
    try {
      const data = new FormData();
      Object.entries(productForm).forEach(([key, val]) => {
        if (key === "tags") data.append(key, JSON.stringify(val));
        else data.append(key, val as string);
      });
      Array.from(selectedFiles).forEach(file => data.append("images", file));

      await apiClient.post("/products", data, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Product created successfully");
      setIsAddOpen(false);
      fetchData();
    } catch (error) { toast.error("Create failed"); }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await apiClient.delete(`/products/${id}`);
      toast.success("Product deleted");
      fetchData();
    } catch (error) { toast.error("Delete failed"); }
  };

  const updateStock = async (id: string, newStock: number) => {
    try {
      await apiClient.patch(`/products/${id}`, { stock: newStock });
      setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p));
      toast.success("Stock updated", { duration: 1000 });
    } catch (error) { toast.error("Update failed"); }
  };

  // Category Actions
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post("/products/categories", categoryForm);
      toast.success("Category created");
      setCategoryForm({ name: "", slug: "", description: "" });
      fetchData();
    } catch (error) { toast.error("Create failed"); }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure? This may affect products in this category.")) return;
    try {
      await apiClient.delete(`/products/categories/${id}`);
      toast.success("Category removed");
      fetchData();
    } catch (error) { toast.error("Removal failed"); }
  };

  // Collection Actions
  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post("/products/collections", collectionForm);
      toast.success("Collection created");
      setCollectionForm({ name: "", slug: "", description: "" });
      fetchData();
    } catch (error) { toast.error("Create failed"); }
  };

  const handleDeleteCollection = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await apiClient.delete(`/products/collections/${id}`);
      toast.success("Collection removed");
      fetchData();
    } catch (error) { toast.error("Removal failed"); }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900">Products</h1>
          <p className="text-sm text-neutral-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis">Manage your store products and inventory.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" size="icon" onClick={fetchData} className="rounded-xl size-10 md:size-12 grow-0 shrink-0 border-black/5 hover:bg-black/5">
            <RefreshCw className={cn("h-5 w-5 text-neutral-400", loading && "animate-spin")} />
          </Button>
          <Button 
            onClick={() => {
              setSelectedProduct(null);
              setDrawerOpen(true);
            }} 
            className="h-10 md:h-12 px-6 rounded-xl premium-gradient font-bold shadow-lg gap-2 flex-1 sm:flex-none"
          >
            <Plus className="h-5 w-5" /> Add Product
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all-products" className="w-full" onValueChange={setActiveTab}>
        <ScrollArea className="w-full">
          <TabsList className="bg-neutral-100/50 p-1.5 rounded-2xl h-auto border border-black/5 mb-10 min-w-max flex">
            <TabsTrigger value="all-products" className="rounded-xl px-8 py-4 font-bold text-sm data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:text-primary transition-all gap-2">
              <Package className="h-4 w-4" /> All Products
            </TabsTrigger>
            <TabsTrigger value="inventory" className="rounded-xl px-8 py-4 font-bold text-sm data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:text-primary transition-all gap-2">
              <BarChart3 className="h-4 w-4" /> Inventory
            </TabsTrigger>
            <TabsTrigger value="categories" className="rounded-xl px-8 py-4 font-bold text-sm data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:text-primary transition-all gap-2">
              <Tag className="h-4 w-4" /> Categories
            </TabsTrigger>
            <TabsTrigger value="collections" className="rounded-xl px-8 py-4 font-bold text-sm data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:text-primary transition-all gap-2">
              <Layers className="h-4 w-4" /> Collections
            </TabsTrigger>
          </TabsList>
        </ScrollArea>

        <TabsContent value="all-products">
          <Card className="border-black/5 shadow-sharcly rounded-3xl overflow-hidden bg-white">
            <CardHeader className="p-8 border-b border-black/5 flex flex-row items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight">All Products</CardTitle>
                <CardDescription className="text-xs font-medium">Manage your product catalog.</CardDescription>
              </div>
              <div className="relative w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-300" />
                <Input placeholder="Search products..." className="pl-12 h-12 rounded-2xl border-black/5 bg-neutral-50 font-medium" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="w-full">
                <Table>

                  <TableHeader className="bg-neutral-50/50">
                    <TableRow className="border-black/5 hover:bg-transparent">
                      <TableHead className="pl-8 py-5 font-black uppercase text-[10px] tracking-widest text-black/40">Image</TableHead>
                      <TableHead className="py-5 font-black uppercase text-[10px] tracking-widest text-black/40">Product</TableHead>
                      <TableHead className="py-5 font-black uppercase text-[10px] tracking-widest text-black/40">Category</TableHead>
                      <TableHead className="py-5 font-black uppercase text-[10px] tracking-widest text-black/40">Price</TableHead>
                      <TableHead className="py-5 font-black uppercase text-[10px] tracking-widest text-black/40">Stock</TableHead>
                      <TableHead className="pr-8 text-right py-5 font-black uppercase text-[10px] tracking-widest text-black/40">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? [1, 2, 3].map(i => <TableRow key={i}><TableCell colSpan={6}><Skeleton className="h-20 w-full rounded-2xl" /></TableCell></TableRow>) : products.map(p => (
                      <TableRow key={p.id} className="border-black/5 hover:bg-neutral-50/50 transition-all group">
                        <TableCell className="pl-8 py-6">
                          <div className="size-16 rounded-2xl bg-neutral-100 border border-black/5 overflow-hidden shadow-sm group-hover:scale-110 transition-transform duration-500">
                            {p.imageUrls?.[0] || p.images?.[0] ? (
                              <img 
                                src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8181/api"}/images/${p.imageUrls?.[0] ? p.imageUrls[0].split("/").pop() : p.images[0].id}`} 
                                className="size-full object-cover" 
                                alt={p.name}
                              />
                            ) : (
                              <div className="size-full flex items-center justify-center bg-neutral-50">
                                <Package className="size-8 text-neutral-200" />
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-6">
                          <div className="flex flex-col gap-1">
                            <span className="font-bold text-neutral-900 text-base">{p.name}</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 font-mono">{p.sku || "NO-SKU"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-6">
                          <div className="flex flex-col gap-1.5">
                            <Badge variant="outline" className="w-fit rounded-lg bg-white border-black/5 text-[9px] font-bold text-neutral-500">
                              {p.category?.name || "Uncategorized"}
                            </Badge>
                            <span className="text-[10px] font-medium text-neutral-400">{p.type?.name || "Standard Type"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-6 font-black text-neutral-900 text-base">${Number(p.price).toFixed(2)}</TableCell>
                        <TableCell className="py-6">
                          <Badge variant={p.stock > 10 ? "secondary" : "destructive"} className="rounded-full px-4 py-1 font-black text-[10px] uppercase shadow-sm">
                            {p.stock} Units
                          </Badge>
                        </TableCell>
                        <TableCell className="pr-8 text-right py-6">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-neutral-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="h-5 w-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-2xl border-black/5 min-w-[200px] p-2 shadow-2xl">
                              <DropdownMenuGroup>
                                <DropdownMenuLabel className="px-3 py-2 text-[10px] uppercase font-black text-black/40">Options</DropdownMenuLabel>
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setSelectedProduct(p);
                                    setDrawerOpen(true);
                                  }}
                                  className="rounded-xl gap-3 font-bold cursor-pointer py-3"
                                >
                                  <Pencil className="h-4 w-4" /> Edit Product
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteProduct(p.id)} className="rounded-xl gap-3 font-bold cursor-pointer py-3 text-destructive focus:bg-destructive/5 focus:text-destructive"><Trash2 className="h-4 w-4" /> Delete Product</DropdownMenuItem>
                              </DropdownMenuGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card className="border-black/5 shadow-sharcly rounded-3xl overflow-hidden bg-white">
            <CardHeader className="p-8 border-b border-black/5">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-2xl font-bold tracking-tight">Manage Stock</CardTitle>
                  <CardDescription className="text-xs font-medium">Manage your product stock levels.</CardDescription>
                </div>
                <Badge className="bg-emerald-500 text-white px-5 py-2 rounded-full font-black text-[10px] tracking-widest border-none shadow-lg shadow-emerald-500/20">
                  Stock Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="w-full">
                <Table>

                  <TableHeader className="bg-neutral-50/50">
                    <TableRow className="border-black/5">
                      <TableHead className="pl-8 py-5 font-black uppercase text-[10px] tracking-widest text-black/40 w-1/4">Product</TableHead>
                      <TableHead className="py-5 font-black uppercase text-[10px] tracking-widest text-black/40">SKU</TableHead>
                      <TableHead className="py-5 font-black uppercase text-[10px] tracking-widest text-black/40 text-center">In Stock</TableHead>
                      <TableHead className="py-5 font-black uppercase text-[10px] tracking-widest text-black/40">Manage Stock</TableHead>
                      <TableHead className="pr-8 text-right py-5 font-black uppercase text-[10px] tracking-widest text-black/40">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map(p => (
                      <TableRow key={p.id} className="border-black/5 hover:bg-neutral-50 transition-all group">
                        <TableCell className="pl-8 py-8">
                          <span className="font-bold text-neutral-900 text-base">{p.name}</span>
                        </TableCell>
                        <TableCell className="py-8">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 font-mono py-1 px-3 bg-neutral-100 rounded-lg">{p.sku || "PENDING"}</span>
                        </TableCell>
                        <TableCell className="py-8 text-center font-black text-2xl text-neutral-900 group-hover:scale-110 transition-transform">
                          {p.stock}
                        </TableCell>
                        <TableCell className="py-8">
                          <div className="flex items-center gap-3">
                            <Button variant="outline" size="icon" onClick={() => updateStock(p.id, Math.max(0, p.stock - 1))} className="size-10 rounded-xl border-black/5 hover:bg-white hover:shadow-md font-black text-lg transition-all">-</Button>
                            <Input type="number" value={p.stock} onChange={e => updateStock(p.id, parseInt(e.target.value) || 0)} className="w-24 h-10 rounded-xl border-black/5 font-black text-center bg-neutral-50" />
                            <Button variant="outline" size="icon" onClick={() => updateStock(p.id, p.stock + 1)} className="size-10 rounded-xl border-black/5 hover:bg-white hover:shadow-md font-black text-lg transition-all">+</Button>
                          </div>
                        </TableCell>
                        <TableCell className="pr-8 text-right py-8">
                          <div className="flex flex-col items-end gap-3">
                            <div className="w-40 h-3 bg-neutral-100 rounded-full overflow-hidden shadow-inner border border-black/5">
                              <div className={cn("h-full transition-all duration-1000", p.stock > 10 ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : p.stock > 0 ? "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" : "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]")} style={{ width: `${Math.min(100, (p.stock / 100) * 100)}%` }} />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-neutral-300 group-hover:text-neutral-900 transition-colors">
                              {p.stock > 50 ? "In Stock" : p.stock > 10 ? "Optimal Stock" : "Low Stock"}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <div className="grid gap-10 lg:grid-cols-12">
            <Card className="lg:col-span-8 border-black/5 shadow-sharcly rounded-3xl overflow-hidden bg-white">
              <CardHeader className="p-8 border-b border-black/5 bg-neutral-50/50">
                <CardTitle className="text-2xl font-bold tracking-tight">Categories</CardTitle>
                <CardDescription className="text-xs font-medium">Manage your product categories.</CardDescription>
              </CardHeader>
              <ScrollArea className="w-full">
                <Table>
                  <TableHeader className="bg-neutral-50/50">
                    <TableRow className="border-black/5">
                      <TableHead className="pl-8 py-5 font-black uppercase text-[10px] tracking-widest text-black/40">Category</TableHead>
                      <TableHead className="py-5 font-black uppercase text-[10px] tracking-widest text-black/40">Identifier</TableHead>
                      <TableHead className="py-5 font-black uppercase text-[10px] tracking-widest text-black/40">Products</TableHead>
                      <TableHead className="pr-8 text-right py-5 font-black uppercase text-[10px] tracking-widest text-black/40">Manage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.length > 0 ? categories.map(cat => (
                      <TableRow key={cat.id} className="border-black/5 hover:bg-neutral-50 transition-all">
                        <TableCell className="pl-8 py-6 font-bold text-lg">{cat.name}</TableCell>
                        <TableCell className="py-6 text-neutral-400 text-xs font-mono">{cat.slug}</TableCell>
                        <TableCell className="py-6 font-black text-xs">{cat._count?.products || 0} Items</TableCell>
                        <TableCell className="pr-8 text-right py-6">
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(cat.id)} className="hover:bg-rose-50 text-rose-500 h-10 w-10 rounded-xl">
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={4} className="py-20 text-center text-neutral-400 font-medium">No categories created</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </Card>

            <Card className="lg:col-span-4 border-black/5 shadow-sharcly rounded-3xl overflow-hidden bg-white h-fit">
              <CardHeader className="p-8 border-b border-black/5 bg-neutral-900 text-white">
                <CardTitle className="text-xl font-bold">New Category</CardTitle>
                <CardDescription className="text-neutral-400 text-xs">Create a new product category.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleCreateCategory} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black text-black/40 tracking-widest">Category Name</Label>
                    <Input required value={categoryForm.name} onChange={e => {
                      const name = e.target.value;
                      setCategoryForm({ ...categoryForm, name, slug: name.toLowerCase().replace(/ /g, '-') });
                    }} className="h-12 rounded-xl bg-neutral-50 border-black/5 font-bold" placeholder="e.g. Gummies" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black text-black/40 tracking-widest">Slug</Label>
                    <Input required value={categoryForm.slug} onChange={e => setCategoryForm({ ...categoryForm, slug: e.target.value })} className="h-12 rounded-xl bg-neutral-50 border-black/5 font-mono text-xs" />
                  </div>
                  <Button type="submit" className="w-full h-12 rounded-xl premium-gradient font-bold shadow-lg">Create Category</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="collections">
          <div className="grid gap-10 lg:grid-cols-12">
            <Card className="lg:col-span-8 border-black/5 shadow-sharcly rounded-3xl overflow-hidden bg-white">
              <CardHeader className="p-8 border-b border-black/5 bg-neutral-50/50">
                <CardTitle className="text-2xl font-bold tracking-tight">Collections</CardTitle>
                <CardDescription className="text-xs font-medium">Thematic product series and marketing groups.</CardDescription>
              </CardHeader>
              <ScrollArea className="w-full">
                <Table>
                  <TableHeader className="bg-neutral-50/50">
                    <TableRow className="border-black/5">
                      <TableHead className="pl-8 py-5 font-black uppercase text-[10px] tracking-widest text-black/40">Collection</TableHead>
                      <TableHead className="py-5 font-black uppercase text-[10px] tracking-widest text-black/40">Identifier</TableHead>
                      <TableHead className="py-5 font-black uppercase text-[10px] tracking-widest text-black/40">Products</TableHead>
                      <TableHead className="pr-8 text-right py-5 font-black uppercase text-[10px] tracking-widest text-black/40">Manage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {collections.length > 0 ? collections.map(col => (
                      <TableRow key={col.id} className="border-black/5 hover:bg-neutral-50 transition-all">
                        <TableCell className="pl-8 py-6 font-bold text-lg">{col.name}</TableCell>
                        <TableCell className="py-6 text-neutral-400 text-xs font-mono">{col.slug}</TableCell>
                        <TableCell className="py-6 font-black text-xs">{col._count?.products || 0} Items</TableCell>
                        <TableCell className="pr-8 text-right py-6">
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteCollection(col.id)} className="hover:bg-rose-50 text-rose-500 h-10 w-10 rounded-xl">
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={4} className="py-20 text-center text-neutral-400 font-medium">No collections created</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </Card>

            <Card className="lg:col-span-4 border-black/5 shadow-sharcly rounded-3xl overflow-hidden bg-white h-fit">
              <CardHeader className="p-8 border-b border-black/5 bg-neutral-900 text-white">
                <CardTitle className="text-xl font-bold">New Collection</CardTitle>
                <CardDescription className="text-neutral-400 text-xs">Create a new product series.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleCreateCollection} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black text-black/40 tracking-widest">Collection Name</Label>
                    <Input required value={collectionForm.name} onChange={e => {
                      const name = e.target.value;
                      setCollectionForm({ ...collectionForm, name, slug: name.toLowerCase().replace(/ /g, '-') });
                    }} className="h-12 rounded-xl bg-neutral-50 border-black/5 font-bold" placeholder="e.g. Chill Series" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black text-black/40 tracking-widest">Slug</Label>
                    <Input required value={collectionForm.slug} onChange={e => setCollectionForm({ ...collectionForm, slug: e.target.value })} className="h-12 rounded-xl bg-neutral-50 border-black/5 font-mono text-xs" />
                  </div>
                  <Button type="submit" className="w-full h-12 rounded-xl premium-gradient font-bold shadow-lg">Create Collection</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <ProductDrawer 
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        initialData={selectedProduct}
        categories={categories}
        collections={collections}
        tags={tags}
        types={types}
        onSave={async (data: any) => {
          console.log("🔥 Frontend Product Data:", data);
          const loadingToast = toast.loading(selectedProduct ? "Updating product..." : "Creating product...");
          try {
            // Data Cleansing & Validation
            if (!data.name?.trim()) throw new Error("Product name is required");
            
            const firstCategory = data.organization?.categories?.[0];
            if (!firstCategory && !selectedProduct) {
               // If no category selected, we might want to find a default one
               // but for now we'll throw to prevent Prisma 500 error
               throw new Error("Please select at least one category in Organization tab");
            }

            // Convert to FormData for multipart/form-data support (for images)
            const formData = new FormData();
            
            // Basic fields
            formData.append("name", data.name.trim());
            formData.append("subtitle", data.subtitle?.trim() || "");
            formData.append("slug", (data.handle || data.name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
            formData.append("description", data.description?.trim() || "No description provided.");
            formData.append("status", data.status?.toUpperCase() || "DRAFT");
            formData.append("discountable", String(data.discountable ?? true));
            
            // Normalized metrics
            formData.append("price", String(parseFloat(data.variants?.[0]?.prices?.[0]?.amount) || 0));
            formData.append("stock", String(data.variants?.reduce((acc: number, v: any) => acc + (parseInt(v.stock) || 0), 0) || 0));
            
            // Shipping
            formData.append("weight", String(parseFloat(data.shipping?.weight) || 0));
            formData.append("length", String(parseFloat(data.shipping?.length) || 0));
            formData.append("height", String(parseFloat(data.shipping?.height) || 0));
            formData.append("width", String(parseFloat(data.shipping?.width) || 0));
            formData.append("originCountry", data.shipping?.origin || "");
            formData.append("material", data.shipping?.material || "");
            formData.append("hsCode", data.shipping?.hsCode || "");
            formData.append("midCode", data.shipping?.midCode || "");

            // SEO
            formData.append("metaTitle", data.seo?.title || data.name);
            formData.append("metaDescription", data.seo?.description || "");
            formData.append("keywords", JSON.stringify(data.seo?.keywords || []));

            // Organization
            formData.append("categoryId", firstCategory || "");
            formData.append("typeId", data.organization?.type || "");
            formData.append("tags", JSON.stringify(data.organization?.tags || []));
            formData.append("collections", JSON.stringify(data.organization?.collections || []));

            // Complex Structures (MUST be stringified for multer)
            // Clean variants to remove File objects before stringifying
            const cleanedVariants = (data.variants || []).map((v: any) => {
              const { image, imageUrl, ...rest } = v;
              // If image is a string (existing URL), keep it, otherwise null (new file is sent separately)
              return { ...rest, image: typeof image === 'string' ? image : null };
            });
            formData.append("variants", JSON.stringify(cleanedVariants));
            formData.append("options", JSON.stringify(data.options || []));
            formData.append("metadata", JSON.stringify(data.metadata || []));
            formData.append("statement", JSON.stringify(data.statement || { line1: "", line2: "" }));
            formData.append("faqs", JSON.stringify(data.faqs || []));
            formData.append("contentSections", JSON.stringify(data.contentSections || []));

            // Images - Robust Detection
            const isFile = (obj: any) => obj && (obj instanceof File || (obj.name && obj.size && obj.type));

            if (isFile(data.thumbnail)) {
               formData.append("product_images", data.thumbnail);
            }
            
            if (Array.isArray(data.galleryFiles)) {
              data.galleryFiles.forEach((file: any) => {
                if (isFile(file)) {
                  formData.append("product_images", file);
                }
              });
            }

            // Variant Images
            if (Array.isArray(data.variants)) {
              data.variants.forEach((v: any, idx: number) => {
                if (isFile(v.image)) {
                  formData.append(`variant_image_${idx}`, v.image);
                }
              });
            }

            const fileCount = Array.from((formData as any).entries()).filter((entry: any) => entry[0].includes('image')).length;
            console.log(`🚀 Sending Product Data with ${fileCount} images...`);

            if (selectedProduct) {
              await apiClient.patch(`/products/${selectedProduct.id}`, formData);
              toast.success("Product updated successfully", { id: loadingToast });
            } else {
              await apiClient.post("/products", formData);
              toast.success("Product created successfully", { id: loadingToast });
            }

            setDrawerOpen(false);
            fetchData();
          } catch (error: any) {
            console.error("Save error:", error);
            const msg = error.response?.data?.message || error.message || "Internal Server Error (500)";
            toast.error(msg, { id: loadingToast });
          }
        }}
      />
    </div>
  );
}


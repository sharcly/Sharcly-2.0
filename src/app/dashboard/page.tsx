"use client";

import React from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  ChevronRight,
  Package,
  ClipboardList,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { useAuth } from "@/context/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Link from "next/link";

const labelMap: Record<string, string> = {
  totalRevenue: "REVENUE",
  activeCustomers: "CUSTOMERS",
  totalOrders: "TOTAL ORDERS",
  activeNow: "PRODUCTS"
};

const iconMap: Record<string, any> = {
  totalRevenue: DollarSign,
  activeCustomers: Users,
  totalOrders: ClipboardList,
  activeNow: Package
};

export default function DashboardPage() {
  const { stats, loading, error } = useDashboardStats();
  const { user } = useAuth();
  
  const hasPermission = (perm: string) => user?.role === "admin" || user?.role === "super_admin" || user?.permissions?.includes(perm);
  const canSeeStats = hasPermission("dashboard.view");
  const canSeeRevenue = hasPermission("revenue.view");
  const canSeeOrders = hasPermission("orders.view");

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground font-medium">Unable to load dashboard performance data.</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>Retry Sync</Button>
      </div>
    );
  }

  const metrics = stats?.metrics && canSeeStats ? Object.keys(stats.metrics)
    .filter(key => key !== "totalRevenue" || canSeeRevenue)
    .map((key) => {
      const val = (stats.metrics as any)[key];
      return {
        key,
        title: labelMap[key] || key,
        value: key === "totalRevenue" ? `$${Number(val).toLocaleString()}` : val.toLocaleString(),
        icon: iconMap[key] || ShoppingBag,
      };
    }) : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Welcome back, {user?.name?.split(' ')[0]}</h1>
          <p className="text-muted-foreground font-medium">
            {canSeeStats ? "Overview of your store performance" : "Have a productive day at Sharcly!"}
          </p>
        </div>
        {!canSeeStats && (
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
            <ShieldCheck className="size-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Restricted Access Mode</span>
          </div>
        )}
      </div>

      {/* Metric Cards Row */}
      {canSeeStats ? (
        <div className={cn(
          "grid gap-6",
          canSeeRevenue ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-3"
        )}>
          {loading ? (
            Array.from({ length: canSeeRevenue ? 4 : 3 }).map((_, i) => (
              <div key={i} className="border-black/5 shadow-sm rounded-xl overflow-hidden bg-white p-6 flex items-center justify-between">
                <div className="space-y-3">
                  <Skeleton className="h-3 w-20 rounded-full" />
                  <Skeleton className="h-8 w-24 rounded-full" />
                </div>
                <Skeleton className="size-12 rounded-xl" />
              </div>
            ))
          ) : (
            metrics.map((stat, i) => {
              const iconColors = ["bg-blue-600", "bg-emerald-500", "bg-purple-600", "bg-orange-500"];
              
              return (
                <Card key={stat.key} className="border-black/5 shadow-sm rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-[0.1em] text-black/40">{stat.title}</p>
                      <div className="text-3xl font-bold tracking-tighter text-neutral-900">{stat.value}</div>
                    </div>
                    <div className={cn("size-12 rounded-xl flex items-center justify-center text-white shadow-sm", iconColors[i % 4])}>
                      <stat.icon className="h-6 w-6 stroke-[2.5]" />
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      ) : (
        <Card className="border-dashed border-2 border-gray-100 bg-gray-50/50 rounded-[2rem] p-10 flex flex-col items-center text-center space-y-6">
          <div className="size-20 rounded-full bg-white shadow-xl flex items-center justify-center text-blue-500">
             <Activity className="size-10" />
          </div>
          <div className="space-y-2 max-w-sm">
             <h3 className="text-2xl font-black tracking-tight">Activity Feed Enabled</h3>
             <p className="text-sm text-gray-500 font-medium">You don't have permission to view global sales analytics, but you can still manage content and catalog from the sidebar.</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="rounded-2xl h-12 px-6 font-bold" asChild>
              <Link href="/dashboard/products">Manage Catalog</Link>
            </Button>
            <Button className="rounded-2xl h-12 px-6 font-bold bg-[#062D1B]" asChild>
              <Link href="/dashboard/blogs">Write Blog</Link>
            </Button>
          </div>
        </Card>
      )}

      {/* Main Grid: Orders & Sidebar */}
      <div className="grid gap-8 lg:grid-cols-12">
        
        {/* Recent Orders Section (8/12) */}
        {canSeeOrders && (
          <div className="lg:col-span-8">
            <Card className="rounded-xl bg-white border-black/5 shadow-sm overflow-hidden">
              <CardHeader className="p-6 flex flex-row items-center justify-between border-b border-black/5">
                <div className="space-y-0.5">
                  <CardTitle className="text-xl font-bold text-neutral-900">Recent Orders</CardTitle>
                  <CardDescription className="text-xs text-neutral-400 font-medium">Last 5 orders</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="rounded-lg h-9 px-4 text-xs font-bold text-neutral-500 border-black/5 hover:bg-neutral-50" asChild>
                  <Link href="/dashboard/orders">View All →</Link>
                </Button>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader className="bg-neutral-50/50">
                    <TableRow className="border-black/5 hover:bg-transparent">
                      <TableHead className="pl-6 py-4 font-black uppercase text-[10px] tracking-widest text-black/40">Order</TableHead>
                      <TableHead className="py-4 font-black uppercase text-[10px] tracking-widest text-black/40">Date</TableHead>
                      <TableHead className="py-4 font-black uppercase text-[10px] tracking-widest text-black/40">Customer</TableHead>
                      <TableHead className="py-4 font-black uppercase text-[10px] tracking-widest text-black/40 text-center">Payment</TableHead>
                      <TableHead className="py-4 font-black uppercase text-[10px] tracking-widest text-black/40 text-center">Fulfillment</TableHead>
                      {canSeeRevenue && <TableHead className="text-right pr-6 py-4 font-black uppercase text-[10px] tracking-widest text-black/40">Total</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i} className="border-black/5">
                          <TableCell className="pl-6 py-5"><Skeleton className="h-4 w-16 rounded-full" /></TableCell>
                          <TableCell className="py-5">
                            <div className="space-y-2">
                               <Skeleton className="h-3 w-20 rounded-full" />
                               <Skeleton className="h-2 w-16 rounded-full" />
                            </div>
                          </TableCell>
                          <TableCell className="py-5"><Skeleton className="h-3 w-32 rounded-full" /></TableCell>
                          <TableCell className="py-5 text-center"><Skeleton className="h-6 w-20 mx-auto rounded-full" /></TableCell>
                          <TableCell className="py-5 text-center"><Skeleton className="h-6 w-20 mx-auto rounded-full" /></TableCell>
                          {canSeeRevenue && <TableCell className="text-right pr-6 py-5"><Skeleton className="h-4 w-16 ml-auto rounded-full" /></TableCell>}
                        </TableRow>
                      ))
                    ) : (stats?.recentTransactions || []).slice(0, 5).map((order) => (
                      <TableRow key={order.id} className="border-black/5 hover:bg-neutral-50/50 transition-colors">
                        <TableCell className="pl-6 py-5 font-bold text-sm">
                          <Link 
                            href={`/dashboard/orders/${order.id}`}
                            className="text-blue-600 hover:underline flex items-center gap-1"
                          >
                            #{order.id.slice(0, 4).toUpperCase()}
                            <ArrowRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        </TableCell>
                        <TableCell className="py-5">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-neutral-900">{format(new Date(order.date), "MMM d")}</span>
                            <span className="text-[10px] text-neutral-400 font-medium">{format(new Date(order.date), "HH:mm")}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-5 text-xs font-medium text-neutral-600">
                          {order.email}
                        </TableCell>
                        <TableCell className="py-5 text-center">
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "rounded-full px-3 py-0.5 text-[10px] font-bold border-0 capitalize",
                              order.status === "PENDING" ? "bg-orange-100 text-orange-600" :
                              order.status === "CANCELLED" ? "bg-red-100 text-red-600" :
                              "bg-green-100 text-green-600"
                            )}
                          >
                            • {order.status.toLowerCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-5 text-center">
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "rounded-full px-3 py-0.5 text-[10px] font-bold border-0 capitalize",
                              ["DELIVERED", "SHIPPED"].includes(order.status) ? "bg-emerald-100 text-emerald-600" : "bg-neutral-100 text-neutral-500"
                            )}
                          >
                            • {["DELIVERED", "SHIPPED"].includes(order.status) ? "fulfilled" : "unfulfilled"}
                          </Badge>
                        </TableCell>
                        {canSeeRevenue && (
                          <TableCell className="text-right pr-6 py-5 font-bold text-sm text-neutral-900">
                            ${Number(order.amount).toFixed(2)}
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Sidebar Sections (4/12) */}
        <div className={cn(
          "lg:col-span-4 space-y-6",
          !canSeeOrders && "lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 space-y-0"
        )}>
          
          {/* Quick Links Card */}
          <Card className="rounded-xl bg-white border-black/5 shadow-sm overflow-hidden h-fit">
            <CardHeader className="p-6 border-b border-black/5">
              <CardTitle className="text-lg font-bold text-neutral-900">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {[
                { label: "Products", desc: "Manage catalog", icon: Package, color: "bg-orange-500", href: "/dashboard/products", perm: "products.view" },
                { label: "Orders", desc: "Process orders", icon: ClipboardList, color: "bg-blue-600", href: "/dashboard/orders", perm: "orders.view" },
                { label: "Customers", desc: "View contacts", icon: Users, color: "bg-purple-600", href: "/dashboard/user-management", perm: "users.view" },
                { label: "Blog Posts", desc: "Manage content", icon: BookOpen, color: "bg-pink-500", href: "/dashboard/blogs", perm: "blogs.view" },
              ].filter(link => hasPermission(link.perm)).map((link, i) => (
                <Link key={i} href={link.href} className="flex items-center gap-4 p-3 rounded-xl hover:bg-neutral-50 transition-colors group">
                  <div className={cn("size-10 rounded-lg flex items-center justify-center text-white shadow-sm", link.color)}>
                    <link.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-neutral-900">{link.label}</p>
                    <p className="text-[10px] font-medium text-neutral-400">{link.desc}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-neutral-200 group-hover:text-neutral-900 transition-colors" />
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Store Overview Summary */}
          <Card className="rounded-xl bg-white border-black/5 shadow-sm overflow-hidden h-fit">
            <CardHeader className="p-6 border-b border-black/5">
              <CardTitle className="text-lg font-bold text-neutral-900">System Info</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between group cursor-pointer">
                <p className="text-sm font-medium text-neutral-600 group-hover:text-neutral-900 transition-colors">Role Assigned</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-600 border-none font-bold uppercase text-[9px] px-2 py-0.5">{user?.role}</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between group cursor-pointer">
                <p className="text-sm font-medium text-neutral-600 group-hover:text-neutral-900 transition-colors">Permissions</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-neutral-900">{user?.permissions?.length || 0} active</span>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}

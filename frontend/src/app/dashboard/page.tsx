"use client";

import React from "react";
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
  ArrowRight
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
  const isAdmin = user?.role === "admin";

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground font-medium">Unable to load dashboard performance data.</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>Retry Sync</Button>
      </div>
    );
  }

  const metrics = stats?.metrics ? Object.keys(stats.metrics)
    .filter(key => isAdmin || key !== "totalRevenue")
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
      <div className="space-y-1">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground font-medium">Overview of your store performance</p>
      </div>

      {/* Metric Cards Row */}
      <div className={cn(
        "grid gap-6",
        isAdmin ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-3"
      )}>
        {loading ? (
          Array.from({ length: isAdmin ? 4 : 3 }).map((_, i) => (
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

      {/* Main Grid: Orders & Sidebar */}
      <div className="grid gap-8 lg:grid-cols-12">
        
        {/* Recent Orders Section (8/12) */}
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
                    {isAdmin && <TableHead className="text-right pr-6 py-4 font-black uppercase text-[10px] tracking-widest text-black/40">Total</TableHead>}
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
                        {isAdmin && <TableCell className="text-right pr-6 py-5"><Skeleton className="h-4 w-16 ml-auto rounded-full" /></TableCell>}
                      </TableRow>
                    ))
                  ) : (stats?.recentTransactions || []).slice(0, 5).map((order) => (
                    <TableRow key={order.id} className="border-black/5 hover:bg-neutral-50/50 transition-colors">
                      <TableCell className="pl-6 py-5 font-bold text-sm text-blue-600">
                        #{order.id.slice(0, 4).toUpperCase()}
                      </TableCell>
                      <TableCell className="py-5">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-neutral-900">{new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          <span className="text-[10px] text-neutral-400 font-medium">{new Date(order.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-5 text-xs font-medium text-neutral-600">
                        {order.email}
                      </TableCell>
                      <TableCell className="py-5 text-center">
                        <Badge variant="outline" className="rounded-full bg-orange-500/5 text-orange-500 border-orange-500/20 px-3 py-0.5 text-[10px] font-bold">
                          • pending
                        </Badge>
                      </TableCell>
                      <TableCell className="py-5 text-center">
                        <Badge variant="outline" className="rounded-full bg-neutral-100 text-neutral-500 border-black/5 px-3 py-0.5 text-[10px] font-bold">
                          • not fulfilled
                        </Badge>
                      </TableCell>
                      {isAdmin && (
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

        {/* Sidebar Sections (4/12) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Links Card */}
          <Card className="rounded-xl bg-white border-black/5 shadow-sm overflow-hidden">
            <CardHeader className="p-6 border-b border-black/5">
              <CardTitle className="text-lg font-bold text-neutral-900">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {[
                { label: "Products", desc: "Manage catalog", icon: Package, color: "bg-orange-500", href: "/dashboard/products" },
                { label: "Orders", desc: "Process orders", icon: ClipboardList, color: "bg-blue-600", href: "/dashboard/orders" },
                { label: "Customers", desc: "View contacts", icon: Users, color: "bg-purple-600", href: "/dashboard/user-management" },
                { label: "Blog Posts", desc: "Manage content", icon: BookOpen, color: "bg-pink-500", href: "/dashboard/blogs" },
              ].map((link, i) => (
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
          <Card className="rounded-xl bg-white border-black/5 shadow-sm overflow-hidden">
            <CardHeader className="p-6 border-b border-black/5">
              <CardTitle className="text-lg font-bold text-neutral-900">Store Overview</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between group cursor-pointer">
                <p className="text-sm font-medium text-neutral-600 group-hover:text-neutral-900 transition-colors">Collections</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-neutral-900">2</span>
                  <ChevronRight className="h-4 w-4 text-neutral-200" />
                </div>
              </div>
              {/* Optional: Add more overview items if needed by backend later */}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}

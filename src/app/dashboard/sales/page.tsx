"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  TrendingUp, 
  Globe, 
  DollarSign, 
  ShoppingBag, 
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  Download,
  PieChart,
  Target,
  Check
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/auth-context";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const DATE_RANGES = [
  { label: "Last 7 Days", value: "7days" },
  { label: "Last 30 Days", value: "30days" },
  { label: "This Month", value: "thisMonth" },
  { label: "Last Month", value: "lastMonth" },
  { label: "This Year", value: "thisYear" },
  { label: "Last Year", value: "lastYear" },
];

export default function SalesAnalyticsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [range, setRange] = useState("30days");

  const fetchAnalytics = useCallback(async (selectedRange: string) => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/stats/analytics?range=${selectedRange}`);
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch sales analytics:", error);
      toast.error("Failed to load real-time sales data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics(range);
  }, [range, fetchAnalytics]);

  const hasPermission = (perm: string) => user?.role === "admin" || user?.role === "super_admin" || user?.permissions?.includes(perm);

  if (!hasPermission("sales.view")) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <div className="size-20 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-6">
          <BarChart3 className="size-10" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-primary">Access Denied</h2>
        <p className="text-gray-500 max-w-xs mt-2">You do not have the required permissions to view sales analytics.</p>
        <Button variant="outline" className="mt-8 rounded-xl" onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  const selectedRangeLabel = DATE_RANGES.find(r => r.value === range)?.label || "Last 30 Days";

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
           <div className="flex items-center gap-3">
              <div className="size-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                <BarChart3 className="size-6" />
              </div>
              <div>
                 <h1 className="text-4xl font-black tracking-tight text-foreground">Sales Analytics</h1>
                 <p className="text-muted-foreground font-medium flex items-center gap-2">
                    <TrendingUp className="size-3 text-emerald-500" />
                    Real-time performance tracking & regional insights
                 </p>
              </div>
           </div>
        </div>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-xl h-12 gap-2 font-bold border-black/5 bg-white shadow-sm">
                <Calendar className="size-4" /> {selectedRangeLabel}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-black/5 shadow-xl">
              {DATE_RANGES.map((r) => (
                <DropdownMenuItem 
                  key={r.value}
                  className="rounded-xl cursor-pointer py-3 px-4 flex justify-between items-center"
                  onSelect={() => setRange(r.value)}
                >
                  <span className={cn("text-xs font-bold", range === r.value ? "text-blue-600" : "text-black/60")}>
                    {r.label}
                  </span>
                  {range === r.value && <Check className="size-4 text-blue-600" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" className="rounded-xl h-12 gap-2 font-bold border-black/5 bg-white shadow-sm">
            <Download className="size-4" /> Export
          </Button>
          <Button 
            className="rounded-xl h-12 gap-2 font-bold bg-[#062D1B] text-white shadow-xl shadow-emerald-900/10"
            onClick={() => fetchAnalytics(range)}
          >
            <Filter className="size-4" /> Sync Data
          </Button>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Revenue", value: `$${data?.totalSales?.toLocaleString() || '0'}`, growth: data?.salesGrowth || 0, icon: DollarSign, color: "bg-blue-600" },
          { label: "Total Orders", value: data?.orderCount?.toLocaleString() || '0', growth: data?.orderGrowth || 0, icon: ShoppingBag, color: "bg-emerald-500" },
          { label: "Avg. Order Value", value: `$${data?.avgOrderValue || '0'}`, growth: data?.aovGrowth || 0, icon: Target, color: "bg-purple-600" }
        ].map((kpi, i) => (
          <Card key={i} className="border-none shadow-sm rounded-3xl bg-white overflow-hidden group hover:shadow-xl transition-all duration-500">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={cn("size-14 rounded-2xl flex items-center justify-center text-white shadow-lg", kpi.color)}>
                  <kpi.icon className="size-7" />
                </div>
                {loading ? <Skeleton className="h-6 w-16 rounded-full" /> : (
                  <Badge className={cn(
                    "rounded-full px-3 py-1 font-bold text-[10px] uppercase tracking-wider",
                    kpi.growth >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                  )}>
                    {kpi.growth >= 0 ? <ArrowUpRight className="size-3 mr-1" /> : <ArrowDownRight className="size-3 mr-1" />}
                    {Math.abs(kpi.growth)}%
                  </Badge>
                )}
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30">{kpi.label}</p>
                 {loading ? <Skeleton className="h-10 w-32 rounded-full mt-2" /> : (
                   <h3 className="text-4xl font-black tracking-tight text-primary">{kpi.value}</h3>
                 )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* TREND CHART */}
        <Card className="lg:col-span-8 border-none shadow-sm rounded-3xl bg-white overflow-hidden">
          <CardHeader className="p-8 border-b border-black/[0.03]">
             <div className="flex justify-between items-center">
                <div className="space-y-1">
                   <CardTitle className="text-xl font-black">Sales Performance</CardTitle>
                   <CardDescription className="text-xs font-medium italic">Revenue trends for the selected period</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                   <div className="size-3 rounded-full bg-blue-600" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-black/40">Revenue</span>
                </div>
             </div>
          </CardHeader>
          <CardContent className="p-10">
             <div className="h-64 w-full flex items-end justify-between gap-4 relative">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5">
                   {[1,2,3,4].map(l => <div key={l} className="w-full h-px bg-black" />)}
                </div>

                {loading ? <Skeleton className="w-full h-full rounded-2xl" /> : (data?.recentSales || []).map((point: any, i: number) => {
                  const maxAmount = Math.max(...data.recentSales.map((s: any) => s.amount), 1);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                      <div 
                        className="w-full bg-blue-600/10 group-hover:bg-blue-600/20 rounded-t-xl transition-all duration-500 relative"
                        style={{ height: `${(point.amount / maxAmount) * 100}%` }}
                      >
                         <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[9px] font-black px-2 py-1 rounded shadow-xl whitespace-nowrap z-10">
                            ${point.amount?.toLocaleString()}
                         </div>
                         <div className="absolute top-0 left-0 w-full h-1 bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)] rounded-t-full" />
                      </div>
                      <p className="mt-4 text-[9px] font-black uppercase tracking-widest text-black/20 group-hover:text-blue-600 transition-colors">{point.date}</p>
                    </div>
                  )
                })}
             </div>
          </CardContent>
        </Card>

        {/* REGIONAL PERFORMANCE */}
        <Card className="lg:col-span-4 border-none shadow-sm rounded-3xl bg-white overflow-hidden">
          <CardHeader className="p-8 border-b border-black/[0.03]">
             <div className="space-y-1">
                <CardTitle className="text-xl font-black">Regional Performance</CardTitle>
                <CardDescription className="text-xs font-medium italic">Sales distribution by shipping destination</CardDescription>
             </div>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
             {loading ? Array.from({length: 4}).map((_, i) => (
               <div key={i} className="space-y-2">
                  <div className="flex justify-between"><Skeleton className="h-3 w-20" /><Skeleton className="h-3 w-10" /></div>
                  <Skeleton className="h-2 w-full" />
               </div>
             )) : (data?.regions || []).map((region: any, i: number) => (
               <div key={i} className="space-y-3">
                 <div className="flex justify-between items-end">
                    <div className="space-y-0.5">
                       <p className="text-[10px] font-black uppercase tracking-widest text-primary/80 truncate max-w-[150px]">{region.name}</p>
                       <p className="text-xs font-bold text-black/40">${region.sales.toLocaleString()}</p>
                    </div>
                    <div className={cn(
                      "text-[10px] font-black",
                      region.growth >= 0 ? "text-emerald-500" : "text-red-500"
                    )}>
                      {region.growth > 0 ? "+" : ""}{region.growth}%
                    </div>
                 </div>
                 <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden border border-black/[0.02]">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${region.percentage}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className={cn(
                        "h-full rounded-full shadow-sm",
                        i === 0 ? "bg-blue-600" : i === 1 ? "bg-emerald-500" : i === 2 ? "bg-purple-600" : "bg-orange-500"
                      )}
                    />
                 </div>
               </div>
             ))}

             <div className="pt-6 border-t border-black/[0.03] flex items-center justify-center">
                <Button variant="ghost" className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 hover:text-blue-600 gap-3">
                   Detailed Map View <Globe className="size-3" />
                </Button>
             </div>
          </CardContent>
        </Card>
      </div>

      {/* ADDITIONAL INSIGHTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
         {[
           { label: "Top Product", value: data?.topProduct || "None", icon: ShoppingBag, color: "text-orange-500" },
           { label: "Conversion Rate", value: data?.conversionRate || "0%", icon: TrendingUp, color: "text-blue-600" },
           { label: "New Customers", value: `+${data?.newCustomers || 0}`, icon: Users, color: "text-emerald-500" },
           { label: "Peak Time", value: data?.peakTime || "N/A", icon: Calendar, color: "text-purple-600" }
         ].map((insight, i) => (
           <Card key={i} className="border-none shadow-sm rounded-[2rem] bg-white group hover:bg-black hover:text-white transition-all duration-500">
             <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                <div className={cn("size-12 rounded-2xl bg-gray-50 flex items-center justify-center transition-all group-hover:bg-white/10 group-hover:scale-110", insight.color)}>
                   <insight.icon className="size-5" />
                </div>
                <div className="space-y-1">
                   <p className="text-[9px] font-black uppercase tracking-[0.2em] text-black/30 group-hover:text-white/40">{insight.label}</p>
                   <p className="text-sm font-black group-hover:text-white">{insight.value}</p>
                </div>
             </CardContent>
           </Card>
         ))}
      </div>
    </div>
  );
}

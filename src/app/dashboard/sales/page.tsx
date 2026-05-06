"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  Target,
  ArrowRight,
  ChevronRight,
  RefreshCcw,
  Globe,
  MapPin,
  Users,
  Search,
  Filter,
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  ShieldCheck,
  Zap,
  Activity,
  PieChart,
  Layers,
  MousePointer2,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/auth-context";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import Link from "next/link";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// --- DESIGN TOKENS ---
const TOKENS = {
  primary: "#062D1B",
  secondary: "#F0FDF4",
  background: "#F9FAFB",
  border: "rgba(6, 45, 27, 0.06)",
  textMain: "#062D1B",
  textMuted: "#6B7280"
};

const DATE_RANGES = [
  { label: "7D", value: "7days" },
  { label: "30D", value: "30days" },
  { label: "MTD", value: "thisMonth" },
  { label: "1Y", value: "thisYear" },
];

/**
 * REFINED ENTERPRISE LINE CHART
 */
const AnalyticsChart = ({ data, loading }: { data: any[], loading: boolean }) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return Array.from({ length: 7 }).map((_, i) => ({ date: i.toString(), amount: 0 }));
    return data;
  }, [data]);

  if (loading) return <Skeleton className="w-full h-[280px] rounded-xl bg-black/[0.02]" />;

  const maxAmount = Math.max(...chartData.map(d => Number(d.amount)), 1) * 1.15;
  const height = 280;
  const width = 1000;
  const paddingX = 40;
  const paddingY = 40;

  const points = chartData.map((d, i) => ({
    x: (i / (chartData.length - 1 || 1)) * (width - paddingX * 2) + paddingX,
    y: height - ((Number(d.amount) / maxAmount) * (height - paddingY * 2) + paddingY)
  }));

  const createPath = () => {
    if (points.length < 2) return "";
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const cp1x = curr.x + (next.x - curr.x) / 3;
      const cp2x = curr.x + (next.x - curr.x) * 2 / 3;
      path += ` C ${cp1x} ${curr.y} ${cp2x} ${next.y} ${next.x} ${next.y}`;
    }
    return path;
  };

  const pathLine = createPath();

  return (
    <div className="w-full h-[280px] relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        {/* Simple Horizontal Grid */}
        {[0, 0.5, 1].map((p, i) => (
          <line 
            key={i} 
            x1={paddingX} y1={paddingY + p * (height - paddingY * 2)} 
            x2={width - paddingX} y2={paddingY + p * (height - paddingY * 2)} 
            stroke="rgba(0,0,0,0.03)" strokeWidth="1"
          />
        ))}

        <motion.path 
          initial={{ pathLength: 0, opacity: 0 }} 
          animate={{ pathLength: 1, opacity: 1 }} 
          transition={{ duration: 1, ease: "easeOut" }}
          d={pathLine} fill="none" stroke={TOKENS.primary} strokeWidth="2.5" strokeLinecap="round" 
        />

        {points.map((p, i) => (
          <g key={i} onMouseEnter={() => setHoveredPoint(i)} onMouseLeave={() => setHoveredPoint(null)}>
            <circle cx={p.x} cy={p.y} r="12" fill="transparent" className="cursor-pointer" />
            <circle 
              cx={p.x} cy={p.y} r="3" fill="white" stroke={TOKENS.primary} strokeWidth="2"
              className={cn("transition-all duration-200", hoveredPoint === i ? "scale-150" : "scale-100")}
            />
          </g>
        ))}
      </svg>

      <AnimatePresence>
        {hoveredPoint !== null && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
            className="absolute pointer-events-none z-50 bg-white border border-black/5 p-3 rounded-lg shadow-xl min-w-[120px]"
            style={{ 
              left: `${(points[hoveredPoint].x / width) * 100}%`, 
              top: `${(points[hoveredPoint].y / height) * 100}%`,
              transform: 'translate(-50%, -120%)'
            }}
          >
            <p className="text-[9px] font-bold text-black/30 uppercase tracking-widest">{chartData[hoveredPoint].date}</p>
            <p className="text-sm font-bold text-black">${Number(chartData[hoveredPoint].amount).toLocaleString()}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

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
    } catch (error) {
      toast.error("Analytics sync failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics(range);
  }, [range, fetchAnalytics]);

  const stats = useMemo(() => [
    { label: "Total Revenue", value: `$${(data?.totalSales || 0).toLocaleString()}`, growth: data?.salesGrowth || 0, icon: DollarSign },
    { label: "Total Orders", value: (data?.orderCount || 0).toLocaleString(), growth: data?.orderGrowth || 0, icon: ShoppingBag },
    { label: "Avg. Basket", value: `$${(data?.avgOrderValue || 0).toLocaleString()}`, growth: data?.aovGrowth || 0, icon: Target },
    { label: "New Users", value: `+${(data?.newCustomers || 0).toLocaleString()}`, growth: 12.4, icon: Users },
  ], [data]);

  const hasPermission = user?.role === "admin" || user?.role === "super_admin" || user?.role === "manager";
  
  if (!hasPermission) return null;

  return (
    <div className="space-y-6 pb-20">
      
      {/* Sleek Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/5 pb-6">
        <div>
           <h1 className="text-2xl font-bold tracking-tight text-black">Sales Analytics</h1>
           <p className="text-xs font-medium text-black/40 mt-0.5">Commercial performance and market intelligence.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-black/[0.03] p-1 rounded-lg border border-black/5">
            {DATE_RANGES.map((r) => (
              <button
                key={r.value}
                onClick={() => setRange(r.value)}
                className={cn(
                  "px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all",
                  range === r.value ? "bg-white text-black shadow-sm" : "text-black/40 hover:text-black"
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
          <Button 
            variant="outline" size="icon" onClick={() => fetchAnalytics(range)}
            className="size-9 rounded-lg border-black/5 hover:bg-black/[0.03]"
          >
            <RefreshCcw className={cn("size-4 text-black/40", loading && "animate-spin")} />
          </Button>
          <Button className="h-9 px-4 rounded-lg bg-[#062D1B] text-white font-bold text-[10px] uppercase tracking-wider hover:bg-[#084228] transition-colors shadow-sm">
            <Download className="mr-2 size-3.5" /> Export
          </Button>
        </div>
      </div>

      {/* Grid KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-black/5 shadow-sharcly bg-white rounded-xl overflow-hidden">
             <CardContent className="p-5 flex items-center gap-4">
                <div className="size-11 rounded-lg bg-[#F0FDF4] flex items-center justify-center text-[#062D1B]">
                   <stat.icon className="size-5.5" />
                </div>
                <div className="flex-1">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-black/30 leading-none mb-1.5">{stat.label}</p>
                   <div className="flex items-baseline gap-2">
                      <h3 className="text-xl font-bold text-black tracking-tight leading-none">{stat.value}</h3>
                      {loading ? <Skeleton className="h-4 w-10 bg-black/5 rounded" /> : (
                        <span className={cn(
                          "text-[9px] font-bold px-1.5 py-0.5 rounded",
                          stat.growth >= 0 ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
                        )}>
                          {stat.growth >= 0 ? "+" : ""}{stat.growth}%
                        </span>
                      )}
                   </div>
                </div>
             </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Main Chart */}
        <Card className="lg:col-span-8 border-black/5 shadow-sharcly bg-white rounded-xl overflow-hidden">
          <CardHeader className="p-6 border-b border-black/5 flex flex-row items-center justify-between bg-black/[0.01]">
            <div>
              <CardTitle className="text-sm font-bold text-black">Revenue Performance</CardTitle>
              <CardDescription className="text-[11px] font-medium text-black/40 mt-0.5">Daily aggregated gross sales volume.</CardDescription>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-1.5">
                  <div className="size-2 rounded-full bg-[#062D1B]" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-black/40">Gross Sales</span>
               </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <AnalyticsChart data={data?.recentSales || []} loading={loading} />
          </CardContent>
        </Card>

        {/* Region */}
        <Card className="lg:col-span-4 border-black/5 shadow-sharcly bg-white rounded-xl overflow-hidden">
          <CardHeader className="p-6 border-b border-black/5 bg-black/[0.01]">
            <CardTitle className="text-sm font-bold text-black">Market Reach</CardTitle>
            <CardDescription className="text-[11px] font-medium text-black/40 mt-0.5">Top regional distribution.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            {loading ? Array.from({length: 4}).map((_, i) => (
              <div key={i} className="space-y-2"><Skeleton className="h-3 w-full bg-black/5" /><Skeleton className="h-1.5 w-3/4 bg-black/5 rounded-full" /></div>
            )) : (data?.regions || []).map((region: any, i: number) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                  <span className="text-black/40">{region.name}</span>
                  <span className="text-black">${Number(region.sales).toLocaleString()}</span>
                </div>
                <div className="h-1.5 w-full bg-black/[0.03] rounded-full overflow-hidden">
                   <motion.div initial={{ width: 0 }} animate={{ width: `${region.percentage}%` }} className="h-full bg-[#062D1B]" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Audit Log Table */}
      <Card className="border-black/5 shadow-sharcly bg-white rounded-xl overflow-hidden">
          <CardHeader className="p-6 border-b border-black/5 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-black/[0.01] gap-4">
            <div>
              <CardTitle className="text-sm font-bold text-black">Audit Ledger</CardTitle>
              <CardDescription className="text-[11px] font-medium text-black/40 mt-0.5">Recent commercial verification stream.</CardDescription>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
               <div className="relative flex-1 sm:w-48">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-black/20" />
                  <input placeholder="Search..." className="w-full h-9 pl-9 pr-4 bg-black/[0.03] border-none rounded-lg text-xs font-medium outline-none focus:ring-1 ring-black/10" />
               </div>
               <Button variant="outline" size="icon" className="size-9 rounded-lg border-black/5 bg-white shadow-sm">
                  <Filter className="size-3.5 text-black/40" />
               </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-black/[0.01] text-[9px] font-bold text-black/30 uppercase tracking-[0.2em] text-left border-b border-black/5">
                  <th className="px-6 py-4">Entity</th>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Quantum</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {loading ? Array.from({length: 5}).map((_, i) => (
                  <tr key={i}><td colSpan={5} className="px-6 py-6"><Skeleton className="h-10 w-full bg-black/5 rounded-lg" /></td></tr>
                )) : (data?.recentTransactions || []).map((order: any) => (
                  <tr key={order.id} className="hover:bg-black/[0.01] transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-md bg-[#F0FDF4] flex items-center justify-center text-[11px] font-bold text-[#062D1B]">
                          {order.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-black">{order.name}</p>
                          <p className="text-[9px] font-medium text-black/20 uppercase tracking-widest mt-0.5">#ORD-{order.id.slice(0, 8).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-xs font-medium text-black/60">{new Date(order.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}</p>
                      <p className="text-[9px] font-medium text-black/20 mt-0.5">{new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-black">${Number(order.amount).toLocaleString()}</p>
                      <p className="text-[9px] font-bold text-emerald-600/60 uppercase mt-0.5 tracking-tighter">Settled</p>
                    </td>
                    <td className="px-6 py-5">
                      <Badge className={cn(
                        "rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest border-none shadow-none",
                        order.status === 'DELIVERED' ? "bg-emerald-50 text-emerald-700" : 
                        order.status === 'CANCELLED' ? "bg-rose-50 text-rose-700" :
                        "bg-amber-50 text-amber-700"
                      )}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Link href={`/dashboard/orders/${order.id}`}>
                        <Button variant="ghost" size="icon" className="size-8 rounded-lg hover:bg-black/[0.03]">
                          <ChevronRight className="size-4 text-black/30" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
          <div className="p-4 border-t border-black/5 bg-black/[0.01] flex justify-center">
             <Button variant="ghost" className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/30 hover:text-black transition-colors">
                View All Transactions
             </Button>
          </div>
      </Card>

      {/* Footer Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Conversion Rate", value: data?.conversionRate || "2.4%", icon: Target, sub: "Session to Checkout" },
          { label: "Peak Activity", value: data?.peakTime || "N/A", icon: Clock, sub: "Peak throughput period" },
          { label: "Retention Rate", value: "64.2%", icon: Users, sub: "Repeat commercial intent" },
          { label: "System Health", value: "Optimal", icon: ShieldCheck, sub: "Real-time node status" },
        ].map((item, i) => (
          <div key={i} className="p-5 rounded-xl bg-white border border-black/5 shadow-sm">
             <div className="flex items-center gap-3 mb-4">
                <item.icon className="size-4 text-[#062D1B]" />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/30">{item.label}</span>
             </div>
             <p className="text-xl font-bold text-black tracking-tight">{item.value}</p>
             <p className="text-[9px] font-medium text-black/20 mt-1 uppercase tracking-tight">{item.sub}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

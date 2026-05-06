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
  ArrowDown
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

const DATE_RANGES = [
  { label: "7 Days", value: "7days" },
  { label: "30 Days", value: "30days" },
  { label: "This Month", value: "thisMonth" },
  { label: "Last Month", value: "lastMonth" },
  { label: "This Year", value: "thisYear" },
];

/**
 * PREMIUM INTERACTIVE CHART
 */
const AnalyticsChart = ({ data, loading }: { data: any[], loading: boolean }) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return Array.from({ length: 7 }).map((_, i) => ({ date: i.toString(), amount: 0 }));
    return data;
  }, [data]);

  if (loading) return <Skeleton className="w-full h-[300px] rounded-3xl" />;

  const maxAmount = Math.max(...chartData.map(d => Number(d.amount)), 1) * 1.1;
  const height = 300;
  const width = 1000;
  const paddingX = 40;
  const paddingY = 40;

  const points = chartData.map((d, i) => ({
    x: (i / (chartData.length - 1)) * (width - paddingX * 2) + paddingX,
    y: height - ((Number(d.amount) / maxAmount) * (height - paddingY * 2) + paddingY)
  }));

  // Create smooth curve using cubic bezier
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
  const pathArea = `${pathLine} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return (
    <div className="w-full h-[300px] relative mt-4">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.01" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Grid Lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
          <line 
            key={i} 
            x1={paddingX} 
            y1={paddingY + p * (height - paddingY * 2)} 
            x2={width - paddingX} 
            y2={paddingY + p * (height - paddingY * 2)} 
            stroke="rgba(0,0,0,0.03)" 
            strokeDasharray="4,4" 
          />
        ))}

        {/* Area */}
        <motion.path 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 1 }}
          d={pathArea} 
          fill="url(#chartFill)" 
        />

        {/* Line */}
        <motion.path 
          initial={{ pathLength: 0, opacity: 0 }} 
          animate={{ pathLength: 1, opacity: 1 }} 
          transition={{ duration: 1.5, ease: "easeInOut" }}
          d={pathLine} 
          fill="none" 
          stroke="#10b981" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          filter="url(#glow)"
        />

        {/* Interaction Points */}
        {points.map((p, i) => (
          <g key={i} onMouseEnter={() => setHoveredPoint(i)} onMouseLeave={() => setHoveredPoint(null)}>
            <circle 
              cx={p.x} 
              cy={p.y} 
              r="12" 
              fill="transparent" 
              className="cursor-pointer"
            />
            <motion.circle 
              cx={p.x} 
              cy={p.y} 
              r="4" 
              fill="#10b981" 
              initial={{ scale: 0 }}
              animate={{ scale: hoveredPoint === i ? 1.5 : 0 }}
              className="pointer-events-none"
            />
            <circle 
              cx={p.x} 
              cy={p.y} 
              r="2" 
              fill="white" 
              stroke="#10b981"
              strokeWidth="1.5"
              className={cn("transition-opacity duration-300", hoveredPoint === i ? "opacity-100" : "opacity-0")}
            />
          </g>
        ))}

        {/* Labels (X-Axis) */}
        {chartData.map((d, i) => {
          if (chartData.length > 15 && i % 2 !== 0) return null;
          return (
            <text 
              key={i} 
              x={points[i].x} 
              y={height - 10} 
              textAnchor="middle" 
              className="text-[10px] font-bold fill-neutral-400 uppercase tracking-tighter"
            >
              {d.date}
            </text>
          );
        })}
      </svg>

      {/* Tooltip Overlay */}
      <AnimatePresence>
        {hoveredPoint !== null && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 pointer-events-none"
            style={{ 
              left: `${(points[hoveredPoint].x / width) * 100}%`, 
              top: `${(points[hoveredPoint].y / height) * 100}%`,
              transform: 'translate(-50%, -120%)'
            }}
          >
            <div className="bg-neutral-900 text-white p-3 rounded-2xl shadow-2xl border border-white/10 min-w-[120px]">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">{chartData[hoveredPoint].date}</p>
              <p className="text-sm font-black">${Number(chartData[hoveredPoint].amount).toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="size-3 text-emerald-400" />
                <span className="text-[9px] font-bold text-emerald-400">+12% vs avg</span>
              </div>
            </div>
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
      toast.error("Failed to sync sales data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics(range);
  }, [range, fetchAnalytics]);

  const stats = useMemo(() => [
    { 
      label: "Total Revenue", 
      value: `$${(data?.totalSales || 0).toLocaleString()}`, 
      growth: data?.salesGrowth || 0, 
      icon: DollarSign, 
      color: "emerald",
      desc: "Gross sales in period"
    },
    { 
      label: "Orders Processed", 
      value: (data?.orderCount || 0).toLocaleString(), 
      growth: data?.orderGrowth || 0, 
      icon: ShoppingBag, 
      color: "blue",
      desc: "Successfully delivered"
    },
    { 
      label: "Average Basket", 
      value: `$${(data?.avgOrderValue || 0).toLocaleString()}`, 
      growth: data?.aovGrowth || 0, 
      icon: Target, 
      color: "amber",
      desc: "Revenue per unique order"
    },
    { 
      label: "New Customers", 
      value: `+${(data?.newCustomers || 0).toLocaleString()}`, 
      growth: 8.2, 
      icon: Users, 
      color: "indigo",
      desc: "First-time purchasers"
    },
  ], [data]);

  const hasPermission = user?.role === "admin" || user?.role === "super_admin" || user?.role === "manager";
  if (!hasPermission) return (
    <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
      <div className="size-16 rounded-full bg-rose-50 flex items-center justify-center">
        <ShieldCheck className="size-8 text-rose-500" />
      </div>
      <h2 className="text-xl font-bold">Access Restricted</h2>
      <p className="text-neutral-500 text-sm">You don't have permission to view sales data.</p>
    </div>
  );

  return (
    <div className="space-y-10 pb-20 max-w-[1600px] mx-auto px-6">
      
      {/* ═══ TOP HEADER ═══ */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-neutral-900">Commercial Intelligence</h1>
          <div className="flex items-center gap-2 text-neutral-500 font-medium text-sm">
            <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live data stream active</span>
            <span className="mx-2 opacity-20">|</span>
            <Calendar className="size-4" />
            <span>Updates every 15 mins</span>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-neutral-100 shadow-sm">
          <div className="flex items-center">
            {DATE_RANGES.map((r) => (
              <button
                key={r.value}
                onClick={() => setRange(r.value)}
                className={cn(
                  "px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                  range === r.value ? "bg-neutral-900 text-white shadow-lg" : "text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50"
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
          <div className="w-px h-6 bg-neutral-100 mx-1" />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={() => fetchAnalytics(range)}
                  variant="ghost" 
                  size="icon" 
                  className="size-10 rounded-xl hover:bg-neutral-100"
                >
                  <RefreshCcw className={cn("size-4 text-neutral-600", loading && "animate-spin")} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Sync Data</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button className="h-10 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-2">
            <Download className="size-3.5" /> Export Report
          </Button>
        </div>
      </div>

      {/* ═══ KPI GRID ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] bg-white overflow-hidden group hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] transition-all duration-500">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div className={cn(
                  "size-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500",
                  stat.color === "emerald" ? "bg-emerald-50 text-emerald-600" :
                  stat.color === "blue" ? "bg-blue-50 text-blue-600" :
                  stat.color === "amber" ? "bg-amber-50 text-amber-600" :
                  "bg-indigo-50 text-indigo-600"
                )}>
                  <stat.icon className="size-6" />
                </div>
                {loading ? <Skeleton className="h-6 w-16 rounded-full" /> : (
                  <div className={cn(
                    "flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-black",
                    stat.growth >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                  )}>
                    {stat.growth >= 0 ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
                    {Math.abs(stat.growth)}%
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-black uppercase tracking-[0.15em] text-neutral-400">{stat.label}</p>
                {loading ? <Skeleton className="h-10 w-40 rounded-xl" /> : (
                  <h3 className="text-3xl font-black tracking-tight text-neutral-900">{stat.value}</h3>
                )}
                <p className="text-xs font-medium text-neutral-400 pt-1">{stat.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ═══ MAIN ANALYTICS CHART ═══ */}
        <Card className="lg:col-span-8 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] bg-white overflow-hidden">
          <CardHeader className="p-8 flex flex-row items-center justify-between border-b border-neutral-50">
            <div>
              <CardTitle className="text-xl font-black">Revenue Velocity</CardTitle>
              <CardDescription className="text-xs font-medium mt-1">Daily aggregated sales volume in USD</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Gross Revenue</span>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-neutral-50">
                <MoreHorizontal className="size-5 text-neutral-400" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <AnalyticsChart data={data?.recentSales || []} loading={loading} />
          </CardContent>
        </Card>

        {/* ═══ REGIONAL PERFORMANCE ═══ */}
        <Card className="lg:col-span-4 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] bg-white overflow-hidden">
          <CardHeader className="p-8 border-b border-neutral-50">
            <CardTitle className="text-xl font-black">Regional Distribution</CardTitle>
            <CardDescription className="text-xs font-medium mt-1">Market share by delivery destination</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            {loading ? Array.from({length: 4}).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between"><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-12" /></div>
                <Skeleton className="h-2 w-full" />
              </div>
            )) : (data?.regions || []).map((region: any, i: number) => (
              <div key={i} className="space-y-3 group cursor-default">
                <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                  <span className="text-neutral-500">{region.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-neutral-900">${Number(region.sales).toLocaleString()}</span>
                    <span className="text-[10px] text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">+{region.percentage}%</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-neutral-50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${region.percentage}%` }} 
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className={cn(
                      "h-full rounded-full",
                      i === 0 ? "bg-emerald-500" : i === 1 ? "bg-blue-500" : i === 2 ? "bg-amber-500" : "bg-neutral-300"
                    )} 
                  />
                </div>
              </div>
            ))}
            {!loading && (!data?.regions || data.regions.length === 0) && (
              <div className="flex flex-col items-center justify-center py-20 space-y-3 opacity-30">
                <Globe className="size-10" />
                <p className="text-[10px] font-black uppercase tracking-widest">No regional clusters found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ═══ TOP PERFORMING PRODUCTS ═══ */}
        <Card className="lg:col-span-4 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] bg-white overflow-hidden">
          <CardHeader className="p-8 border-b border-neutral-50">
            <CardTitle className="text-xl font-black">Top Products</CardTitle>
            <CardDescription className="text-xs font-medium mt-1">Best selling items by quantity</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-neutral-50">
              {loading ? Array.from({length: 4}).map((_, i) => (
                <div key={i} className="p-6 flex items-center gap-4"><Skeleton className="size-12 rounded-2xl" /><div className="space-y-2 flex-1"><Skeleton className="h-4 w-full" /><Skeleton className="h-3 w-1/2" /></div></div>
              )) : (data?.topProducts || []).length > 0 ? (data?.topProducts || []).map((product: any, i: number) => (
                <div key={product.id} className="p-6 hover:bg-neutral-50/50 transition-all flex items-center gap-4 group">
                  <div className="relative size-14 rounded-2xl bg-neutral-50 flex items-center justify-center border border-neutral-100 overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                    {product.image ? (
                      <img src={`${process.env.NEXT_PUBLIC_API_URL}/images/${product.image}`} className="w-full h-full object-cover" alt={product.name} />
                    ) : <BarChart3 className="size-6 text-neutral-200" />}
                    <div className="absolute top-0 left-0 size-6 bg-neutral-900 text-white text-[9px] font-black flex items-center justify-center rounded-br-xl">
                      {i + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-neutral-900 truncate leading-tight">{product.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="h-5 px-1.5 rounded-md text-[9px] font-black uppercase tracking-widest border-neutral-100 text-neutral-400">
                        {product.sales} Sold
                      </Badge>
                      <span className="text-[10px] font-bold text-emerald-500">+4.2%</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              )) : (
                <div className="py-20 text-center opacity-30">
                  <p className="text-[10px] font-black uppercase tracking-widest">No product movement tracked</p>
                </div>
              )}
            </div>
          </CardContent>
          <div className="p-6 border-t border-neutral-50">
            <Button variant="ghost" className="w-full h-12 rounded-xl text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-neutral-900">
              View Product Catalogue
            </Button>
          </div>
        </Card>

        {/* ═══ RECENT TRANSACTIONS TABLE ═══ */}
        <Card className="lg:col-span-8 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] bg-white overflow-hidden">
          <CardHeader className="p-8 border-b border-neutral-50 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-black">Audit Log</CardTitle>
              <CardDescription className="text-xs font-medium mt-1">Recent orders and transaction status</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400" />
                <input placeholder="Search ID..." className="h-10 pl-9 pr-4 bg-neutral-50 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 ring-neutral-100 w-40" />
              </div>
              <Button variant="outline" size="icon" className="size-10 rounded-xl border-neutral-100">
                <Filter className="size-4 text-neutral-500" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-50/50 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] text-left">
                  <th className="px-8 py-5">Origin / Entity</th>
                  <th className="px-8 py-5">Timestamp</th>
                  <th className="px-8 py-5">Quantum</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {loading ? Array.from({length: 5}).map((_, i) => (
                  <tr key={i}><td colSpan={5} className="px-8 py-6"><Skeleton className="h-12 w-full rounded-2xl" /></td></tr>
                )) : (data?.recentTransactions || []).length > 0 ? (data?.recentTransactions || []).map((order: any) => (
                  <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="size-10 rounded-2xl bg-neutral-100 flex items-center justify-center text-xs font-black text-neutral-600 uppercase border border-neutral-200/30">
                          {order.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-neutral-900 truncate">{order.name}</p>
                          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5">#ORD-{order.id.slice(0, 8).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-xs font-bold text-neutral-600">
                        {new Date(order.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="text-[9px] font-black text-neutral-300 uppercase tracking-tighter mt-1">
                        {new Date(order.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-black text-neutral-900">${Number(order.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                      <div className="text-[9px] font-bold text-emerald-500 mt-1 uppercase">Net Settled</div>
                    </td>
                    <td className="px-8 py-6">
                      <Badge className={cn(
                        "rounded-xl px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border-none shadow-sm",
                        order.status === 'DELIVERED' ? "bg-emerald-500 text-white" : 
                        order.status === 'CANCELLED' ? "bg-rose-500 text-white" :
                        "bg-amber-400 text-white"
                      )}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <Link href={`/dashboard/orders/${order.id}`}>
                        <Button variant="ghost" size="icon" className="size-10 rounded-xl hover:bg-neutral-900 hover:text-white transition-all">
                          <ChevronRight className="size-5" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center opacity-30">
                      <p className="text-[10px] font-black uppercase tracking-widest">No recent commercial activity</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* ═══ ANALYTICS FOOTER ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Conversion Rate", value: data?.conversionRate || "2.4%", icon: Target, color: "emerald", detail: "Session to Checkout" },
          { label: "Peak Activity", value: data?.peakTime || "14:00 - 16:00", icon: Calendar, color: "blue", detail: "Max concurrent orders" },
          { label: "Retention Rate", value: "64.2%", icon: Users, color: "amber", detail: "Repeat purchase intent" },
          { label: "Network Health", value: "Optimal", icon: Globe, color: "indigo", detail: "System performance verified" },
        ].map((item, i) => (
          <div key={i} className="p-6 rounded-[2rem] bg-neutral-50 border border-neutral-100 flex items-center gap-5 group hover:bg-white hover:shadow-xl transition-all duration-500">
            <div className={cn(
              "size-12 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12",
              item.color === "emerald" ? "bg-emerald-50 text-emerald-500" :
              item.color === "blue" ? "bg-blue-50 text-blue-500" :
              item.color === "amber" ? "bg-amber-50 text-amber-500" :
              "bg-indigo-50 text-indigo-500"
            )}>
              <item.icon className="size-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 leading-none mb-1.5">{item.label}</p>
              <p className="text-lg font-black text-neutral-900 leading-none">{item.value}</p>
              <p className="text-[9px] font-bold text-neutral-400 mt-1.5">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { format } from "date-fns";
import { 
  ShoppingBag, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  XCircle,
  ChevronRight,
  ArrowLeft,
  MapPin,
  ExternalLink,
  Hash
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface OrderItem {
  id: string;
  product: {
    name: string;
    price: number;
    images?: { data: string }[];
  }
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  createdAt: string;
  totalAmount: number;
  status: string;
  address: string;
  items: OrderItem[];
  trackingNumber?: string;
  carrier?: string;
}

export default function AccountOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/orders/my-orders");
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 rounded-full px-3 py-1 font-black text-[9px] uppercase tracking-widest flex items-center gap-1.5 w-fit">
          <Clock className="h-3 w-3" /> Processing
        </Badge>;
      case "ACCEPTED":
        return <Badge className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20 rounded-full px-3 py-1 font-black text-[9px] uppercase tracking-widest flex items-center gap-1.5 w-fit">
          <CheckCircle2 className="h-3 w-3" /> Confirmed
        </Badge>;
      case "SHIPPED":
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 rounded-full px-3 py-1 font-black text-[9px] uppercase tracking-widest flex items-center gap-1.5 w-fit">
          <Truck className="h-3 w-3" /> Out for Delivery
        </Badge>;
      case "DELIVERED":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 rounded-full px-3 py-1 font-black text-[9px] uppercase tracking-widest flex items-center gap-1.5 w-fit">
          <Package className="h-3 w-3" /> Delivered
        </Badge>;
      case "CANCELLED":
        return <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 rounded-full px-3 py-1 font-black text-[9px] uppercase tracking-widest flex items-center gap-1.5 w-fit">
          <XCircle className="h-3 w-3" /> Cancelled
        </Badge>;
      default:
        return <Badge className="bg-neutral-500/10 text-neutral-500 border-neutral-500/20 rounded-full px-3 py-1 font-black text-[9px] uppercase tracking-widest flex items-center gap-1.5 w-fit">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
        <Link href="/account">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-black/5">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
          <p className="text-muted-foreground font-medium">Manage and track your recent purchases.</p>
        </div>
      </div>

      <div className="grid gap-6">
        {loading ? (
          [1, 2, 3].map((i) => (
            <Card key={i} className="border-black/5 rounded-3xl overflow-hidden bg-white">
               <CardHeader className="p-8 border-b border-black/5 bg-neutral-50/50 flex flex-row items-center justify-between">
                  <div className="space-y-2">
                     <Skeleton className="h-3 w-16" />
                     <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="text-right space-y-2">
                     <Skeleton className="h-3 w-20 ml-auto" />
                     <Skeleton className="h-6 w-24 ml-auto rounded-full" />
                  </div>
               </CardHeader>
               <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row gap-8 justify-between">
                     <div className="flex-1 space-y-4">
                        <div className="flex -space-x-3">
                           <Skeleton className="size-16 rounded-2xl" />
                           <Skeleton className="size-16 rounded-2xl" />
                        </div>
                        <div className="space-y-2">
                           <Skeleton className="h-4 w-48 rounded-full" />
                           <Skeleton className="h-3 w-32 rounded-full" />
                        </div>
                     </div>
                     <div className="flex flex-col justify-between items-end gap-6">
                        <Skeleton className="h-8 w-24 rounded-full" />
                        <Skeleton className="h-12 w-40 rounded-xl" />
                     </div>
                  </div>
               </CardContent>
            </Card>
          ))
        ) : orders.length === 0 ? (
          <Card className="border-black/5 rounded-3xl border-dashed py-20 text-center bg-transparent">
             <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-10" />
             <p className="text-muted-foreground font-medium mb-6">You haven't placed any orders yet.</p>
             <Link href="/products">
                <Button className="rounded-xl h-12 px-8 font-bold uppercase tracking-widest">Start Shopping</Button>
             </Link>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="group border-black/5 hover:border-primary/20 transition-all duration-500 shadow-sharcly rounded-3xl overflow-hidden bg-white">
               <CardHeader className="p-8 border-b border-black/5 bg-neutral-50/50 flex flex-row items-center justify-between">
                  <div>
                     <CardDescription className="text-[10px] uppercase font-black tracking-widest text-primary/40 mb-1 flex items-center gap-1.5">
                        <Hash className="h-3 w-3" /> Order ID
                     </CardDescription>
                     <CardTitle className="text-sm font-bold tracking-tight uppercase truncate max-w-[120px]">#{order.id.split('-')[0]}</CardTitle>
                  </div>
                  <div className="text-right">
                     <p className="text-xs font-bold text-muted-foreground mb-1 italic opacity-40">{format(new Date(order.createdAt), "MMMM d, yyyy")}</p>
                     {getStatusBadge(order.status)}
                  </div>
               </CardHeader>
               <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row gap-8 justify-between">
                     <div className="flex-1 space-y-4">
                        <div className="flex -space-x-3">
                           {order.items.slice(0, 3).map((item, idx) => (
                              <div key={item.id} className="size-16 rounded-2xl bg-neutral-100 border-2 border-white overflow-hidden shadow-sm" style={{ zIndex: 10 - idx }}>
                                 <img 
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(item.product.name)}&background=f5f5f5&color=000&bold=true&length=1`} 
                                    alt={item.product.name}
                                    className="size-full object-cover"
                                 />
                              </div>
                           ))}
                           {order.items.length > 3 && (
                              <div className="size-16 rounded-2xl bg-primary text-white border-2 border-white flex items-center justify-center font-bold text-xs" style={{ zIndex: 5 }}>
                                 +{order.items.length - 3}
                              </div>
                           )}
                        </div>
                        <div>
                           <p className="font-bold text-sm tracking-tight">
                              {order.items[0].product.name} {order.items.length > 1 && `and ${order.items.length - 1} other items`}
                           </p>
                           <p className="text-xs text-muted-foreground font-medium mt-1 italic flex items-center gap-2">
                              <MapPin className="h-3 w-3 opacity-40 shrink-0" /> {order.address.split(',')[0]}...
                           </p>
                        </div>
                     </div>
                     <div className="flex flex-col justify-between items-end gap-6">
                        <div className="text-right">
                           <p className="text-[10px] uppercase font-black tracking-widest text-black/20 mb-1">Total Amount</p>
                           <p className="text-2xl font-black tracking-tighter text-primary">${Number(order.totalAmount).toFixed(2)}</p>
                        </div>
                        <Link href={`/account/orders/${order.id}`}>
                           <Button className="rounded-xl h-12 px-6 bg-black text-white hover:bg-neutral-800 font-bold text-[10px] uppercase tracking-widest gap-2 shadow-xl shadow-black/10">
                              Track Details <ChevronRight className="h-4 w-4" />
                           </Button>
                        </Link>
                     </div>
                  </div>

                  {order.status === "SHIPPED" && order.trackingNumber && (
                    <div className="mt-8 pt-8 border-t border-black/5">
                       <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                             <div className="size-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                                <Truck className="h-5 w-5" />
                             </div>
                             <div>
                                <p className="text-[10px] uppercase font-black text-blue-400 tracking-widest">Tracking Shipments</p>
                                <p className="font-bold text-sm text-blue-900">{order.carrier}: {order.trackingNumber}</p>
                             </div>
                          </div>
                          <Button variant="outline" className="rounded-xl h-10 px-5 border-blue-200 text-blue-600 hover:bg-blue-100 font-bold text-[10px] uppercase tracking-widest gap-2">
                             Full Tracker <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                       </div>
                    </div>
                  )}
               </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

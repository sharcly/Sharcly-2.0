"use client";

import { useEffect, useState, use } from "react";
import { apiClient } from "@/lib/api-client";
import { format } from "date-fns";
import { 
  ArrowLeft,
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  XCircle,
  MapPin,
  ExternalLink,
  ShoppingBag,
  CreditCard,
  ChevronRight,
  ShieldCheck,
  Mail,
  Store,
  Download
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { toast } from "sonner";

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
  taxAmount: number;
  shippingAmount: number;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  notes?: string;
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/orders/${id}`);
      if (response.data.success) {
        setOrder(response.data.order);
      }
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
        case "PENDING":
          return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 rounded-full px-4 py-1.5 font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5 w-fit">
            <Clock className="h-3.5 w-3.5" /> Processing
          </Badge>;
        case "CONFIRMED":
          return <Badge className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20 rounded-full px-4 py-1.5 font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5 w-fit">
            <CheckCircle2 className="h-3.5 w-3.5" /> Confirmed
          </Badge>;
        case "PREPARING":
          return <Badge className="bg-violet-500/10 text-violet-500 border-violet-500/20 rounded-full px-4 py-1.5 font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5 w-fit">
            <Clock className="h-3.5 w-3.5" /> Preparing
          </Badge>;
        case "SHIPPED":
          return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 rounded-full px-4 py-1.5 font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5 w-fit">
            <Truck className="h-3.5 w-3.5" /> In Transit
          </Badge>;
        case "DELIVERED":
          return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 rounded-full px-4 py-1.5 font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5 w-fit">
            <Package className="h-3.5 w-3.5" /> Delivered
          </Badge>;
        case "CANCELLED":
          return <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 rounded-full px-4 py-1.5 font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5 w-fit">
            <XCircle className="h-3.5 w-3.5" /> Cancelled
          </Badge>;
        default:
          return <Badge className="bg-neutral-500/10 text-neutral-500 border-neutral-500/20 rounded-full px-4 py-1.5 font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5 w-fit">{status}</Badge>;
      }
  };

  const statusSteps = [
    { key: "PENDING", label: "Processing", icon: Clock },
    { key: "CONFIRMED", label: "Confirmed", icon: CheckCircle2 },
    { key: "PREPARING", label: "Preparing", icon: Clock },
    { key: "SHIPPED", label: "In Transit", icon: Truck },
    { key: "DELIVERED", label: "Delivered", icon: Package },
  ];

  const currentStatusIndex = order ? statusSteps.findIndex(s => s.key === order.status) : -1;
  const isCancelled = order?.status === "CANCELLED";

  const handleDownloadInvoice = async () => {
    if (!order) return;
    try {
      const response = await apiClient.get(`/orders/${order.id}/invoice`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${order.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error("Failed to download invoice");
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        <Skeleton className="h-10 w-48 rounded-full" />
        <div className="grid md:grid-cols-3 gap-8">
          <Skeleton className="md:col-span-2 h-[600px] rounded-3xl" />
          <Skeleton className="h-[400px] rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Order not found</h2>
        <Link href="/account/orders">
           <Button className="rounded-xl h-12 px-8 font-bold uppercase tracking-widest">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <Link href="/account/orders">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-black/5">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Order Details</h1>
            <p className="text-muted-foreground font-medium flex items-center gap-1.5 uppercase text-[10px] font-black tracking-widest opacity-40 mt-1">
              Order #{order.id}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="gap-2 rounded-xl h-12 px-6 border-black/5 hover:bg-black/5 font-bold text-xs uppercase tracking-widest"
            onClick={handleDownloadInvoice}
          >
            <Download className="h-4 w-4" /> Download Invoice
          </Button>
          {getStatusBadge(order.status)}
        </div>
      </div>

      {!isCancelled && (
        <Card className="border-black/5 shadow-sharcly rounded-3xl overflow-hidden bg-white">
          <CardContent className="p-8 md:p-12">
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-6 left-0 right-0 h-1 bg-neutral-100 hidden md:block">
                <div 
                  className="h-full bg-primary transition-all duration-1000 ease-out" 
                  style={{ width: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%` }}
                />
              </div>

              <div className="relative flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4">
                {statusSteps.map((step, idx) => {
                  const Icon = step.icon;
                  const isCompleted = idx <= currentStatusIndex;
                  const isCurrent = idx === currentStatusIndex;

                  return (
                    <div key={step.key} className="flex flex-col items-center text-center z-10 space-y-3">
                       <div className={`size-12 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                         isCompleted 
                          ? "bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/20" 
                          : "bg-white border-neutral-100 text-neutral-300"
                       }`}>
                          <Icon className="h-5 w-5" />
                       </div>
                       <div>
                          <p className={`text-xs font-black uppercase tracking-widest ${isCompleted ? "text-primary" : "text-neutral-300 opacity-60"}`}>
                            {step.label}
                          </p>
                          {isCurrent && (
                            <p className="text-[10px] font-bold text-muted-foreground/40 mt-0.5 px-2 py-0.5 bg-black/5 rounded-full inline-block">Current Stage</p>
                          )}
                       </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isCancelled && (
        <div className="p-8 rounded-3xl bg-rose-50 border border-rose-100 flex items-center gap-6">
           <div className="size-16 rounded-2xl bg-rose-100 text-rose-500 flex items-center justify-center">
              <XCircle className="h-8 w-8" />
           </div>
           <div>
              <h3 className="text-xl font-bold text-rose-900">Order Cancelled</h3>
              <p className="text-rose-700/60 font-medium">This order was cancelled and will not be processed further. If this was an error, please contact support.</p>
           </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Items & Shipping Tracker */}
        <div className="md:col-span-2 space-y-8">
           <Card className="border-black/5 shadow-sharcly rounded-3xl overflow-hidden bg-white">
              <CardHeader className="p-8 border-b border-black/5">
                 <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-primary/40" /> Order Summary
                 </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                 <Table>
                    <TableBody>
                       {order.items.map((item) => (
                          <TableRow key={item.id} className="border-black/5 hover:bg-transparent">
                             <TableCell className="pl-8 py-6">
                                <div className="flex items-center gap-6">
                                   <div className="size-20 rounded-2xl bg-neutral-50 overflow-hidden border border-black/5 flex-shrink-0">
                                      <img 
                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(item.product.name)}&background=f5f5f5&color=000&bold=true&length=1`} 
                                        alt={item.product.name}
                                        className="size-full object-cover"
                                      />
                                   </div>
                                   <div>
                                      <h4 className="font-bold text-lg tracking-tight mb-1">{item.product.name}</h4>
                                      <p className="text-xs text-muted-foreground font-medium italic">
                                         ${Number(item.price).toFixed(2)} per unit
                                      </p>
                                   </div>
                                </div>
                             </TableCell>
                             <TableCell className="text-center py-6 font-bold text-muted-foreground/40 italic">
                                × {item.quantity}
                             </TableCell>
                             <TableCell className="pr-8 py-6 text-right">
                                <p className="font-black text-lg tracking-tighter text-black">
                                   ${(Number(item.price) * item.quantity).toFixed(2)}
                                </p>
                             </TableCell>
                          </TableRow>
                       ))}
                    </TableBody>
                 </Table>

                 <div className="p-10 bg-neutral-50/50 border-t border-black/5">
                    <div className="flex flex-col md:flex-row justify-between gap-8">
                       <div className="space-y-4 max-w-xs">
                          <h4 className="text-[10px] uppercase font-black tracking-widest text-primary/40">Shipping Address</h4>
                          <div className="flex gap-3 text-sm font-medium text-muted-foreground leading-relaxed italic">
                             <MapPin className="h-4 w-4 shrink-0 text-primary opacity-40 mt-1" />
                             {order.address}
                          </div>
                       </div>
                       <div className="space-y-3 min-w-[200px]">
                           <div className="flex justify-between items-center text-sm font-medium text-muted-foreground/60">
                              <span>Subtotal</span>
                              <span>${(Number(order.totalAmount) - Number(order.taxAmount || 0) - Number(order.shippingAmount || 0)).toFixed(2)}</span>
                           </div>
                           <div className="flex justify-between items-center text-sm font-medium text-muted-foreground/60">
                              <span>Tax</span>
                              <span>${Number(order.taxAmount || 0).toFixed(2)}</span>
                           </div>
                           <div className="flex justify-between items-center text-sm font-medium text-muted-foreground/60">
                              <span>Shipping</span>
                              <span>{Number(order.shippingAmount || 0) > 0 ? `$${Number(order.shippingAmount).toFixed(2)}` : 'FREE'}</span>
                           </div>
                           <div className="h-[1px] bg-black/5 my-2" />
                           <div className="flex justify-between items-end">
                              <span className="text-[10px] uppercase font-black tracking-widest text-primary/40 mb-1">Grand Total</span>
                              <span className="text-3xl font-black tracking-tighter text-primary">${Number(order.totalAmount).toFixed(2)}</span>
                           </div>
                        </div>
                    </div>
                 </div>
              </CardContent>
           </Card>

           {order.status === "SHIPPED" && (
             <Card className="border-0 shadow-2xl shadow-blue-100 rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
                <CardContent className="p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                   <div className="space-y-4">
                      <div className="flex items-center gap-3">
                         <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                            <Truck className="h-5 w-5" />
                         </div>
                         <h3 className="text-xl font-bold">In Transit</h3>
                      </div>
                      <p className="text-blue-100 font-medium">Your package is currently with our carrier <strong>{order.carrier}</strong>. Click below to view live tracking.</p>
                      <div className="inline-block p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                         <p className="text-[10px] uppercase font-black tracking-widest text-white/40 mb-1">Tracking Number</p>
                         <p className="text-lg font-black tracking-widest">{order.trackingNumber}</p>
                      </div>
                   </div>
                   <Button className="rounded-2xl h-14 px-8 bg-white text-blue-600 hover:bg-neutral-100 font-bold uppercase tracking-widest gap-2 shadow-xl shrink-0">
                      Live Tracker <ExternalLink className="h-5 w-5" />
                   </Button>
                </CardContent>
             </Card>
           )}
        </div>

        {/* Right Column: Order Info & Support */}
        <div className="space-y-8">
           <Card className="border-black/5 shadow-sharcly rounded-3xl overflow-hidden bg-white">
              <CardHeader className="p-8 pb-4">
                 <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-primary/40" /> Order Information
                 </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-6">
                 <div className="space-y-1">
                    <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/40">Placement Date</p>
                    <p className="font-bold text-sm">{format(new Date(order.createdAt), "MMMM d, yyyy")}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/40">Preferred Delivery</p>
                    <p className="font-bold text-sm italic">{order.estimatedDelivery ? format(new Date(order.estimatedDelivery), "MMMM d, yyyy") : "Express Standard"}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/40">Secure Status</p>
                    <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-widest">
                       <ShieldCheck className="h-4 w-4" /> Verified Payment
                    </div>
                 </div>
              </CardContent>
           </Card>

           <Card className="border-black/5 shadow-sharcly rounded-3xl overflow-hidden bg-primary text-white">
              <CardContent className="p-8 space-y-4">
                 <h3 className="font-bold text-lg">Need Assistance?</h3>
                 <p className="text-white/60 text-xs font-medium leading-relaxed italic">Our lifestyle support team is available 24/7 to help you with any questions regarding your order.</p>
                 <div className="space-y-2 pt-2">
                    <Button variant="outline" className="w-full rounded-xl h-11 bg-white/5 border-white/10 hover:bg-white/10 text-white font-bold text-[10px] uppercase tracking-widest gap-2">
                       <Mail className="h-4 w-4" /> Message Support
                    </Button>
                    <Button variant="outline" className="w-full rounded-xl h-11 bg-white/5 border-white/10 hover:bg-white/10 text-white font-bold text-[10px] uppercase tracking-widest gap-2">
                       <Store className="h-4 w-4" /> Store Policy
                    </Button>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}

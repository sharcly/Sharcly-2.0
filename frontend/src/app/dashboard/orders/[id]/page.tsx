"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  CheckCircle2, 
  Clock, 
  Truck, 
  Package, 
  XCircle,
  MapPin,
  User,
  CreditCard,
  Download,
  ArrowLeft,
  Calendar,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api-client";
import { format } from "date-fns";
import { toast } from "sonner";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [updating, setUpdating] = useState(false);
  const [isShipFormOpen, setIsShipFormOpen] = useState(false);
  const [shipData, setShipData] = useState({ trackingNumber: "", carrier: "" });

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/orders/${id}`);
      if (response.data.success) {
        setOrder(response.data.order);
      }
    } catch (error) {
      console.error("Failed to fetch order:", error);
      toast.error("Order not found");
      router.push("/dashboard/orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status: string, additionalData = {}) => {
    try {
      setUpdating(true);
      const response = await apiClient.patch(`/orders/${id}/status`, { status, ...additionalData });
      if (response.data.success) {
        setOrder(response.data.order);
        toast.success(`Order status updated to ${status}`);
        setIsShipFormOpen(false);
      }
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 rounded-full px-3 py-1 font-black text-[9px] uppercase tracking-widest flex items-center gap-1.5 w-fit">
          <Clock className="h-3 w-3" /> Pending
        </Badge>;
      case "CONFIRMED":
        return <Badge className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20 rounded-full px-3 py-1 font-black text-[9px] uppercase tracking-widest flex items-center gap-1.5 w-fit">
          <CheckCircle2 className="h-3 w-3" /> Confirmed
        </Badge>;
      case "PREPARING":
        return <Badge className="bg-violet-500/10 text-violet-500 border-violet-500/20 rounded-full px-3 py-1 font-black text-[9px] uppercase tracking-widest flex items-center gap-1.5 w-fit">
          <Clock className="h-3 w-3" /> Preparing
        </Badge>;
      case "SHIPPED":
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 rounded-full px-3 py-1 font-black text-[9px] uppercase tracking-widest flex items-center gap-1.5 w-fit">
          <Truck className="h-3 w-3" /> Shipped
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

  const handleDownloadInvoice = async () => {
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
      <div className="space-y-8 p-8 animate-in fade-in duration-700">
        <Skeleton className="h-8 w-48" />
        <div className="grid md:grid-cols-3 gap-8">
           <Skeleton className="h-[400px] md:col-span-2 rounded-3xl" />
           <Skeleton className="h-[400px] rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-xl hover:bg-black/5" 
            onClick={() => router.push("/dashboard/orders")}
          >
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">Order Details</h1>
              {getStatusBadge(order.status)}
            </div>
            <p className="text-muted-foreground text-sm font-medium mt-1">
              Order ID: <span className="text-primary font-bold">#{order.id}</span> • {format(new Date(order.createdAt), "MMMM d, yyyy 'at' h:mm a")}
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
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Actions */}
          <Card className="border-black/5 shadow-sharcly rounded-3xl bg-white overflow-hidden">
             <CardContent className="p-8 space-y-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                   <Package className="h-5 w-5 text-primary/40" /> Order Fulfillment
                </h3>
                <div className="flex flex-wrap gap-3">
                  {order.status === "PENDING" && (
                    <Button 
                      className="rounded-xl h-12 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-widest gap-2 shadow-lg shadow-indigo-200"
                      onClick={() => updateStatus("CONFIRMED")}
                      disabled={updating}
                    >
                      <CheckCircle2 className="h-4 w-4" /> Confirm Order
                    </Button>
                  )}
                  {order.status === "CONFIRMED" && (
                    <Button 
                      className="rounded-xl h-12 px-6 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-widest gap-2 shadow-lg shadow-violet-200"
                      onClick={() => updateStatus("PREPARING")}
                      disabled={updating}
                    >
                      <Clock className="h-4 w-4" /> Start Preparing
                    </Button>
                  )}
                  {order.status === "PREPARING" && (
                    <Button 
                      className="rounded-xl h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest gap-2 shadow-lg shadow-blue-200"
                      onClick={() => setIsShipFormOpen(true)}
                      disabled={updating}
                    >
                      <Truck className="h-4 w-4" /> Finalize Shipment
                    </Button>
                  )}
                  {order.status === "SHIPPED" && (
                    <Button 
                      className="rounded-xl h-12 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-widest gap-2 shadow-lg shadow-emerald-200"
                      onClick={() => updateStatus("DELIVERED")}
                      disabled={updating}
                    >
                      <Package className="h-4 w-4" /> Mark Delivered
                    </Button>
                  )}
                  {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
                    <Button 
                      variant="outline"
                      className="rounded-xl h-12 px-6 text-rose-500 border-rose-100 hover:bg-rose-50 font-bold text-xs uppercase tracking-widest gap-2"
                      onClick={() => updateStatus("CANCELLED")}
                      disabled={updating}
                    >
                      <XCircle className="h-4 w-4" /> Cancel Order
                    </Button>
                  )}
                </div>
             </CardContent>
          </Card>

          {/* Items */}
          <Card className="border-black/5 shadow-sharcly rounded-3xl bg-white overflow-hidden">
             <CardContent className="p-8">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
                   <Package className="h-5 w-5 text-primary/40" /> Order Items
                </h3>
                <div className="space-y-4">
                   {order.items.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50/50 border border-black/5 group hover:bg-neutral-50 transition-all">
                        <div className="flex items-center gap-4">
                           <div className="size-16 rounded-xl bg-white overflow-hidden border border-black/5 p-2">
                              <img 
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(item.product.name)}&background=f5f5f5&color=000&bold=true&length=1`} 
                                alt={item.product.name}
                                className="size-full object-contain"
                              />
                           </div>
                           <div>
                              <p className="font-bold text-sm">{item.product.name}</p>
                              <p className="text-xs text-muted-foreground font-medium italic">${Number(item.price).toFixed(2)} × {item.quantity}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="font-black text-sm">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                   ))}
                </div>
             </CardContent>
          </Card>

          {/* Shipment Tracking info if available */}
          {(order.trackingNumber || order.carrier) && (
            <Card className="border-black/5 shadow-sharcly rounded-3xl bg-blue-50/30 border-blue-100 overflow-hidden">
               <CardContent className="p-8 space-y-4">
                  <h3 className="font-bold text-blue-900 flex items-center gap-2">
                      <Truck className="h-5 w-5" /> Shipping Information
                  </h3>
                  <div className="grid grid-cols-2 gap-8">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-blue-400 tracking-widest mb-1.5">Carrier</p>
                        <p className="font-bold text-base text-blue-800">{order.carrier || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-blue-400 tracking-widest mb-1.5">Tracking Number</p>
                        <p className="font-bold text-base text-blue-800 flex items-center gap-2">
                          {order.trackingNumber || "N/A"}
                          <ExternalLink className="h-4 w-4 opacity-40 cursor-pointer" />
                        </p>
                      </div>
                  </div>
               </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
           <Card className="border-black/5 shadow-sharcly rounded-3xl bg-white overflow-hidden">
              <CardContent className="p-8 space-y-6">
                 <div>
                    <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                       <User className="h-5 w-5 text-primary/40" /> Customer
                    </h3>
                    <div className="p-4 rounded-2xl border border-black/5 bg-neutral-50/50">
                       <p className="font-bold text-sm">{order.user.name}</p>
                       <p className="text-xs text-muted-foreground font-medium">{order.user.email}</p>
                    </div>
                 </div>

                 <div>
                    <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                       <MapPin className="h-5 w-5 text-primary/40" /> Shipping Address
                    </h3>
                    <div className="p-4 rounded-2xl border border-black/5 bg-neutral-50/50">
                       <p className="text-sm font-medium leading-relaxed text-muted-foreground italic">
                          {order.address}
                       </p>
                    </div>
                 </div>

                 <div>
                    <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                       <CreditCard className="h-5 w-5 text-primary/40" /> Payment Summary
                    </h3>
                    <div className="p-8 rounded-[2rem] bg-[#0A0A0A] text-white space-y-6 shadow-2xl relative overflow-hidden group border border-white/5">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full -mr-20 -mt-20 blur-[80px] group-hover:bg-primary/20 transition-all duration-1000" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full -ml-16 -mb-16 blur-[60px]" />

                        {(() => {
                           const itemsSubtotal = order.items.reduce((acc: number, item: any) => acc + (Number(item.price) * item.quantity), 0);
                           const tax = Number(order.taxAmount || 0);
                           const shipping = Number(order.shippingAmount || 0);
                           const total = Number(order.totalAmount || 0);
                           const discount = Math.max(0, itemsSubtotal + tax + shipping - total);

                           return (
                              <>
                                 <div className="space-y-4 relative z-10">
                                    <div className="flex justify-between items-center">
                                       <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30">Items Subtotal</span>
                                       <span className="font-bold text-sm tabular-nums text-white/90">${itemsSubtotal.toFixed(2)}</span>
                                    </div>
                                    {discount > 0 && (
                                       <div className="flex justify-between items-center">
                                          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-rose-400/50">Discount Applied</span>
                                          <span className="font-bold text-sm tabular-nums text-rose-400">-${discount.toFixed(2)}</span>
                                       </div>
                                    )}
                                    <div className="flex justify-between items-center">
                                       <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30">Tax (Vat)</span>
                                       <span className="font-bold text-sm tabular-nums text-white/90">${tax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                       <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30">Shipping</span>
                                       <span className="font-bold text-sm tabular-nums text-white/90">
                                          {shipping > 0 ? `$${shipping.toFixed(2)}` : 'FREE'}
                                       </span>
                                    </div>
                                 </div>

                                 <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-2" />
                                 
                                 <div className="flex justify-between items-end relative z-10 pt-2">
                                    <div>
                                       <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-1.5">Amount Paid</p>
                                       <div className="flex items-center gap-2">
                                          <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                          <p className="text-[10px] text-emerald-500/60 font-bold uppercase tracking-wider">Settled</p>
                                       </div>
                                    </div>
                                    <div className="text-right">
                                       <span className="text-4xl font-black tabular-nums tracking-tighter bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
                                          ${total.toFixed(2)}
                                       </span>
                                    </div>
                                 </div>
                              </>
                           );
                        })()}
                    </div>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>

      {/* Shipping Form Dialog */}
      <Dialog open={isShipFormOpen} onOpenChange={setIsShipFormOpen}>
        <DialogContent className="max-w-md p-8 rounded-3xl border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Fulfill Order</DialogTitle>
            <DialogDescription className="font-medium">Enter the shipping details to notify the customer.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Shipping Carrier</label>
              <Input 
                placeholder="e.g. UPS, FedEx, DHL" 
                className="h-12 rounded-xl bg-neutral-50 border-black/5 font-bold"
                value={shipData.carrier}
                onChange={(e) => setShipData({...shipData, carrier: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Tracking Number</label>
              <Input 
                placeholder="Enter tracking ID" 
                className="h-12 rounded-xl bg-neutral-50 border-black/5 font-bold"
                value={shipData.trackingNumber}
                onChange={(e) => setShipData({...shipData, trackingNumber: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter className="mt-8 flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              className="w-full rounded-xl h-12 font-bold uppercase tracking-widest"
              onClick={() => setIsShipFormOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="w-full rounded-xl h-12 bg-primary font-bold uppercase tracking-widest shadow-lg text-white"
              disabled={updating || !shipData.trackingNumber}
              onClick={() => updateStatus("SHIPPED", shipData)}
            >
              Dispatch Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
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
  Eye, 
  Truck, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Search,
  Download,
  ShoppingBag,
  Package,
  MapPin,
  Calendar,
  ExternalLink,
  ChevronRight,
  User,
  CreditCard,
  Hash,
  ArrowLeft
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { apiClient } from "@/lib/api-client";
import { format } from "date-fns";
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
  customerName?: string;
  user: {
    name: string;
    email: string;
  };
  createdAt: string;
  totalAmount: number;
  status: string;
  address: string;
  items: OrderItem[];
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  notes?: string;
}

export default function DashboardOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isShipFormOpen, setIsShipFormOpen] = useState(false);
  const [shipData, setShipData] = useState({ trackingNumber: "", carrier: "" });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/orders/all");
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string, additionalData = {}) => {
    // Optimistic Update
    const previousOrders = [...orders];
    const previousSelectedOrder = selectedOrder ? { ...selectedOrder } : null;

    setOrders(prev => prev.map(o => o.id === id ? { ...o, status, ...additionalData } : o));
    if (selectedOrder?.id === id) {
      setSelectedOrder({ ...selectedOrder, status, ...additionalData });
    }
    setIsShipFormOpen(false);

    try {
      setUpdating(true);
      const response = await apiClient.patch(`/orders/${id}/status`, { status, ...additionalData });
      if (response.data.success) {
        toast.success(`Order status updated to ${status}`);
        // No need to fetchOrders() immediately if UI is in sync
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      toast.error("Failed to update status");
      // Rollback
      setOrders(previousOrders);
      setSelectedOrder(previousSelectedOrder);
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
      case "ACCEPTED":
        return <Badge className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20 rounded-full px-3 py-1 font-black text-[9px] uppercase tracking-widest flex items-center gap-1.5 w-fit">
          <CheckCircle2 className="h-3 w-3" /> Accepted
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

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(search.toLowerCase()) || 
    order.user.name.toLowerCase().includes(search.toLowerCase()) ||
    order.user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
           <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <ShoppingBag className="size-5" />
           </div>
           <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Customer Orders</h1>
              <p className="text-muted-foreground text-sm font-medium">Track and fulfill your shop's latest sales and shipments.</p>
           </div>
        </div>
        <Button variant="outline" className="gap-2 rounded-xl h-12 px-6 border-black/5 hover:bg-black/5 font-bold text-xs uppercase tracking-widest">
          <Download className="h-4 w-4" /> Export List
        </Button>
      </div>

      <Card className="border-black/5 shadow-sharcly rounded-3xl overflow-hidden bg-white">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-black/5 p-8">
           <div>
              <CardTitle className="text-xl font-bold">Recent Sales</CardTitle>
              <CardDescription className="text-[10px] uppercase font-bold tracking-widest opacity-40 mt-1">Live order activity</CardDescription>
           </div>
           <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
              <Input 
                placeholder="Search orders..." 
                className="pl-10 h-11 rounded-xl bg-neutral-50 border-black/5 font-medium" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-neutral-50/50">
              <TableRow className="hover:bg-transparent border-black/5">
                <TableHead className="pl-8 py-4 font-black uppercase text-[10px] tracking-widest text-black/40">Order ID</TableHead>
                <TableHead className="py-4 font-black uppercase text-[10px] tracking-widest text-black/40">Customer</TableHead>
                <TableHead className="py-4 font-black uppercase text-[10px] tracking-widest text-black/40">Date</TableHead>
                <TableHead className="py-4 font-black uppercase text-[10px] tracking-widest text-black/40">Total Amount</TableHead>
                <TableHead className="py-4 font-black uppercase text-[10px] tracking-widest text-black/40">Status</TableHead>
                <TableHead className="text-right pr-8 py-4 font-black uppercase text-[10px] tracking-widest text-black/40">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-black/5">
                    <TableCell className="pl-8 py-5"><Skeleton className="h-4 w-16 rounded-full" /></TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1.5">
                        <Skeleton className="h-4 w-32 rounded-full" />
                        <Skeleton className="h-3 w-40 rounded-full" />
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-4 w-24 rounded-full" /></TableCell>
                    <TableCell>
                       <div className="flex flex-col gap-1.5">
                          <Skeleton className="h-4 w-16 rounded-full" />
                          <Skeleton className="h-3 w-12 rounded-full" />
                       </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell className="pr-8 text-right"><Skeleton className="h-10 w-10 ml-auto rounded-xl" /></TableCell>
                  </TableRow>
                ))
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground font-medium italic">No orders found.</TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id} className="border-black/5 group hover:bg-neutral-50 transition-all duration-300">
                    <TableCell className="pl-8 py-5">
                       <span className="font-bold text-xs text-primary tracking-tight truncate max-w-[80px] block">#{order.id.split('-')[0]}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm tracking-tight">{order.user.name || "Guest"}</span>
                        <span className="text-[10px] text-muted-foreground font-medium">{order.user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs font-medium italic">{format(new Date(order.createdAt), "MMM d, h:mm a")}</TableCell>
                    <TableCell>
                       <div className="flex flex-col">
                          <span className="font-black text-sm tracking-tight">${Number(order.totalAmount).toFixed(2)}</span>
                          <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">({order.items.length} items)</span>
                       </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(order.status)}
                    </TableCell>
                    <TableCell className="text-right pr-8">
                       <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-10 w-10 rounded-xl hover:bg-black/5 transition-all opacity-0 group-hover:opacity-100"
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsDetailOpen(true);
                        }}
                       >
                          <Eye className="h-4 w-4 text-primary" />
                       </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-3xl border-0 shadow-2xl">
          {selectedOrder && (
            <div className="flex flex-col h-[85vh]">
              {/* Header */}
              <div className="p-8 border-b border-black/5 bg-neutral-50/50">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-2xl font-bold tracking-tight">Order Details</h2>
                      <span className="text-xs font-bold text-muted-foreground/40 bg-black/5 px-2 py-0.5 rounded-full uppercase tracking-tighter">#{selectedOrder.id}</span>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium flex items-center gap-1.5">
                      Placed on {format(new Date(selectedOrder.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                  {getStatusBadge(selectedOrder.status)}
                </div>

                <div className="flex flex-wrap gap-4">
                  {selectedOrder.status === "PENDING" && (
                    <Button 
                      className="rounded-xl h-12 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-widest gap-2 shadow-lg shadow-indigo-200"
                      onClick={() => updateStatus(selectedOrder.id, "ACCEPTED")}
                      disabled={updating}
                    >
                      <CheckCircle2 className="h-4 w-4" /> Accept Order
                    </Button>
                  )}
                  {selectedOrder.status === "ACCEPTED" && (
                    <Button 
                      className="rounded-xl h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest gap-2 shadow-lg shadow-blue-200"
                      onClick={() => setIsShipFormOpen(true)}
                      disabled={updating}
                    >
                      <Truck className="h-4 w-4" /> Finalize Shipment
                    </Button>
                  )}
                  {selectedOrder.status === "SHIPPED" && (
                    <Button 
                      className="rounded-xl h-12 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-widest gap-2 shadow-lg shadow-emerald-200"
                      onClick={() => updateStatus(selectedOrder.id, "DELIVERED")}
                      disabled={updating}
                    >
                      <Package className="h-4 w-4" /> Mark Delivered
                    </Button>
                  )}
                  {selectedOrder.status !== "CANCELLED" && selectedOrder.status !== "DELIVERED" && (
                    <Button 
                      variant="outline"
                      className="rounded-xl h-12 px-6 text-rose-500 border-rose-100 hover:bg-rose-50 font-bold text-xs uppercase tracking-widest gap-2"
                      onClick={() => updateStatus(selectedOrder.id, "CANCELLED")}
                      disabled={updating}
                    >
                      <XCircle className="h-4 w-4" /> Cancel Order
                    </Button>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-8 bg-white grid md:grid-cols-3 gap-8">
                {/* Left Column: Items */}
                <div className="md:col-span-2 space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                       <Package className="h-5 w-5 text-primary/40" /> Order Items
                    </h3>
                    <div className="border border-black/5 rounded-2xl overflow-hidden">
                      <Table>
                        <TableBody>
                          {selectedOrder.items.map((item) => (
                            <TableRow key={item.id} className="border-black/5 hover:bg-transparent">
                              <TableCell className="py-4">
                                <div className="flex items-center gap-4">
                                  <div className="size-14 rounded-xl bg-neutral-100 overflow-hidden border border-black/5 flex-shrink-0">
                                    {/* Product Image placeholder */}
                                    <img 
                                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(item.product.name)}&background=f5f5f5&color=000&bold=true&length=1`} 
                                      alt={item.product.name}
                                      className="size-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <p className="font-bold text-sm tracking-tight">{item.product.name}</p>
                                    <p className="text-xs text-muted-foreground font-medium italic">${Number(item.price).toFixed(2)} × {item.quantity}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-right py-4 font-black text-sm pr-6">
                                ${(Number(item.price) * item.quantity).toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Shipment Tracking info if available */}
                  {(selectedOrder.trackingNumber || selectedOrder.carrier) && (
                    <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-4">
                       <h3 className="font-bold text-blue-900 flex items-center gap-2">
                          <Truck className="h-5 w-5" /> Shipping Information
                       </h3>
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[10px] uppercase font-bold text-blue-400 tracking-widest mb-1">Carrier</p>
                            <p className="font-bold text-sm text-blue-800">{selectedOrder.carrier || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-bold text-blue-400 tracking-widest mb-1">Tracking Number</p>
                            <p className="font-bold text-sm text-blue-800 flex items-center gap-2">
                              {selectedOrder.trackingNumber || "N/A"}
                              <ExternalLink className="h-3 w-3 opacity-40" />
                            </p>
                          </div>
                       </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Customer & Payment */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                       <User className="h-5 w-5 text-primary/40" /> Customer
                    </h3>
                    <div className="p-5 rounded-2xl border border-black/5 space-y-3">
                       <div>
                          <p className="font-bold text-sm">{selectedOrder.user.name}</p>
                          <p className="text-xs text-muted-foreground font-medium">{selectedOrder.user.email}</p>
                       </div>
                       <Button variant="link" className="p-0 text-primary h-auto text-xs font-bold uppercase tracking-widest">
                          View Profile <ChevronRight className="h-3 w-3" />
                       </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                       <MapPin className="h-5 w-5 text-primary/40" /> Shipping Address
                    </h3>
                    <div className="p-5 rounded-2xl border border-black/5">
                       <p className="text-sm font-medium leading-relaxed text-muted-foreground italic">
                          {selectedOrder.address}
                       </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                       <CreditCard className="h-5 w-5 text-primary/40" /> Payment Summary
                    </h3>
                    <div className="p-5 rounded-2xl border border-black/5 bg-neutral-50/50 space-y-2">
                       <div className="flex justify-between text-xs font-medium text-muted-foreground">
                          <span>Subtotal</span>
                          <span>${Number(selectedOrder.totalAmount).toFixed(2)}</span>
                       </div>
                       <div className="flex justify-between text-xs font-medium text-muted-foreground">
                          <span>Shipping</span>
                          <span>FREE</span>
                       </div>
                       <div className="h-[1px] bg-black/5 my-2" />
                       <div className="flex justify-between items-center font-black text-lg">
                          <span className="tracking-tighter uppercase text-[10px] text-muted-foreground opacity-40">Total Amount</span>
                          <span className="text-primary">${Number(selectedOrder.totalAmount).toFixed(2)}</span>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-black/5 text-center">
                 <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/30">Order processed via Scarly Admin System v2.0</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Shipping Form Dialog */}
      <Dialog open={isShipFormOpen} onOpenChange={setIsShipFormOpen}>
        <DialogContent className="max-w-md p-8 rounded-3xl">
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
              className="w-full rounded-xl h-12 bg-primary font-bold uppercase tracking-widest shadow-lg"
              disabled={updating || !shipData.trackingNumber}
              onClick={() => selectedOrder && updateStatus(selectedOrder.id, "SHIPPED", shipData)}
            >
              Dispatch Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


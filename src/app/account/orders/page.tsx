"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { ShoppingBag, ArrowRight, Package } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiClient.get("/orders/my-orders");
        setOrders(response.data.orders || []);
      } catch (error) {
        console.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-[#062D1B]">Order History</h2>
        <p className="text-gray-500">Check the status of recent orders, manage returns, and download invoices.</p>
      </div>

      <div className="min-h-[400px]">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-gray-200 rounded-2xl">
            <ShoppingBag className="size-10 opacity-10 mx-auto mb-4" />
            <p className="text-gray-400 mb-6">You haven't placed any orders yet.</p>
            <Link href="/products" className="inline-flex h-10 px-6 items-center rounded-lg bg-[#062D1B] text-white text-xs font-bold hover:opacity-90 transition-all">
              Go to products
            </Link>
          </div>
        ) : (
          <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="group hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-6 font-bold text-sm">#{order.display_id || order.id.slice(-8).toUpperCase()}</td>
                    <td className="px-6 py-6 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-6">
                      <Badge className={cn(
                        "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest border-none shadow-none",
                        order.status === 'completed' ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                      )}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-6 font-bold text-sm">${Number(order.totalAmount)}</td>
                    <td className="px-6 py-6 text-right">
                      <Link href={`/account/orders/${order.id}`} className="text-xs font-bold text-[#062D1B] hover:underline">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

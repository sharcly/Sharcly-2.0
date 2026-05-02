"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { apiClient } from "@/lib/api-client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AccountPage() {
  const { user } = useAuth();
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const response = await apiClient.get("/orders/my-orders");
        setRecentOrders(response.data.orders?.slice(0, 3) || []);
      } catch (error) {
        console.error("Failed to fetch recent orders");
      } finally {
        setLoading(false);
      }
    };
    fetchRecentOrders();
  }, []);

  if (!user) return null;

  return (
    <div className="space-y-12 max-w-4xl">
      <section className="space-y-4">
        <h2 className="text-4xl font-bold tracking-tight text-[#062D1B]">
          Hello, {user.name?.split(' ')[0] || 'Member'}
        </h2>
        <p className="text-gray-500 max-w-2xl text-lg leading-relaxed">
          From your account overview, you can easily check your recent orders, manage your shipping addresses, and edit your password and account details.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Recent Orders Card */}
        <div className="border border-gray-100 rounded-2xl p-8 bg-white shadow-sm flex flex-col justify-between min-h-[300px]">
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Recent Orders</h3>
            {loading ? (
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-50 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex justify-between items-center text-sm border-b border-gray-50 pb-3">
                    <div>
                      <p className="font-bold">#{order.display_id || order.id.slice(-8).toUpperCase()}</p>
                      <p className="text-gray-400 text-xs">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="font-bold text-[#062D1B]">${Number(order.totalAmount)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">You haven't placed any orders yet.</p>
            )}
          </div>
          <Link href="/account/orders" className="inline-flex items-center gap-2 text-sm font-bold text-[#062D1B] hover:gap-3 transition-all group pt-6">
            {recentOrders.length > 0 ? "View all orders" : "Start shopping"} <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* Account Details Card */}
        <div className="border border-gray-100 rounded-2xl p-8 bg-white shadow-sm flex flex-col justify-between min-h-[300px]">
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Account Details</h3>
            <div className="space-y-1">
              <p className="font-bold">{user.name}</p>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>
          </div>
          <Link href="/account/profile" className="inline-flex items-center gap-2 text-sm font-bold text-[#062D1B] hover:gap-3 transition-all">
            Edit profile <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>

      {/* Quick Links Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-8 border-t border-gray-100">
        <Link href="/account/orders" className="group p-6 rounded-xl border border-gray-100 hover:border-[#062D1B] hover:bg-gray-50 transition-all">
          <h4 className="font-bold mb-2">Order History</h4>
          <p className="text-xs text-gray-400">Review your past purchases and track deliveries.</p>
        </Link>
        <Link href="/account/addresses" className="group p-6 rounded-xl border border-gray-100 hover:border-[#062D1B] hover:bg-gray-50 transition-all">
          <h4 className="font-bold mb-2">Shipping Addresses</h4>
          <h4 className="font-bold mb-2">Shipping Addresses</h4>
          <p className="text-xs text-gray-400">Add or edit your delivery locations.</p>
        </Link>
        <Link href="/account/payments" className="group p-6 rounded-xl border border-gray-100 hover:border-[#062D1B] hover:bg-gray-50 transition-all">
          <h4 className="font-bold mb-2">Payment Methods</h4>
          <p className="text-xs text-gray-400">Securely manage your cards and payments.</p>
        </Link>
      </section>
    </div>
  );
}

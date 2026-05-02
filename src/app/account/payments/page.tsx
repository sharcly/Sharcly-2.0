"use client";

import { useEffect, useState } from "react";
import { CreditCard, Plus, Trash2, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const response = await apiClient.get("/payments");
      setPayments(response.data.paymentMethods || []);
    } catch (error) {
      console.error("Failed to fetch payment methods");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/payments/${id}`);
      toast.success("Payment method removed");
      setPayments(payments.filter(p => p.id !== id));
    } catch (error) {
      toast.error("Failed to remove payment method");
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-[#062D1B]">Payment Methods</h2>
          <p className="text-gray-500">Securely manage your saved credit and debit cards.</p>
        </div>
        <Button className="h-10 px-6 rounded-lg bg-[#062D1B] hover:opacity-90 text-white text-xs font-bold gap-2 transition-all">
          <Plus className="size-4" /> Add Payment Method
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {loading ? (
          <div className="h-48 bg-gray-50 rounded-xl animate-pulse" />
        ) : payments.length === 0 ? (
          <div className="md:col-span-2 py-20 text-center border border-dashed border-gray-200 rounded-2xl">
            <CreditCard className="size-10 opacity-10 mx-auto mb-4" />
            <p className="text-gray-400">No payment methods found.</p>
          </div>
        ) : (
          payments.map((pm) => (
            <div
              key={pm.id}
              className="group relative bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:border-[#062D1B] transition-all"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="size-10 rounded-lg bg-gray-50 flex items-center justify-center">
                  <CreditCard className="size-5 text-[#062D1B]" />
                </div>
                {pm.is_default && (
                  <Badge className="bg-emerald-50 text-emerald-600 border-none px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-full shadow-none">
                    Default
                  </Badge>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-xl font-black tracking-widest">•••• •••• •••• {pm.last4}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-medium uppercase">{pm.brand} •••• {pm.last4}</span>
                  <button 
                    onClick={() => handleDelete(pm.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        <div className="p-6 rounded-xl bg-gray-50 flex items-start gap-4">
          <div className="p-2 rounded-lg bg-white border border-gray-100">
            <Lock className="size-4 text-gray-400" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold">Secure Transactions</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              We use bank-grade encryption to protect your data. We never store your full card details on our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

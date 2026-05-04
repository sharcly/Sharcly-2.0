"use client";

import { useState, useEffect } from "react";
import { Search, Mail, Calendar, User, ShieldCheck, ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { format } from "date-fns";

export default function NewsletterSubscribersPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const response = await apiClient.get("/marketing/subscribers");
      setSubscribers(response.data);
    } catch (error) {
      toast.error("Failed to fetch subscribers");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSubscribers = subscribers.filter(subscriber => 
    subscriber.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 italic serif">Newsletter Subscribers</h2>
          <p className="text-sm text-neutral-500 font-medium">View and manage users who signed up for the newsletter.</p>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
          <Input 
            placeholder="Search email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="h-10 pl-10 rounded-xl border-neutral-100 bg-neutral-50/50"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-black/5 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/50 border-b border-neutral-50">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Subscriber Email</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Date Subscribed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {filteredSubscribers.map((subscriber) => (
                <tr key={subscriber.id} className="hover:bg-neutral-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Mail size={14} />
                      </div>
                      <span className="text-sm font-bold text-neutral-900">{subscriber.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {subscriber.isActive ? (
                      <div className="flex items-center gap-2 text-emerald-600">
                        <ShieldCheck size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-rose-600">
                        <ShieldAlert size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Unsubscribed</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-400 font-medium">
                      <Calendar size={12} />
                      {format(new Date(subscriber.createdAt), "MMM d, yyyy • HH:mm")}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredSubscribers.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={3} className="px-6 py-20 text-center">
                    <div className="space-y-3">
                      <div className="size-12 bg-neutral-50 rounded-xl flex items-center justify-center mx-auto text-neutral-200">
                        <User size={24} />
                      </div>
                      <p className="text-sm font-medium text-neutral-400">No subscribers found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

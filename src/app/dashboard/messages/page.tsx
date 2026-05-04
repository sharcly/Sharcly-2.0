"use client";

import { useState, useEffect } from "react";
import { Search, Mail, Calendar, User, MessageSquare, Trash2, CheckCircle2, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await apiClient.get("/contact");
      setMessages(response.data);
    } catch (error) {
      toast.error("Failed to fetch messages");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "READ" ? "UNREAD" : "READ";
      await apiClient.patch(`/contact/${id}/status`, { status: newStatus });
      toast.success(`Message marked as ${newStatus.toLowerCase()}`);
      fetchMessages();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      await apiClient.delete(`/contact/${id}`);
      toast.success("Message deleted");
      fetchMessages();
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  const filteredMessages = messages.filter(msg => 
    msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 italic serif">Contact Messages</h2>
          <p className="text-sm text-neutral-500 font-medium">Manage and respond to user inquiries and support requests.</p>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
          <Input 
            placeholder="Search name, email, subject..."
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
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Sender</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Inquiry</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Received</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {filteredMessages.map((msg) => (
                <tr key={msg.id} className={`hover:bg-neutral-50/30 transition-colors group ${msg.status === 'UNREAD' ? 'bg-emerald-50/20' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                       <p className="text-sm font-bold text-neutral-900">{msg.name}</p>
                       <p className="text-xs text-neutral-400 flex items-center gap-1">
                          <Mail size={10} /> {msg.email}
                       </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-md">
                    <div className="space-y-1">
                       <p className="text-sm font-bold text-neutral-900">{msg.subject}</p>
                       <p className="text-xs text-neutral-500 line-clamp-1 italic">"{msg.message}"</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={`rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest border-none ${msg.status === 'UNREAD' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                       {msg.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
                      <Calendar size={12} />
                      {format(new Date(msg.createdAt), "MMM d, HH:mm")}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         onClick={() => handleUpdateStatus(msg.id, msg.status)}
                         className={`size-8 rounded-lg ${msg.status === 'UNREAD' ? 'text-emerald-600 hover:bg-emerald-50' : 'text-neutral-400 hover:bg-neutral-100'}`}
                         title={msg.status === 'UNREAD' ? "Mark as Read" : "Mark as Unread"}
                       >
                          {msg.status === 'UNREAD' ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                       </Button>
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         onClick={() => handleDelete(msg.id)}
                         className="size-8 rounded-lg text-rose-500 hover:bg-rose-50"
                         title="Delete Message"
                       >
                          <Trash2 size={16} />
                       </Button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredMessages.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="space-y-3">
                      <div className="size-12 bg-neutral-50 rounded-xl flex items-center justify-center mx-auto text-neutral-200">
                        <MessageSquare size={24} />
                      </div>
                      <p className="text-sm font-medium text-neutral-400">No messages found.</p>
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

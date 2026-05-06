"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Mail, Phone, Calendar, MessageSquare, MoreHorizontal, ExternalLink, Building2, User } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function InquiriesView() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const response = await apiClient.get("/wholesale/inquiries");
      if (response.data.success) {
        setInquiries(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch inquiries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredInquiries = inquiries.filter(inquiry => 
    inquiry.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.contactName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input 
            placeholder="Search by business, contact, or email..." 
            className="h-14 pl-12 bg-white border-none rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus-visible:ring-emerald-500/20 transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
            <Badge variant="outline" className="h-10 px-4 rounded-xl border-neutral-200 text-neutral-500 font-bold uppercase tracking-widest text-[9px]">
                {filteredInquiries.length} Inquiries Total
            </Badge>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-neutral-50/50">
            <TableRow className="border-b-neutral-100 hover:bg-transparent">
              <TableHead className="font-black uppercase tracking-[0.15em] text-[10px] text-neutral-400 px-8 py-6">Business Name</TableHead>
              <TableHead className="font-black uppercase tracking-[0.15em] text-[10px] text-neutral-400">Primary Contact</TableHead>
              <TableHead className="font-black uppercase tracking-[0.15em] text-[10px] text-neutral-400">Business Type</TableHead>
              <TableHead className="font-black uppercase tracking-[0.15em] text-[10px] text-neutral-400">Estimated Volume</TableHead>
              <TableHead className="font-black uppercase tracking-[0.15em] text-[10px] text-neutral-400">Date Received</TableHead>
              <TableHead className="font-black uppercase tracking-[0.15em] text-[10px] text-neutral-400 text-right pr-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i} className="border-b-neutral-50">
                  <TableCell className="px-8 py-6"><Skeleton className="h-5 w-48 rounded-lg" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32 rounded-lg" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16 rounded-lg" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24 rounded-lg" /></TableCell>
                  <TableCell className="text-right pr-8"><Skeleton className="h-10 w-10 ml-auto rounded-xl" /></TableCell>
                </TableRow>
              ))
            ) : filteredInquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-[450px] text-center">
                  <div className="flex flex-col items-center justify-center space-y-4 opacity-20">
                    <div className="size-20 rounded-[2rem] bg-neutral-100 flex items-center justify-center">
                        <MessageSquare className="w-10 h-10" />
                    </div>
                    <p className="font-black uppercase tracking-[0.2em] text-xs">No inquiries found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredInquiries.map((inquiry) => (
                <TableRow key={inquiry.id} className="border-b-neutral-50 hover:bg-neutral-50/50 transition-colors group">
                  <TableCell className="px-8 py-6">
                    <div className="flex items-center gap-4">
                        <div className="size-10 rounded-2xl bg-neutral-100 flex items-center justify-center text-xs font-black text-neutral-400 uppercase">
                            {inquiry.businessName.charAt(0)}
                        </div>
                        <div>
                            <p className="font-black text-neutral-900 text-base">{inquiry.businessName}</p>
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5">Company</p>
                        </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-bold text-sm text-neutral-800 flex items-center gap-2">
                        {inquiry.contactName}
                      </p>
                      <div className="flex flex-col gap-0.5 text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">
                        <span className="flex items-center gap-1.5"><Mail className="w-3 h-3 opacity-50" /> {inquiry.email}</span>
                        <span className="flex items-center gap-1.5"><Phone className="w-3 h-3 opacity-50" /> {inquiry.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="px-3 py-1 bg-emerald-50 text-emerald-700 border-none rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm">
                      {inquiry.businessType}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-black text-neutral-900 text-xs">{inquiry.estimatedVolume || "N/A"}</TableCell>
                  <TableCell className="text-neutral-400 text-[10px] font-black uppercase tracking-widest">
                    {format(new Date(inquiry.createdAt), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-neutral-900 hover:text-white transition-all">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl rounded-[2.5rem] border-none p-0 bg-white shadow-2xl overflow-hidden">
                        <div className="bg-emerald-600 p-8 text-white relative">
                            <div className="flex items-center gap-3 mb-2">
                                <Building2 className="size-6 text-emerald-200" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-100/60">Partner Details</p>
                            </div>
                            <h2 className="text-3xl font-black tracking-tight">{inquiry.businessName}</h2>
                        </div>
                        <div className="p-10 space-y-10">
                          <div className="grid grid-cols-2 gap-10">
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-neutral-400">
                                <User className="size-3.5" />
                                <p className="text-[10px] font-black uppercase tracking-widest">Contact Person</p>
                              </div>
                              <p className="font-black text-xl text-neutral-900">{inquiry.contactName}</p>
                            </div>
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-neutral-400">
                                <Calendar className="size-3.5" />
                                <p className="text-[10px] font-black uppercase tracking-widest">Date Sent</p>
                              </div>
                              <p className="font-black text-xl text-neutral-900">{format(new Date(inquiry.createdAt), "MMMM dd, yyyy")}</p>
                            </div>
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-neutral-400">
                                <Mail className="size-3.5" />
                                <p className="text-[10px] font-black uppercase tracking-widest">Email Address</p>
                              </div>
                              <p className="font-bold text-neutral-900">{inquiry.email}</p>
                            </div>
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-neutral-400">
                                <Phone className="size-3.5" />
                                <p className="text-[10px] font-black uppercase tracking-widest">Phone Number</p>
                              </div>
                              <p className="font-bold text-neutral-900">{inquiry.phone}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-4 pt-8 border-t border-neutral-100">
                            <div className="flex items-center gap-2 text-neutral-400">
                                <MessageSquare className="size-3.5" />
                                <p className="text-[10px] font-black uppercase tracking-widest">Message from Partner</p>
                            </div>
                            <div className="text-sm font-medium leading-relaxed text-neutral-600 bg-neutral-50 p-8 rounded-[2rem] border border-neutral-100 italic relative">
                              <div className="absolute -top-3 left-8 size-6 bg-white border border-neutral-100 rounded-lg flex items-center justify-center font-serif text-emerald-600 text-xl font-black">"</div>
                              {inquiry.message || "No message provided."}
                            </div>
                          </div>

                          <div className="flex justify-end gap-3 pt-4">
                            <Button variant="ghost" className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] text-neutral-400 hover:text-neutral-900 transition-all">
                              Close
                            </Button>
                            <Button className="h-14 px-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-600/20 transition-all active:scale-95">
                              Reply to Inquiry
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

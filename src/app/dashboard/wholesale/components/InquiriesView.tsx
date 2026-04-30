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
import { Search, Mail, Phone, Calendar, MessageSquare, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0d2719]/30" />
        <Input 
          placeholder="Search by name, email or business..." 
          className="h-12 pl-12 bg-white border-[#0d2719]/5 rounded-2xl focus:ring-2 focus:ring-[#0d2719]/10 transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-[2rem] border border-[#0d2719]/5 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-[#0d2719]/5">
            <TableRow className="border-b-[#0d2719]/5 hover:bg-transparent">
              <TableHead className="font-black uppercase tracking-widest text-[10px] text-[#0d2719]/60 px-8 py-6">Business</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px] text-[#0d2719]/60">Contact</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px] text-[#0d2719]/60">Type</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px] text-[#0d2719]/60">Est. Volume</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px] text-[#0d2719]/60">Date</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px] text-[#0d2719]/60 text-right pr-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i} className="border-b-[#0d2719]/5">
                  <TableCell className="px-8 py-6"><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell className="text-right pr-8"><Skeleton className="h-8 w-8 ml-auto rounded-lg" /></TableCell>
                </TableRow>
              ))
            ) : filteredInquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-[400px] text-center">
                  <div className="flex flex-col items-center justify-center space-y-4 opacity-30">
                    <MessageSquare className="w-12 h-12" />
                    <p className="font-serif text-xl">No inquiries found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredInquiries.map((inquiry) => (
                <TableRow key={inquiry.id} className="border-b-[#0d2719]/5 hover:bg-[#f0f9f0]/50 transition-colors">
                  <TableCell className="px-8 py-6 font-serif text-[#0d2719] text-lg">{inquiry.businessName}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-bold text-sm text-[#0d2719]">{inquiry.contactName}</p>
                      <div className="flex items-center gap-4 text-[10px] font-medium text-black/40">
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {inquiry.email}</span>
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {inquiry.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-3 py-1 bg-[#0d2719]/5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#0d2719]">
                      {inquiry.businessType}
                    </span>
                  </TableCell>
                  <TableCell className="font-bold text-[#0d2719]/60">{inquiry.estimatedVolume || "N/A"}</TableCell>
                  <TableCell className="text-black/40 text-[10px] font-black uppercase tracking-widest">
                    {format(new Date(inquiry.createdAt), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-[#0d2719] hover:text-white transition-all">
                          <MoreHorizontal className="w-5 h-5" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl rounded-[2.5rem] border-none p-10 bg-[#f0f9f0] shadow-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-3xl font-serif text-[#0d2719] mb-6">Inquiry Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-8">
                          <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2">
                              <p className="text-[10px] font-black uppercase tracking-widest text-black/30">Business</p>
                              <p className="font-serif text-xl text-[#0d2719]">{inquiry.businessName}</p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-[10px] font-black uppercase tracking-widest text-black/30">Contact</p>
                              <p className="font-bold text-lg text-[#0d2719]">{inquiry.contactName}</p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-[10px] font-black uppercase tracking-widest text-black/30">Email</p>
                              <p className="font-medium text-[#0d2719]">{inquiry.email}</p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-[10px] font-black uppercase tracking-widest text-black/30">Phone</p>
                              <p className="font-medium text-[#0d2719]">{inquiry.phone}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3 pt-6 border-t border-[#0d2719]/5">
                            <p className="text-[10px] font-black uppercase tracking-widest text-black/30">Message</p>
                            <p className="text-sm font-medium leading-relaxed text-[#0d2719]/80 bg-white p-6 rounded-2xl italic">
                              "{inquiry.message || "No message provided."}"
                            </p>
                          </div>

                          <div className="flex justify-end gap-4 pt-6">
                            <Button className="h-12 px-8 bg-[#0d2719] text-white rounded-xl font-bold uppercase tracking-widest text-[10px]">
                              Reply to Partner
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

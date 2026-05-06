"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";

export function WholesaleForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await apiClient.post("/wholesale/inquiries", data);

      if (!response.data.success) throw new Error("Failed to submit inquiry");

      setIsSuccess(true);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-12 bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 text-center space-y-6"
      >
        <div className="size-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20">
          <CheckCircle2 className="size-10 text-white" />
        </div>
        <h3 className="text-3xl font-black text-white tracking-tight">Application Sent</h3>
        <p className="text-white/60 font-medium max-w-sm mx-auto">Thanks for your interest! Our partnership team will review your application and get back to you within 24 hours.</p>
        <Button 
          onClick={() => setIsSuccess(false)}
          variant="ghost" 
          className="text-emerald-400 font-black uppercase tracking-widest text-[10px] hover:text-emerald-300"
        >
          Send Another Application
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="relative p-8 md:p-12 bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden">
        {/* Decorative Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]" />
        
        <form onSubmit={handleSubmit} className="relative z-10 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
            {/* Business Name */}
            <div className="space-y-3">
              <Label htmlFor="businessName" className="text-white/40 text-[10px] font-black ml-1 uppercase tracking-[0.2em]">Business Name</Label>
              <Input
                id="businessName"
                name="businessName"
                placeholder="Your Company Name"
                required
                className="h-16 bg-white border-none text-neutral-900 rounded-2xl focus-visible:ring-2 focus-visible:ring-emerald-500/50 transition-all placeholder:text-neutral-300 font-bold"
              />
            </div>

            {/* Contact Name */}
            <div className="space-y-3">
              <Label htmlFor="contactName" className="text-white/40 text-[10px] font-black ml-1 uppercase tracking-[0.2em]">Your Name</Label>
              <Input
                id="contactName"
                name="contactName"
                placeholder="Full Name"
                required
                className="h-16 bg-white border-none text-neutral-900 rounded-2xl focus-visible:ring-2 focus-visible:ring-emerald-500/50 transition-all placeholder:text-neutral-300 font-bold"
              />
            </div>

            {/* Email */}
            <div className="space-y-3">
              <Label htmlFor="email" className="text-white/40 text-[10px] font-black ml-1 uppercase tracking-[0.2em]">Work Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="email@company.com"
                required
                className="h-16 bg-white border-none text-neutral-900 rounded-2xl focus-visible:ring-2 focus-visible:ring-emerald-500/50 transition-all placeholder:text-neutral-300 font-bold"
              />
            </div>

            {/* Phone */}
            <div className="space-y-3">
              <Label htmlFor="phone" className="text-white/40 text-[10px] font-black ml-1 uppercase tracking-[0.2em]">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Contact Number"
                required
                className="h-16 bg-white border-none text-neutral-900 rounded-2xl focus-visible:ring-2 focus-visible:ring-emerald-500/50 transition-all placeholder:text-neutral-300 font-bold"
              />
            </div>

            {/* Business Type */}
            <div className="space-y-3">
              <Label className="text-white/40 text-[10px] font-black ml-1 uppercase tracking-[0.2em]">Business Type</Label>
              <Select name="businessType" required>
                <SelectTrigger className="h-16 bg-white border-none text-neutral-900 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 font-bold">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                  <SelectItem value="retail" className="rounded-xl py-3 font-bold">Retail Store</SelectItem>
                  <SelectItem value="dispensary" className="rounded-xl py-3 font-bold">Dispensary</SelectItem>
                  <SelectItem value="wellness" className="rounded-xl py-3 font-bold">Wellness / Spa</SelectItem>
                  <SelectItem value="online" className="rounded-xl py-3 font-bold">Online Shop</SelectItem>
                  <SelectItem value="distributor" className="rounded-xl py-3 font-bold">Distributor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Estimated Volume */}
            <div className="space-y-3">
              <Label htmlFor="estimatedVolume" className="text-white/40 text-[10px] font-black ml-1 uppercase tracking-[0.2em]">Monthly Volume</Label>
              <Input
                id="estimatedVolume"
                name="estimatedVolume"
                placeholder="Expected Orders"
                className="h-16 bg-white border-none text-neutral-900 rounded-2xl focus-visible:ring-2 focus-visible:ring-emerald-500/50 transition-all placeholder:text-neutral-300 font-bold"
              />
            </div>
          </div>

          {/* Message */}
          <div className="space-y-3">
            <Label htmlFor="message" className="text-white/40 text-[10px] font-black ml-1 uppercase tracking-[0.2em]">Additional Details</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Tell us about your business goals..."
              className="min-h-[140px] bg-white border-none text-neutral-900 rounded-3xl focus-visible:ring-2 focus-visible:ring-emerald-500/50 transition-all placeholder:text-neutral-300 p-6 font-bold"
            />
          </div>

          <div className="pt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-18 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-[0.25em] rounded-2xl transition-all duration-300 shadow-xl shadow-emerald-600/20 active:scale-[0.98]"
            >
              {isSubmitting ? (
                 <div className="flex items-center gap-3">
                    <Loader2 className="size-4 animate-spin" />
                    Processing...
                 </div>
              ) : "Submit Partnership Inquiry"}
            </Button>
            
            <p className="mt-8 text-white/20 text-center text-[9px] font-black tracking-[0.3em] uppercase">
              Fast Response Guaranteed • Secure Data Handling
            </p>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

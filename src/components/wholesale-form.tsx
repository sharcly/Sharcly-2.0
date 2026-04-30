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

import { apiClient } from "@/lib/api-client";

export function WholesaleForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await apiClient.post("/wholesale/inquiries", data);

      if (!response.data.success) throw new Error("Failed to submit inquiry");

      alert("Application sent successfully!");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="relative p-8 md:p-12 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden">
        {/* Decorative Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]" />
        
        <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Business Name */}
            <div className="space-y-3">
              <Label htmlFor="businessName" className="text-[#f0f9f0] text-sm font-bold ml-1 uppercase tracking-widest opacity-70">Business Name</Label>
              <Input
                id="businessName"
                name="businessName"
                placeholder="Ex: Wellness Collective"
                required
                className="h-14 bg-white border-none text-[#0d2719] rounded-2xl focus-visible:ring-2 focus-visible:ring-emerald-400/50 transition-all placeholder:text-black/20"
              />
            </div>

            {/* Contact Name */}
            <div className="space-y-3">
              <Label htmlFor="contactName" className="text-[#f0f9f0] text-sm font-bold ml-1 uppercase tracking-widest opacity-70">Contact Name</Label>
              <Input
                id="contactName"
                name="contactName"
                placeholder="Ex: Jane Cooper"
                required
                className="h-14 bg-white border-none text-[#0d2719] rounded-2xl focus-visible:ring-2 focus-visible:ring-emerald-400/50 transition-all placeholder:text-black/20"
              />
            </div>

            {/* Email */}
            <div className="space-y-3">
              <Label htmlFor="email" className="text-[#f0f9f0] text-sm font-bold ml-1 uppercase tracking-widest opacity-70">Work Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="jane@business.com"
                required
                className="h-14 bg-white border-none text-[#0d2719] rounded-2xl focus-visible:ring-2 focus-visible:ring-emerald-400/50 transition-all placeholder:text-black/20"
              />
            </div>

            {/* Phone */}
            <div className="space-y-3">
              <Label htmlFor="phone" className="text-[#f0f9f0] text-sm font-bold ml-1 uppercase tracking-widest opacity-70">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                required
                className="h-14 bg-white border-none text-[#0d2719] rounded-2xl focus-visible:ring-2 focus-visible:ring-emerald-400/50 transition-all placeholder:text-black/20"
              />
            </div>

            {/* Business Type */}
            <div className="space-y-3">
              <Label className="text-[#f0f9f0] text-sm font-bold ml-1 uppercase tracking-widest opacity-70">Business Type</Label>
              <Select name="businessType" required>
                <SelectTrigger className="h-14 bg-white border-none text-[#0d2719] rounded-2xl focus:ring-2 focus:ring-emerald-400/50">
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-none shadow-2xl">
                  <SelectItem value="retail">Retail Store</SelectItem>
                  <SelectItem value="dispensary">Dispensary / CBD Shop</SelectItem>
                  <SelectItem value="wellness">Wellness Center / Spa</SelectItem>
                  <SelectItem value="gym">Gym / Fitness Center</SelectItem>
                  <SelectItem value="online">Online Retailer</SelectItem>
                  <SelectItem value="distributor">Regional Distributor</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Estimated Volume */}
            <div className="space-y-3">
              <Label htmlFor="estimatedVolume" className="text-[#f0f9f0] text-sm font-bold ml-1 uppercase tracking-widest opacity-70">Monthly Volume (Est.)</Label>
              <Input
                id="estimatedVolume"
                name="estimatedVolume"
                placeholder="Ex: $5,000 / month"
                className="h-14 bg-white border-none text-[#0d2719] rounded-2xl focus-visible:ring-2 focus-visible:ring-emerald-400/50 transition-all placeholder:text-black/20"
              />
            </div>
          </div>

          {/* Message */}
          <div className="space-y-3">
            <Label htmlFor="message" className="text-[#f0f9f0] text-sm font-bold ml-1 uppercase tracking-widest opacity-70">Additional Information</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Tell us more about your business..."
              className="min-h-[120px] bg-white border-none text-[#0d2719] rounded-2xl focus-visible:ring-2 focus-visible:ring-emerald-400/50 transition-all placeholder:text-black/20 p-4"
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-16 bg-[#f0f9f0] hover:bg-[#e0f0e0] text-[#0d2719] font-bold text-base uppercase tracking-widest rounded-2xl transition-all duration-300 shadow-xl shadow-black/20 active:scale-[0.98]"
            >
              {isSubmitting ? "Processing..." : "Submit Application"}
            </Button>
            
            <div className="mt-6 flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-[#f0f9f0]/40 text-center text-[10px] font-bold tracking-widest uppercase">
                We respond within 24 hours
              </p>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

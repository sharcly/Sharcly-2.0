"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Mail, Phone, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

export function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [offers, setOffers] = useState<any[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("sharcly_welcome_popup_seen");
    if (!hasSeenPopup) {
      fetchOffers();
      const timer = setTimeout(() => setIsOpen(true), 3000); // Show after 3 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await apiClient.get("/marketing/active-offers");
      setOffers(response.data);
    } catch (error) {
      console.error("Failed to fetch offers");
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("sharcly_welcome_popup_seen", "true");
  };

  const handleSelectOffer = (offer: any) => {
    setSelectedOffer(offer);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !phone) return toast.error("Please fill all fields");

    setIsLoading(true);
    try {
      await apiClient.post("/marketing/claim-offer", {
        offerId: selectedOffer.id,
        email,
        phone
      });
      setIsSuccess(true);
      toast.success("Coupon sent to your email!");
      setTimeout(() => handleClose(), 5000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || offers.length === 0) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row"
        >
          {/* Close Button */}
          <button 
            onClick={handleClose}
            className="absolute top-6 right-6 z-20 size-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            <X size={20} />
          </button>

          {/* Image/Visual Side */}
          <div className="w-full md:w-1/2 relative bg-emerald-900 overflow-hidden min-h-[300px]">
            <img 
              src="https://i.postimg.cc/K8nwpV4T/Premium-Hemp-Essentials-Sharcly.jpg" 
              className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay scale-110"
              alt="Welcome"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 to-transparent" />
            <div className="absolute bottom-10 left-10 right-10 text-white space-y-4">
              <div className="size-12 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20">
                <Gift className="text-emerald-400" size={24} />
              </div>
              <h2 className="text-3xl font-black italic serif leading-tight">Welcome to the <br/> Sharcly Club.</h2>
              <p className="text-white/60 text-sm leading-relaxed">Join 50,000+ members who prioritize their wellness with precision-crafted essentials.</p>
            </div>
          </div>

          {/* Content Side */}
          <div className="w-full md:w-1/2 p-10 md:p-12 flex flex-col justify-center">
            {step === 1 ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-900/40">Limited Time Offer</span>
                  <h3 className="text-2xl font-bold tracking-tight text-neutral-900">Choose your gift.</h3>
                  <p className="text-sm text-neutral-400 font-medium">Select a special offer to unlock on your first order today.</p>
                </div>

                <div className="space-y-4">
                  {offers.map((offer) => (
                    <button
                      key={offer.id}
                      onClick={() => handleSelectOffer(offer)}
                      className="w-full group p-5 rounded-2xl border border-neutral-100 hover:border-emerald-500/30 hover:bg-emerald-50/30 text-left transition-all flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <p className="font-bold text-neutral-900">{offer.title}</p>
                        <p className="text-xs text-neutral-400">{offer.description}</p>
                      </div>
                      <div className="size-8 rounded-full bg-neutral-50 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all">
                        <ArrowRight size={14} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : isSuccess ? (
              <div className="space-y-8 text-center animate-in zoom-in-95 duration-500">
                 <div className="size-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-2xl font-bold tracking-tight text-neutral-900">You're in!</h3>
                    <p className="text-sm text-neutral-400 font-medium leading-relaxed px-4">
                      Check your email shortly. We've sent your exclusive coupon code for <strong>{selectedOffer.discount}% OFF</strong>.
                    </p>
                 </div>
                 <Button 
                   onClick={handleClose}
                   className="h-14 rounded-2xl w-full bg-emerald-900 hover:bg-emerald-800 text-white font-bold"
                 >
                    Start Shopping
                 </Button>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <button 
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 text-neutral-400 hover:text-neutral-900 text-[10px] font-black uppercase tracking-widest transition-colors"
                >
                  &larr; Back to offers
                </button>

                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-900/40">Final Step</span>
                  <h3 className="text-2xl font-bold tracking-tight text-neutral-900">Unlock your code.</h3>
                  <p className="text-sm text-neutral-400 font-medium">Enter your details to receive the <strong>{selectedOffer.title}</strong> coupon via email.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" size={18} />
                      <Input 
                        type="email"
                        placeholder="Digital Mail Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-14 rounded-2xl pl-12 border-neutral-100 bg-neutral-50/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" size={18} />
                      <Input 
                        type="tel"
                        placeholder="Mobile Connection"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="h-14 rounded-2xl pl-12 border-neutral-100 bg-neutral-50/50"
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="h-14 rounded-2xl w-full bg-emerald-900 hover:bg-emerald-800 text-white font-bold shadow-lg shadow-emerald-900/20 border-none"
                  >
                    {isLoading ? "Generating Code..." : "Send My Coupon"}
                  </Button>
                </form>

                <p className="text-[9px] text-neutral-400 text-center leading-relaxed font-medium">
                  By joining, you agree to receive marketing updates. <br/> We respect your privacy and never spam.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

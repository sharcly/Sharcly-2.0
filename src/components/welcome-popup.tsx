"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Mail, Phone, ArrowRight, Gift, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { getImageUrl } from "@/lib/image-utils";

export function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFloatingIconVisible, setIsFloatingIconVisible] = useState(false);
  const pathname = usePathname();
  const [step, setStep] = useState(1);
  const [offers, setOffers] = useState<any[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Only show on home page
    if (pathname !== "/") return;

    const isAgeVerified = localStorage.getItem("sharcly_age_verified");
    const hasSeenPopup = localStorage.getItem("sharcly_welcome_popup_seen");

    if (isAgeVerified) {
      if (!hasSeenPopup) {
        fetchOffers(true);
      } else {
        setIsFloatingIconVisible(true);
      }
    }

    const handleAgeVerified = () => {
      if (!localStorage.getItem("sharcly_welcome_popup_seen")) {
        fetchOffers(true);
      } else {
        setIsFloatingIconVisible(true);
      }
    };

    window.addEventListener("age-verified", handleAgeVerified);
    return () => window.removeEventListener("age-verified", handleAgeVerified);
  }, [pathname]);

  const fetchOffers = async (shouldShow = false) => {
    try {
      const response = await apiClient.get("/marketing/active-offers");
      if (response.data && response.data.length > 0) {
        setOffers(response.data);
        if (shouldShow) {
          const timer = setTimeout(() => setIsOpen(true), 2000);
          return () => clearTimeout(timer);
        }
      }
    } catch (error) {
      console.error("Failed to fetch offers");
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("sharcly_welcome_popup_seen", "true");
    setIsFloatingIconVisible(true);
  };

  const handleOpenPopup = () => {
    if (offers.length === 0) {
      fetchOffers(true);
    } else {
      setIsOpen(true);
    }
  };

  const handleSelectOption = (offer: any) => {
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
      toast.success("Discount code sent to your email!");
      setTimeout(() => handleClose(), 5000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const currentOffer = offers[0]; // Assuming we show the first active offer

  if (pathname !== "/") return null;

  return (
    <>
      {/* FLOATING OFFER ICON */}
      <AnimatePresence>
        {isFloatingIconVisible && !isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, x: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.5, x: 100 }}
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(6,45,27,0.2)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenPopup}
            className="fixed bottom-32 right-8 z-[90] group flex items-center gap-4 pl-7 pr-3 py-3 bg-[#062D1B] text-white border border-white/20 rounded-full shadow-2xl"
          >
            <div className="flex flex-col items-start leading-none">
               <span className="text-[10px] font-bold text-white/60 uppercase tracking-[0.3em] mb-1">Members Only</span>
               <span className="text-xs font-black uppercase tracking-widest text-white">Get Discount</span>
            </div>
            <div className="size-11 bg-white rounded-full flex items-center justify-center text-[#062D1B] shadow-lg shadow-black/20 transition-transform group-hover:rotate-12">
               <Gift size={20} />
            </div>
            {/* Elegant Glow */}
            <div className="absolute inset-0 rounded-full bg-[#062D1B]/20 blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && currentOffer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/10 backdrop-blur-md">
            <style dangerouslySetInnerHTML={{ __html: `
              @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Outfit:wght@100..900&display=swap');
              .font-serif { font-family: 'Cormorant Garamond', serif; }
              .font-sans { font-family: 'Outfit', sans-serif; }
            `}} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-5xl bg-white rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.1)] flex flex-col md:flex-row border border-black/5"
            >
              {/* Close Button */}
              <button 
                onClick={handleClose}
                className="absolute top-8 right-8 z-30 size-10 rounded-full bg-[#f8fafc] hover:bg-[#062D1B] hover:text-white flex items-center justify-center text-slate-300 transition-all border border-slate-100"
              >
                <X size={18} />
              </button>

              {/* Left Side: Content */}
                <div className="w-full md:w-[55%] p-8 md:p-12 flex flex-col justify-center min-h-[450px] bg-white">
                  <div className="mb-6 flex justify-center md:justify-start">
                     <div className="flex items-center gap-3">
                        <img 
                          src="/assets/final-Logo-1.png" 
                          alt="Sharcly" 
                          className="h-8 w-auto opacity-100" 
                        />
                     </div>
                  </div>

                {step === 1 ? (
                  <div className="space-y-6">
                    <div className="space-y-3 text-center md:text-left">
                      <div className="flex items-center gap-3 justify-center md:justify-start">
                         <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#EBB56B]">Welcome Offer</span>
                      </div>
                      <h2 className="text-4xl md:text-5xl font-serif text-[#062D1B] leading-[1.1] italic">
                        {currentOffer.title}
                      </h2>
                      <p className="text-sm font-medium text-[#062D1B]/50 leading-relaxed max-w-sm">
                        {currentOffer.subtitle}
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      {(currentOffer.options || []).map((option: any, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => handleSelectOption(currentOffer)}
                          className="w-full group relative overflow-hidden p-3.5 rounded-xl bg-[#062D1B]/5 border border-[#062D1B]/10 hover:border-[#EBB56B] transition-all text-left"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-[#EBB56B]/0 via-[#EBB56B]/5 to-[#EBB56B]/0 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-100%] group-hover:translate-x-[100%] duration-1000" />
                          <div className="flex items-center gap-3 relative z-10">
                            <span className="text-xl">{option.icon}</span>
                            <div className="flex-1">
                               <p className="text-xs font-bold text-[#062D1B] uppercase tracking-widest">{option.label}</p>
                            </div>
                            <ArrowRight className="size-3 text-[#EBB56B] opacity-0 group-hover:opacity-100 transition-all -translate-x-3 group-hover:translate-x-0" />
                          </div>
                        </button>
                      ))}
                    </div>

                    <button 
                      onClick={handleClose}
                      className="w-full text-center text-[#062D1B]/30 hover:text-[#EBB56B] text-[10px] uppercase tracking-widest font-bold transition-colors mt-2"
                    >
                      {currentOffer.footerText || "No thanks"}
                    </button>
                  </div>
                ) : isSuccess ? (
                  <div className="space-y-8 text-center py-6">
                     <div className="size-20 bg-[#EBB56B]/10 text-[#EBB56B] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#EBB56B]/20">
                        <CheckCircle2 size={40} className="animate-pulse" />
                     </div>
                     <div className="space-y-2">
                        <h3 className="text-3xl font-serif text-[#062D1B] italic">You're All Set!</h3>
                        <p className="text-xs text-[#062D1B]/60 font-medium leading-relaxed max-w-xs mx-auto">
                          Check your inbox for your <strong>{currentOffer.discountType === "FIXED" ? "$" : ""}{currentOffer.discount}{currentOffer.discountType === "PERCENTAGE" ? "%" : ""} DISCOUNT CODE</strong>.
                        </p>
                     </div>
                     <Button 
                       onClick={handleClose}
                       className="h-14 rounded-full w-full bg-[#062D1B] hover:bg-[#083a24] text-white font-black text-base shadow-[0_10px_20px_rgba(6,45,27,0.2)] border-none"
                     >
                        Start Shopping
                     </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-3 text-center md:text-left">
                      <div className="flex items-center gap-3 justify-center md:justify-start">
                         <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#EBB56B]">Claim Your Offer</span>
                      </div>
                      <h2 className="text-4xl md:text-5xl font-serif text-[#062D1B] leading-[1.1] italic">
                        {currentOffer.step2Title || "Get Your Discount Code"}
                      </h2>
                      <p className="text-sm font-medium text-[#062D1B]/60">
                        {currentOffer.step2Text || "(There's no catch, use it anytime!)"}
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Input 
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="h-14 rounded-xl border-[#062D1B]/10 bg-[#062D1B]/5 text-[#062D1B] placeholder:text-[#062D1B]/20 focus:border-[#EBB56B]/50 focus:ring-[#EBB56B]/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                           <div className="h-14 px-4 rounded-xl border border-[#062D1B]/10 bg-[#062D1B]/5 flex items-center gap-2 text-[#062D1B]/40">
                              <img src="https://flagcdn.com/us.svg" alt="US" className="w-5 h-auto rounded-sm" />
                              <span className="text-sm">▼</span>
                           </div>
                           <Input 
                            type="tel"
                            placeholder="Phone Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className="h-14 rounded-xl border-[#062D1B]/10 bg-[#062D1B]/5 text-[#062D1B] placeholder:text-[#062D1B]/20 flex-1 focus:border-[#EBB56B]/50 focus:ring-[#EBB56B]/20"
                          />
                        </div>
                      </div>
                      <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="h-16 rounded-full w-full bg-[#062D1B] hover:bg-[#083a24] text-white font-black text-lg shadow-[0_10px_30px_rgba(6,45,27,0.3)] transform hover:scale-[1.02] active:scale-95 border-none"
                      >
                        {isLoading ? "SENDING..." : "Send Discount Code"}
                      </Button>
                    </form>

                    <button 
                      onClick={() => setStep(1)}
                      className="w-full text-center text-[#062D1B]/30 hover:text-[#EBB56B] text-[10px] font-bold uppercase tracking-widest transition-colors"
                    >
                      Back to options
                    </button>
                  </div>
                )}
              </div>

              {/* Right Side: Image with Luxury Overlay */}
              <div className="w-full md:w-[45%] relative min-h-[400px] md:min-h-full overflow-hidden bg-[#062D1B]">
                <img 
                  src={getImageUrl(currentOffer.image)} 
                  className="absolute inset-0 w-full h-full object-cover md:object-center mix-blend-overlay opacity-50 scale-110"
                  alt="Products"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#062D1B] via-transparent to-transparent" />
                
                {/* Branding Badge */}
                <div className="absolute top-8 left-8">
                   <div className="flex items-center gap-3">
                      <img 
                        src="/assets/final-Logo-1.png" 
                        alt="Sharcly" 
                        className="h-5 w-auto brightness-0 invert opacity-40" 
                      />
                   </div>
                </div>

                {/* Boutique Card */}
                <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/10 backdrop-blur-xl rounded-[1.5rem] border border-white/20 shadow-2xl">
                   <div className="flex items-center gap-4 mb-3">
                      <div className="size-10 rounded-full bg-white flex items-center justify-center text-[#EBB56B] shadow-lg">
                         <Sparkles size={16} />
                      </div>
                      <div>
                         <p className="text-[8px] font-bold text-white/60 uppercase tracking-[0.4em] mb-0.5">The Collection</p>
                         <h4 className="text-base font-serif text-white italic leading-tight">Archive Edition</h4>
                      </div>
                   </div>
                   <p className="text-[10px] text-white/60 font-medium leading-relaxed italic mb-3">
                      "Unlock the botanical precision of Sharcly's premium extracts, verified for the discerning individual."
                   </p>
                   <div className="flex gap-2.5">
                      {[1, 2, 3].map(i => (
                         <div key={i} className="h-0.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-white" 
                              initial={{ x: "-100%" }}
                              animate={{ x: "0%" }}
                              transition={{ duration: 1, delay: i * 0.2 }}
                            />
                         </div>
                      ))}
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

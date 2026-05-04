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
          const timer = setTimeout(() => setIsOpen(true), 1500);
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
    setStep(1); // Reset to first step when manually opened
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

  const currentOffer = offers[0];

  if (pathname !== "/") return null;

  return (
    <>
      {/* LUXURY FLOATING ICON */}
      <AnimatePresence>
        {isFloatingIconVisible && !isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, x: 100 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              x: 0,
              y: [0, -10, 0] 
            }}
            transition={{ 
              y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
              opacity: { duration: 0.5 },
              scale: { duration: 0.5 }
            }}
            exit={{ opacity: 0, scale: 0.5, x: 100 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenPopup}
            className="fixed bottom-12 right-8 z-[90] group flex items-center gap-4 pl-7 pr-3 py-3 bg-[#062D1B] text-white border border-[#EBB56B]/30 rounded-full shadow-[0_20px_50px_rgba(6,45,27,0.3)]"
          >
            <div className="flex flex-col items-start leading-none pr-2">
               <span className="text-[9px] font-bold text-[#EBB56B] uppercase tracking-[0.4em] mb-1.5">Special Offer</span>
               <span className="text-[11px] font-black uppercase tracking-widest text-white/90">Unlock Reward</span>
            </div>
            <div className="size-11 bg-white rounded-full flex items-center justify-center text-[#062D1B] shadow-lg relative overflow-hidden">
               <Gift size={20} className="relative z-10 group-hover:rotate-12 transition-transform duration-500" />
               <motion.div 
                 animate={{ opacity: [0.1, 0.3, 0.1] }}
                 transition={{ repeat: Infinity, duration: 2 }}
                 className="absolute inset-0 bg-[#EBB56B]" 
               />
            </div>
            {/* Animated Ring */}
            <div className="absolute -inset-1 rounded-full border border-[#EBB56B]/20 animate-ping opacity-20 pointer-events-none" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && currentOffer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={handleClose}
               className="absolute inset-0 bg-black/40 backdrop-blur-xl"
            />
            
            <style dangerouslySetInnerHTML={{ __html: `
              @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Outfit:wght@100..900&display=swap');
              .font-serif { font-family: 'Cormorant Garamond', serif; }
              .font-sans { font-family: 'Outfit', sans-serif; }
            `}} />

            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-5xl bg-white rounded-[3rem] overflow-hidden shadow-[0_100px_150px_rgba(0,0,0,0.25)] flex flex-col md:flex-row border border-white/20"
            >
              {/* Close Button */}
              <button 
                onClick={handleClose}
                className="absolute top-8 right-8 z-30 size-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-[#062D1B] hover:text-white flex items-center justify-center text-[#062D1B]/40 transition-all border border-[#062D1B]/5 group"
              >
                <X size={20} className="group-hover:rotate-90 transition-transform" />
              </button>

              {/* Left Side: Boutique Experience */}
              <div className="w-full md:w-[55%] p-8 md:p-12 flex flex-col justify-center bg-white relative">
                {/* Subtle Background Text */}
                <div className="absolute top-8 left-8 text-[100px] font-serif font-black text-black/[0.02] select-none pointer-events-none leading-none uppercase">
                   WELCOME
                </div>

                <div className="relative z-10">
                   <div className="mb-6">
                      <img 
                        src="/assets/final-Logo-1.png" 
                        alt="Sharcly" 
                        className="h-8 w-auto opacity-100" 
                      />
                   </div>

                   {step === 1 ? (
                     <div className="space-y-6">
                       <div className="space-y-3">
                         <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-full bg-[#EBB56B]/10 text-[#EBB56B] text-[10px] font-black uppercase tracking-[0.3em]">Special Offer</span>
                         </div>
                         <h2 className="text-4xl md:text-5xl font-serif text-[#062D1B] leading-tight italic">
                           {currentOffer.title}
                         </h2>
                         <p className="text-sm text-[#062D1B]/50 font-medium leading-relaxed max-w-md">
                           {currentOffer.subtitle || "Join our community and get a special discount on your first order."}
                         </p>
                       </div>

                       <div className="space-y-2.5">
                         {(currentOffer.options || []).map((option: any, idx: number) => (
                           <motion.button
                             key={idx}
                             whileHover={{ x: 8 }}
                             onClick={() => handleSelectOption(currentOffer)}
                             className="w-full group relative p-4 rounded-xl bg-neutral-50 border border-neutral-100 hover:border-[#EBB56B] transition-all text-left flex items-center gap-4"
                           >
                             <div className="size-10 rounded-full bg-white flex items-center justify-center text-lg shadow-sm border border-neutral-100 group-hover:scale-110 transition-transform">
                                {option.icon}
                             </div>
                             <div className="flex-1">
                                <p className="text-[10px] font-black text-[#062D1B] uppercase tracking-[0.2em]">{option.label}</p>
                             </div>
                             <div className="size-7 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                                <ArrowRight className="size-3 text-[#EBB56B]" />
                             </div>
                           </motion.button>
                         ))}
                       </div>

                       <button 
                         onClick={handleClose}
                         className="w-full text-center text-[#062D1B]/30 hover:text-[#062D1B] text-[10px] uppercase tracking-widest font-black transition-colors"
                       >
                         {currentOffer.footerText || "No thanks, I'll shop without a discount"}
                       </button>
                     </div>
                   ) : isSuccess ? (
                     <div className="space-y-6 text-center py-6">
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="size-20 bg-[#EBB56B]/10 text-[#EBB56B] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#EBB56B]/20"
                        >
                           <CheckCircle2 size={40} className="animate-pulse" />
                        </motion.div>
                        <div className="space-y-2">
                           <h3 className="text-3xl font-serif text-[#062D1B] italic">All Set!</h3>
                           <p className="text-xs text-[#062D1B]/60 font-medium leading-relaxed max-w-sm mx-auto">
                             Check your email for your <strong>{currentOffer.discountType === "FIXED" ? "$" : ""}{currentOffer.discount}{currentOffer.discountType === "PERCENTAGE" ? "%" : ""} discount code</strong>.
                           </p>
                        </div>
                        <Button 
                          onClick={handleClose}
                          className="h-14 rounded-full w-full bg-[#062D1B] hover:bg-[#083a24] text-white font-black text-base shadow-[0_15px_30px_rgba(6,45,27,0.3)] border-none mt-4"
                        >
                           Start Shopping
                        </Button>
                     </div>
                   ) : (
                     <div className="space-y-6">
                       <div className="space-y-3">
                         <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-full bg-[#EBB56B]/10 text-[#EBB56B] text-[10px] font-black uppercase tracking-[0.3em]">Almost Done</span>
                         </div>
                         <h2 className="text-4xl md:text-5xl font-serif text-[#062D1B] leading-tight italic">
                           {currentOffer.step2Title || "Get Your Discount"}
                         </h2>
                         <p className="text-sm text-[#062D1B]/60 font-medium">
                           {currentOffer.step2Text || "We'll email your discount code right away."}
                         </p>
                       </div>

                       <form onSubmit={handleSubmit} className="space-y-4">
                         <div className="space-y-2">
                           <Input 
                             type="email"
                             placeholder="Enter your email"
                             value={email}
                             onChange={(e) => setEmail(e.target.value)}
                             required
                             className="h-14 rounded-xl border-neutral-100 bg-neutral-50 text-[#062D1B] placeholder:text-[#062D1B]/20 focus:border-[#EBB56B]/50 focus:ring-0 px-5 font-medium text-base"
                           />
                         </div>
                         <div className="flex gap-3">
                            <div className="h-14 px-4 rounded-xl border border-neutral-100 bg-neutral-50 flex items-center gap-2 text-[#062D1B]/40">
                               <img src="https://flagcdn.com/us.svg" alt="US" className="w-5 h-auto rounded-sm" />
                               <span className="text-xs font-bold">▼</span>
                            </div>
                            <Input 
                             type="tel"
                             placeholder="Phone Number"
                             value={phone}
                             onChange={(e) => setPhone(e.target.value)}
                             required
                             className="h-14 rounded-xl border-neutral-100 bg-neutral-50 text-[#062D1B] placeholder:text-[#062D1B]/20 flex-1 focus:border-[#EBB56B]/50 focus:ring-0 px-5 font-medium text-base"
                           />
                         </div>
                         <Button 
                           type="submit" 
                           disabled={isLoading}
                           className="h-16 rounded-full w-full bg-[#062D1B] hover:bg-[#083a24] text-white font-black text-lg shadow-[0_20px_40px_rgba(6,45,27,0.3)] transform hover:scale-[1.02] active:scale-95 border-none mt-2 transition-all"
                         >
                           {isLoading ? "SENDING..." : "Send My Discount Code"}
                         </Button>
                       </form>

                       <button 
                         onClick={() => setStep(1)}
                         className="w-full text-center text-[#062D1B]/30 hover:text-[#062D1B] text-[10px] font-black uppercase tracking-widest transition-colors"
                       >
                         Go back
                       </button>
                     </div>
                   )}
                </div>
              </div>

              {/* Right Side: Visual Archive */}
              <div className="w-full md:w-[45%] relative min-h-[350px] md:min-h-full overflow-hidden bg-[#062D1B]">
                <motion.img 
                  animate={{ scale: [1.1, 1.15, 1.1] }}
                  transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                  src={getImageUrl(currentOffer.image)} 
                  className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60"
                  alt="Quality Products"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#062D1B] via-transparent to-transparent opacity-80" />
                
                {/* Visual Content */}
                <div className="absolute bottom-10 left-10 right-10 space-y-6">
                   <div className="p-8 bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-3xl">
                      <div className="flex items-center gap-5 mb-5">
                         <div className="size-14 rounded-2xl bg-[#EBB56B] flex items-center justify-center text-[#062D1B] shadow-xl rotate-3">
                            <Sparkles size={24} />
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-[#EBB56B] uppercase tracking-[0.5em] mb-1">Quality</p>
                            <h4 className="text-xl font-serif text-white italic leading-tight">Premium Quality</h4>
                         </div>
                      </div>
                      <p className="text-xs text-white/60 font-medium leading-relaxed italic mb-5">
                         "We take pride in providing only the finest natural extracts for your wellbeing."
                      </p>
                      <div className="flex items-center gap-1.5 h-1">
                         {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-full flex-1 bg-white/10 rounded-full overflow-hidden">
                               <motion.div 
                                 className="h-full bg-[#EBB56B]" 
                                 initial={{ x: "-100%" }}
                                 animate={{ x: "0%" }}
                                 transition={{ duration: 1, delay: i * 0.15 }}
                               />
                            </div>
                         ))}
                      </div>
                   </div>
                </div>

                {/* Subtle Floating Dust Particles or Grain could be added here via CSS */}
                <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}


"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { clearCart, toggleCart } from "@/store/slices/cartSlice";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldCheck, 
  ArrowLeft, 
  CreditCard, 
  Truck, 
  Lock,
  ArrowRight,
  ShoppingBag,
  Info,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Mail,
  RotateCcw,
  Zap,
  Globe,
  Fingerprint,
  X,
  PackageCheck,
  Calendar,
  Sparkles,
  CreditCard as CardIcon
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { 
  CardNumberElement, 
  CardExpiryElement, 
  CardCvcElement, 
  useStripe, 
  useElements 
} from "@stripe/react-stripe-js";
import { StripeWrapper } from "@/components/stripe-wrapper";

function CheckoutContent() {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const dispatch = useDispatch();
  const { user } = useAuth();
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1);
  const [orderStatus, setOrderStatus] = useState<'checkout' | 'success'>('checkout');
  const [lastOrder, setLastOrder] = useState<any>(null);

  // For Visual Card Updates
  const [cardBrand, setCardBrand] = useState('unknown');
  const [cardNumPreview, setCardNumPreview] = useState('•••• •••• •••• ••••');
  const [cardExpiryPreview, setCardExpiryPreview] = useState('MM/YY');

  const [formData, setFormData] = useState({
    email: user?.email || "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    cardHolderName: ""
  });

  useEffect(() => {
    if (user?.email && !formData.email) {
      setFormData(prev => ({ ...prev, email: user.email }));
    }
  }, [user]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    if (!stripe || !elements) return;

    setIsProcessing(true);
    try {
      const cardElement = elements.getElement(CardNumberElement);
      if (!cardElement) throw new Error("Card identification required");

      await new Promise(resolve => setTimeout(resolve, 2500));

      const fullAddress = `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}, ${formData.country}`;
      const response = await apiClient.post("/orders", {
        email: formData.email,
        items: cartItems.map(i => ({ productId: i.id, quantity: i.quantity })),
        address: fullAddress
      });

      if (response.data.success) {
        setLastOrder({
          id: response.data.order?.id || "SC-" + Math.random().toString(36).substring(7).toUpperCase(),
          date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          items: [...cartItems],
          total: subtotal,
          address: fullAddress
        });
        
        toast.success("Order Placed Successfully");
        dispatch(clearCart());
        setOrderStatus('success');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: any) {
      toast.error("Payment failed: " + (err.message || "Please check your card details"));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardChange = (event: any) => {
    if (event.brand) setCardBrand(event.brand);
    // Note: React Stripe JS doesn't provide the actual numbers for security,
    // so we maintain the '••••' look but we can update the brand logo.
  };

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        fontSize: '14px',
        color: '#062D1B',
        fontFamily: 'Instrument Sans, sans-serif',
        '::placeholder': {
          color: 'rgba(6, 45, 27, 0.2)',
        },
        fontWeight: '600',
      },
      invalid: {
        color: '#ef4444',
      },
    },
  };

  if (orderStatus === 'success') {
    return (
      <div className="min-h-screen bg-[#FDFCFA] text-[#062D1B]">
         <div className="container mx-auto px-6 lg:px-20 py-20 lg:py-32 max-w-4xl">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-16 text-center">
               <div className="flex justify-center">
                  <div className="relative">
                     <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="size-32 rounded-full bg-[#062D1B] flex items-center justify-center text-white shadow-3xl shadow-[#062D1B]/20">
                        <PackageCheck className="size-12" />
                     </motion.div>
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -top-4 -right-4 size-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                        <Sparkles className="size-5" />
                     </motion.div>
                  </div>
               </div>

               <div className="space-y-6">
                  <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter italic font-serif">Order <br /> <span className="not-italic">Received.</span></h1>
                  <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#062D1B]/30 ml-2">Thank you for your order.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
                  <div className="p-10 rounded-[3rem] bg-white border border-black/[0.03] shadow-sharcly space-y-8">
                     <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-black/20">Order Number</label>
                        <p className="text-lg font-bold tracking-tight">#{lastOrder?.id}</p>
                     </div>
                     <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-black/20">Status</label>
                        <div className="flex items-center gap-2 text-emerald-600">
                           <Zap className="size-4" />
                           <span className="text-xs font-bold uppercase tracking-widest">Processing</span>
                        </div>
                     </div>
                     <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-black/20">Shipping Address</label>
                        <p className="text-xs font-bold text-[#062D1B]/60 leading-relaxed truncate">{lastOrder?.address}</p>
                     </div>
                  </div>

                  <div className="p-10 rounded-[3rem] bg-[#062D1B] text-white space-y-8 shadow-3xl shadow-[#062D1B]/20">
                     <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest">
                        <span>Summary</span>
                        <Calendar className="size-4 opacity-50" />
                     </div>
                     <div className="space-y-4 max-h-[120px] overflow-y-auto no-scrollbar pr-2 italic opacity-60 text-xs">
                        {lastOrder?.items?.map((item: any) => (
                           <div key={item.id} className="flex justify-between">{item.name} × {item.quantity} <span>${item.price}</span></div>
                        ))}
                     </div>
                     <Separator className="bg-white/10" />
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Total</span>
                        <span className="text-3xl font-bold tabular-nums">${lastOrder?.total.toFixed(2)}</span>
                     </div>
                  </div>
               </div>

               <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-10">
                  <Button asChild className="rounded-full px-12 h-16 bg-[#062D1B] text-white text-[10px] font-bold uppercase tracking-[0.3em] shadow-xl"><Link href="/products">Explore Catalog</Link></Button>
                  <Button asChild variant="ghost" className="rounded-full px-12 h-16 text-[10px] uppercase tracking-widest text-black/30 hover:text-black"><Link href="/dashboard">View Archive</Link></Button>
               </div>
            </motion.div>
         </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFCFA] flex flex-col items-center justify-center p-8">
        <div className="size-24 rounded-full bg-white shadow-xl flex items-center justify-center text-[#062D1B]/10 mb-8 border border-gray-100">
           <ShoppingBag className="size-10" />
        </div>
        <h2 className="text-3xl font-bold text-[#062D1B] tracking-tight mb-4">Bag is Empty</h2>
        <Button asChild className="rounded-full px-12 h-16 text-[10px] uppercase font-bold tracking-[0.3em] bg-[#062D1B] text-white"><Link href="/products">Shop the Catalog</Link></Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFA] text-[#062D1B] selection:bg-[#062D1B] selection:text-white antialiased">
      <header className="h-24 flex items-center bg-white/50 backdrop-blur-3xl sticky top-0 z-50 border-b border-black/[0.03]">
         <div className="container mx-auto px-6 lg:px-20 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="size-10 rounded-xl bg-[#062D1B] flex items-center justify-center text-white font-black text-sm">S</div>
              <span className="text-sm font-bold uppercase tracking-[0.4em]">Sharcly</span>
            </Link>
            <div className="flex items-center gap-6">
               <div className="hidden md:flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-[#062D1B]/30 border-r border-[#062D1B]/10 pr-6"><Lock className="size-3" /> Secure Payment</div>
               <button onClick={() => router.back()} className="size-12 rounded-full border border-black/5 flex items-center justify-center hover:bg-[#062D1B] hover:text-white transition-all text-black/40"><X className="size-4" /></button>
            </div>
         </div>
      </header>

      <main className="container mx-auto px-6 lg:px-20 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
          
          <div className="lg:col-span-7 space-y-20">
             <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter italic font-serif">Checkout.</h1>
                <div className="flex items-center gap-2 pt-6">
                   <div className={cn("px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all", step === 1 ? "bg-[#062D1B] text-white" : "bg-black/5 text-black/30")}>Shipping</div>
                   <div className="h-px w-8 bg-black/5" />
                   <div className={cn("px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all", step === 2 ? "bg-[#062D1B] text-white" : "bg-black/5 text-black/30")}>Payment</div>
                </div>
             </div>

             <form onSubmit={handleCheckout} className="space-y-20">
                <AnimatePresence mode="wait">
                   {step === 1 ? (
                     <motion.div key="step1" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-16">
                        <div className="space-y-10 p-12 rounded-[3.5rem] bg-white border border-black/[0.03] shadow-sharcly">
                           <div className="flex items-center gap-4">
                              <div className="size-10 rounded-2xl bg-[#062D1B]/5 flex items-center justify-center text-[#062D1B]"><Globe className="size-5" /></div>
                              <h3 className="text-xl font-bold tracking-tight">Shipping Details</h3>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-3 md:col-span-2">
                                 <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30 ml-2">Email Address</Label>
                                 <Input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="checkout-input" />
                              </div>
                              <div className="space-y-3">
                                 <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30 ml-2">First Name</Label>
                                 <Input required value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="checkout-input" />
                              </div>
                              <div className="space-y-3">
                                 <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30 ml-2">Last Name</Label>
                                 <Input required value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="checkout-input" />
                              </div>
                           </div>
                           <div className="space-y-3"><Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30 ml-2">Street Address</Label><Input required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="checkout-input" /></div>
                           <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                              <div className="space-y-3"><Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30 ml-2">City</Label><Input required value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="checkout-input" /></div>
                              <div className="space-y-3"><Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30 ml-2">State</Label><Input required value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} className="checkout-input" /></div>
                              <div className="space-y-3"><Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30 ml-2">Zip</Label><Input required value={formData.zipCode} onChange={(e) => setFormData({...formData, zipCode: e.target.value})} className="checkout-input" /></div>
                           </div>
                        </div>
                        <Button type="submit" className="w-full h-20 rounded-full bg-[#062D1B] text-white hover:opacity-95 text-[11px] font-bold uppercase tracking-[0.4em] shadow-xl">Continue to Payment <ArrowRight className="ml-4 size-4" /></Button>
                     </motion.div>
                   ) : (
                     <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-16">
                        <div className="space-y-12">
                           
                           {/* Visual Interactive Credit Card Overlay */}
                           <div className="flex justify-center -mb-16 relative z-10">
                              <motion.div initial={{ y: 20, rotateY: 20 }} animate={{ y: 0, rotateY: 0 }} transition={{ type: 'spring', damping: 10 }} className="w-80 h-48 rounded-[2rem] bg-gradient-to-br from-[#062D1B] to-[#0A4D2D] p-8 text-white shadow-3xl shadow-[#062D1B]/30 flex flex-col justify-between relative overflow-hidden backdrop-blur-sm">
                                 <div className="absolute top-0 right-0 size-48 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                                 <div className="flex justify-between items-start">
                                    <div className="size-10 bg-white/10 rounded-lg flex items-center justify-center p-2"><Fingerprint className="size-6 text-white/40" /></div>
                                    <span className="text-[10px] font-bold tracking-widest uppercase opacity-40">Sharcly Node</span>
                                 </div>
                                 <div className="space-y-4">
                                    <p className="text-xl font-bold tracking-[0.15em] tabular-nums font-serif italic">{cardNumPreview}</p>
                                    <div className="flex justify-between items-end">
                                       <div className="space-y-1">
                                          <p className="text-[8px] font-bold uppercase opacity-30 tracking-widest">Card Holder</p>
                                          <p className="text-[10px] font-bold tracking-widest uppercase">{formData.cardHolderName || "Authorized Name"}</p>
                                       </div>
                                       <div className="space-y-1 text-right">
                                          <p className="text-[8px] font-bold uppercase opacity-30 tracking-widest">Expiry</p>
                                          <p className="text-[10px] font-bold">{cardExpiryPreview}</p>
                                       </div>
                                    </div>
                                 </div>
                              </motion.div>
                           </div>

                           <div className="space-y-10 p-12 pt-24 rounded-[3.5rem] bg-white border border-black/[0.03] shadow-sharcly">
                              <div className="space-y-8">
                                 <div className="space-y-3">
                                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30 ml-2">Card Holder Full Name</Label>
                                    <Input required value={formData.cardHolderName} onChange={(e) => setFormData({...formData, cardHolderName: e.target.value})} placeholder="As printed on card" className="checkout-input" />
                                 </div>
                                 <div className="space-y-3">
                                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30 ml-2">Secure Card Identification Number</Label>
                                    <div className="checkout-input flex items-center px-6"><CardNumberElement onChange={handleCardChange} options={CARD_ELEMENT_OPTIONS} className="w-full" /></div>
                                 </div>
                                 <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                       <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30 ml-2">Expiration Date</Label>
                                       <div className="checkout-input flex items-center px-6"><CardExpiryElement options={CARD_ELEMENT_OPTIONS} className="w-full" /></div>
                                    </div>
                                    <div className="space-y-3">
                                       <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30 ml-2">CVC Security</Label>
                                       <div className="checkout-input flex items-center px-6"><CardCvcElement options={CARD_ELEMENT_OPTIONS} className="w-full" /></div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <Button type="submit" disabled={isProcessing || !stripe} className="w-full h-24 rounded-full bg-[#062D1B] text-white hover:opacity-95 text-[12px] font-bold uppercase tracking-[0.5em] shadow-3xl shadow-black/20">{isProcessing ? "Processing..." : "Complete Order"}</Button>
                     </motion.div>
                   )}
                </AnimatePresence>
             </form>
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-40">
             <Card className="rounded-[4rem] border border-black/[0.03] bg-white shadow-sharcly overflow-hidden">
                <CardContent className="p-12 space-y-12">
                   <h3 className="text-2xl font-bold tracking-tighter">Your Bag</h3>
                   <div className="space-y-8 max-h-[350px] overflow-y-auto no-scrollbar">
                      {cartItems.map((item) => (
                         <div key={item.id} className="flex gap-6 group">
                            <div className="size-16 rounded-2xl overflow-hidden border border-black/5 bg-neutral-50 shrink-0 relative"><img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover" /><div className="absolute -top-1 -right-1 size-5 bg-[#062D1B] text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">{item.quantity}</div></div>
                            <div className="flex-1 min-w-0 flex flex-col justify-center"><h4 className="text-[13px] font-bold text-[#062D1B] truncate">{item.name}</h4><p className="text-[10px] font-bold uppercase tracking-widest text-black/20">${item.price}</p></div>
                         </div>
                      ))}
                   </div>
                   <div className="space-y-5 pt-8 border-t border-black/5">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-black/30"><span>Subtotal</span><span className="text-[#062D1B]">${subtotal.toFixed(2)}</span></div>
                      <Separator className="bg-black/[0.03]" />
                      <div className="flex justify-between items-center"><span className="text-xs font-bold uppercase tracking-[0.4em] text-black/30">Total</span><span className="text-4xl font-bold tracking-tighter tabular-nums">${subtotal.toFixed(2)}</span></div>
                   </div>
                </CardContent>
             </Card>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .checkout-input {
          height: 4.5rem !important;
          border-radius: 1.5rem !important;
          background-color: transparent !important;
          border: 2px solid rgba(0,0,0,0.03) !important;
          padding-left: 1.5rem !important;
          font-weight: 700 !important;
          transition: all 0.3s ease !important;
          display: flex !important;
          align-items: center !important;
        }
        .checkout-input:focus-within {
          border-color: #062D1B !important;
          background-color: white !important;
          box-shadow: 0 10px 40px -10px rgba(6,45,27,0.1) !important;
        }
      `}</style>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <StripeWrapper>
      <CheckoutContent />
    </StripeWrapper>
  );
}

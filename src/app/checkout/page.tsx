"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { clearCart } from "@/store/slices/cartSlice";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldCheck, 
  ArrowLeft, 
  CreditCard, 
  Truck, 
  Lock,
  ArrowRight,
  ShoppingBag,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Mail,
  Zap,
  Globe,
  Fingerprint,
  X,
  PackageCheck,
  Calendar,
  Sparkles,
  Ticket
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
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

  const [formData, setFormData] = useState({
    email: user?.email || "",
    shipping: {
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States",
    },
    billing: {
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States",
    },
    sameAsShipping: true,
    saveAddress: false,
    cardHolderName: "",
    paymentMethod: "online" as "online" | "cod",
    createAccount: false,
    password: "",
    confirmPassword: ""
  });

  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedSavedAddress, setSelectedSavedAddress] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [summary, setSummary] = useState<any>(null);

  const fetchSummary = async (code?: string) => {
    try {
      const response = await apiClient.post("/orders/preview", {
        items: cartItems.map(i => ({ productId: i.id, quantity: i.quantity })),
        couponCode: code || appliedCoupon?.code
      });
      if (response.data.success) {
        setSummary(response.data.summary);
      }
    } catch (err) {
      console.error("Failed to fetch summary:", err);
    }
  };

  useEffect(() => {
    if (cartItems.length > 0) {
      fetchSummary();
    }
  }, [cartItems, appliedCoupon]);

  const taxAmount = summary?.taxAmount || 0;
  const shippingCost = summary?.shippingAmount || 0;
  const total = summary?.totalAmount || 0;
  const discountAmount = summary?.discountAmount || 0;

  useEffect(() => {
    const fetchProfile = async () => {
       if (user) {
          try {
             const response = await apiClient.get("/auth/profile");
             if (response.data.success) {
                setSavedAddresses(response.data.user.addresses || []);
             }
          } catch (err) {
             console.error("Failed to fetch profile:", err);
          }
       }
    };
    fetchProfile();
  }, [user]);

  useEffect(() => {
    if (user?.email && !formData.email) {
      setFormData(prev => ({ ...prev, email: user.email }));
    }
  }, [user]);

  const selectAddress = (addr: any) => {
     setSelectedSavedAddress(addr.id);
     setFormData(prev => ({
        ...prev,
        shipping: {
           firstName: user?.name?.split(' ')[0] || prev.shipping.firstName,
           lastName: user?.name?.split(' ').slice(1).join(' ') || prev.shipping.lastName,
           address: addr.street,
           city: addr.city,
           state: addr.state,
           zipCode: addr.zipCode,
           country: addr.country
        }
     }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsApplyingCoupon(true);
    try {
      const response = await apiClient.post("/coupons/validate", { code: couponCode });
      if (response.data.valid) {
        setAppliedCoupon(response.data);
        fetchSummary(response.data.code);
        toast.success("Coupon Applied!");
      } else {
        toast.error(response.data.message || "Invalid coupon code");
      }
    } catch (error) {
      toast.error("Failed to validate coupon");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      if (!user && formData.createAccount) {
         if (!formData.password) return toast.error("Please enter a password");
         if (formData.password !== formData.confirmPassword) return toast.error("Passwords do not match");
         if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
      }
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    if (formData.paymentMethod === 'online' && (!stripe || !elements)) {
       toast.error("Payment system is still loading.");
       return;
    }

    setIsProcessing(true);
    try {
      if (formData.paymentMethod === 'online') {
         await new Promise(resolve => setTimeout(resolve, 2000));
      }

      const shippingStr = `${formData.shipping.address}, ${formData.shipping.city}, ${formData.shipping.state} ${formData.shipping.zipCode}, ${formData.shipping.country}`;
      const billingStr = formData.sameAsShipping 
        ? shippingStr 
        : `${formData.billing.address}, ${formData.billing.city}, ${formData.billing.state} ${formData.billing.zipCode}, ${formData.billing.country}`;

      const response = await apiClient.post("/orders", {
        email: formData.email,
        items: cartItems.map(i => ({ productId: i.id, quantity: i.quantity })),
        shippingAddress: shippingStr,
        billingAddress: billingStr,
        paymentMethod: formData.paymentMethod,
        couponCode: appliedCoupon?.code,
        password: (!user && formData.createAccount) ? formData.password : undefined,
        name: `${formData.shipping.firstName} ${formData.shipping.lastName}`.trim()
      });

      if (response.data.success) {
        setLastOrder({
          id: response.data.order?.id,
          date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          items: [...cartItems],
          subtotal,
          tax: taxAmount,
          shipping: shippingCost,
          total: total,
          address: shippingStr,
          paymentMethod: formData.paymentMethod
        });
        
        toast.success("Order Placed Successfully!");
        dispatch(clearCart());
        setOrderStatus('success');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Checkout failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        fontSize: '14px',
        color: '#062D1B',
        fontFamily: 'Outfit, sans-serif',
        '::placeholder': { color: 'rgba(6, 45, 27, 0.2)' },
        fontWeight: '500',
      },
      invalid: { color: '#ef4444' },
    },
  };

  if (orderStatus === 'success') {
    return (
      <div className="min-h-screen bg-[#FDFDFB] text-[#062D1B] antialiased">
         <div className="container mx-auto px-6 py-20 max-w-4xl text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
               <div className="flex justify-center">
                  <div className="size-24 rounded-full bg-[#062D1B] flex items-center justify-center text-white shadow-2xl">
                     <PackageCheck className="size-10" />
                  </div>
               </div>

               <div className="space-y-4">
                  <h1 className="text-5xl md:text-7xl font-serif italic text-[#062D1B]">Order <span className="text-[#EBB56B]">Placed!</span></h1>
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#062D1B]/40">Thank you for your order.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                  <div className="p-10 rounded-[2.5rem] bg-white border border-gray-100 space-y-6 shadow-sm">
                     <div className="space-y-4">
                        <div>
                           <label className="text-[9px] font-bold uppercase tracking-widest text-[#062D1B]/30">Order Number</label>
                           <p className="text-sm font-bold">#{lastOrder?.id?.slice(-8).toUpperCase()}</p>
                        </div>
                        <div>
                           <label className="text-[9px] font-bold uppercase tracking-widest text-[#062D1B]/30">Delivery Status</label>
                           <div className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-widest">
                              <Zap className="size-3" /> Preparing Shipment
                           </div>
                        </div>
                        <div>
                           <label className="text-[9px] font-bold uppercase tracking-widest text-[#062D1B]/30">Ship To</label>
                           <p className="text-[11px] font-medium text-[#062D1B]/60 leading-relaxed">{lastOrder?.address}</p>
                        </div>
                     </div>
                  </div>

                  <div className="p-10 rounded-[2.5rem] bg-[#062D1B] text-white space-y-6 shadow-2xl relative overflow-hidden">
                     <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[url('https://i.postimg.cc/0y2xqZs9/Sunlit-forest-path-with-wooden-platform.jpg')] bg-cover" />
                     <div className="relative z-10 space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest opacity-40">
                           <span>Items Overview</span>
                           <span>{lastOrder?.items?.length} Items</span>
                        </div>
                        <div className="h-px bg-white/10" />
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest opacity-40">
                           <span>Total Paid</span>
                           <span className="text-2xl font-serif italic text-[#EBB56B]">${lastOrder?.total?.toFixed(2)}</span>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-10">
                  <Button asChild className="rounded-xl px-10 h-14 bg-[#062D1B] text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#083a23]">
                     <Link href="/products">Continue Browsing</Link>
                  </Button>
                  <Button asChild variant="ghost" className="rounded-xl px-10 h-14 text-[10px] uppercase tracking-widest text-[#062D1B]/40 hover:text-[#062D1B]">
                     <Link href="/account">Order Archive</Link>
                  </Button>
               </div>
            </motion.div>
         </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFDFB] flex flex-col items-center justify-center p-8">
        <ShoppingBag className="size-16 text-[#062D1B]/10 mb-8" />
        <h2 className="text-3xl font-serif italic text-[#062D1B] mb-8">Your bag is currently empty.</h2>
        <Button asChild className="rounded-xl px-12 h-16 text-[10px] uppercase font-bold tracking-[0.3em] bg-[#062D1B] text-white">
          <Link href="/products">Discover Collection</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFB] text-[#062D1B] antialiased">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Outfit:wght@100..900&display=swap');
        .font-serif { font-family: 'Cormorant Garamond', serif; }
        .font-sans { font-family: 'Outfit', sans-serif; }
        .checkout-input { height: 3.5rem; border-radius: 0.75rem; border-color: #f1f5f9; background: #ffffff; font-weight: 500; }
        .checkout-input:focus { border-color: #062D1B; ring-color: #062D1B; }
      `}} />

      <header className="h-24 flex items-center border-b border-gray-100 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
         <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
               <img src="https://cdn.mignite.app/ws/works_01KM0WR2ZSKYNHV0ZE2MPNM9EF/final-Logo-1--01KM5Y2NCW8720B30G9G0XW18Y.png" alt="Sharcly" className="h-7 w-auto" />
            </Link>
            <div className="flex items-center gap-6">
               <div className="hidden md:flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-[#062D1B]/40">
                  <ShieldCheck size={14} className="text-[#EBB56B]" /> SECURE SSL
               </div>
               <button onClick={() => router.back()} className="size-10 rounded-full bg-gray-50 flex items-center justify-center text-[#062D1B]/20 hover:bg-gray-100 transition-all"><X size={16} /></button>
            </div>
         </div>
      </header>

      <main className="container mx-auto px-6 lg:px-12 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          <div className="lg:col-span-7 space-y-12">
             <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-serif italic text-[#062D1B]">Secure <span className="text-[#EBB56B]">Checkout.</span></h1>
                <div className="flex items-center gap-1.5 pt-4">
                   <div className={cn("px-5 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all", step === 1 ? "bg-[#062D1B] text-white" : "bg-white border border-gray-100 text-[#062D1B]/20")}>1. Shipping</div>
                   <ChevronRight className="size-3 text-black/10" />
                   <div className={cn("px-5 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all", step === 2 ? "bg-[#062D1B] text-white" : "bg-white border border-gray-100 text-[#062D1B]/20")}>2. Payment</div>
                </div>
             </div>

             <form onSubmit={handleCheckout} className="space-y-12">
                <AnimatePresence mode="wait">
                   {step === 1 ? (
                     <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
                         <div className="space-y-10 p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm">
                            
                            <div className="space-y-6">
                               <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#062D1B]">Contact Information</h3>
                                  {!user && (
                                     <Link href="/login" className="text-[10px] font-bold uppercase tracking-widest text-[#EBB56B] hover:text-[#062D1B] transition-colors">
                                        Login
                                     </Link>
                                  )}
                               </div>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                     <Label className="text-[10px] font-bold uppercase tracking-widest text-[#062D1B]/40 ml-1">Email Address</Label>
                                     <Input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="email@example.com" className="checkout-input" />
                                  </div>
                                  {!user && (
                                     <div className="flex items-center gap-3 pt-6">
                                        <button 
                                          type="button"
                                          onClick={() => setFormData({...formData, createAccount: !formData.createAccount})}
                                          className={cn(
                                            "size-5 rounded-lg border flex items-center justify-center transition-all",
                                            formData.createAccount ? "bg-[#062D1B] border-[#062D1B]" : "border-gray-200"
                                          )}
                                        >
                                           {formData.createAccount && <CheckCircle2 className="size-3 text-white" />}
                                        </button>
                                        <div className="space-y-0.5">
                                           <p className="text-[10px] font-bold uppercase tracking-widest text-[#062D1B]">Create Account</p>
                                           <p className="text-[8px] font-medium text-[#062D1B]/30 italic">Save details for future purchase</p>
                                        </div>
                                     </div>
                                  )}
                               </div>

                               <AnimatePresence>
                                  {!user && formData.createAccount && (
                                     <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 overflow-hidden">
                                        <div className="space-y-2">
                                           <Label className="text-[10px] font-bold uppercase tracking-widest text-[#062D1B]/40 ml-1">Password</Label>
                                           <Input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="••••••••" className="checkout-input" />
                                        </div>
                                        <div className="space-y-2">
                                           <Label className="text-[10px] font-bold uppercase tracking-widest text-[#062D1B]/40 ml-1">Confirm Password</Label>
                                           <Input type="password" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} placeholder="••••••••" className="checkout-input" />
                                        </div>
                                     </motion.div>
                                  )}
                               </AnimatePresence>
                            </div>

                            <div className="space-y-6 pt-4">
                               <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#062D1B]">Shipping Address</h3>
                               </div>

                               {user && savedAddresses.length > 0 && (
                                 <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                                    {savedAddresses.map((addr) => (
                                       <button 
                                         key={addr.id}
                                         type="button"
                                         onClick={() => selectAddress(addr)}
                                         className={cn(
                                           "flex-shrink-0 w-64 p-6 rounded-2xl border transition-all text-left",
                                           selectedSavedAddress === addr.id ? "border-[#062D1B] bg-[#062D1B] text-white" : "border-gray-100 bg-gray-50 hover:border-gray-200"
                                         )}
                                       >
                                          <MapPin className={cn("size-4 mb-3", selectedSavedAddress === addr.id ? "text-[#EBB56B]" : "text-[#062D1B]/20")} />
                                          <p className="text-[11px] font-bold truncate">{addr.street}</p>
                                          <p className="text-[9px] font-medium truncate opacity-60">{addr.city}, {addr.state} {addr.zipCode}</p>
                                       </button>
                                    ))}
                                 </div>
                               )}

                               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                  <div className="space-y-2">
                                     <Label className="text-[10px] font-bold uppercase tracking-widest text-[#062D1B]/40 ml-1">First Name</Label>
                                     <Input required value={formData.shipping.firstName} onChange={(e) => setFormData({...formData, shipping: { ...formData.shipping, firstName: e.target.value }})} placeholder="John" className="checkout-input" />
                                  </div>
                                  <div className="space-y-2">
                                     <Label className="text-[10px] font-bold uppercase tracking-widest text-[#062D1B]/40 ml-1">Last Name</Label>
                                     <Input required value={formData.shipping.lastName} onChange={(e) => setFormData({...formData, shipping: { ...formData.shipping, lastName: e.target.value }})} placeholder="Doe" className="checkout-input" />
                                  </div>
                                  <div className="md:col-span-2 space-y-2">
                                     <Label className="text-[10px] font-bold uppercase tracking-widest text-[#062D1B]/40 ml-1">Street Address</Label>
                                     <Input required value={formData.shipping.address} onChange={(e) => setFormData({...formData, shipping: { ...formData.shipping, address: e.target.value }})} placeholder="123 Main St" className="checkout-input" />
                                  </div>
                                  <div className="grid grid-cols-3 md:col-span-2 gap-4">
                                     <div className="col-span-1 space-y-2">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-[#062D1B]/40 ml-1">City</Label>
                                        <Input required value={formData.shipping.city} onChange={(e) => setFormData({...formData, shipping: { ...formData.shipping, city: e.target.value }})} className="checkout-input" />
                                     </div>
                                     <div className="col-span-1 space-y-2">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-[#062D1B]/40 ml-1">State</Label>
                                        <Input required value={formData.shipping.state} onChange={(e) => setFormData({...formData, shipping: { ...formData.shipping, state: e.target.value }})} className="checkout-input" />
                                     </div>
                                     <div className="col-span-1 space-y-2">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-[#062D1B]/40 ml-1">Zip</Label>
                                        <Input required value={formData.shipping.zipCode} onChange={(e) => setFormData({...formData, shipping: { ...formData.shipping, zipCode: e.target.value }})} className="checkout-input" />
                                     </div>
                                  </div>
                               </div>
                            </div>
                         </div>

                         <div className="flex justify-end">
                            <Button type="submit" className="h-14 px-12 rounded-xl bg-[#062D1B] text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#083a23] transition-all shadow-xl shadow-[#062D1B]/10">
                               Continue to Payment <ArrowRight className="ml-3 size-4" />
                            </Button>
                         </div>
                     </motion.div>
                   ) : (
                     <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
                        <div className="p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm space-y-10">
                           <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                              <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#062D1B]">Payment Method</h3>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {[
                                { id: 'online', label: 'Online Payment', sub: 'Credit/Debit Card', icon: CreditCard },
                                { id: 'cod', label: 'Cash on Delivery', sub: 'Pay at your doorstep', icon: Truck }
                              ].map((method) => (
                                <button 
                                  key={method.id}
                                  type="button"
                                  onClick={() => setFormData({...formData, paymentMethod: method.id as any})}
                                  className={cn(
                                    "p-8 rounded-[2rem] border transition-all text-left flex flex-col gap-4 group",
                                    formData.paymentMethod === method.id ? "border-[#062D1B] bg-[#062D1B] text-white shadow-xl" : "border-gray-100 bg-gray-50 hover:border-gray-200"
                                  )}
                                >
                                   <method.icon className={cn("size-6", formData.paymentMethod === method.id ? "text-[#EBB56B]" : "text-[#062D1B]/20")} />
                                   <div>
                                      <p className="text-xs font-bold uppercase tracking-widest">{method.label}</p>
                                      <p className={cn("text-[10px] font-medium opacity-40")}>{method.sub}</p>
                                   </div>
                                </button>
                              ))}
                           </div>

                           <AnimatePresence mode="wait">
                              {formData.paymentMethod === 'online' ? (
                                <motion.div key="card" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-6 pt-6 border-t border-gray-50">
                                   <div className="space-y-2">
                                      <Label className="text-[10px] font-bold uppercase tracking-widest text-[#062D1B]/40 ml-1">Cardholder Name</Label>
                                      <Input required={formData.paymentMethod === 'online'} value={formData.cardHolderName} onChange={(e) => setFormData({...formData, cardHolderName: e.target.value})} placeholder="Full Name" className="checkout-input" />
                                   </div>
                                   <div className="space-y-2">
                                      <Label className="text-[10px] font-bold uppercase tracking-widest text-[#062D1B]/40 ml-1">Card Details</Label>
                                      <div className="checkout-input flex items-center px-4 border border-gray-100"><CardNumberElement options={CARD_ELEMENT_OPTIONS} className="w-full" /></div>
                                   </div>
                                   <div className="grid grid-cols-2 gap-4">
                                      <div className="checkout-input flex items-center px-4 border border-gray-100"><CardExpiryElement options={CARD_ELEMENT_OPTIONS} className="w-full" /></div>
                                      <div className="checkout-input flex items-center px-4 border border-gray-100"><CardCvcElement options={CARD_ELEMENT_OPTIONS} className="w-full" /></div>
                                   </div>
                                </motion.div>
                              ) : (
                                <motion.div key="cod" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="p-8 rounded-[2rem] bg-emerald-50/30 border border-emerald-100 text-center space-y-2">
                                   <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">Cash on Delivery</p>
                                   <p className="text-[11px] text-emerald-800/60 font-medium italic">Cash on delivery is available for your order.</p>
                                </motion.div>
                              )}
                           </AnimatePresence>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                           <button type="button" onClick={() => setStep(1)} className="text-[9px] font-bold uppercase tracking-widest text-[#062D1B]/30 hover:text-[#062D1B] flex items-center gap-2 transition-colors">
                              <ArrowLeft size={12} /> Edit Shipping
                           </button>
                           <Button type="submit" disabled={isProcessing} className="h-16 px-12 rounded-xl bg-[#062D1B] text-white hover:bg-[#083a23] text-[11px] font-bold uppercase tracking-[0.4em] shadow-2xl shadow-[#062D1B]/20 transition-all">
                              {isProcessing ? "Processing..." : formData.paymentMethod === 'online' ? "Complete Transaction" : "Confirm Order"}
                           </Button>
                        </div>
                     </motion.div>
                   )}
                </AnimatePresence>
             </form>
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-32">
             <div className="rounded-[3rem] bg-[#062D1B] text-white shadow-2xl overflow-hidden relative group">
                <div 
                  className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://i.postimg.cc/0y2xqZs9/Sunlit-forest-path-with-wooden-platform.jpg')] bg-cover bg-center transition-transform duration-[10s] ease-linear group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#062D1B]/50 to-[#062D1B]" />
                
                <div className="relative z-10 p-10 lg:p-12 space-y-10">
                   <div className="flex justify-between items-center border-b border-white/10 pb-6">
                      <h3 className="text-2xl font-serif italic text-white">Order Summary</h3>
                      <Badge className="bg-[#EBB56B] text-[#062D1B] rounded-full px-3 py-1 text-[9px] font-bold border-none">{cartItems.length} Items</Badge>
                   </div>
                   
                   <div className="space-y-6 max-h-[350px] overflow-y-auto no-scrollbar pr-1">
                      {cartItems.map((item) => (
                         <div key={item.id} className="flex gap-5 group">
                            <div className="size-20 rounded-[1.5rem] overflow-hidden border border-white/10 bg-white/5 shrink-0 relative">
                               <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover opacity-80" />
                               <div className="absolute -top-1 -right-1 size-6 bg-[#EBB56B] text-[#062D1B] text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#062D1B]">{item.quantity}</div>
                            </div>
                            <div className="flex-1 space-y-1">
                               <h4 className="text-sm font-serif italic text-white line-clamp-1">{item.name}</h4>
                               <p className="text-[10px] font-bold text-[#EBB56B] tracking-widest">${item.price}</p>
                            </div>
                         </div>
                      ))}
                   </div>

                   <div className="space-y-4 pt-6 border-t border-white/10">
                      <div className="flex flex-col gap-4">
                         <div className="flex gap-2">
                            <Input 
                               placeholder="Coupon Code" 
                               value={couponCode}
                               onChange={(e) => setCouponCode(e.target.value)}
                               className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/20 px-5 text-xs font-bold uppercase tracking-widest focus:border-[#EBB56B]/50"
                            />
                            <Button 
                               onClick={handleApplyCoupon}
                               disabled={isApplyingCoupon || !couponCode}
                               className="h-12 px-6 rounded-xl bg-[#EBB56B] text-[#062D1B] hover:bg-white font-bold text-[10px] uppercase tracking-widest"
                            >
                               {isApplyingCoupon ? <Zap className="size-3 animate-spin" /> : "Apply"}
                            </Button>
                         </div>
                         {appliedCoupon && (
                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex justify-between items-center px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                               <div className="flex items-center gap-2 text-emerald-400">
                                  <Ticket size={12} />
                                  <span className="text-[9px] font-bold uppercase tracking-widest">{appliedCoupon.code}</span>
                               </div>
                               <button onClick={handleRemoveCoupon} className="text-white/40 hover:text-white"><X size={12} /></button>
                            </motion.div>
                         )}
                      </div>

                      <div className="space-y-3 pt-4">
                         <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-white/40">
                            <span>Subtotal</span>
                            <span className="text-white">${subtotal.toFixed(2)}</span>
                         </div>
                         {discountAmount > 0 && (
                            <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-emerald-400">
                               <span>Discount</span>
                               <span>-${discountAmount.toFixed(2)}</span>
                            </div>
                         )}
                         <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-white/40">
                            <span>Tax</span>
                            <span className="text-white">${taxAmount.toFixed(2)}</span>
                         </div>
                         <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-white/40">
                            <span>Shipping</span>
                            <span className={cn(shippingCost === 0 ? "text-emerald-400" : "text-white")}>{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span>
                         </div>
                         <div className="h-px bg-white/10 my-4" />
                         <div className="flex justify-between items-end">
                            <div className="space-y-1">
                               <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#EBB56B]">Total Amount</p>
                               <p className="text-4xl font-serif italic text-white">${total.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-white/20 pb-2">
                               <Globe size={12} /> Total
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </main>
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

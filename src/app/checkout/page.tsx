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
  CreditCard as CardIcon,
  Ticket
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
    paymentMethod: "online" as "online" | "cod"
  });

  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedSavedAddress, setSelectedSavedAddress] = useState<string | null>(null);
  const [settings, setSettings] = useState<any>(null);

  // Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await apiClient.get("/settings");
        if (response.data.success) {
          setSettings(response.data.settings);
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      }
    };
    fetchSettings();
  }, []);

  const taxRate = settings ? Number(settings.taxRate) : 0;
  const shippingCharge = settings ? Number(settings.shippingCharge) : 0;
  const freeThreshold = settings ? Number(settings.freeShippingThreshold) : 0;

  const taxAmount = (subtotal * taxRate) / 100;
  const shippingCost = (freeThreshold > 0 && subtotal >= freeThreshold) ? 0 : shippingCharge;
  const total = Math.max(0, subtotal - discountAmount) + taxAmount + shippingCost;

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
        toast.success(`Coupon Applied! ${response.data.discount}${response.data.discountType === 'PERCENTAGE' ? '%' : '$'} OFF`);
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
    setDiscountAmount(0);
  };

  useEffect(() => {
    if (appliedCoupon) {
      if (appliedCoupon.discountType === 'PERCENTAGE') {
        setDiscountAmount((subtotal * Number(appliedCoupon.discount)) / 100);
      } else {
        setDiscountAmount(Number(appliedCoupon.discount));
      }
    } else {
      setDiscountAmount(0);
    }
  }, [appliedCoupon, subtotal]);

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
      if (formData.paymentMethod === 'online') {
         const cardElement = elements.getElement(CardNumberElement);
         if (!cardElement) throw new Error("Card identification required");
         // Simulate processing or actual Stripe call if integrated further
         await new Promise(resolve => setTimeout(resolve, 2000));
      }

      const shippingStr = `${formData.shipping.address}, ${formData.shipping.city}, ${formData.shipping.state} ${formData.shipping.zipCode}, ${formData.shipping.country}`;
      const billingStr = formData.sameAsShipping 
        ? shippingStr 
        : `${formData.billing.address}, ${formData.billing.city}, ${formData.billing.state} ${formData.billing.zipCode}, ${formData.billing.country}`;

      // Save address if requested
      if (formData.saveAddress && user) {
         try {
            await apiClient.post("/addresses", {
               street: formData.shipping.address,
               city: formData.shipping.city,
               state: formData.shipping.state,
               zipCode: formData.shipping.zipCode,
               country: formData.shipping.country,
               isDefault: savedAddresses.length === 0
            });
         } catch (addrErr) {
            console.error("Failed to save address:", addrErr);
         }
      }

      const response = await apiClient.post("/orders", {
        email: formData.email,
        items: cartItems.map(i => ({ productId: i.id, quantity: i.quantity })),
        shippingAddress: shippingStr,
        billingAddress: billingStr,
        paymentMethod: formData.paymentMethod,
        couponCode: appliedCoupon?.code
      });

      if (response.data.success) {
        setLastOrder({
          id: response.data.order?.id || "SC-" + Math.random().toString(36).substring(7).toUpperCase(),
          date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          items: [...cartItems],
          subtotal: subtotal,
          tax: taxAmount,
          shipping: shippingCost,
          total: total,
          address: shippingStr,
          paymentMethod: formData.paymentMethod
        });
        
        toast.success("Order Placed Successfully");
        dispatch(clearCart());
        setOrderStatus('success');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Checkout failed";
      
      if (errorMsg.includes("Insufficient stock")) {
        const productName = errorMsg.split("for ")[1] || "Some items";
        toast.error(`Out of Stock: ${productName} is no longer available.`);
      } else {
        toast.error(errorMsg);
      }
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
      <div className="min-h-screen bg-white text-[#062D1B] font-sans selection:bg-[#062D1B] selection:text-white antialiased">
         <div className="container mx-auto px-6 lg:px-12 py-20 lg:py-32 max-w-4xl text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
               <div className="flex justify-center">
                  <div className="relative">
                     <motion.div 
                       initial={{ scale: 0.5, opacity: 0 }}
                       animate={{ scale: 1, opacity: 1 }}
                       transition={{ type: "spring", damping: 12 }}
                       className="size-24 rounded-full bg-[#062D1B] flex items-center justify-center text-white shadow-xl shadow-[#062D1B]/10"
                     >
                        <PackageCheck className="size-10" />
                     </motion.div>
                     <motion.div 
                       animate={{ scale: [1, 1.2, 1], rotate: [0, 15, 0] }}
                       transition={{ repeat: Infinity, duration: 3 }}
                       className="absolute -top-2 -right-2 size-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100"
                     >
                        <Sparkles className="size-4" />
                     </motion.div>
                  </div>
               </div>

               <div className="space-y-4">
                  <h1 className="text-4xl lg:text-6xl font-medium tracking-tight">Order <span className="italic serif text-[#062D1B]/40">Confirmed.</span></h1>
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#062D1B]/30">Thank you for choosing Sharcly.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left pt-6">
                  <div className="p-8 rounded-3xl bg-neutral-50/50 border border-gray-100 space-y-6">
                     <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-black/20">Order Receipt</label>
                        <p className="text-sm font-bold tracking-tight">#{lastOrder?.id}</p>
                     </div>
                     <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-black/20">Delivery Status</label>
                        <div className="flex items-center gap-2 text-emerald-600">
                           <Zap className="size-3.5" />
                           <span className="text-[10px] font-bold uppercase tracking-widest">Preparing Shipment</span>
                        </div>
                     </div>
                     <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-black/20">Shipping To</label>
                        <p className="text-[11px] font-medium text-[#062D1B]/60 leading-relaxed line-clamp-2">{lastOrder?.address}</p>
                     </div>
                     <div className="space-y-1 pt-2">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-black/20">Payment Method</label>
                        <div className="flex items-center gap-2 text-[#062D1B]/60">
                           {lastOrder?.paymentMethod === 'cod' ? <Truck className="size-3.5" /> : <CreditCard className="size-3.5" />}
                           <span className="text-[10px] font-bold uppercase tracking-widest">
                              {lastOrder?.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                           </span>
                        </div>
                     </div>
                  </div>

                  <div className="p-8 rounded-3xl bg-[#062D1B] text-white space-y-6 shadow-2xl shadow-[#062D1B]/10">
                     <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest opacity-40">
                        <span>Items Overview</span>
                        <Calendar className="size-3.5" />
                     </div>
                     <div className="space-y-3 max-h-[100px] overflow-y-auto no-scrollbar pr-2 italic opacity-70 text-[11px]">
                        {lastOrder?.items?.map((item: any) => (
                           <div key={item.id} className="flex justify-between">{item.name} × {item.quantity} <span>${item.price}</span></div>
                        ))}
                     </div>
                     <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest opacity-40">
                        <span>Subtotal</span>
                        <span>${lastOrder?.subtotal?.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest opacity-40">
                        <span>Tax</span>
                        <span>${lastOrder?.tax?.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest opacity-40">
                        <span>Shipping</span>
                        <span>{lastOrder?.shipping === 0 ? "FREE" : `$${lastOrder?.shipping?.toFixed(2)}`}</span>
                     </div>
                     <div className="h-px bg-white/10" />
                     <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold uppercase tracking-widest opacity-40">
                           {lastOrder?.paymentMethod === 'cod' ? 'Total to Pay' : 'Paid Total'}
                        </span>
                        <span className="text-2xl font-medium tabular-nums">${lastOrder?.total?.toFixed(2)}</span>
                     </div>
                  </div>
               </div>

               <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-10">
                  <Button asChild className="rounded-full px-10 h-14 bg-[#062D1B] text-white text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-[#062D1B]/10 transition-all hover:scale-[1.02] active:scale-[0.98]">
                     <Link href="/products">Continue Browsing</Link>
                  </Button>
                  <Button asChild variant="ghost" className="rounded-full px-10 h-14 text-[10px] uppercase tracking-widest text-black/30 hover:text-[#062D1B] hover:bg-neutral-50">
                     <Link href="/dashboard">Order Archive</Link>
                  </Button>
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
    <div className="min-h-screen bg-white text-[#062D1B] selection:bg-[#062D1B] selection:text-white antialiased font-sans">
      <header className="h-20 flex items-center bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-50">
         <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="size-8 rounded-lg bg-[#062D1B] flex items-center justify-center text-white font-black text-xs">S</div>
              <span className="text-[11px] font-bold uppercase tracking-[0.3em]">Sharcly</span>
            </Link>
            <div className="flex items-center gap-6">
               <div className="hidden md:flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-[#062D1B]/40"><Lock className="size-3" /> Secure SSL Encryption</div>
               <button onClick={() => router.back()} className="size-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-neutral-50 transition-all text-black/20"><X className="size-4" /></button>
            </div>
         </div>
      </header>

      <main className="container mx-auto px-6 lg:px-12 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          <div className="lg:col-span-7 space-y-12">
             <div className="space-y-4">
                <div className="flex items-center gap-2">
                   <div className="h-px w-6 bg-[#062D1B]/20" />
                   <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#062D1B]/40">Secure Checkout</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-medium tracking-tight">Complete your order.</h1>
                <div className="flex items-center gap-1.5 pt-4">
                   <div className={cn("px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all", step === 1 ? "bg-[#062D1B] text-white" : "bg-neutral-50 text-black/20")}>1. Shipping</div>
                   <ChevronRight className="size-3 text-black/10" />
                   <div className={cn("px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all", step === 2 ? "bg-[#062D1B] text-white" : "bg-neutral-50 text-black/20")}>2. Payment</div>
                </div>
             </div>

             <form onSubmit={handleCheckout} className="space-y-12">
                <AnimatePresence mode="wait">
                   {step === 1 ? (
                     <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
                         <div className="space-y-10 p-8 lg:p-10 rounded-3xl bg-white border border-gray-100 shadow-sm">
                           
                           {/* Email Section */}
                           <div className="space-y-6">
                              <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                                 <Mail className="size-4 text-[#062D1B]/30" />
                                 <h3 className="text-sm font-bold uppercase tracking-widest">Contact Information</h3>
                              </div>
                              <div className="space-y-2">
                                 <Label className="text-[10px] font-bold uppercase tracking-widest text-[#062D1B]/40 ml-1">Email Address</Label>
                                 <Input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="email@example.com" className="checkout-input" />
                              </div>
                           </div>

                           {/* Shipping Address Section */}
                           <div className="space-y-6 pt-4">
                              <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                                 <div className="flex items-center gap-3">
                                    <Truck className="size-4 text-[#062D1B]/30" />
                                    <h3 className="text-sm font-bold uppercase tracking-widest">Shipping Address</h3>
                                 </div>
                                 {user && savedAddresses.length > 0 && (
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                                       {savedAddresses.length} Saved
                                    </span>
                                 )}
                              </div>

                              {user && savedAddresses.length > 0 && (
                                <div className="space-y-3">
                                   <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2">
                                      {savedAddresses.map((addr) => (
                                         <button 
                                           key={addr.id}
                                           type="button"
                                           onClick={() => selectAddress(addr)}
                                           className={cn(
                                             "flex-shrink-0 w-56 p-5 rounded-2xl border transition-all text-left",
                                             selectedSavedAddress === addr.id 
                                               ? "border-[#062D1B] bg-[#062D1B] text-white shadow-md shadow-[#062D1B]/10" 
                                               : "border-gray-100 bg-neutral-50 hover:border-gray-200"
                                           )}
                                         >
                                            <div className="flex justify-between items-start mb-2">
                                               <MapPin className={cn("size-3.5", selectedSavedAddress === addr.id ? "text-white" : "text-[#062D1B]/20")} />
                                               {selectedSavedAddress === addr.id && <div className="size-2 rounded-full bg-emerald-400" />}
                                            </div>
                                            <p className="text-[11px] font-bold truncate mb-0.5">{addr.street}</p>
                                            <p className={cn("text-[9px] font-medium truncate opacity-60")}>
                                               {addr.city}, {addr.state} {addr.zipCode}
                                            </p>
                                         </button>
                                      ))}
                                      <button 
                                        type="button" 
                                        onClick={() => setSelectedSavedAddress(null)}
                                        className={cn(
                                          "flex-shrink-0 w-56 p-5 rounded-2xl border border-dashed flex flex-col items-center justify-center gap-2 text-black/20 hover:text-[#062D1B] hover:border-[#062D1B]/20 transition-all",
                                          !selectedSavedAddress ? "border-[#062D1B]/20 bg-neutral-50" : "border-gray-200"
                                        )}
                                      >
                                         <div className="size-8 rounded-full bg-neutral-100 flex items-center justify-center text-black/20 group-hover:bg-[#062D1B]/5 transition-all"><X className="size-4 rotate-45" /></div>
                                         <span className="text-[9px] font-bold uppercase tracking-widest">New Address</span>
                                      </button>
                                   </div>
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
                                       <Input required value={formData.shipping.city} onChange={(e) => setFormData({...formData, shipping: { ...formData.shipping, city: e.target.value }})} placeholder="City" className="checkout-input" />
                                    </div>
                                    <div className="col-span-1 space-y-2">
                                       <Label className="text-[10px] font-bold uppercase tracking-widest text-[#062D1B]/40 ml-1">State</Label>
                                       <Input required value={formData.shipping.state} onChange={(e) => setFormData({...formData, shipping: { ...formData.shipping, state: e.target.value }})} placeholder="ST" className="checkout-input" />
                                    </div>
                                    <div className="col-span-1 space-y-2">
                                       <Label className="text-[10px] font-bold uppercase tracking-widest text-[#062D1B]/40 ml-1">Zip</Label>
                                       <Input required value={formData.shipping.zipCode} onChange={(e) => setFormData({...formData, shipping: { ...formData.shipping, zipCode: e.target.value }})} placeholder="12345" className="checkout-input" />
                                    </div>
                                 </div>
                              </div>

                              {user && (
                                 <div className="flex items-center gap-3 pt-2">
                                    <button 
                                      type="button"
                                      onClick={() => setFormData({...formData, saveAddress: !formData.saveAddress})}
                                      className={cn(
                                        "size-4 rounded border flex items-center justify-center transition-all",
                                        formData.saveAddress ? "bg-[#062D1B] border-[#062D1B]" : "border-gray-200 hover:border-gray-300"
                                      )}
                                    >
                                       {formData.saveAddress && <CheckCircle2 className="size-2.5 text-white" />}
                                    </button>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-black/30">Save this address to profile</span>
                                 </div>
                              )}
                           </div>

                           {/* Billing Section */}
                           <div className="space-y-8 pt-6 border-t border-gray-50">
                              <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                    <CreditCard className="size-4 text-[#062D1B]/30" />
                                    <h3 className="text-sm font-bold uppercase tracking-widest">Billing Address</h3>
                                 </div>
                                 <button 
                                   type="button"
                                   onClick={() => setFormData({...formData, sameAsShipping: !formData.sameAsShipping})}
                                   className={cn(
                                     "px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all border",
                                     formData.sameAsShipping ? "bg-[#062D1B] text-white border-[#062D1B]" : "bg-neutral-50 text-black/40 border-gray-100"
                                   )}
                                 >
                                    Same as Shipping
                                 </button>
                              </div>

                              <AnimatePresence>
                                 {!formData.sameAsShipping && (
                                   <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-6 overflow-hidden">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                                         <div className="space-y-2">
                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#062D1B]/40 ml-1">First Name</Label>
                                            <Input required={!formData.sameAsShipping} value={formData.billing.firstName} onChange={(e) => setFormData({...formData, billing: { ...formData.billing, firstName: e.target.value }})} className="checkout-input" />
                                         </div>
                                         <div className="space-y-2">
                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#062D1B]/40 ml-1">Last Name</Label>
                                            <Input required={!formData.sameAsShipping} value={formData.billing.lastName} onChange={(e) => setFormData({...formData, billing: { ...formData.billing, lastName: e.target.value }})} className="checkout-input" />
                                         </div>
                                         <div className="md:col-span-2 space-y-2">
                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#062D1B]/40 ml-1">Billing Street Address</Label>
                                            <Input required={!formData.sameAsShipping} value={formData.billing.address} onChange={(e) => setFormData({...formData, billing: { ...formData.billing, address: e.target.value }})} className="checkout-input" />
                                         </div>
                                         <div className="grid grid-cols-3 md:col-span-2 gap-4">
                                            <div className="space-y-2"><Label className="text-[10px] font-bold uppercase tracking-widest text-[#062D1B]/40 ml-1">City</Label><Input required={!formData.sameAsShipping} value={formData.billing.city} onChange={(e) => setFormData({...formData, billing: { ...formData.billing, city: e.target.value }})} className="checkout-input" /></div>
                                            <div className="space-y-2"><Label className="text-[10px] font-bold uppercase tracking-widest text-[#062D1B]/40 ml-1">State</Label><Input required={!formData.sameAsShipping} value={formData.billing.state} onChange={(e) => setFormData({...formData, billing: { ...formData.billing, state: e.target.value }})} className="checkout-input" /></div>
                                            <div className="space-y-2"><Label className="text-[10px] font-bold uppercase tracking-widest text-[#062D1B]/40 ml-1">Zip</Label><Input required={!formData.sameAsShipping} value={formData.billing.zipCode} onChange={(e) => setFormData({...formData, billing: { ...formData.billing, zipCode: e.target.value }})} className="checkout-input" /></div>
                                         </div>
                                      </div>
                                   </motion.div>
                                 )}
                              </AnimatePresence>
                           </div>
                        </div>

                        <div className="flex justify-end">
                           <Button type="submit" className="h-14 px-10 rounded-full bg-[#062D1B] text-white hover:opacity-90 text-[10px] font-bold uppercase tracking-[0.3em] shadow-lg shadow-[#062D1B]/10 transition-all active:scale-[0.98]">
                              Continue to Payment <ArrowRight className="ml-3 size-3.5" />
                           </Button>
                        </div>
                     </motion.div>
                   ) : (
                     <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
                        <div className="space-y-10">
                           
                           {/* Payment Method Selection */}
                           <div className="p-8 lg:p-10 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-8">
                              <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                                 <CreditCard className="size-4 text-[#062D1B]/30" />
                                 <h3 className="text-sm font-bold uppercase tracking-widest">Payment Method</h3>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <button 
                                   type="button"
                                   onClick={() => setFormData({...formData, paymentMethod: 'online'})}
                                   className={cn(
                                     "p-6 rounded-2xl border transition-all text-left flex flex-col gap-3",
                                     formData.paymentMethod === 'online' ? "border-[#062D1B] bg-neutral-50 shadow-sm" : "border-gray-100 hover:border-gray-200"
                                   )}
                                 >
                                    <div className="flex justify-between items-center">
                                       <CreditCard className={cn("size-5", formData.paymentMethod === 'online' ? "text-[#062D1B]" : "text-black/20")} />
                                       <div className={cn("size-4 rounded-full border-2 flex items-center justify-center", formData.paymentMethod === 'online' ? "border-[#062D1B]" : "border-gray-200")}>
                                          {formData.paymentMethod === 'online' && <div className="size-2 rounded-full bg-[#062D1B]" />}
                                       </div>
                                    </div>
                                    <div className="space-y-1">
                                       <p className="text-xs font-bold uppercase tracking-widest">Pay Online</p>
                                       <p className="text-[10px] text-black/40 font-medium">Securely pay with Credit or Debit card</p>
                                    </div>
                                 </button>

                                 <button 
                                   type="button"
                                   onClick={() => setFormData({...formData, paymentMethod: 'cod'})}
                                   className={cn(
                                     "p-6 rounded-2xl border transition-all text-left flex flex-col gap-3",
                                     formData.paymentMethod === 'cod' ? "border-[#062D1B] bg-neutral-50 shadow-sm" : "border-gray-100 hover:border-gray-200"
                                   )}
                                 >
                                    <div className="flex justify-between items-center">
                                       <Truck className={cn("size-5", formData.paymentMethod === 'cod' ? "text-[#062D1B]" : "text-black/20")} />
                                       <div className={cn("size-4 rounded-full border-2 flex items-center justify-center", formData.paymentMethod === 'cod' ? "border-[#062D1B]" : "border-gray-200")}>
                                          {formData.paymentMethod === 'cod' && <div className="size-2 rounded-full bg-[#062D1B]" />}
                                       </div>
                                    </div>
                                    <div className="space-y-1">
                                       <p className="text-xs font-bold uppercase tracking-widest">Cash on Delivery</p>
                                       <p className="text-[10px] text-black/40 font-medium">Pay when your order reaches your doorstep</p>
                                    </div>
                                 </button>
                              </div>
                           </div>

                           <AnimatePresence mode="wait">
                              {formData.paymentMethod === 'online' ? (
                                <motion.div 
                                  key="online"
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="space-y-10 overflow-hidden"
                                >
                                   <div className="flex justify-center -mb-12 relative z-10">
                                      <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="w-80 h-48 rounded-3xl bg-[#062D1B] p-8 text-white shadow-2xl shadow-[#062D1B]/20 flex flex-col justify-between relative overflow-hidden">
                                         <div className="absolute top-0 right-0 size-40 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                                         <div className="flex justify-between items-start">
                                            <div className="size-9 bg-white/10 rounded-xl flex items-center justify-center"><Fingerprint className="size-5 text-white/40" /></div>
                                            <span className="text-[8px] font-bold tracking-[0.3em] uppercase opacity-40">Sharcly Secure</span>
                                         </div>
                                         <div className="space-y-4">
                                            <p className="text-lg font-medium tracking-[0.2em] tabular-nums italic font-serif">{cardNumPreview}</p>
                                            <div className="flex justify-between items-end">
                                               <div className="space-y-1">
                                                  <p className="text-[7px] font-bold uppercase opacity-30 tracking-widest">Card Holder</p>
                                                  <p className="text-[9px] font-bold tracking-widest uppercase">{formData.cardHolderName || "Sharcly Customer"}</p>
                                               </div>
                                               <div className="space-y-1 text-right">
                                                  <p className="text-[7px] font-bold uppercase opacity-30 tracking-widest">Expiry</p>
                                                  <p className="text-[9px] font-bold">{cardExpiryPreview}</p>
                                               </div>
                                            </div>
                                         </div>
                                      </motion.div>
                                   </div>

                                   <div className="p-8 lg:p-10 pt-20 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-8">
                                      <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                                         <ShieldCheck className="size-4 text-[#062D1B]/30" />
                                         <h3 className="text-sm font-bold uppercase tracking-widest">Card Details</h3>
                                      </div>
                                      
                                      <div className="space-y-6">
                                         <div className="space-y-2">
                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#062D1B]/40 ml-1">Cardholder Full Name</Label>
                                            <Input required={formData.paymentMethod === 'online'} value={formData.cardHolderName} onChange={(e) => setFormData({...formData, cardHolderName: e.target.value})} placeholder="As printed on card" className="checkout-input" />
                                         </div>
                                         <div className="space-y-2">
                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#062D1B]/40 ml-1">Card Number</Label>
                                            <div className="checkout-input flex items-center px-4"><CardNumberElement onChange={handleCardChange} options={CARD_ELEMENT_OPTIONS} className="w-full" /></div>
                                         </div>
                                         <div className="grid grid-cols-2 gap-5">
                                            <div className="space-y-2">
                                               <Label className="text-[10px] font-bold uppercase tracking-widest text-[#062D1B]/40 ml-1">Expiration Date</Label>
                                               <div className="checkout-input flex items-center px-4"><CardExpiryElement options={CARD_ELEMENT_OPTIONS} className="w-full" /></div>
                                            </div>
                                            <div className="space-y-2">
                                               <Label className="text-[10px] font-bold uppercase tracking-widest text-[#062D1B]/40 ml-1">CVC Code</Label>
                                               <div className="checkout-input flex items-center px-4"><CardCvcElement options={CARD_ELEMENT_OPTIONS} className="w-full" /></div>
                                            </div>
                                         </div>
                                      </div>
                                   </div>
                                </motion.div>
                              ) : (
                                <motion.div 
                                  key="cod"
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="space-y-6 overflow-hidden"
                                >
                                   <div className="p-8 lg:p-10 rounded-3xl bg-neutral-50 border border-gray-100 flex flex-col items-center text-center gap-6">
                                      <div className="size-16 rounded-full bg-[#062D1B]/5 flex items-center justify-center text-[#062D1B]">
                                         <Truck className="size-8" />
                                      </div>
                                      <div className="space-y-2">
                                         <h3 className="text-sm font-bold uppercase tracking-widest">Pay on Delivery</h3>
                                         <p className="text-[11px] text-black/50 leading-relaxed max-w-xs mx-auto">
                                            Prepare the exact amount in cash or have your digital payment ready for when our courier partner arrives at your location.
                                         </p>
                                      </div>
                                      <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-[#062D1B]/40 px-4 py-2 bg-white rounded-full border border-gray-50">
                                         <Info className="size-3" />
                                         No extra handling fee for COD
                                      </div>
                                   </div>
                                </motion.div>
                              )}
                           </AnimatePresence>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                           <button type="button" onClick={() => setStep(1)} className="text-[9px] font-bold uppercase tracking-widest text-black/30 hover:text-black flex items-center gap-2 transition-colors">
                              <ArrowLeft className="size-3" /> Edit Shipping
                           </button>
                           <Button type="submit" disabled={isProcessing || (formData.paymentMethod === 'online' && !stripe)} className="h-16 px-12 rounded-full bg-[#062D1B] text-white hover:opacity-95 text-[11px] font-bold uppercase tracking-[0.4em] shadow-xl shadow-[#062D1B]/10 active:scale-[0.98] transition-all">
                              {isProcessing ? "Finalizing Order..." : formData.paymentMethod === 'online' ? "Complete Payment" : "Place COD Order"}
                           </Button>
                        </div>
                     </motion.div>
                   )}
                </AnimatePresence>
             </form>
          </div>

          {/* Bag Summary */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
             <div className="rounded-3xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                <div className="p-8 lg:p-10 space-y-8">
                   <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold tracking-tight">Your Bag</h3>
                      <Badge variant="outline" className="rounded-full px-3 py-1 border-gray-100 text-[9px] text-black/40 font-bold">{cartItems.reduce((acc, i) => acc + i.quantity, 0)} Items</Badge>
                   </div>
                   
                   <div className="space-y-6 max-h-[300px] overflow-y-auto no-scrollbar pr-1">
                      {cartItems.map((item) => (
                         <div key={item.id} className="flex gap-4 group">
                            <div className="size-16 rounded-2xl overflow-hidden border border-gray-50 bg-neutral-50 shrink-0 relative">
                               <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                               <div className="absolute -top-1 -right-1 size-5 bg-[#062D1B] text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">{item.quantity}</div>
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                               <h4 className="text-[12px] font-bold text-[#062D1B] truncate">{item.name}</h4>
                               <p className="text-[10px] font-bold uppercase tracking-widest text-[#062D1B]/30 mt-1">${item.price}</p>
                            </div>
                         </div>
                      ))}
                   </div>

                    <div className="space-y-4 pt-6 border-t border-gray-50">
                       {/* Coupon Section */}
                       <div className="space-y-3 pb-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-[#062D1B]/40 ml-1">Promo Code</Label>
                          <div className="flex gap-2">
                             <Input 
                               placeholder="ENTER CODE" 
                               value={couponCode} 
                               onChange={(e) => setCouponCode(e.target.value)}
                               className="h-10 rounded-xl bg-neutral-50/50 border-neutral-100 text-xs font-black uppercase tracking-widest placeholder:text-neutral-300"
                             />
                             <Button 
                               type="button" 
                               onClick={handleApplyCoupon}
                               disabled={!couponCode || isApplyingCoupon}
                               className="h-10 px-6 rounded-xl bg-[#062D1B] text-white text-[9px] font-black uppercase tracking-widest border-none"
                             >
                                Apply
                             </Button>
                          </div>
                          {appliedCoupon && (
                            <div className="flex items-center justify-between px-4 py-2.5 bg-emerald-50 rounded-xl border border-emerald-100 animate-in fade-in zoom-in-95 duration-300">
                               <div className="flex items-center gap-2">
                                  <Ticket className="size-3 text-emerald-600" />
                                  <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">{appliedCoupon.code}</span>
                               </div>
                               <button onClick={handleRemoveCoupon} className="text-emerald-400 hover:text-emerald-600 transition-colors">
                                  <X size={12} />
                                </button>
                            </div>
                          )}
                       </div>

                       <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-black/30">
                          <span>Subtotal</span>
                          <span className="text-[#062D1B]">${subtotal.toFixed(2)}</span>
                       </div>
                       {discountAmount > 0 && (
                          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                             <span>Discount</span>
                             <span>-${discountAmount.toFixed(2)}</span>
                          </div>
                       )}
                       <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-black/30">
                          <span>Tax ({taxRate}%)</span>
                          <span className="text-[#062D1B]">${taxAmount.toFixed(2)}</span>
                       </div>
                       <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-black/30">
                          <span>Shipping</span>
                          <span className={shippingCost === 0 ? "text-emerald-600" : "text-[#062D1B]"}>
                             {shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}
                          </span>
                       </div>
                       <div className="pt-2">
                          <div className="flex justify-between items-end">
                             <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/20 mb-1.5">Total Amount</span>
                             <span className="text-4xl font-medium tracking-tight tabular-nums">${total.toFixed(2)}</span>
                          </div>
                       </div>
                    </div>
                </div>
                
                {/* Security Trust Badges */}
                <div className="bg-neutral-50/50 p-6 flex justify-around items-center border-t border-gray-50">
                   <div className="flex flex-col items-center gap-1.5 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                      <ShieldCheck className="size-4" />
                      <span className="text-[7px] font-bold uppercase tracking-widest">Safe Pay</span>
                   </div>
                   <div className="flex flex-col items-center gap-1.5 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                      <Truck className="size-4" />
                      <span className="text-[7px] font-bold uppercase tracking-widest">Tracked</span>
                   </div>
                   <div className="flex flex-col items-center gap-1.5 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                      <RotateCcw className="size-4" />
                      <span className="text-[7px] font-bold uppercase tracking-widest">Returns</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: sanitizeHtml(`
        .checkout-input {
          height: 3.5rem !important;
          border-radius: 0.75rem !important;
          background-color: transparent !important;
          border: 1px solid #F3F4F6 !important;
          padding-left: 1rem !important;
          font-size: 13px !important;
          font-weight: 500 !important;
          transition: all 0.2s ease !important;
          display: flex !important;
          align-items: center !important;
          color: #062D1B !important;
        }
        .checkout-input::placeholder {
          color: rgba(6, 45, 27, 0.2) !important;
          font-weight: 400 !important;
        }
        .checkout-input:focus {
          border-color: #062D1B !important;
          background-color: white !important;
          box-shadow: 0 4px 12px -2px rgba(6,45,27,0.05) !important;
          outline: none !important;
          }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
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

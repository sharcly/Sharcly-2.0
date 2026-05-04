"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Star,
  Plus,
  Minus,
  CheckCircle2,
  Share2,
  Info,
  ChevronLeft,
  Leaf,
  FlaskConical,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useSeo } from "@/hooks/use-seo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [liked, setLiked] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "specs" | "shipping">("details");
  
  const dispatch = useDispatch();

  useSeo(`product/${slug}`, {
    title: product ? `${product.name} | Sharcly` : "Loading...",
    description: product?.description,
    ogImage: product?.image_url
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await apiClient.get(`/products/${slug}`);
        const productData = response.data.product;
        setProduct(productData);
        if (productData?.variants?.length > 0) {
          setSelectedVariant(productData.variants[0]);
        }
      } catch (error: any) {
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: selectedVariant ? selectedVariant.id : product.id,
      name: selectedVariant ? `${product.name} - ${selectedVariant.title}` : product.name,
      slug: product.slug,
      price: displayPrice,
      quantity: quantity,
      image: productImages[0],
      category: product.category?.name
    }));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  /* ═══ LOADING STATE ═══ */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
          <div className="size-10 rounded-full border-2 border-black/[0.04] border-t-[#062D1B] animate-spin" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#062D1B]/20">Loading product...</span>
        </motion.div>
      </div>
    );
  }

  if (!product) return null;

  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.split('/api')[0] || "http://localhost:8181";
  const productImages = product.imageUrls?.length > 0 
    ? product.imageUrls.map((url: string) => url.startsWith('/api') ? `${baseUrl}${url}` : url) 
    : (product.images?.length > 0 
        ? product.images.map((img: any) => img.url || img) 
        : [
            product.image_url || "https://i.postimg.cc/T3qHks4z/Sharcly-Chill-Collection.jpg",
            "https://i.postimg.cc/9F7Kz7H4/Sharcly-Lift-Series.jpg",
            "https://i.postimg.cc/vHgY9D41/Daytime-Clarity.jpg",
            "https://i.postimg.cc/K8nwpV4T/Premium-Hemp-Essentials-Sharcly.jpg"
          ]);

  const displayPrice = selectedVariant ? Number(selectedVariant.price) : Number(product.price);
  const isOutOfStock = (selectedVariant ? selectedVariant.inventoryQuantity : product.stock) === 0;

  const PROMISE_ITEMS = [
    { icon: ShieldCheck, label: "Lab Verified", sub: "COA every batch" },
    { icon: Truck, label: "Free Shipping", sub: "Orders $50+" },
    { icon: RotateCcw, label: "30-Day Returns", sub: "No questions asked" },
    { icon: Leaf, label: "Organic Hemp", sub: "USDA certified" },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#062D1B] selection:bg-[#062D1B] selection:text-white antialiased">
      <Navbar />
      
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-6 md:px-12">
          
          {/* ═══ BREADCRUMB ═══ */}
          <motion.nav 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-10"
          >
            <Link href="/products" className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#062D1B]/25 hover:text-[#062D1B]/60 transition-colors group">
              <ChevronLeft className="size-3 group-hover:-translate-x-0.5 transition-transform" />
              Back to Products
            </Link>
            <span className="text-[#062D1B]/10">·</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#062D1B]/15">{product.category?.name || "Collection"}</span>
          </motion.nav>

          {/* ═══ MAIN LAYOUT ═══ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            
            {/* ═══ LEFT: GALLERY ═══ */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-3"
            >
              {/* Main Image */}
              <div className="relative aspect-square max-h-[calc(100vh-160px)] rounded-2xl overflow-hidden bg-white border border-black/[0.04] group">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    src={productImages[activeImage]}
                    alt={product.name}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Hover zoom hint */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.02] transition-colors duration-500" />

                {/* Top actions */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  {product.category?.name && (
                    <span className="px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-md text-[9px] font-bold uppercase tracking-widest text-[#062D1B]/50 shadow-sm">
                      {product.category.name}
                    </span>
                  )}
                  <button 
                    onClick={() => setLiked(!liked)}
                    className={cn(
                      "size-10 rounded-xl flex items-center justify-center backdrop-blur-md shadow-sm transition-all active:scale-90",
                      liked ? "bg-rose-500 text-white" : "bg-white/90 text-[#062D1B]/40 hover:text-rose-500"
                    )}
                  >
                    <Heart className={cn("size-4", liked && "fill-current")} />
                  </button>
                </div>

                {/* Out of stock overlay */}
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="px-6 py-3 rounded-full bg-[#062D1B] text-white text-[11px] font-bold uppercase tracking-widest">Sold Out</span>
                  </div>
                )}

                {/* Image counter */}
                {productImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md">
                    <span className="text-[10px] font-bold text-white/80 tabular-nums">{activeImage + 1} / {productImages.length}</span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {productImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto no-scrollbar p-1.5">
                  {productImages.map((src: string, i: number) => (
                    <button 
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={cn(
                        "relative size-14 md:size-16 rounded-xl overflow-hidden shrink-0 transition-all duration-300",
                        activeImage === i 
                          ? "ring-[2.5px] ring-[#062D1B] ring-offset-[3px] ring-offset-[#FAFAF8] opacity-100" 
                          : "opacity-40 hover:opacity-70"
                      )}
                    >
                      <img src={src} className="absolute inset-0 w-full h-full object-cover" alt={`View ${i + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* ═══ RIGHT: PRODUCT INFO ═══ */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:sticky lg:top-28 space-y-8"
            >
              {/* Title + Price Block */}
              <div className="space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">In Stock · Lab Verified</span>
                  </div>

                  <h1 className="text-[clamp(26px,3vw,38px)] font-black tracking-[-0.03em] leading-[1.1]">
                    {product.name}
                  </h1>

                  {selectedVariant && (
                    <span className="text-[13px] font-semibold text-[#062D1B]/35">{selectedVariant.title}</span>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black tabular-nums tracking-tight">${displayPrice.toFixed(2)}</span>
                  <span className="text-[11px] font-bold text-[#062D1B]/20 uppercase tracking-widest">USD</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-[13px] text-[#062D1B]/45 leading-[1.7] font-medium">
                {product.description || "Thoughtfully designed and clinically synthesized. Our signature product represents the pinnacle of hemp science, focused on restoring your natural rhythm."}
              </p>

              {/* Divider */}
              <div className="h-px bg-black/[0.04]" />

              {/* ═══ VARIANTS ═══ */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#062D1B]/25">Configuration</span>
                  <div className="grid grid-cols-2 gap-2">
                    {product.variants.map((v: any) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={cn(
                          "relative p-3.5 rounded-xl text-left transition-all duration-300",
                          selectedVariant?.id === v.id 
                            ? "bg-[#062D1B] text-white shadow-lg shadow-[#062D1B]/10" 
                            : "bg-white border border-black/[0.04] hover:border-black/[0.1] text-[#062D1B]"
                        )}
                      >
                        <span className="text-[11px] font-bold block">{v.title}</span>
                        <span className={cn("text-[10px] font-semibold", selectedVariant?.id === v.id ? "text-white/50" : "text-[#062D1B]/30")}>${Number(v.price).toFixed(2)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ═══ QUANTITY + ADD TO CART ═══ */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#062D1B]/25">Quantity</span>
                <div className="flex items-center gap-3">
                  {/* Qty Stepper */}
                  <div className="flex items-center h-13 bg-white rounded-xl border border-black/[0.04] overflow-hidden">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                      className="w-12 h-full flex items-center justify-center hover:bg-black/[0.02] transition-colors active:scale-90"
                    >
                      <Minus className="size-3 text-[#062D1B]/40" />
                    </button>
                    <span className="w-12 text-center text-[13px] font-black tabular-nums border-x border-black/[0.04]">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)} 
                      className="w-12 h-full flex items-center justify-center hover:bg-black/[0.02] transition-colors active:scale-90"
                    >
                      <Plus className="size-3 text-[#062D1B]/40" />
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <Button 
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={cn(
                      "flex-1 h-13 rounded-xl font-bold text-[11px] uppercase tracking-[0.12em] transition-all duration-300 active:scale-[0.98]",
                      addedToCart 
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                        : "bg-[#062D1B] text-white hover:bg-[#0a4a2e] shadow-lg shadow-[#062D1B]/15"
                    )}
                  >
                    {addedToCart ? (
                      <motion.span initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center gap-2">
                        <CheckCircle2 className="size-4" /> Added!
                      </motion.span>
                    ) : isOutOfStock ? "Sold Out" : "Add to Cart"}
                  </Button>
                </div>

                {/* Total hint */}
                {quantity > 1 && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] font-semibold text-[#062D1B]/25 tabular-nums">
                    Total: ${(displayPrice * quantity).toFixed(2)}
                  </motion.p>
                )}
              </div>

              {/* ═══ PROMISES ═══ */}
              <div className="grid grid-cols-2 gap-3">
                {PROMISE_ITEMS.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-black/[0.03] group hover:border-black/[0.06] transition-colors">
                    <div className="size-8 rounded-lg bg-[#062D1B]/[0.03] flex items-center justify-center group-hover:bg-[#062D1B]/[0.06] transition-colors shrink-0">
                      <item.icon className="size-3.5 text-[#062D1B]/30" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#062D1B]/70 leading-tight">{item.label}</p>
                      <p className="text-[9px] text-[#062D1B]/25 font-medium">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Share */}
              <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#062D1B]/15 hover:text-[#062D1B]/40 transition-colors">
                <Share2 className="size-3" /> Share this product
              </button>
            </motion.div>
          </div>

          {/* ═══ TABS SECTION ═══ */}
          <div className="mt-20 md:mt-28 max-w-4xl mx-auto">
            {/* Tab Buttons */}
            <div className="flex gap-1 p-1 bg-white rounded-xl border border-black/[0.04] mb-8">
              {(["details", "specs", "shipping"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex-1 py-3 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all duration-300",
                    activeTab === tab 
                      ? "bg-[#062D1B] text-white shadow-md shadow-[#062D1B]/10" 
                      : "text-[#062D1B]/25 hover:text-[#062D1B]/50"
                  )}
                >
                  {tab === "details" ? "Details" : tab === "specs" ? "Specifications" : "Shipping"}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === "details" && (
                <motion.div key="details" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                      <h2 className="text-2xl font-black tracking-tight">Precision Crafted</h2>
                      <p className="text-[13px] text-[#062D1B]/40 leading-[1.8] font-medium">
                        Our process begins with heirloom botanical selection and ends in a climate-controlled laboratory. We remove 100% of the distortion to ensure every drop carries the pure intended frequency of the plant.
                      </p>
                      <div className="space-y-3 pt-2">
                        {["99.8% Synthesis Purity", "Ethanol-Free Extraction", "Terpene Matrix Locked", "Certified Organic Base"].map((check, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="size-6 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                              <CheckCircle2 className="size-3" />
                            </div>
                            <span className="text-[12px] font-bold text-[#062D1B]/50">{check}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-white border border-black/[0.04]">
                      <img src="https://i.postimg.cc/mrCnYW4B/Calming-balance-with-Sharcly.jpg" className="w-full h-full object-cover" alt="Process" />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "specs" && (
                <motion.div key="specs" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { k: "Product ID", v: `SC-${(slug as string || "").substring(0,6).toUpperCase()}` },
                      { k: "Sourcing", v: "Oregon Heritage Organic" },
                      { k: "Potency", v: "1500mg Matrix" },
                      { k: "Carrier", v: "MCT / Coconut Pure" },
                      { k: "Verification", v: "QR-Batch v2.4" },
                      { k: "Shelf Life", v: "24 Months" }
                    ].map((spec, i) => (
                      <div key={i} className="p-5 bg-white rounded-xl border border-black/[0.04] space-y-1.5 hover:border-black/[0.08] transition-colors">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[#062D1B]/20 block">{spec.k}</span>
                        <span className="text-[12px] font-bold text-[#062D1B]">{spec.v}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "shipping" && (
                <motion.div key="shipping" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                  <div className="space-y-4">
                    {[
                      { icon: Truck, title: "Free Shipping", desc: "Complimentary standard shipping on all orders over $50. Express options available at checkout." },
                      { icon: RotateCcw, title: "30-Day Returns", desc: "Not satisfied? Return any unopened product within 30 days for a full refund, no questions asked." },
                      { icon: Zap, title: "Express Delivery", desc: "Need it fast? Select express shipping at checkout for 2-3 business day delivery." },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4 p-5 bg-white rounded-xl border border-black/[0.04]">
                        <div className="size-10 rounded-xl bg-[#062D1B]/[0.03] flex items-center justify-center shrink-0">
                          <item.icon className="size-4 text-[#062D1B]/30" />
                        </div>
                        <div>
                          <h4 className="text-[12px] font-bold text-[#062D1B] mb-1">{item.title}</h4>
                          <p className="text-[11px] text-[#062D1B]/35 leading-relaxed font-medium">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

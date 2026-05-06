"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { apiClient } from "@/lib/api-client";
import { 
  Heart, Truck, ShieldCheck, RotateCcw, 
  Plus, Minus, CheckCircle2, Share2,
  ChevronLeft, Leaf, Zap
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
        if (productData?.variants?.length > 0) setSelectedVariant(productData.variants[0]);
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
      quantity,
      image: productImages[0],
      category: product.category?.name
    }));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#040e07' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
          <div className="size-10 rounded-full border-2 animate-spin" style={{ borderColor: 'rgba(239,248,238,0.08)', borderTopColor: '#E8C547' }} />
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(239,248,238,0.2)' }}>Loading...</span>
        </motion.div>
      </div>
    );
  }

  if (!product) return null;

  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.split('/api')[0] || "http://localhost:8181";
  
  // Base gallery images
  const baseImages = product.imageUrls?.length > 0 
    ? product.imageUrls.map((url: string) => url.startsWith('/api') ? `${baseUrl}${url}` : url) 
    : (product.images?.length > 0 
        ? product.images.map((img: any) => img.url || img) 
        : [product.image_url || "https://i.postimg.cc/T3qHks4z/Sharcly-Chill-Collection.jpg"]);

  // Collect unique images from variants
  const variantImages = (product.variants || [])
    .map((v: any) => v.image)
    .filter((img: any) => img)
    .map((img: string) => img.startsWith('/api') ? `${baseUrl}${img}` : (img.startsWith('http') ? img : `${baseUrl}/api/images/${img}`));

  // Final image list (unique)
  const productImages = Array.from(new Set([...baseImages, ...variantImages]));

  const displayPrice = selectedVariant ? Number(selectedVariant.price) : Number(product.price);
  const isOutOfStock = (selectedVariant ? selectedVariant.inventoryQuantity : product.stock) === 0;

  const PROMISE_ITEMS = [
    { icon: ShieldCheck, label: "Lab Verified", sub: "COA every batch" },
    { icon: Truck, label: "Free Shipping", sub: "Orders $50+" },
    { icon: RotateCcw, label: "30-Day Returns", sub: "No questions" },
    { icon: Leaf, label: "Organic Hemp", sub: "USDA certified" },
  ];

  return (
    <div className="min-h-screen antialiased" style={{ background: 'linear-gradient(175deg, #040e07 0%, #082f1d 50%, #040e07 100%)', color: '#eff8ee' }}>
      <Navbar />
      
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-6 md:px-12">
          
          {/* Breadcrumb */}
          <motion.nav initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 mb-10">
            <Link href="/products" className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors group" style={{ color: 'rgba(239,248,238,0.7)' }}>
              <ChevronLeft className="size-3 group-hover:-translate-x-0.5 transition-transform" />
              Back to Products
            </Link>
            <span style={{ color: 'rgba(239,248,238,0.5)' }}>·</span>
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(239,248,238,0.6)' }}>{product.category?.name || "Collection"}</span>
          </motion.nav>

          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            
            {/* LEFT: Gallery */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-3">
              <div className="relative aspect-square max-h-[calc(100vh-160px)] rounded-[20px] overflow-hidden group" style={{ backgroundColor: '#0d2518', border: '1px solid rgba(239,248,238,0.06)', boxShadow: '0 30px 80px rgba(0,0,0,0.5)' }}>
                <AnimatePresence mode="wait">
                  <motion.img key={activeImage} src={productImages[activeImage]} alt={product.name}
                    initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4 }} className="absolute inset-0 w-full h-full object-cover" />
                </AnimatePresence>
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(4,14,7,0.4) 0%, transparent 50%)' }} />

                {/* Top actions */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  {product.category?.name && (
                    <span className="inline-flex items-center px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.2em]"
                      style={{ 
                        backgroundColor: '#E8C547', 
                        color: '#040e07', 
                        borderRadius: '2px',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                      }}
                    >
                      {product.category.name}
                    </span>
                  )}
                  <button onClick={() => setLiked(!liked)} className={cn("size-10 rounded-xl flex items-center justify-center backdrop-blur-md transition-all active:scale-90", liked ? "bg-rose-500 text-white" : "text-[#eff8ee]/40 hover:text-rose-400")} style={!liked ? { backgroundColor: 'rgba(239,248,238,0.08)' } : {}}>
                    <Heart className={cn("size-4", liked && "fill-current")} />
                  </button>
                </div>

                {isOutOfStock && (
                  <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(4,14,7,0.7)', backdropFilter: 'blur(2px)' }}>
                    <span className="px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest" style={{ backgroundColor: '#E8C547', color: '#082f1d' }}>Sold Out</span>
                  </div>
                )}

                {productImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full backdrop-blur-md" style={{ backgroundColor: 'rgba(4,14,7,0.6)' }}>
                    <span className="text-[10px] font-bold tabular-nums" style={{ color: 'rgba(239,248,238,0.9)' }}>{activeImage + 1} / {productImages.length}</span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {productImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto no-scrollbar p-1.5">
                  {productImages.map((src: string, i: number) => (
                    <button key={i} onClick={() => setActiveImage(i)}
                      className={cn("relative size-14 md:size-16 rounded-xl overflow-hidden shrink-0 transition-all duration-300",
                        activeImage === i ? "ring-[2.5px] ring-[#E8C547] ring-offset-[3px] opacity-100" : "opacity-40 hover:opacity-70"
                      )}>
                      <img src={src} className="absolute inset-0 w-full h-full object-cover" alt={`View ${i + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* RIGHT: Product Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="lg:sticky lg:top-28 space-y-8">
              
              {/* Title + Price */}
              <div className="space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="size-1.5 rounded-full bg-[#E8C547] animate-pulse shadow-[0_0_8px_#E8C547]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#E8C547' }}>In Stock · Lab Verified</span>
                  </div>
                  <h1 className="font-black leading-[1.1]" style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 'clamp(28px, 3.5vw, 42px)', color: '#eff8ee' }}>
                    {product.name}
                  </h1>
                  {selectedVariant && <span className="text-[13px] font-semibold" style={{ color: 'rgba(239,248,238,0.7)' }}>{selectedVariant.title}</span>}
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black tabular-nums tracking-tight" style={{ color: '#E8C547' }}>${displayPrice.toFixed(2)}</span>
                  <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'rgba(239,248,238,0.6)' }}>USD</span>
                </div>
              </div>

              <p className="text-[13px] leading-[1.7] font-medium" style={{ color: 'rgba(239,248,238,0.85)' }}>
                {product.description || "Thoughtfully designed and clinically synthesized. Our signature product represents the pinnacle of hemp science."}
              </p>

              <div className="h-px" style={{ backgroundColor: 'rgba(239,248,238,0.06)' }} />

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(239,248,238,0.7)' }}>Configuration</span>
                  <div className="grid grid-cols-2 gap-2">
                    {product.variants.map((v: any) => (
                      <button key={v.id} onClick={() => {
                        setSelectedVariant(v);
                        if (v.image) {
                          const variantUrl = v.image.startsWith('/api') ? `${baseUrl}${v.image}` : (v.image.startsWith('http') ? v.image : `${baseUrl}/api/images/${v.image}`);
                          const idx = productImages.indexOf(variantUrl);
                          if (idx !== -1) setActiveImage(idx);
                        }
                      }}
                        className={cn("relative p-3.5 rounded-xl text-left transition-all duration-300",
                          selectedVariant?.id === v.id ? "shadow-lg" : ""
                        )}
                        style={selectedVariant?.id === v.id
                          ? { backgroundColor: '#E8C547', color: '#082f1d' }
                          : { backgroundColor: 'rgba(239,248,238,0.04)', border: '1px solid rgba(239,248,238,0.08)', color: '#eff8ee' }}
                      >
                        <span className="text-[11px] font-bold block">{v.title}</span>
                        <span className="text-[10px] font-semibold" style={{ opacity: 0.8 }}>${Number(v.price).toFixed(2)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity + Add to Cart */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(239,248,238,0.7)' }}>Quantity</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center h-13 rounded-xl overflow-hidden" style={{ backgroundColor: 'rgba(239,248,238,0.05)', border: '1px solid rgba(239,248,238,0.08)' }}>
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-full flex items-center justify-center transition-colors active:scale-90" style={{ color: 'rgba(239,248,238,0.8)' }}>
                      <Minus className="size-3" />
                    </button>
                    <span className="w-12 text-center text-[13px] font-black tabular-nums" style={{ borderLeft: '1px solid rgba(239,248,238,0.08)', borderRight: '1px solid rgba(239,248,238,0.08)', color: '#eff8ee' }}>{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-full flex items-center justify-center transition-colors active:scale-90" style={{ color: 'rgba(239,248,238,0.8)' }}>
                      <Plus className="size-3" />
                    </button>
                  </div>

                  <button onClick={handleAddToCart} disabled={isOutOfStock}
                    className={cn("flex-1 h-13 rounded-xl font-bold text-[11px] uppercase tracking-[0.12em] transition-all duration-300 active:scale-[0.98]",
                      addedToCart ? "shadow-lg shadow-emerald-500/20" : "shadow-lg"
                    )}
                    style={addedToCart
                      ? { backgroundColor: '#22c55e', color: 'white' }
                      : { backgroundColor: '#E8C547', color: '#082f1d', boxShadow: '0 10px 30px rgba(232,197,71,0.2)' }}
                  >
                    {addedToCart ? (
                      <motion.span initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center justify-center gap-2">
                        <CheckCircle2 className="size-4" /> Added!
                      </motion.span>
                    ) : isOutOfStock ? "Sold Out" : "Add to Cart"}
                  </button>
                </div>
                {quantity > 1 && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] font-semibold tabular-nums" style={{ color: 'rgba(232,197,71,0.5)' }}>
                    Total: ${(displayPrice * quantity).toFixed(2)}
                  </motion.p>
                )}
              </div>

              {/* Promises */}
              <div className="grid grid-cols-2 gap-3">
                {PROMISE_ITEMS.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-3 rounded-xl group transition-colors" style={{ backgroundColor: 'rgba(239,248,238,0.03)', border: '1px solid rgba(239,248,238,0.06)' }}>
                    <div className="size-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(232,197,71,0.08)' }}>
                      <item.icon className="size-3.5" style={{ color: '#E8C547' }} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold leading-tight" style={{ color: 'rgba(239,248,238,0.9)' }}>{item.label}</p>
                      <p className="text-[9px] font-medium" style={{ color: 'rgba(239,248,238,0.7)' }}>{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors" style={{ color: 'rgba(239,248,238,0.6)' }}>
                <Share2 className="size-3" /> Share this product
              </button>
            </motion.div>
          </div>

          {/* ═══ TABS ═══ */}
          <div className="mt-20 md:mt-28 max-w-4xl mx-auto">
            <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: 'rgba(239,248,238,0.04)', border: '1px solid rgba(239,248,238,0.06)' }}>
              {(["details", "specs", "shipping"] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={cn("flex-1 py-3 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all duration-300",
                    activeTab === tab ? "" : ""
                  )}
                  style={activeTab === tab
                    ? { backgroundColor: '#E8C547', color: '#082f1d', boxShadow: '0 4px 15px rgba(232,197,71,0.2)' }
                    : { color: 'rgba(239,248,238,0.6)' }}
                >
                  {tab === "details" ? "Details" : tab === "specs" ? "Specifications" : "Shipping"}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "details" && (
                <motion.div key="details" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="pt-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                      <h2 className="text-2xl font-black tracking-tight" style={{ fontFamily: 'var(--font-cormorant), serif', color: '#eff8ee' }}>Precision Crafted</h2>
                      <p className="text-[13px] leading-[1.8] font-medium" style={{ color: 'rgba(239,248,238,0.85)' }}>
                        Our process begins with heirloom botanical selection and ends in a climate-controlled laboratory. We remove 100% of the distortion to ensure every drop carries the pure intended frequency of the plant.
                      </p>
                      <div className="space-y-3 pt-2">
                        {["99.8% Synthesis Purity", "Ethanol-Free Extraction", "Terpene Matrix Locked", "Certified Organic Base"].map((check, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="size-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(232,197,71,0.1)' }}>
                              <CheckCircle2 className="size-3" style={{ color: '#E8C547' }} />
                            </div>
                            <span className="text-[12px] font-bold" style={{ color: 'rgba(239,248,238,0.8)' }}>{check}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="aspect-[4/5] rounded-[20px] overflow-hidden" style={{ backgroundColor: '#0d2518', border: '1px solid rgba(239,248,238,0.06)', boxShadow: '0 30px 60px rgba(0,0,0,0.4)' }}>
                      <img src="https://i.postimg.cc/mrCnYW4B/Calming-balance-with-Sharcly.jpg" className="w-full h-full object-cover" alt="Process" />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "specs" && (
                <motion.div key="specs" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="pt-10">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { k: "Product ID", v: `SC-${(slug as string || "").substring(0,6).toUpperCase()}` },
                      { k: "Sourcing", v: "Oregon Heritage Organic" },
                      { k: "Potency", v: "1500mg Matrix" },
                      { k: "Carrier", v: "MCT / Coconut Pure" },
                      { k: "Verification", v: "QR-Batch v2.4" },
                      { k: "Shelf Life", v: "24 Months" }
                    ].map((spec, i) => (
                      <div key={i} className="p-5 rounded-xl space-y-1.5 transition-colors" style={{ backgroundColor: 'rgba(239,248,238,0.03)', border: '1px solid rgba(239,248,238,0.06)' }}>
                        <span className="text-[9px] font-bold uppercase tracking-widest block" style={{ color: 'rgba(239,248,238,0.6)' }}>{spec.k}</span>
                        <span className="text-[12px] font-bold" style={{ color: '#eff8ee' }}>{spec.v}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "shipping" && (
                <motion.div key="shipping" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="pt-10">
                  <div className="space-y-4">
                    {[
                      { icon: Truck, title: "Free Shipping", desc: "Complimentary standard shipping on all orders over $50. Express options available at checkout." },
                      { icon: RotateCcw, title: "30-Day Returns", desc: "Not satisfied? Return any unopened product within 30 days for a full refund." },
                      { icon: Zap, title: "Express Delivery", desc: "Need it fast? Select express shipping at checkout for 2-3 business day delivery." },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4 p-5 rounded-xl" style={{ backgroundColor: 'rgba(239,248,238,0.03)', border: '1px solid rgba(239,248,238,0.06)' }}>
                        <div className="size-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(232,197,71,0.08)' }}>
                          <item.icon className="size-4" style={{ color: '#E8C547' }} />
                        </div>
                        <div>
                          <h4 className="text-[12px] font-bold mb-1" style={{ color: '#eff8ee' }}>{item.title}</h4>
                          <p className="text-[11px] leading-relaxed font-medium" style={{ color: 'rgba(239,248,238,0.8)' }}>{item.desc}</p>
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

"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { apiClient } from "@/lib/api-client";
import {
  Heart, Truck, ShieldCheck, RotateCcw,
  Plus, Minus, Share2, ChevronLeft, Leaf, FileText,
  Zap, Star, ShoppingCart, Link as LinkIcon,
  Instagram, Twitter, ExternalLink, AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { toast } from "sonner";
import { useSeo } from "@/hooks/use-seo";
import { useLensZoom } from "@/hooks/use-lens-zoom";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import { getImageUrl } from "@/lib/image-utils";
import { ProductDetailSkeleton, ProductCardSkeleton, FeaturedProductCardSkeleton } from "@/components/ui/skeletons";
import { ProductCard } from "@/components/product-card";
import { FeaturedProductCard } from "@/components/product/featured-product-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [liked, setLiked] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "ingredients" | "lab" | "reviews">("description");

  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(true);

  const [currentImageUrl, setCurrentImageUrl] = useState<string>("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const atcRef = useRef<HTMLDivElement>(null);
  const [showMobileATC, setShowMobileATC] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const zoom = useLensZoom(3);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Intersection Observer for Mobile Sticky ATC
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowMobileATC(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    if (atcRef.current) {
      observer.observe(atcRef.current);
    }

    return () => observer.disconnect();
  }, [loading, product]);

  // Fetch Related/Featured Products
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await apiClient.get('/products?featured=true');
        setRelatedProducts(res.data.products || []);
      } catch (err) {
        console.error("Failed to fetch related products", err);
      } finally {
        setRelatedLoading(false);
      }
    };
    fetchRelated();
  }, []);

  const baseImages = useMemo(() => {
    if (!product) return [getImageUrl(null)];

    const variantImageIds = (product.variants || [])
      .map((v: any) => v.image)
      .filter(Boolean);

    // If we have the full images array (with metadata), filter correctly
    if (product.images?.length > 0) {
      const gallery = product.images
        .filter((img: any) => !img.isThumbnail && img.order !== 999 && !variantImageIds.includes(img.id))
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
        .map((img: any) => getImageUrl(img.id));

      if (gallery.length > 0) return gallery;
    }

    // Fallback: If only imageUrls available, use them but try to exclude variant ones if they match
    if (product.imageUrls?.length > 0) {
      return product.imageUrls
        .filter((url: string) => !variantImageIds.some(vid => url.includes(vid)))
        .map((url: string) => getImageUrl(url));
    }

    return [getImageUrl(product.image_url)];
  }, [product]);

  const variantImages = useMemo(() => {
    return (product?.variants || [])
      .map((v: any) => v.image ? getImageUrl(v.image) : null)
      .filter(Boolean);
  }, [product]);

  const allImages = useMemo(() => {
    return Array.from(new Set([...baseImages, ...variantImages]));
  }, [baseImages, variantImages]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await apiClient.get(`/products/${slug}`);
        const productData = response.data.product;
        setProduct(productData);

        if (productData?.variants?.length > 0) {
          setSelectedVariant(productData.variants[0]);
        } else {
          // Fallback sequential variants
          setSelectedVariant({ id: '1', title: 'Pack of 1', price: productData.price });
        }
      } catch (error: any) {
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  // Set initial image when product loads
  useEffect(() => {
    if (product && !currentImageUrl) {
      if (selectedVariant?.image) {
        setCurrentImageUrl(getImageUrl(selectedVariant.image));
      } else if (baseImages.length > 0) {
        setCurrentImageUrl(baseImages[0]);
      }
    }
  }, [product, baseImages, selectedVariant]);

  // Synchronize active index whenever image URL changes
  useEffect(() => {
    const idx = allImages.findIndex(img => img === currentImageUrl);
    if (idx !== -1) {
      setActiveImageIndex(idx);
    }
  }, [currentImageUrl, allImages]);

  // Switch image ONLY when variant is changed manually
  useEffect(() => {
    if (selectedVariant?.image) {
      setCurrentImageUrl(getImageUrl(selectedVariant.image));
    }
  }, [selectedVariant?.id]); // Depend on ID specifically to avoid unnecessary triggers

  useSeo(`product/${slug}`, {
    title: product ? `${product.name} | Sharcly` : "Loading...",
    description: product?.description,
    ogImage: product?.image_url
  });

  const displayPrice = selectedVariant ? Number(selectedVariant.price) : Number(product?.price || 0);
  const displayActualPrice = (selectedVariant && Number(selectedVariant.actualPrice) > 0)
    ? Number(selectedVariant.actualPrice)
    : Number(product?.actualPrice || 0);
  const isOutOfStock = (selectedVariant ? selectedVariant.inventoryQuantity : product?.stock) === 0;

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addToCart({
      id: selectedVariant ? selectedVariant.id : product.id,
      name: selectedVariant ? `${product.name} - ${selectedVariant.title}` : product.name,
      slug: product.slug,
      price: displayPrice,
      quantity,
      image: currentImageUrl || allImages[0],
      category: product.category?.name
    }));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleShare = async () => {
    setIsShareModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#040e07] text-[#eff8ee]">
        <Navbar />
        <main className="pt-28 pb-20">
          <div className="container mx-auto px-6 md:px-12">
            <ProductDetailSkeleton />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) return null;

  const seriesName = product.tags?.find((t: any) => t.value.toLowerCase().includes("series"))?.value || "Vape";
  const productType = product.type || "Disposable";
  const cannabinoid = product.tags?.find((t: any) => t.value.includes("-"))?.value || "Delta-8 THC";

  return (
    <div className="min-h-screen bg-[#040e07] text-[#eff8ee] selection:bg-[#E8C547]/20 selection:text-[#E8C547]">
      <Navbar />

      <main className="pt-24 md:pt-[120px] pb-12 md:pb-16">
        <div className="container mx-auto px-4 md:px-12">

          {/* 🍞 BREADCRUMB */}
          <nav className="mb-6 md:mb-8 flex items-center gap-2 overflow-x-auto no-scrollbar whitespace-nowrap py-1">
            <Link href="/products" className="text-[10px] md:text-[11px] font-medium font-body uppercase tracking-[0.08em] text-[rgba(239,248,238,0.5)] hover:text-[#E8C547] transition-colors flex items-center gap-1">
              <ChevronLeft className="size-3" /> Back
            </Link>
            <span className="text-[rgba(239,248,238,0.2)]">·</span>
            <Link href={`/products?series=${seriesName}`} className="text-[10px] md:text-[11px] font-medium font-body uppercase tracking-[0.08em] text-[rgba(239,248,238,0.5)] hover:text-[#E8C547] transition-colors">
              {seriesName} Series
            </Link>
            <span className="text-[rgba(239,248,238,0.2)]">·</span>
            <span className="text-[10px] md:text-[11px] font-medium font-body uppercase tracking-[0.08em] text-[#E8C547] truncate max-w-[120px] md:max-w-[300px]">
              {product.name}
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">

            {/* 🖼️ LEFT PANEL — IMAGE GALLERY */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-6 flex flex-col md:flex-row gap-4 lg:sticky lg:top-[120px]"
            >

              {/* Thumbnail Strip */}
              <div className="hidden md:flex flex-col gap-2.5">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentImageUrl(img);
                      setActiveImageIndex(idx);
                      zoom.setIsHovering(false);
                    }}
                    className={cn(
                      "w-[72px] h-[72px] rounded-xl overflow-hidden cursor-pointer border transition-all duration-300 bg-[#082f1d]/50",
                      activeImageIndex === idx
                        ? "border-[#E8C547] shadow-[0_0_0_1px_#E8C547]"
                        : "border-[rgba(239,248,238,0.08)] hover:border-[rgba(232,197,71,0.3)]"
                    )}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Main Image Card */}
              <div
                ref={zoom.imgRef}
                onMouseEnter={zoom.onMouseEnter}
                onMouseLeave={zoom.onMouseLeave}
                onMouseMove={zoom.onMouseMove}
                style={{ cursor: (!isTouchDevice && zoom.isHovering) ? 'none' : 'default' }}
                className="flex-1 relative aspect-[1/1.05] rounded-[24px] overflow-hidden border border-[rgba(239,248,238,0.08)] bg-linear-to-br from-[#082f1d]/60 to-[#040e07]/90 shadow-[0_40px_100px_rgba(0,0,0,0.5),0_0_0_1px_rgba(232,197,71,0.04)] group"
              >

                {/* 1. Radial gold glow */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,rgba(232,197,71,0.08),transparent_65%)]" />

                {/* 3. Glossy sheen */}
                <div className="absolute top-0 left-0 right-0 h-[45%] bg-linear-to-b from-white/5 to-transparent z-10 pointer-events-none" />

                {/* 5. Four gold corner brackets */}
                <div className="absolute top-6 left-6 w-7 h-7 border-t-[1.5px] border-l-[1.5px] border-[#E8C547]/45 z-10" />
                <div className="absolute top-6 right-6 w-7 h-7 border-t-[1.5px] border-r-[1.5px] border-[#E8C547]/45 z-10" />
                <div className="absolute bottom-6 left-6 w-7 h-7 border-b-[1.5px] border-l-[1.5px] border-[#E8C547]/45 z-10" />
                <div className="absolute bottom-6 right-6 w-7 h-7 border-b-[1.5px] border-r-[1.5px] border-[#E8C547]/45 z-10" />

                {/* 4. Series badge */}
                <div className="absolute top-5 left-5 z-20">
                  <span className="bg-[#E8C547]/90 text-[#082f1d] text-[9px] font-bold font-body uppercase tracking-[0.18em] px-3 py-1.5 rounded-full shadow-lg">
                    {seriesName} Series
                  </span>
                </div>

                {/* 2. Product image */}
                <div className="absolute inset-0 p-8 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {currentImageUrl ? (
                      <motion.img
                        key={currentImageUrl}
                        src={currentImageUrl}
                        alt={product.name}
                        initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)] group-hover:scale-[1.04] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/5 rounded-2xl animate-pulse" />
                    )}
                  </AnimatePresence>
                </div>

                {/* ZOOM LENS — renders on top when hovering */}
                {!isTouchDevice && (
                  <AnimatePresence>
                    {zoom.isHovering && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                          position: 'absolute',
                          width: zoom.lensSize,
                          height: zoom.lensSize,
                          borderRadius: '50%',
                          border: '2px solid rgba(232,197,71,0.6)',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(232,197,71,0.2), inset 0 0 20px rgba(232,197,71,0.05)',
                          pointerEvents: 'none',
                          zIndex: 30,
                          overflow: 'hidden',
                          left: zoom.lensPos.x - zoom.lensSize / 2,
                          top: zoom.lensPos.y - zoom.lensSize / 2,
                          backgroundImage: `url(${currentImageUrl})`,
                          backgroundSize: `${zoom.zoomFactor * 100}%`,
                          backgroundPosition: `${zoom.bgPos.x}% ${zoom.bgPos.y}%`,
                          backgroundRepeat: 'no-repeat',
                          backdropFilter: 'brightness(1.1) contrast(1.05)',
                        }}
                      />
                    )}
                  </AnimatePresence>
                )}

                {/* Hover to zoom hint */}
                {!isTouchDevice && (
                  <div style={{
                    position: 'absolute',
                    bottom: 14,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: 9,
                    fontWeight: 600,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'rgba(239,248,238,0.28)',
                    pointerEvents: 'none',
                    zIndex: 25,
                    opacity: zoom.isHovering ? 0 : 1,
                    transition: 'opacity 0.3s',
                    whiteSpace: 'nowrap',
                  }}>
                    Hover to zoom
                  </div>
                )}

                {/* 6. Image counter badge */}
                <div className="absolute bottom-5 right-5 z-20 bg-[#082f1d]/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
                  <span className="text-[11px] font-semibold font-body text-[rgba(239,248,238,0.55)]">
                    {activeImageIndex + 1} / {allImages.length}
                  </span>
                </div>
              </div>

              {/* Mobile Thumbnail Row */}
              <div className="flex md:hidden gap-2.5 overflow-x-auto no-scrollbar pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentImageUrl(img);
                      setActiveImageIndex(idx);
                      zoom.setIsHovering(false);
                    }}
                    className={cn(
                      "w-16 h-16 rounded-xl overflow-hidden shrink-0 border transition-all duration-300 bg-[#082f1d]/50",
                      activeImageIndex === idx
                        ? "border-[#E8C547]"
                        : "border-[rgba(239,248,238,0.08)]"
                    )}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* ℹ️ RIGHT PANEL — PRODUCT INFO */}
            <motion.div
              variants={containerVariants}
              initial="initial"
              animate="animate"
              className="lg:col-span-6 space-y-8"
            >

              {/* 1. Status Row */}
              <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-5">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#4ade80]/8 border border-[#4ade80]/20 text-[#4ade80] text-[10px] font-bold font-body uppercase tracking-[0.14em]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] shadow-[0_0_8px_#4ade80] animate-pulse" />
                  In Stock
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E8C547]/8 border border-[#E8C547]/20 text-[#E8C547] text-[10px] font-bold font-body uppercase tracking-[0.14em]">
                  <ShieldCheck className="size-[11px]" />
                  Lab Verified
                </div>
              </motion.div>

              {/* 2. Product Name */}
              <motion.div variants={itemVariants} className="space-y-1.5">
                <h1 className="font-serif font-bold text-[clamp(32px,3.5vw,52px)] leading-[1.06] tracking-[-0.02em] text-[#eff8ee]">
                  {product.name}
                </h1>
                <p className="text-[13px] font-body text-[#eff8ee]/52 tracking-[0.04em]">
                  Sharcly · {seriesName} Series · {productType} · {cannabinoid}
                </p>
              </motion.div>

              {/* 3. Rating Row */}
              <motion.div variants={itemVariants} className="flex items-center gap-2.5 pb-7 border-b border-[rgba(239,248,238,0.08)]">
                {(() => {
                  const testimonials = Array.isArray(product.testimonials) ? product.testimonials : [];
                  const reviews = Array.isArray(product.reviews) ? product.reviews : [];
                  const allRatings = [
                    ...testimonials.map((t: any) => t.rating || 5),
                    ...reviews.map((r: any) => r.rating || 5)
                  ];
                  
                  const avgRating = allRatings.length > 0 
                    ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1) 
                    : "5.0";
                  const count = allRatings.length > 0 ? allRatings.length : 1;

                  return (
                    <>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className={cn("size-3.5", Number(avgRating) >= s ? "fill-[#E8C547] text-[#E8C547]" : "text-[#eff8ee]/10")} />
                        ))}
                      </div>
                      <span className="font-serif font-semibold text-lg text-[#eff8ee]">{avgRating}</span>
                      <div className="w-[1px] h-3.5 bg-[rgba(239,248,238,0.08)]" />
                      <span className="text-[12px] text-[#eff8ee]/52">{count} {count === 1 ? 'Review' : 'Reviews'}</span>
                      <div className="w-[1px] h-3.5 bg-[rgba(239,248,238,0.08)]" />
                      <button 
                        onClick={() => {
                          const el = document.getElementById('product-tabs');
                          if (el) {
                            el.scrollIntoView({ behavior: 'smooth' });
                            setActiveTab('reviews');
                          }
                        }}
                        className="text-[12px] text-[#E8C547] hover:underline transition-all"
                      >
                        Read Reviews
                      </button>
                    </>
                  );
                })()}
              </motion.div>

              {/* 4. Price Block */}
              <motion.div variants={itemVariants} className="space-y-2">
                <div className="flex items-baseline gap-2.5">
                  <span className="font-serif font-bold text-[36px] md:text-[48px] text-[#E8C547] tracking-[-0.02em]">
                    ${displayPrice}
                  </span>
                  {displayActualPrice > 0 && displayActualPrice !== displayPrice && (
                    <span className="text-[20px] md:text-[28px] text-[#eff8ee]/30 line-through decoration-[#E8C547]/40 font-medium">
                      ${displayActualPrice}
                    </span>
                  )}
                  <span className="text-[14px] md:text-[16px] font-semibold font-body text-[#eff8ee]/52">USD</span>
                </div>
                <p className="text-[10px] md:text-[11px] text-[#eff8ee]/40">
                  Free shipping on orders over $50 · Ships within 24h
                </p>
              </motion.div>

              {/* 5. Description Card */}
              <motion.div variants={itemVariants} className="relative p-5 rounded-[14px] bg-[rgba(239,248,238,0.04)] border border-[rgba(239,248,238,0.08)] before:absolute before:top-0 before:left-5 before:right-5 before:h-[1px] before:bg-linear-to-r before:from-transparent before:via-[#E8C547]/15 before:to-transparent">
                <p className="text-[14.5px] leading-[1.78] text-[#eff8ee]/52">
                  {product.description || "Experience zesty relief with Sharcly's premium Delta-8. Our extra-large tank is lab-tested and pure. Get your long-lasting, legal chill today."}
                </p>
              </motion.div>

              {/* 6. Configuration Selector */}
              <motion.div variants={itemVariants} className="space-y-3">
                <span className="text-[10px] font-bold font-body uppercase tracking-[0.18em] text-[#eff8ee]/52">
                  CONFIGURATION
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {(() => {
                    const variants = product.variants && product.variants.length > 0
                      ? [...product.variants].sort((a: any, b: any) => {
                        const aNum = parseInt(a.title.match(/\d+/)?.[0] || "0");
                        const bNum = parseInt(b.title.match(/\d+/)?.[0] || "0");
                        return aNum - bNum;
                      })
                      : [
                        { id: '1', title: 'Pack of 1', price: product.price },
                        { id: '2', title: 'Pack of 2', price: (Number(product.price) * 2 * 0.95).toFixed(2), save: '5%' },
                        { id: '3', title: 'Pack of 3', price: (Number(product.price) * 3 * 0.9).toFixed(2), save: '10%' },
                        { id: '4', title: 'Pack of 4', price: (Number(product.price) * 4 * 0.85).toFixed(2), save: '15%' }
                      ];

                    return variants.map((variant: any) => {
                      const isSelected = selectedVariant?.id === variant.id;
                      return (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedVariant(variant)}
                          className={cn(
                            "relative p-[16px_18px] rounded-[14px] text-left transition-all duration-300 group overflow-hidden",
                            isSelected
                              ? "bg-[#E8C547]/7 border-[#E8C547] shadow-[0_0_0_1px_rgba(232,197,71,0.2),0_8px_24px_rgba(232,197,71,0.1)]"
                              : "bg-[rgba(239,248,238,0.04)] border-[rgba(239,248,238,0.08)] hover:border-[#E8C547]/25 hover:-translate-y-[1px]"
                          )}
                        >
                          {/* Hover radial glow */}
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(232,197,71,0.12),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                          <div className="relative z-10">
                            <p className="text-[13px] font-bold font-body text-[#eff8ee] mb-1">{variant.title}</p>
                            <p className="text-[14px] font-bold font-body text-[#E8C547]">${variant.price}</p>
                          </div>

                          {variant.save && (
                            <div className="absolute top-2 right-2.5 bg-[#E8C547] text-[#082f1d] text-[9px] font-bold font-body uppercase tracking-[0.1em] px-2 py-0.5 rounded-full">
                              SAVE {variant.save}
                            </div>
                          )}
                        </button>
                      );
                    });
                  })()}
                </div>
              </motion.div>

              {/* 7. Qty + Add to Cart + Wishlist */}
              <motion.div variants={itemVariants} className="flex items-center gap-3" ref={atcRef}>
                <div className="flex items-center bg-[rgba(239,248,238,0.04)] border border-[rgba(239,248,238,0.08)] rounded-[14px] overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-[44px] h-[52px] flex items-center justify-center text-[#eff8ee] hover:bg-[#E8C547]/8 hover:text-[#E8C547] transition-all"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <div className="min-w-[44px] h-[52px] flex items-center justify-center font-serif font-semibold text-[20px] text-[#eff8ee] border-x border-[rgba(239,248,238,0.08)]">
                    {quantity}
                  </div>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-[44px] h-[52px] flex items-center justify-center text-[#eff8ee] hover:bg-[#E8C547]/8 hover:text-[#E8C547] transition-all"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 h-[52px] relative overflow-hidden bg-[#E8C547] text-[#082f1d] rounded-[14px] font-bold font-body text-[13px] uppercase tracking-[0.1em] shadow-[0_8px_28px_rgba(232,197,71,0.28)] hover:bg-[#f0cf55] hover:-translate-y-[1px] active:translate-y-0 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:pointer-events-none"
                >
                  <ShoppingCart className="size-4" />
                  {addedToCart ? "Added!" : "Add to Cart"}

                  {/* Shimmer Effect */}
                  <div className="absolute top-0 -left-full w-full h-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-all duration-700 ease-in-out group-hover:left-full" />
                </button>

                <button
                  onClick={() => setLiked(!liked)}
                  className={cn(
                    "w-[52px] h-[52px] rounded-[14px] border flex items-center justify-center transition-all",
                    liked
                      ? "bg-[#E8C547]/10 border-[#E8C547] text-[#E8C547]"
                      : "bg-[rgba(239,248,238,0.04)] border-[rgba(239,248,238,0.08)] text-[#eff8ee]/50 hover:border-[#E8C547]/30 hover:text-[#E8C547]"
                  )}
                >
                  <Heart className={cn("size-[18px]", liked && "fill-current")} />
                </button>

                <button
                  onClick={handleShare}
                  className="w-[52px] h-[52px] rounded-[14px] border border-[rgba(239,248,238,0.08)] bg-[rgba(239,248,238,0.04)] text-[#eff8ee]/50 flex items-center justify-center hover:border-[#E8C547]/30 hover:text-[#E8C547] transition-all"
                >
                  <Share2 className="size-[18px]" />
                </button>
              </motion.div>

              {/* 8. Trust Chips */}
              <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {[
                  { icon: ShieldCheck, title: "Lab Verified", sub: "COA every batch" },
                  { icon: Truck, title: "Free Shipping", sub: "Orders $50+" },
                  { icon: RotateCcw, title: "30-Day Returns", sub: "No questions asked" },
                  { icon: Leaf, title: "Organic Hemp", sub: "USDA certified" }
                ].map((chip, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-[12px_14px] rounded-xl bg-[rgba(239,248,238,0.04)] border border-[rgba(239,248,238,0.08)] hover:border-[#E8C547]/18 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-[#E8C547]/10 border border-[#E8C547]/15 text-[#E8C547] flex items-center justify-center">
                      <chip.icon className="size-[15px]" />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold font-body text-[#eff8ee] leading-tight mb-0.5">{chip.title}</p>
                      <p className="text-[10.5px] font-body text-[#eff8ee]/50">{chip.sub}</p>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* ⚠️ Prop 65 Warning */}
              <motion.div
                variants={itemVariants}
                className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 flex gap-3 items-start"
              >
                <div className="shrink-0 mt-0.5">
                  <div className="w-6 h-6 rounded-md bg-red-500/10 flex items-center justify-center text-red-500">
                    <AlertTriangle className="size-3.5" />
                  </div>
                </div>
                <p className="text-[11px] leading-relaxed text-red-500/90">
                  <span className="font-bold">WARNING:</span> Consuming this product during pregnancy exposes your child to delta-9-THC, which can affect your child&apos;s behavior and learning ability. For more information go to <a href="https://www.p65warnings.ca.gov/cannabis" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-400 transition-colors">www.p65warnings.ca.gov/cannabis</a>
                </p>
              </motion.div>

              {/* 9. Share Row */}
              <motion.div variants={itemVariants} className="pt-5 border-t border-[rgba(239,248,238,0.08)] flex items-center gap-2.5">
                <span className="text-[11px] font-body font-bold text-[#eff8ee]/40 uppercase tracking-[0.06em]">SHARE</span>
                <div className="flex gap-2">
                  <button
                    onClick={handleShare}
                    className="w-[34px] h-[34px] rounded-full flex items-center justify-center bg-[rgba(239,248,238,0.04)] border border-[rgba(239,248,238,0.08)] text-[#eff8ee]/40 hover:border-[#E8C547]/30 hover:text-[#E8C547] transition-all"
                  >
                    <LinkIcon className="size-[14px]" />
                  </button>
                  {[Instagram, Twitter].map((Icon, i) => (
                    <button key={i} className="w-[34px] h-[34px] rounded-full flex items-center justify-center bg-[rgba(239,248,238,0.04)] border border-[rgba(239,248,238,0.08)] text-[#eff8ee]/40 hover:border-[#E8C547]/30 hover:text-[#E8C547] transition-all">
                      <Icon className="size-[14px]" />
                    </button>
                  ))}
                </div>
              </motion.div>

            </motion.div>
          </div>

          {/* 📑 TABS SECTION */}
          <div className="mt-20 border-t border-[rgba(239,248,238,0.08)]">
            <div className="flex overflow-x-auto no-scrollbar">
              {["description", "ingredients", "lab", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={cn(
                    "px-4 md:px-7 py-4 text-[10px] md:text-[12px] font-bold font-body uppercase tracking-[0.12em] transition-all relative",
                    activeTab === tab ? "text-[#eff8ee]" : "text-[#eff8ee]/45 hover:text-[#eff8ee]"
                  )}
                >
                  {tab === "lab" ? "Lab Results" : tab}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="tab-underline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E8C547]"
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="py-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  {activeTab === "description" && (
                    <div className="max-w-[700px] space-y-8">
                      <div className="space-y-4">
                        <h3 className="font-serif text-2xl font-bold text-[#eff8ee]">Pure Potency, Refined Pleasure</h3>
                        <p className="text-[15px] leading-[1.8] text-[#eff8ee]/60">
                          {product.description || "Our signature formula represents the culmination of years of botanical research. By leveraging state-of-the-art CO2 extraction, we ensure that every molecule of Delta-8 THC is delivered in its most bioavailable form."}
                        </p>
                      </div>

                      <div className="overflow-hidden rounded-xl border border-[rgba(239,248,238,0.08)] bg-[rgba(239,248,238,0.02)]">
                        <table className="w-full text-left text-[13px]">
                          <tbody>
                            {[
                              { label: "SKU", value: product.sku },
                              ...(product.metadata || []).map((m: any) => ({ label: m.key, value: m.value }))
                            ].filter(spec => spec.value).map((spec, i) => (
                              <tr key={i} className="border-b border-[rgba(239,248,238,0.08)] last:border-0">
                                <td className="py-3 px-5 font-bold text-[#eff8ee]/40">{spec.label}</td>
                                <td className="py-3 px-5 text-[#eff8ee]/70">{spec.value}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {activeTab === "ingredients" && (
                    <div className="max-w-[700px] space-y-4">
                      <h3 className="font-serif text-2xl font-bold text-[#eff8ee]">Transparency in every drop</h3>
                      <p className="text-[15px] leading-[1.8] text-[#eff8ee]/60">
                        {product.ingredients || "Hemp-Derived Delta-8 THC Distillate, Organic Terpene Blend, Natural Flavorings. No PG, VG, PEG, Vitamin E Acetate, or heavy metals. Just the essentials for a clean, elevated experience."}
                      </p>

                      <div className="pt-10 space-y-6">
                        <h3 className="font-serif text-2xl font-bold text-[#eff8ee]">Product Testimonials</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(product.testimonials && Array.isArray(product.testimonials) && product.testimonials.length > 0 ? product.testimonials : [
                            { name: "Julian R.", date: "2 days ago", text: "Absolute game changer. The flavor is incredibly clean and the effects are exactly as described. Best I've had.", rating: 5 }
                          ]).map((rev: any, i: number) => (
                            <div key={i} className="p-6 rounded-2xl bg-[rgba(239,248,238,0.03)] border border-[rgba(239,248,238,0.08)] space-y-3">
                              <div className="flex justify-between items-start">
                                <div className="space-y-0.5">
                                  <p className="font-bold text-[#eff8ee]">{rev.name}</p>
                                  <p className="text-[11px] text-[#eff8ee]/40">{rev.date}</p>
                                </div>
                                <div className="flex gap-0.5">
                                  {[1, 2, 3, 4, 5].map(s => (
                                    <Star key={s} className={`size-3 ${s <= rev.rating ? 'fill-[#E8C547] text-[#E8C547]' : 'text-[#eff8ee]/10'}`} />
                                  ))}
                                </div>
                              </div>
                              <p className="text-[13px] leading-relaxed text-[#eff8ee]/70 italic">"{rev.text}"</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "lab" && (
                    <div className="space-y-8">
                      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div className="space-y-2">
                          <h3 className="font-serif text-2xl font-bold text-[#eff8ee]">COA Available for Every Batch</h3>
                          <p className="text-[14px] text-[#eff8ee]/50">Third-party lab results ensure potency and purity.</p>
                        </div>
                      </div>

                      {(() => {
                        const reports = [
                          { name: "30mg CBD Full Spectrum", file: "/30mg_CBD_Sharcly-1_260509_175622.pdf", batch: "SHC0001CBD" },
                          { name: "25mg CBN + CBD Sleep", file: "/25mg_CBN___CBD_Sharcly-1_260509_175649.pdf", batch: "SHC0001SLP" },
                          { name: "30mg Delta-8 THC", file: "/30mg_delta8_Sharcly-1_260509_175752.pdf", batch: "SHC0001D8" },
                          { name: "20mg Delta-9 THC", file: "/20mg_Delta9_Sharcly.pdf", batch: "SHC0001D9" }
                        ];

                        const matchedReport = reports.find(r =>
                          product.name.toLowerCase().includes(r.name.split(' ')[1].toLowerCase()) || // e.g. "CBD"
                          product.description.toLowerCase().includes(r.name.split(' ')[1].toLowerCase())
                        );

                        if (matchedReport) {
                          return (
                            <div className="p-8 rounded-2xl border border-[#E8C547]/30 bg-[#E8C547]/5 flex flex-col md:flex-row items-center justify-between gap-6">
                              <div className="flex items-center gap-6">
                                <div className="size-16 bg-[#E8C547]/10 rounded-2xl flex items-center justify-center">
                                  <FileText className="h-8 w-8 text-[#E8C547]" />
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold text-[#E8C547] uppercase tracking-widest mb-1">Latest Lab Verification</p>
                                  <h4 className="text-xl font-bold text-[#eff8ee]">{matchedReport.name} Report</h4>
                                  <p className="text-sm text-[#eff8ee]/50">Batch ID: {matchedReport.batch} • Tested May 09, 2026</p>
                                </div>
                              </div>
                              <a
                                href={matchedReport.file}
                                target="_blank"
                                className="w-full md:w-auto h-14 px-8 bg-[#E8C547] text-[#082f1d] rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#f0cf55] transition-all"
                              >
                                <ExternalLink className="size-4" /> Download PDF
                              </a>
                            </div>
                          );
                        }

                        return (
                          <div className="p-8 rounded-2xl border border-[rgba(239,248,238,0.1)] bg-[rgba(239,248,238,0.02)] flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                              <div className="size-16 bg-[#E8C547]/10 rounded-2xl flex items-center justify-center">
                                <FileText className="h-8 w-8 text-[#E8C547]" />
                              </div>
                              <div>
                                <h4 className="text-xl font-bold text-[#eff8ee]">View All Lab Results</h4>
                                <p className="text-sm text-[#eff8ee]/50">Access our complete database of third-party COAs.</p>
                              </div>
                            </div>
                            <Link
                              href="/lab-results"
                              className="w-full md:w-auto h-14 px-8 bg-[#E8C547] text-[#082f1d] rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#f0cf55] transition-all"
                            >
                              Go to Lab Page <ExternalLink className="size-4" />
                            </Link>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {activeTab === "reviews" && (
                    <div className="space-y-10">
                      {(() => {
                        const testimonials = Array.isArray(product.testimonials) ? product.testimonials : [];
                        const reviews = (product.reviews || []).map((r: any) => ({
                          name: r.user?.name || "Verified Buyer",
                          date: new Date(r.createdAt).toLocaleDateString(),
                          text: r.comment,
                          rating: r.rating
                        }));

                        const allReviews = [...testimonials, ...reviews];
                        const displayReviews = allReviews.length > 0 ? allReviews : [
                          { name: "Julian R.", date: "2 days ago", text: "Absolute game changer. The flavor is incredibly clean and the effects are exactly as described. Best I've had.", rating: 5 }
                        ];

                        const avgRating = allReviews.length > 0 
                          ? (allReviews.reduce((a: number, b: any) => a + (b.rating || 5), 0) / allReviews.length).toFixed(1) 
                          : "5.0";

                        const ratingCounts = [5, 4, 3, 2, 1].map(r => ({
                          rating: r,
                          count: allReviews.filter(rev => rev.rating === r).length,
                          percentage: allReviews.length > 0 ? (allReviews.filter(rev => rev.rating === r).length / allReviews.length) * 100 : (r === 5 ? 100 : 0)
                        }));

                        return (
                          <>
                            <div className="flex flex-col md:flex-row gap-10">
                              <div className="space-y-4">
                                <div className="text-5xl font-serif font-bold text-[#eff8ee]">{avgRating}</div>
                                <div className="flex gap-1">
                                  {[1, 2, 3, 4, 5].map(s => (
                                    <Star key={s} className={cn("size-4", Number(avgRating) >= s ? "fill-[#E8C547] text-[#E8C547]" : "text-[#eff8ee]/10")} />
                                  ))}
                                </div>
                                <p className="text-[14px] text-[#eff8ee]/50">Based on {allReviews.length || 1} verified reviews</p>
                              </div>

                              <div className="flex-1 max-w-[400px] space-y-2.5">
                                {ratingCounts.map((item, i) => (
                                  <div key={i} className="flex items-center gap-4">
                                    <span className="text-[11px] font-bold text-[#eff8ee]/40 w-3">{item.rating}</span>
                                    <div className="flex-1 h-1.5 rounded-full bg-[rgba(239,248,238,0.04)] overflow-hidden">
                                      <div className="h-full bg-[#E8C547]" style={{ width: `${item.percentage}%` }} />
                                    </div>
                                    <span className="text-[11px] font-bold text-[#eff8ee]/20 w-8">{item.count}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {displayReviews.map((rev, i) => (
                                <div key={i} className="p-6 rounded-2xl bg-[rgba(239,248,238,0.03)] border border-[rgba(239,248,238,0.08)] space-y-3">
                                  <div className="flex justify-between items-start">
                                    <div className="space-y-0.5">
                                      <p className="font-bold text-[#eff8ee]">{rev.name}</p>
                                      <p className="text-[11px] text-[#eff8ee]/40">{rev.date}</p>
                                    </div>
                                    <div className="flex gap-0.5">
                                      {[1, 2, 3, 4, 5].map(s => (
                                        <Star key={s} className={cn("size-3", s <= rev.rating ? "fill-[#E8C547] text-[#E8C547]" : "text-[#eff8ee]/10")} />
                                      ))}
                                    </div>
                                  </div>
                                  <p className="text-[14px] leading-relaxed text-[#eff8ee]/60 italic">"{rev.text}"</p>
                                </div>
                              ))}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* 🎡 RELATED PRODUCTS */}
          <div className="mt-20">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-serif text-3xl font-bold text-[#eff8ee]">You May Also Like</h2>
              <Link href="/products" className="text-[12px] font-bold text-[#E8C547] uppercase tracking-wider hover:underline">View All</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <FeaturedProductCardSkeleton key={i} />
                ))
              ) : (
                relatedProducts
                  .filter((p: any) => p.slug !== slug)
                  .slice(0, 4)
                  .map((p: any) => (
                    <FeaturedProductCard key={p.id} product={p} />
                  ))
              )}
            </div>
          </div>

        </div>
      </main>

      {/* 📱 STICKY MOBILE ATC BAR */}
      <AnimatePresence>
        {showMobileATC && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#082f1d]/95 backdrop-blur-2xl border-t border-[#E8C547]/15 p-3.5 flex items-center justify-between gap-4"
          >
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-[#eff8ee] truncate">{product.name}</p>
              <p className="text-[12px] font-bold text-[#E8C547]">${displayPrice}</p>
            </div>
            <button
              onClick={handleAddToCart}
              className="h-[44px] px-6 bg-[#E8C547] text-[#082f1d] rounded-xl font-bold text-[11px] uppercase tracking-wider shadow-lg active:scale-95 transition-all"
            >
              Add to Cart
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent className="bg-[#040e07] border border-[#eff8ee]/10 text-[#eff8ee] max-w-[90vw] sm:max-w-md p-6 rounded-[24px] shadow-[0_32px_64px_rgba(0,0,0,0.8)] overflow-hidden">
          {/* Subtle gold glow behind */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[150px] bg-[radial-gradient(ellipse_at_top,rgba(232,197,71,0.08),transparent_70%)] pointer-events-none" />

          <DialogHeader className="relative z-10 text-left">
            <DialogTitle className="font-serif text-2xl font-bold text-[#E8C547] mb-1">Share this product</DialogTitle>
            <DialogDescription className="text-[#eff8ee]/50 text-[13px] leading-relaxed">
              Spread the word. Copy the link below to share the premium Sharcly experience with your circle.
            </DialogDescription>
          </DialogHeader>

          <div className="relative z-10 mt-6 flex items-center gap-2 p-1.5 pl-4 rounded-2xl bg-[rgba(239,248,238,0.04)] border border-[rgba(239,248,238,0.08)] transition-all focus-within:border-[#E8C547]/30">
            <input
              readOnly
              value={typeof window !== 'undefined' ? window.location.href : ''}
              className="bg-transparent border-none outline-none text-[13px] flex-1 text-[#eff8ee]/80 font-medium font-body truncate"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied to clipboard!");
                setIsShareModalOpen(false);
              }}
              className="h-11 px-5 bg-[#E8C547] text-[#082f1d] rounded-xl text-[12px] font-bold uppercase tracking-wider hover:bg-[#f0cf55] transition-all active:scale-95 flex items-center gap-2"
            >
              Copy
            </button>
          </div>

          <div className="relative z-10 mt-8 pt-6 border-t border-[rgba(239,248,238,0.08)]">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#eff8ee]/30 mb-4">Quick Share</p>
            <div className="flex gap-3">
              {[
                { name: 'Twitter', icon: Twitter, color: '#1DA1F2' },
                { name: 'Instagram', icon: Instagram, color: '#E4405F' }
              ].map((social) => (
                <button
                  key={social.name}
                  className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-[rgba(239,248,238,0.04)] border border-[rgba(239,248,238,0.08)] hover:bg-[rgba(239,248,238,0.08)] transition-all group"
                >
                  <social.icon className="size-4 text-[#eff8ee]/60 group-hover:text-[#eff8ee] transition-colors" />
                  <span className="text-[11px] font-bold text-[#eff8ee]/40 group-hover:text-[#eff8ee] transition-colors">{social.name}</span>
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}


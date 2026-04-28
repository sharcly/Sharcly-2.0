"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ShoppingBag, 
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
  Package
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useSeo } from "@/hooks/use-seo";
import Image from "next/image";
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
  
  const dispatch = useDispatch();

  useSeo(`product/${slug}`, {
    title: product ? `${product.name} | Sharcly Boutique` : "Loading Product...",
    description: product?.description,
    ogImage: product?.image_url
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await apiClient.get(`/products/${slug}`);
        const productData = response.data.product;
        setProduct(productData);
        
        // Auto-select first variant if available
        if (productData?.variants?.length > 0) {
          setSelectedVariant(productData.variants[0]);
        }
      } catch (error: any) {
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
         <div className="size-10 rounded-full border-2 border-gray-100 border-t-[#062D1B] animate-spin" />
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

  // Price logic: use selected variant price or base product price
  const displayPrice = selectedVariant ? Number(selectedVariant.price) : Number(product.price);

  return (
    <div className="min-h-screen bg-white text-[#062D1B] selection:bg-[#062D1B] selection:text-white antialiased">
      <Navbar />
      
      <main className="pt-32 pb-40">
        <div className="container mx-auto px-6 md:px-12">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-300 mb-12">
             <Link href="/" className="hover:text-[#062D1B] transition-colors">Home</Link>
             <span>/</span>
             <Link href="/products" className="hover:text-[#062D1B] transition-colors">Catalog</Link>
             <span>/</span>
             <span className="text-[#062D1B]">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
             
             {/* Left Column: Gallery */}
             <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-6">
                <div className="flex md:flex-col gap-4 overflow-x-auto no-scrollbar md:w-20 shrink-0">
                   {productImages.map((src: string, i: number) => (
                      <button 
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={cn(
                          "relative size-20 rounded-xl overflow-hidden border-2 transition-all shrink-0",
                          activeImage === i ? "border-[#062D1B]" : "border-gray-50 hover:border-gray-200"
                        )}
                      >
                         <img src={src} className="absolute inset-0 w-full h-full object-cover" alt="thumb" />
                      </button>
                   ))}
                </div>
                <div className="flex-1 aspect-[4/5] relative rounded-3xl overflow-hidden bg-neutral-50 shadow-sm border border-gray-50 group">
                   <img src={productImages[activeImage]} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="main" />
                   <button className="absolute top-6 right-6 p-3 rounded-full bg-white/80 backdrop-blur-md shadow-sm text-[#062D1B] hover:bg-white transition-all transform hover:scale-110">
                      <Heart className="size-4" />
                   </button>
                </div>
             </div>

             {/* Right Column: Info Panel */}
             <div className="lg:col-span-5 space-y-10 lg:sticky lg:top-40">
                <div className="space-y-4">
                   <div className="flex items-center gap-4">
                      <Badge variant="secondary" className="px-3 py-1 bg-gray-100 text-[#062D1B]/60 text-[9px] font-bold uppercase tracking-widest border-none">
                         {product.category?.name || "Boutique Essential"}
                      </Badge>
                      <div className="flex items-center gap-1 text-emerald-600">
                         <CheckCircle2 className="size-3" />
                         <span className="text-[9px] font-bold uppercase tracking-widest">Authenticated Batch</span>
                      </div>
                   </div>
                   
                   <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
                      {product.name}
                      {selectedVariant && <span className="block text-xl md:text-2xl font-medium text-[#062D1B]/40 mt-1">{selectedVariant.title}</span>}
                   </h1>

                   <div className="flex items-center gap-6">
                      <div className="flex items-center text-[#062D1B]">
                         {[1,2,3,4,5].map((s) => (
                            <Star key={s} className="size-3 fill-current" />
                         ))}
                         <span className="ml-2 text-xs font-bold tabular-nums">4.9</span>
                      </div>
                      <div className="h-4 w-px bg-gray-100" />
                      <span className="text-xs text-black/40 font-medium">128 Verified Experiences</span>
                   </div>

                   <div className="text-3xl font-semibold tabular-nums pt-2">
                     ${displayPrice.toFixed(2)}
                   </div>
                </div>

                <p className="text-base text-black/60 leading-relaxed font-normal">
                   {product.description || "Thoughtfully designed and clinically synthesized. Our signature tincture represents the pinnacle of hemp science, focused on restoring your natural rhythm."}
                </p>

                <Separator className="bg-gray-50" />

                {/* Variant Selection - Added Logic */}
                {product.variants && product.variants.length > 0 && (
                   <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-black/30">Select Configuration</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                         {product.variants.map((v: any) => (
                            <button
                              key={v.id}
                              onClick={() => setSelectedVariant(v)}
                              className={cn(
                                "flex flex-col items-start p-4 rounded-2xl border-2 transition-all group",
                                selectedVariant?.id === v.id 
                                  ? "border-[#062D1B] bg-[#062D1B]/[0.02]" 
                                  : "border-gray-50 hover:border-gray-200 bg-white"
                              )}
                            >
                               <div className="flex items-center justify-between w-full mb-1">
                                  <span className="text-xs font-bold">{v.title}</span>
                                  {selectedVariant?.id === v.id && <CheckCircle2 className="size-3 text-[#062D1B]" />}
                               </div>
                               <span className="text-[10px] text-black/40 font-medium">${Number(v.price).toFixed(2)} Each</span>
                            </button>
                         ))}
                      </div>
                   </div>
                )}

                <div className="space-y-8">
                   <div className="flex flex-col gap-6">
                      <div className="space-y-3">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-black/30">Quantity</label>
                         <div className="flex items-center gap-4">
                            <div className="flex items-center bg-neutral-50 rounded-full h-14 px-4 border border-gray-100 w-36">
                               <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex-1 flex justify-center hover:scale-125 transition-transform"><Minus className="size-3" /></button>
                               <span className="w-10 text-center font-bold tabular-nums">{quantity}</span>
                               <button onClick={() => setQuantity(quantity + 1)} className="flex-1 flex justify-center hover:scale-125 transition-transform"><Plus className="size-3" /></button>
                            </div>
                            <Button 
                              onClick={() => dispatch(addToCart({
                                id: selectedVariant ? selectedVariant.id : product.id,
                                name: selectedVariant ? `${product.name} - ${selectedVariant.title}` : product.name,
                                slug: product.slug,
                                price: displayPrice,
                                quantity: quantity,
                                image: productImages[0],
                                category: product.category?.name
                              }))}
                              className="flex-1 h-14 rounded-full bg-[#062D1B] text-white hover:opacity-90 font-bold text-[11px] uppercase tracking-[0.2em] shadow-xl"
                            >
                               Add to Cart
                            </Button>
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6 border-y border-gray-50">
                      {[
                        { icon: Truck, text: "Free Global Shipping" },
                        { icon: ShieldCheck, text: "Third-Party Lab Tested" },
                        { icon: RotateCcw, text: "30-Day Effortless Return" },
                        { icon: Info, text: "Subscribe & Save 15%" }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                           <item.icon className="size-4 text-[#062D1B]/30" />
                           <span className="text-xs font-semibold text-[#062D1B]/80">{item.text}</span>
                        </div>
                      ))}
                   </div>
                   
                   <Button variant="ghost" className="w-full text-[#062D1B]/40 hover:text-[#062D1B] gap-2 h-10 font-bold uppercase text-[10px] tracking-widest">
                      <Share2 className="size-3" /> Share This Expression
                   </Button>
                </div>

             </div>

          </div>

          {/* Detailed Content Fold */}
          <div className="mt-40 max-w-5xl mx-auto space-y-32">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                <div className="space-y-8">
                   <h2 className="text-3xl font-semibold tracking-tight">The Precision Synthesis</h2>
                   <p className="text-lg text-black/50 leading-relaxed font-medium">
                      Our process begins with heirloom botanical selection and ends in a climate-controlled laboratory. We remove 100% of the distortion to ensure every drop carries the pure intended frequency of the plant.
                   </p>
                   <ul className="space-y-4">
                      {["99.8% Synthesis Purity", "Ethanol-Free Extraction", "Terpene Matrix Locked", "Certified Organic Base"].map((check, i) => (
                        <li key={i} className="flex items-center gap-3">
                           <div className="size-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                              <CheckCircle2 className="size-3" />
                           </div>
                           <span className="text-sm font-bold opacity-70">{check}</span>
                        </li>
                      ))}
                   </ul>
                </div>
                <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-neutral-50 shadow-sm">
                   <img src="https://i.postimg.cc/mrCnYW4B/Calming-balance-with-Sharcly.jpg" className="absolute inset-0 w-full h-full object-cover" alt="science" />
                </div>
             </div>

             {/* Full Specs Table */}
             <div className="space-y-12">
                <h2 className="text-3xl font-semibold tracking-tight text-center">Full Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {[
                     { k: "Archive ID", v: `SC-${slug.substring(0,6).toUpperCase()}` },
                     { k: "Sourcing", v: "Oregon Heritage Organic" },
                     { k: "Potency", v: "1500mg Matrix" },
                     { k: "Carrier", v: "MCT / Coconut Pure" },
                     { k: "Verification", v: "QR-Batch v2.4" },
                     { k: "Shelf Life", v: "24 Months" }
                   ].map((spec, i) => (
                     <div key={i} className="p-8 bg-neutral-50 rounded-2xl border border-gray-50 space-y-2 group hover:bg-white hover:shadow-xl hover:border-gray-100 transition-all">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-black/20 block">{spec.k}</span>
                        <span className="text-sm font-bold text-[#062D1B]">{spec.v}</span>
                     </div>
                   ))}
                </div>
             </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { 
  removeFromCart, 
  updateQuantity, 
  toggleCart, 
  addToCart 
} from "@/store/slices/cartSlice";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetFooter
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Minus, 
  X, 
  ShoppingBag, 
  Trash2,
  ArrowRight,
  PlusCircle
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const RECOMMENDATIONS = [
  { id: "rec1", name: "Deep Sleep Tincture", price: 55.00, slug: "deep-sleep-tincture", image: "https://i.postimg.cc/vHgY9D41/Daytime-Clarity.jpg" },
  { id: "rec2", name: "Lift Series Softgels", price: 60.00, slug: "balance-series-softgels", image: "https://i.postimg.cc/K8nwpV4T/Premium-Hemp-Essentials-Sharcly.jpg" }
];

export function CartDrawer() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const isCartOpen = useSelector((state: RootState) => state.cart.isOpen);
  
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <Sheet open={isCartOpen} onOpenChange={(open) => dispatch(toggleCart(open))}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col border-l border-white/10 bg-[#040e07] text-[#eff8ee]">
        {/* Header */}
        <div className="px-8 py-8 flex items-center justify-between border-b border-white/5 bg-[#040e07]">
           <div className="space-y-1">
              <div className="flex items-center gap-3">
                 <SheetTitle className="text-xl font-bold tracking-tight text-[#eff8ee]">Cart</SheetTitle>
                 <Badge className="bg-[#E8C547] text-[#040e07] px-2.5 py-0.5 rounded-full text-[10px] font-bold tabular-nums border-none shadow-lg shadow-[#E8C547]/10">
                    {totalItems}
                 </Badge>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#eff8ee]/40">Premium botanical archive</p>
           </div>
           <button onClick={() => dispatch(toggleCart(false))} className="size-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
              <X className="size-4 text-[#eff8ee]" />
           </button>
        </div>

        {/* Product List */}
        <div className="flex-1 overflow-y-auto px-8 py-8 no-scrollbar space-y-12 bg-gradient-to-b from-[#040e07] to-[#082f1d]/20">
           {cartItems.length > 0 ? (
             <div className="space-y-10">
                {cartItems.map((item) => (
                   <div key={item.id} className="flex gap-6 group">
                      <div className="size-20 rounded-2xl bg-white/5 overflow-hidden shrink-0 relative border border-white/10">
                         <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110" />
                      </div>
                      <div className="flex-1 space-y-3">
                         <div className="flex justify-between items-start">
                            <div className="space-y-0.5">
                               <h4 className="text-[13px] font-bold text-[#eff8ee] line-clamp-1 group-hover:text-[#E8C547] transition-colors">{item.name}</h4>
                               <p className="text-[10px] font-bold uppercase tracking-widest text-[#eff8ee]/30">${item.price}</p>
                            </div>
                            <button onClick={() => dispatch(removeFromCart(item.id))} className="text-white/20 hover:text-rose-500 transition-colors">
                               <Trash2 className="size-3.5" />
                            </button>
                         </div>

                         <div className="flex items-center justify-between">
                            <div className="flex items-center bg-white/5 border border-white/10 rounded-full h-9 px-2 w-24">
                               <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))} className="flex-1 flex justify-center hover:scale-125 transition-transform text-[#eff8ee]/60 hover:text-[#eff8ee]"><Minus className="size-2" /></button>
                               <span className="w-8 text-center text-[11px] font-bold tabular-nums text-[#eff8ee]">{item.quantity}</span>
                               <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))} className="flex-1 flex justify-center hover:scale-125 transition-transform text-[#eff8ee]/60 hover:text-[#eff8ee]"><Plus className="size-2" /></button>
                            </div>
                            <span className="text-[13px] font-black tabular-nums text-[#E8C547]">${(item.price * item.quantity).toFixed(2)}</span>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
           ) : (
             <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
                <div className="size-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/10">
                   <ShoppingBag className="size-10" />
                </div>
                <div className="space-y-2">
                   <p className="text-lg font-bold text-[#eff8ee]">Your cart is empty</p>
                   <p className="text-xs text-[#eff8ee]/40 font-medium">Browse our catalog to find your rhythm.</p>
                </div>
                <Button onClick={() => dispatch(toggleCart(false))} className="h-12 rounded-full border border-[#E8C547]/30 bg-transparent px-10 text-[10px] font-bold uppercase tracking-widest text-[#E8C547] hover:bg-[#E8C547] hover:text-[#040e07] transition-all">
                   Go To Catalog
                </Button>
             </div>
           )}

           {/* Recommendations Section */}
           <div className="pt-10 border-t border-white/5 space-y-6">
              <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#eff8ee]/20">Recommended pairing</h5>
              <div className="space-y-4">
                 {RECOMMENDATIONS.map((prod) => (
                    <div key={prod.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#E8C547]/30 transition-all flex items-center gap-4 group/rec">
                       <div className="size-12 rounded-xl overflow-hidden relative shrink-0 border border-white/10">
                          <img src={prod.image} alt={prod.name} className="absolute inset-0 w-full h-full object-cover" />
                       </div>
                       <div className="flex-1 overflow-hidden">
                          <p className="text-[11px] font-bold text-[#eff8ee] group-hover/rec:text-[#E8C547] transition-colors truncate">{prod.name}</p>
                          <p className="text-[10px] font-medium text-[#eff8ee]/30">${prod.price}</p>
                       </div>
                       <button 
                         onClick={() => dispatch(addToCart({ 
                           id: prod.id, 
                           name: prod.name, 
                           price: prod.price, 
                           slug: prod.slug, 
                           image: prod.image, 
                           quantity: 1 
                         }))}
                         className="size-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-sm hover:bg-[#E8C547] hover:text-[#040e07] hover:border-[#E8C547] transition-all text-[#eff8ee]/60"
                       >
                          <PlusCircle className="size-4" />
                       </button>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Footer Checkout */}
        <div className="p-8 bg-[#040e07] border-t border-white/10 space-y-6 relative z-10">
           {/* Glow Effect */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-24 bg-[#E8C547]/5 blur-3xl pointer-events-none" />
           
           <div className="space-y-3 relative">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-[#eff8ee]/20">
                 <span>Subtotal</span>
                 <span className="tabular-nums text-[#eff8ee]">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-[#eff8ee]/30 italic">
                 <span>Shipping & Tax</span>
                 <span>Calculated at checkout</span>
              </div>
              <Separator className="bg-white/5" />
              <div className="flex justify-between items-center">
                 <span className="text-xl font-bold text-[#eff8ee]">Total</span>
                 <span className="text-2xl font-black tabular-nums text-[#E8C547]">${subtotal.toFixed(2)}</span>
              </div>
           </div>

           <Button className="w-full h-14 rounded-full bg-[#E8C547] text-[#040e07] hover:bg-[#E8C547]/90 font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-[#E8C547]/20 gap-3 transition-all" asChild>
              <Link href="/checkout" onClick={() => dispatch(toggleCart(false))}>
                 Continue to Checkout <ArrowRight className="size-4" />
              </Link>
           </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

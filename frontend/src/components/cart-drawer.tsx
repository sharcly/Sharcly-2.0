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
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col border-l border-gray-100 bg-white">
        {/* Header */}
        <div className="px-8 py-8 flex items-center justify-between border-b border-gray-50">
           <div className="space-y-1">
              <div className="flex items-center gap-3">
                 <SheetTitle className="text-xl font-bold tracking-tight text-[#062D1B]">Cart</SheetTitle>
                 <Badge className="bg-[#062D1B] text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold tabular-nums border-none shadow-sm">
                    {totalItems}
                 </Badge>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-black/30">Premium botanical archive</p>
           </div>
        </div>

        {/* Product List */}
        <div className="flex-1 overflow-y-auto px-8 py-8 no-scrollbar space-y-12">
           {cartItems.length > 0 ? (
             <div className="space-y-10">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-6 group">
                     <div className="size-20 rounded-2xl bg-neutral-50 overflow-hidden shrink-0 relative border border-gray-100">
                        <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110" />
                     </div>
                     <div className="flex-1 space-y-3">
                        <div className="flex justify-between items-start">
                           <div className="space-y-0.5">
                              <h4 className="text-xs font-bold text-[#062D1B] line-clamp-1">{item.name}</h4>
                              <p className="text-[9px] font-bold uppercase tracking-widest text-black/30">${item.price}</p>
                           </div>
                           <button onClick={() => dispatch(removeFromCart(item.id))} className="text-black/10 hover:text-red-500 transition-colors">
                              <Trash2 className="size-3.5" />
                           </button>
                        </div>

                        <div className="flex items-center justify-between">
                           <div className="flex items-center bg-neutral-50 border border-gray-100 rounded-full h-9 px-2 w-24">
                              <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))} className="flex-1 flex justify-center hover:scale-125 transition-transform"><Minus className="size-2" /></button>
                              <span className="w-8 text-center text-[11px] font-bold tabular-nums">{item.quantity}</span>
                              <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))} className="flex-1 flex justify-center hover:scale-125 transition-transform"><Plus className="size-2" /></button>
                           </div>
                           <span className="text-xs font-bold tabular-nums">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
           ) : (
             <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
                <div className="size-16 rounded-full bg-neutral-50 flex items-center justify-center text-black/10">
                   <ShoppingBag className="size-8" />
                </div>
                <div className="space-y-2">
                   <p className="text-lg font-bold">Your cart is empty</p>
                   <p className="text-xs text-black/40 font-medium">Browse our catalog to find your rhythm.</p>
                </div>
                <Button onClick={() => dispatch(toggleCart(false))} variant="outline" className="h-10 rounded-full border-gray-100 px-8 text-[9px] font-bold uppercase tracking-widest text-[#062D1B]">
                   Go To Catalog
                </Button>
             </div>
           )}

           {/* Recommendations Section */}
           <div className="pt-10 border-t border-gray-50 space-y-6">
              <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#062D1B]/40">Recommended pairing</h5>
              <div className="space-y-4">
                 {RECOMMENDATIONS.map((prod) => (
                    <div key={prod.id} className="p-4 rounded-2xl bg-neutral-50 border border-transparent hover:border-gray-100 transition-all flex items-center gap-4">
                       <div className="size-12 rounded-xl overflow-hidden relative shrink-0 border border-gray-200/50">
                          <img src={prod.image} alt={prod.name} className="absolute inset-0 w-full h-full object-cover" />
                       </div>
                       <div className="flex-1 overflow-hidden">
                          <p className="text-[11px] font-bold text-[#062D1B] truncate">{prod.name}</p>
                          <p className="text-[10px] font-medium text-black/30">${prod.price}</p>
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
                         className="size-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-[#062D1B] hover:text-white transition-all text-[#062D1B]"
                       >
                          <PlusCircle className="size-4" />
                       </button>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Footer Checkout */}
        <div className="p-8 bg-white border-t border-gray-100 space-y-6">
           <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-black/20">
                 <span>Subtotal</span>
                 <span className="tabular-nums text-[#062D1B]">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-[#062D1B]/40 italic">
                 <span>Shipping & Tax</span>
                 <span>Calculated at checkout</span>
              </div>
              <Separator className="bg-gray-50" />
              <div className="flex justify-between items-center">
                 <span className="text-xl font-bold">Total</span>
                 <span className="text-2xl font-bold tabular-nums">${subtotal.toFixed(2)}</span>
              </div>
           </div>

           <Button className="w-full h-14 rounded-full bg-[#062D1B] text-white hover:opacity-90 font-bold uppercase tracking-widest text-[10px] shadow-xl gap-3 transition-all" asChild>
              <Link href="/checkout" onClick={() => dispatch(toggleCart(false))}>
                 Continue to Checkout <ArrowRight className="size-4" />
              </Link>
           </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

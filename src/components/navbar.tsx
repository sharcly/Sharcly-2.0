"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { 
  ShoppingBag, 
  Menu, 
  Search, 
  X,
  User,
  LayoutGrid,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { toggleCart } from "@/store/slices/cartSlice";
import { MiniSearch } from "@/components/mini-search";

const NAV_LINKS = [
  { name: "New Arrivals", href: "/products?status=new" },
  { name: "The Series", href: "/products" },
  { name: "Our Process", href: "/about" },
  { name: "Journal", href: "/blogs" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { user, logout } = useAuth();
  
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-10 left-0 right-0 z-50 transition-all duration-500",
        scrolled ? "translate-y-[-40px]" : "translate-y-0"
      )}
    >
      <div className="container mx-auto px-6 md:px-12">
        <nav 
          className={cn(
            "h-16 px-6 rounded-2xl flex items-center justify-between transition-all duration-500",
            scrolled 
              ? "bg-white/80 backdrop-blur-xl border border-gray-100 shadow-sm" 
              : "bg-transparent border-transparent"
          )}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="size-8 rounded-lg bg-[#062D1B] flex items-center justify-center text-white font-black text-xs group-hover:scale-110 transition-transform">S</div>
            <span className={cn(
              "text-xs font-bold uppercase tracking-[0.3em] transition-colors",
              !scrolled && isHome ? "text-[#062D1B]" : "text-[#062D1B]"
            )}>
              Sharcly
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <Link 
                key={link.name}
                href={link.href}
                className="nav-link text-[#062D1B]/60 hover:text-[#062D1B]"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-3">
             <div className="relative">
                <button 
                  onClick={() => setSearchOpen(!searchOpen)}
                  className={cn(
                    "p-2 rounded-full transition-all duration-300",
                    searchOpen ? "bg-black text-white" : "hover:bg-neutral-50 text-[#062D1B]/40 hover:text-[#062D1B]"
                  )}
                >
                   {searchOpen ? <X className="size-4" /> : <Search className="size-4" />}
                </button>
                <MiniSearch open={searchOpen} setOpen={setSearchOpen} />
             </div>
             
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <button className="px-2 py-1.5 rounded-full hover:bg-neutral-50 transition-colors text-[#062D1B]/40 hover:text-[#062D1B] flex items-center gap-1">
                      <User className="size-4" />
                      <ChevronDown className="size-3 opacity-50" />
                   </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-black/5 shadow-xl bg-white/95 backdrop-blur-xl">
                   {user ? (
                     <>
                        <DropdownMenuGroup>
                           <DropdownMenuLabel className="px-3 py-2 text-xs font-black uppercase tracking-widest text-[#062D1B]">
                             {user.name}
                             <span className="block text-[9px] text-black/40 lowercase tracking-normal pt-0.5">{user.email}</span>
                           </DropdownMenuLabel>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className="bg-black/5" />
                        <DropdownMenuGroup className="space-y-1">
                           <DropdownMenuItem asChild className="rounded-xl cursor-pointer text-xs font-bold text-[#062D1B]/60 focus:text-[#062D1B] focus:bg-black/5 py-2.5">
                              <Link href="/account">My Account</Link>
                           </DropdownMenuItem>
                           <DropdownMenuItem asChild className="rounded-xl cursor-pointer text-xs font-bold text-[#062D1B]/60 focus:text-[#062D1B] focus:bg-black/5 py-2.5">
                              <Link href="/account/orders">Order History</Link>
                           </DropdownMenuItem>
                           {["admin", "manager", "content_manager"].includes(user.role) && (
                              <DropdownMenuItem asChild className="rounded-xl cursor-pointer text-xs font-bold text-amber-600 focus:text-amber-700 focus:bg-amber-500/10 py-2.5">
                                 <Link href="/dashboard">Admin Dashboard</Link>
                              </DropdownMenuItem>
                           )}
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className="bg-black/5" />
                        <DropdownMenuItem onSelect={() => logout()} className="rounded-xl cursor-pointer text-xs font-bold text-rose-500 focus:text-rose-600 focus:bg-rose-500/10 py-2.5">
                           Sign Out
                        </DropdownMenuItem>
                     </>
                   ) : (
                     <>
                        <DropdownMenuGroup>
                           <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-black/30">
                             Account Access
                           </DropdownMenuLabel>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className="bg-black/5" />
                        <DropdownMenuGroup className="space-y-1">
                           <DropdownMenuItem asChild className="rounded-xl cursor-pointer text-xs font-bold text-[#062D1B] focus:text-[#062D1B] focus:bg-black/5 py-2.5">
                              <Link href="/login">Sign In</Link>
                           </DropdownMenuItem>
                           <DropdownMenuItem asChild className="rounded-xl cursor-pointer text-xs font-bold text-[#062D1B]/60 focus:text-[#062D1B] focus:bg-black/5 py-2.5">
                              <Link href="/register">Create Account</Link>
                           </DropdownMenuItem>
                        </DropdownMenuGroup>
                     </>
                   )}
                </DropdownMenuContent>
             </DropdownMenu>
             
             <button 
               onClick={() => dispatch(toggleCart(true))}
               className="p-2 rounded-full hover:bg-neutral-50 transition-all text-[#062D1B] flex items-center gap-2 group relative"
             >
                <div className="relative">
                   <ShoppingBag className="size-4 transition-transform group-hover:scale-110" />
                   {totalItems > 0 && (
                     <div className="absolute -top-1.5 -right-1.5 size-3.5 bg-[#062D1B] text-white text-[8px] font-bold rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                        {totalItems}
                     </div>
                   )}
                </div>
                <span className="text-[10px] font-bold tracking-widest hidden sm:block">Cart</span>
             </button>
             
             {/* Mobile Menu Trigger */}
             <div className="lg:hidden">
                <Sheet>
                   <SheetTrigger asChild>
                      <button className="p-2 rounded-full hover:bg-neutral-50 transition-colors text-[#062D1B]">
                         <Menu className="size-4" />
                      </button>
                   </SheetTrigger>
                   <SheetContent side="right" className="w-[300px] p-8 border-l border-gray-100">
                      <SheetHeader className="mb-10">
                         <SheetTitle className="text-left text-xs uppercase tracking-widest font-bold">Navigation</SheetTitle>
                      </SheetHeader>
                      <div className="flex flex-col gap-6">
                         {NAV_LINKS.map((link) => (
                           <Link key={link.name} href={link.href} className="text-sm font-bold uppercase tracking-widest">
                             {link.name}
                           </Link>
                         ))}
                         
                         {user ? (
                           <>
                             <div className="h-px bg-black/5 my-2" />
                             <Link href="/account" className="text-sm font-bold uppercase tracking-widest">My Account</Link>
                             <button 
                               onClick={() => logout()}
                               className="text-sm font-bold uppercase tracking-widest text-rose-500 text-left"
                             >
                               Sign Out
                             </button>
                           </>
                         ) : (
                           <>
                             <div className="h-px bg-black/5 my-2" />
                             <Link href="/login" className="text-sm font-bold uppercase tracking-widest">Sign In</Link>
                           </>
                         )}
                      </div>
                   </SheetContent>
                </Sheet>
             </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

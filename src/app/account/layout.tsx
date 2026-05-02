"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShoppingBag, 
  MapPin, 
  User, 
  CreditCard,
  LogOut,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";

const navItems = [
  { label: "Dashboard", href: "/account", icon: ShoppingBag },
  { label: "Orders", href: "/account/orders", icon: ShoppingBag },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Payments", href: "/account/payments", icon: CreditCard },
  { label: "Profile", href: "/account/profile", icon: User },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFB] text-[#062D1B] font-sans antialiased selection:bg-[#062D1B] selection:text-white">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-20 container mx-auto px-6 md:px-12 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="lg:w-64 space-y-8 shrink-0">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight">Account</h1>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-widest">Personal Workspace</p>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-2xl text-sm font-bold transition-all group",
                      isActive 
                        ? "bg-[#062D1B] text-white shadow-xl shadow-[#062D1B]/10" 
                        : "hover:bg-black/5 text-[#062D1B]/60 hover:text-[#062D1B]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={cn("size-4", isActive ? "text-[#EBB56B]" : "opacity-40")} />
                      {item.label}
                    </div>
                    {isActive && <ChevronRight className="size-4 text-[#EBB56B]" />}
                  </Link>
                );
              })}
              
              <button 
                onClick={() => logout()}
                className="w-full flex items-center gap-3 p-4 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all mt-4"
              >
                <LogOut className="size-4" />
                Sign Out
              </button>
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

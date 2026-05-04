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
  { label: "Overview", href: "/account", icon: User },
  { label: "Orders", href: "/account/orders", icon: ShoppingBag },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Payment Methods", href: "/account/payments", icon: CreditCard },
  { label: "Account Settings", href: "/account/profile", icon: User },
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
          <aside className="lg:w-64 shrink-0">
            <div className="mb-10">
              <h1 className="text-3xl font-bold tracking-tight text-[#062D1B]">My Account</h1>
              <p className="text-gray-400 text-sm mt-1">Manage your details and orders.</p>
            </div>

            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                      isActive 
                        ? "bg-[#062D1B] text-white shadow-md" 
                        : "text-gray-500 hover:bg-gray-100 hover:text-[#062D1B]"
                    )}
                  >
                    <item.icon className={cn("size-4", isActive ? "text-[#EBB56B]" : "opacity-40")} />
                    {item.label}
                  </Link>
                );
              })}
              
              <div className="h-px bg-gray-100 my-6" />

              <button 
                onClick={() => logout()}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
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

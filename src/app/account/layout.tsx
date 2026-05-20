"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShoppingBag, 
  MapPin, 
  User, 
  LogOut,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";

const navItems = [
  { label: "Overview", href: "/account", icon: User },
  { label: "Orders", href: "/account/orders", icon: ShoppingBag },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Account Settings", href: "/account/profile", icon: User },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[#040e07] text-[#eff8ee] font-sans antialiased selection:bg-[#EBB56B] selection:text-[#040e07] overflow-x-hidden w-full max-w-full">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Outfit:wght@100..900&display=swap');
        .font-serif { font-family: 'Cormorant Garamond', serif; }
        .font-sans { font-family: 'Outfit', sans-serif; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
      
      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div 
          className="absolute inset-0"
          style={{ 
            background: "linear-gradient(135deg, #040e07 0%, #082f1d 45%, #051a10 100%)" 
          }} 
        />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#082f1d] rounded-full blur-[120px] opacity-30" />
      </div>

      <Navbar />
      
      <main className="relative z-10 flex-1 pt-32 pb-20 container mx-auto px-6 md:px-12 max-w-7xl overflow-x-hidden w-full">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 w-full max-w-full overflow-hidden">
          {/* Sidebar */}
          <aside className="w-full lg:w-72 shrink-0 overflow-hidden">
            <div className="mb-6 lg:mb-12 flex flex-row lg:flex-col justify-between items-center lg:items-start gap-4">
              <div className="space-y-1.5 lg:space-y-2">
                <h1 className="text-3xl lg:text-4xl font-serif italic tracking-tight text-[#eff8ee]">My <span className="text-[#EBB56B]">Account</span></h1>
                <div className="h-0.5 w-12 bg-[#EBB56B]" />
                <p className="hidden lg:block text-[#eff8ee]/30 text-[10px] font-bold uppercase tracking-widest pt-2">Management Portal</p>
              </div>

              {/* Sign Out Button on Mobile */}
              <button 
                onClick={() => logout()}
                className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest text-red-400 hover:bg-red-400/10 transition-all border border-red-400/20"
              >
                <LogOut className="size-3.5" />
                Sign Out
              </button>
            </div>

            <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-none -mx-6 px-6 lg:mx-0 lg:px-0">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 lg:gap-4 px-5 py-3.5 lg:px-6 lg:py-4 rounded-xl lg:rounded-2xl text-[10px] lg:text-[11px] font-bold uppercase tracking-widest transition-all group shrink-0 whitespace-nowrap",
                      isActive 
                        ? "bg-[#EBB56B] text-[#040e07] shadow-xl shadow-[#EBB56B]/10" 
                        : "text-[#eff8ee]/40 hover:bg-white/5 hover:text-[#eff8ee] border border-white/5"
                    )}
                  >
                    <item.icon className={cn("size-3.5 lg:size-4 transition-transform group-hover:scale-110", isActive ? "text-[#040e07]" : "text-[#EBB56B]")} />
                    {item.label}
                    {isActive && <ChevronRight className="ml-auto size-3 text-[#040e07] hidden lg:block" />}
                  </Link>
                );
              })}
              
              {/* Sign Out Button on Desktop */}
              <div className="hidden lg:block h-px bg-white/5 my-8" />

              <button 
                onClick={() => logout()}
                className="hidden lg:flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-red-400 hover:bg-red-400/10 transition-all border border-transparent hover:border-red-400/20"
              >
                <LogOut className="size-4" />
                Sign Out
              </button>
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0 w-full max-w-full overflow-hidden">
            {children}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

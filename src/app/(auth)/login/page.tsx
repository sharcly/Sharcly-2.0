"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ArrowLeft, ShieldCheck, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  
  useEffect(() => {
    apiClient.get("/health").catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await apiClient.post("/auth/login", { email, password });
      login(response.data.accessToken, response.data.refreshToken, response.data.user);
      toast.success("Welcome back to Sharcly.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#FDFDFB]">
      {/* Narrative Side: Brand Heritage */}
      <div className="hidden lg:flex w-[55%] relative overflow-hidden bg-[#062D1B] items-center justify-center p-24">
        {/* Abstract Brand Background */}
        <div 
          className="absolute inset-0 opacity-40 mix-blend-overlay"
          style={{ 
            backgroundImage: 'url("https://i.postimg.cc/0y2xqZs9/Sunlit-forest-path-with-wooden-platform.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#062D1B] via-[#062D1B]/90 to-transparent" />
        
        <div className="relative z-20 max-w-xl space-y-12">
          <div className="space-y-6">
            <h1 className="text-7xl xl:text-8xl font-black text-white tracking-tighter leading-[0.9] uppercase italic">
              Better <br/> <span className="text-[#EBB56B]">Nature</span> <br/> Better You.
            </h1>
            <p className="text-xl text-white/60 font-medium leading-relaxed">
              Experience the pinnacle of wellness with our premium, lab-verified hemp essentials. Designed for those who seek the extraordinary.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 pt-8 border-t border-white/10">
            <div className="space-y-1">
              <p className="text-3xl font-black text-[#EBB56B] italic uppercase tracking-tighter">Gold Standard</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 text-nowrap">Industry Certified Purity</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-black text-[#EBB56B] italic uppercase tracking-tighter">Direct Farm</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 text-nowrap">Ethically Sourced Worldwide</p>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Side: Professional Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-24 relative bg-white">
        <div className="w-full max-w-md space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex flex-col items-center lg:items-start space-y-8">
            <Link href="/" className="transition-transform hover:scale-105 duration-300">
              <img 
                src="https://cdn.mignite.app/ws/works_01KM0WR2ZSKYNHV0ZE2MPNM9EF/final-Logo-1--01KM5Y2NCW8720B30G9G0XW18Y.png" 
                alt="Sharcly" 
                className="h-10 w-auto" 
              />
            </Link>
            <div className="space-y-2 text-center lg:text-left">
              <h2 className="text-4xl font-black text-[#062D1B] tracking-tighter uppercase italic leading-none">
                Sign In To <br/> <span className="text-[#EBB56B]">Dashboard</span>
              </h2>
              <p className="text-[#062D1B]/40 font-bold uppercase tracking-widest text-[10px]">Administrative Access Only</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-3 group">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#062D1B]/40 group-focus-within:text-[#062D1B] transition-colors">Registered Email</Label>
                <Input
                  type="email"
                  placeholder="admin@sharcly.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-16 px-8 rounded-2xl border-2 border-[#062D1B]/5 bg-[#062D1B]/[0.02] focus:border-[#062D1B] focus:bg-white transition-all font-bold text-lg placeholder:text-[#062D1B]/10"
                />
              </div>

              <div className="space-y-3 group">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#062D1B]/40 group-focus-within:text-[#062D1B] transition-colors">Access Password</Label>
                  <Link href="/forgot-password" title="Recover Password" className="text-[10px] font-black uppercase tracking-widest text-[#EBB56B] hover:text-[#062D1B] transition-colors">
                    Lost Access?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-16 px-8 rounded-2xl border-2 border-[#062D1B]/5 bg-[#062D1B]/[0.02] focus:border-[#062D1B] focus:bg-white transition-all font-bold text-lg pr-16 placeholder:text-[#062D1B]/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-[#062D1B]/20 hover:text-[#062D1B] transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-20 rounded-2xl bg-[#062D1B] text-white hover:bg-[#083a23] hover:shadow-2xl hover:shadow-[#062D1B]/20 active:scale-95 transition-all duration-300 text-[12px] font-black uppercase tracking-[0.4em] shadow-xl shadow-[#062D1B]/10"
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-white/50" />
              ) : (
                <span className="flex items-center gap-3">
                  Secure Sign In <ShieldCheck className="h-4 w-4 text-[#EBB56B]" />
                </span>
              )}
            </Button>
          </form>

          <div className="pt-12 border-t border-[#062D1B]/5 flex flex-col items-center lg:items-start gap-4">
            <p className="text-[11px] font-black uppercase tracking-widest text-[#062D1B]/20">Don't have an account yet?</p>
            <Link href="/register">
              <Button variant="outline" className="h-14 px-10 rounded-2xl border-2 border-[#062D1B]/5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#062D1B] hover:text-white transition-all">
                Join Community
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

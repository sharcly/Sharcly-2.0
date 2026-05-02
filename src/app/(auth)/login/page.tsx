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
      toast.success("Welcome back to Sharcly!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#020d08] text-white selection:bg-accent selection:text-primary">
      {/* Visual Narrative Side */}
      <div className="hidden lg:flex w-[55%] relative overflow-hidden bg-primary items-end p-20">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center animate-ken-burns"
          style={{ 
            backgroundImage: 'url("https://i.postimg.cc/0y2xqZs9/Sunlit-forest-path-with-wooden-platform.jpg")',
            filter: 'brightness(0.6) contrast(1.2)'
          }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#020d08] via-transparent to-transparent opacity-80" />
        
        <div className="relative z-20 max-w-2xl space-y-10">
          <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80">Est. 2024 • Premium Quality</span>
          </div>
          
          <h1 className="text-8xl xl:text-9xl font-black tracking-tighter leading-[0.85] italic font-serif">
            NATURE <br/> <span className="text-accent underline decoration-white/10 decoration-[8px] underline-offset-[12px]">BOTTLED.</span>
          </h1>
          
          <p className="text-xl text-white/60 font-medium leading-relaxed max-w-lg">
            Access your exclusive dashboard to manage your wellness journey and explore our latest lab-verified essentials.
          </p>

          <div className="flex gap-12 pt-10">
            <div className="space-y-1">
              <p className="text-4xl font-black italic tracking-tighter">10K+</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Active Users</p>
            </div>
            <div className="space-y-1 border-l border-white/10 pl-12">
              <p className="text-4xl font-black italic tracking-tighter">100%</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Purity Guaranteed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Side */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-20 bg-[#020d08] relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md space-y-16 relative z-10">
          <div className="space-y-6">
            <Link href="/" className="inline-block group">
              <img 
                src="https://cdn.mignite.app/ws/works_01KM0WR2ZSKYNHV0ZE2MPNM9EF/final-Logo-1--01KM5Y2NCW8720B30G9G0XW18Y.png" 
                alt="Sharcly" 
                className="h-12 w-auto brightness-0 invert opacity-100 group-hover:scale-110 transition-transform duration-500" 
              />
            </Link>
            <div className="space-y-2">
              <h2 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
                Welcome <span className="text-accent">Back</span>
              </h2>
              <p className="text-white/40 font-medium">Please enter your credentials to continue.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-3 group">
                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 group-focus-within:text-accent transition-colors">
                  Account Identifier
                </Label>
                <Input
                  type="email"
                  placeholder="name@sharcly.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-16 px-8 rounded-2xl bg-white/[0.03] border-2 border-white/5 focus:border-accent/40 focus:bg-white/[0.05] transition-all duration-300 font-bold text-lg placeholder:text-white/10"
                />
              </div>

              <div className="space-y-3 group">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 group-focus-within:text-accent transition-colors">
                    Access Code
                  </Label>
                  <Link href="/forgot-password" title="Recover Password" className="text-[10px] font-black uppercase tracking-widest text-accent/60 hover:text-accent transition-colors">
                    Recovery
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-16 px-8 rounded-2xl bg-white/[0.03] border-2 border-white/5 focus:border-accent/40 focus:bg-white/[0.05] transition-all duration-300 font-bold text-lg pr-16 placeholder:text-white/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-18 py-8 rounded-2xl text-[14px] font-black uppercase tracking-[0.4em] bg-accent text-primary hover:bg-white hover:scale-[1.02] active:scale-95 transition-all duration-500 shadow-[0_20px_50px_rgba(235,181,107,0.15)] group"
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <span className="flex items-center gap-3">
                  Initiate Session <ShieldCheck className="h-4 w-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                </span>
              )}
            </Button>
          </form>

          <div className="pt-10 border-t border-white/5 flex flex-col items-center gap-4">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/20">
              New to the ecosystem?
            </p>
            <Link href="/register">
              <Button variant="outline" className="h-14 px-10 rounded-2xl border-2 border-white/5 bg-transparent hover:bg-white/5 hover:border-white/10 text-[10px] font-black uppercase tracking-[0.3em] transition-all">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes ken-burns {
          0% { transform: scale(1); }
          100% { transform: scale(1.2); }
        }
        .animate-ken-burns {
          animation: ken-burns 30s infinite alternate linear;
        }
      `}</style>
    </div>
  );
}

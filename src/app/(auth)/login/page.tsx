"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ShieldCheck, Eye, EyeOff } from "lucide-react";

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
      toast.success("Login successful.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#FDFDFB]">
      {/* Narrative Side */}
      <div className="hidden lg:flex w-[55%] relative overflow-hidden bg-[#062D1B] items-center justify-center p-16">
        <div 
          className="absolute inset-0 opacity-20 mix-blend-overlay"
          style={{ 
            backgroundImage: 'url("https://i.postimg.cc/0y2xqZs9/Sunlit-forest-path-with-wooden-platform.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#062D1B] to-[#062D1B]/80" />
        
        <div className="relative z-20 max-w-lg space-y-8">
          <h1 className="text-6xl font-bold text-white tracking-tight leading-[1.1]">
            Experience <br/> <span className="text-[#EBB56B]">Natural</span> Wellness.
          </h1>
          <p className="text-lg text-white/70 font-medium leading-relaxed">
            Join Sharcly to explore our collection of premium, lab-verified hemp essentials delivered directly to your door.
          </p>
          <div className="flex gap-8 pt-6 border-t border-white/10">
            <div>
              <p className="text-2xl font-bold text-[#EBB56B]">100%</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Lab Verified</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#EBB56B]">Pure</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Farm Sourced</p>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Side */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-10">
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <img 
                src="https://cdn.mignite.app/ws/works_01KM0WR2ZSKYNHV0ZE2MPNM9EF/final-Logo-1--01KM5Y2NCW8720B30G9G0XW18Y.png" 
                alt="Sharcly" 
                className="h-8 w-auto" 
              />
            </Link>
            <div className="space-y-1">
              <h2 className="text-3xl font-bold text-[#062D1B] tracking-tight">Login</h2>
              <p className="text-gray-500 text-sm font-medium">Welcome back! Please enter your details.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-[#062D1B]">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 px-4 rounded-xl border-gray-200 focus:border-[#062D1B] focus:ring-[#062D1B] transition-all"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-semibold text-[#062D1B]">Password</Label>
                  <Link href="/forgot-password" size="sm" className="text-xs font-bold text-[#EBB56B] hover:text-[#062D1B]">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 px-4 rounded-xl border-gray-200 focus:border-[#062D1B] focus:ring-[#062D1B] transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-[#062D1B] text-white hover:bg-[#083a23] font-bold text-sm transition-all"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Login"
              )}
            </Button>
          </form>

          <div className="pt-8 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link href="/register" className="text-[#062D1B] font-bold hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

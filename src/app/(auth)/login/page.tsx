"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, ArrowLeft, ShieldCheck, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  
  // Initialize CSRF token on mount
  useState(() => {
    apiClient.get("/health").catch(() => {});
  });

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
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-background overflow-hidden">
      {/* Left Side: Cinematic Narrative */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-primary items-center justify-center p-20">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-110"
          style={{ 
            backgroundImage: 'url("https://i.postimg.cc/0y2xqZs9/Sunlit-forest-path-with-wooden-platform.jpg")',
            filter: 'brightness(0.7) contrast(1.1)'
          }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-tr from-primary/40 via-transparent to-transparent" />
        
        <div className="relative z-20 max-w-lg space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
          <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-20 group">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Back to Store</span>
          </Link>
          
          <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter italic font-serif leading-none">
            BETTER <br/> <span className="text-accent underline decoration-white/20">LIVING</span> <br/> BEGINS HERE.
          </h2>
          
          <p className="text-lg text-white/70 font-medium leading-relaxed">
            Join thousands of individuals rediscovering their natural balance with our lab-verified hemp essentials.
          </p>
          
          <div className="flex items-center gap-6 pt-10">
            <div className="flex flex-col">
              <span className="text-3xl font-black text-white">4.9/5</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">User Rating</span>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div className="flex flex-col">
              <span className="text-3xl font-black text-white">100%</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Lab Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative">
        {/* Mobile Background */}
        <div 
          className="absolute inset-0 lg:hidden -z-10 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url("https://i.postimg.cc/0y2xqZs9/Sunlit-forest-path-with-wooden-platform.jpg")',
            filter: 'brightness(0.3)'
          }}
        />

        <div className="w-full max-w-md space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="lg:hidden text-center space-y-4">
             <Link href="/" className="flex items-center gap-4">
                <img 
                  src="https://cdn.mignite.app/ws/works_01KM0WR2ZSKYNHV0ZE2MPNM9EF/final-Logo-1--01KM5Y2NCW8720B30G9G0XW18Y.png" 
                  alt="Sharcly" 
                  className="h-10 w-auto brightness-0 invert" 
                />
             </Link>
          </div>

          <div className="space-y-4">
             <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-[0.9]">WELCOME BACK.</h1>
             <p className="text-foreground/50 font-medium">Please sign in to your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 rounded-2xl border-primary/5 bg-primary/5 px-6 font-medium focus:ring-accent/20 focus:border-accent/40 transition-all placeholder:text-foreground/20"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Password</Label>
                  <Link href="/forgot-password" className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 rounded-2xl border-primary/5 bg-primary/5 px-6 pr-12 font-medium focus:ring-accent/20 focus:border-accent/40 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/30 hover:text-primary transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <Button className="w-full h-16 rounded-2xl premium-gradient font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-primary/20 group border-none hover:opacity-90" type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-primary/5" />
              </div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest leading-none">
                <span className="bg-background px-4 text-foreground/30">New to Sharcly?</span>
              </div>
            </div>

            <Button variant="outline" className="w-full h-16 rounded-2xl border-primary/5 bg-transparent font-black uppercase tracking-[0.2em] text-xs hover:bg-primary/5" asChild>
               <Link href="/register">Create an Account</Link>
            </Button>
          </form>
          
          <div className="pt-10 flex items-center justify-center gap-6 opacity-30 grayscale transition-all hover:opacity-100 hover:grayscale-0">
             <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-[9px] font-black uppercase tracking-widest">SSL Encrypted</span>
             </div>
             <div className="flex items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-widest">Proudly USA Made</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

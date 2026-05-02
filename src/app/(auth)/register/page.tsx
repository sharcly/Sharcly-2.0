"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ArrowLeft, CheckCircle2, Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [step, setStep] = useState(1); // 1: Details, 2: OTP
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  
  useEffect(() => {
    apiClient.get("/health").catch(() => {});
  }, []);

  const handleSendOtp = async () => {
    if (!formData.email || !formData.name || !formData.password) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsSendingOtp(true);
    try {
      await apiClient.post("/auth/send-otp", { email: formData.email });
      setStep(2);
      toast.success("Verification code sent to your email!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send verification code");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      await handleSendOtp();
      return;
    }
    
    setIsLoading(true);
    try {
      const { name, email, password } = formData;
      const response = await apiClient.post("/auth/register", { name, email, password, otp });
      const { accessToken, refreshToken, user } = response.data;
      login(accessToken, refreshToken, user);
      toast.success("Welcome to Sharcly! Your account has been created.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed. Please check your OTP.");
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
            backgroundImage: 'url("https://i.postimg.cc/mD8Z8L4j/Close-up-of-hemp-plant-leaves.jpg")',
            filter: 'brightness(0.5) contrast(1.2)'
          }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#020d08] via-transparent to-transparent opacity-80" />
        
        <div className="relative z-20 max-w-2xl space-y-10">
          <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80">Premium Access • Limited Slots</span>
          </div>
          
          <h1 className="text-8xl xl:text-9xl font-black tracking-tighter leading-[0.85] italic font-serif">
            JOIN THE <br/> <span className="text-accent underline decoration-white/10 decoration-[8px] underline-offset-[12px]">ELITE.</span>
          </h1>
          
          <p className="text-xl text-white/60 font-medium leading-relaxed max-w-lg">
            Create your account to unlock exclusive member benefits, early access to new harvests, and personalized wellness plans.
          </p>

          <div className="flex gap-12 pt-10">
            <div className="space-y-1">
              <p className="text-4xl font-black italic tracking-tighter">SECURE</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">End-to-End Encryption</p>
            </div>
            <div className="space-y-1 border-l border-white/10 pl-12">
              <p className="text-4xl font-black italic tracking-tighter">FAST</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Instant Verification</p>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Side */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-20 bg-[#020d08] relative overflow-hidden">
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
                {step === 1 ? <>Join <span className="text-accent">Us</span></> : <>Verify <span className="text-accent">Identity</span></>}
              </h2>
              <p className="text-white/40 font-medium">
                {step === 1 ? "Fill in your details to start your journey." : `We've sent a code to ${formData.email}`}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {step === 1 ? (
              <div className="space-y-6">
                <div className="space-y-3 group">
                  <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 group-focus-within:text-accent transition-colors">Legal Full Name</Label>
                  <Input
                    placeholder="ALEXANDER SHARCLY"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="h-16 px-8 rounded-2xl bg-white/[0.03] border-2 border-white/5 focus:border-accent/40 focus:bg-white/[0.05] transition-all duration-300 font-bold text-lg placeholder:text-white/10"
                  />
                </div>

                <div className="space-y-3 group">
                  <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 group-focus-within:text-accent transition-colors">Primary Email</Label>
                  <Input
                    type="email"
                    placeholder="name@sharcly.io"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className="h-16 px-8 rounded-2xl bg-white/[0.03] border-2 border-white/5 focus:border-accent/40 focus:bg-white/[0.05] transition-all duration-300 font-bold text-lg placeholder:text-white/10"
                  />
                </div>

                <div className="space-y-3 group">
                  <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 group-focus-within:text-accent transition-colors">Create Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                      className="h-16 px-8 rounded-2xl bg-white/[0.03] border-2 border-white/5 focus:border-accent/40 focus:bg-white/[0.05] transition-all duration-300 font-bold text-lg pr-16 placeholder:text-white/10"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20">
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-3 group">
                  <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 group-focus-within:text-accent transition-colors">Confirm Password</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    required
                    className="h-16 px-8 rounded-2xl bg-white/[0.03] border-2 border-white/5 focus:border-accent/40 focus:bg-white/[0.05] transition-all duration-300 font-bold text-lg placeholder:text-white/10"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-3 group">
                  <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 group-focus-within:text-accent transition-colors">6-Digit Access Code</Label>
                  <Input
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength={6}
                    className="h-24 px-8 rounded-2xl bg-white/[0.03] border-2 border-white/5 focus:border-accent/40 focus:bg-white/[0.05] transition-all duration-300 font-black text-5xl tracking-[0.5em] text-center placeholder:text-white/10"
                  />
                </div>
                <button 
                  type="button" 
                  onClick={handleSendOtp}
                  className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline w-full text-center"
                >
                  Didn't receive it? Resend Code
                </button>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={isLoading || isSendingOtp}
              className="w-full h-18 py-8 rounded-2xl text-[14px] font-black uppercase tracking-[0.4em] bg-accent text-primary hover:bg-white hover:scale-[1.02] active:scale-95 transition-all duration-500 shadow-[0_20px_50px_rgba(235,181,107,0.15)] group"
            >
              {isLoading || isSendingOtp ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <span className="flex items-center gap-3">
                  {step === 1 ? "Request Access" : "Validate & Enter"} <ShieldCheck className="h-4 w-4 opacity-40 group-hover:opacity-100" />
                </span>
              )}
            </Button>
          </form>

          <div className="pt-10 border-t border-white/5 flex flex-col items-center gap-4">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/20">
              Already have credentials?
            </p>
            <Link href="/login">
              <Button variant="outline" className="h-14 px-10 rounded-2xl border-2 border-white/5 bg-transparent hover:bg-white/5 hover:border-white/10 text-[10px] font-black uppercase tracking-[0.3em] transition-all">
                Sign In
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

"use client";

import { useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ArrowLeft, MailCheck, ShieldCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await apiClient.post("/auth/forgot-password", { email });
      setIsSent(true);
      toast.success("Security link dispatched.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to initiate recovery.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-8 bg-[#FDFDFB]">
        <div className="w-full max-w-md space-y-12 text-center animate-in fade-in zoom-in duration-700">
          <div className="mx-auto w-24 h-24 bg-[#062D1B] rounded-3xl flex items-center justify-center text-[#EBB56B] shadow-2xl shadow-[#062D1B]/20">
            <MailCheck className="h-10 w-10" />
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl font-black italic tracking-tighter text-[#062D1B] uppercase leading-none">
              Recovery <br/> <span className="text-[#EBB56B]">Dispatched</span>
            </h1>
            <p className="text-[#062D1B]/40 font-bold uppercase tracking-widest text-[10px] leading-relaxed">
              Check your inbox for a secure link. <br/> Active for the next 7 hours.
            </p>
          </div>
          <div className="pt-10 border-t border-[#062D1B]/5">
            <Link href="/login">
              <Button className="h-16 px-12 rounded-2xl bg-[#062D1B] text-white hover:bg-[#083a23] transition-all font-black uppercase tracking-[0.3em] text-[10px]">
                Back to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#FDFDFB]">
      {/* Narrative Side */}
      <div className="hidden lg:flex w-[55%] relative overflow-hidden bg-[#062D1B] items-center justify-center p-24">
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
          <Link href="/login" className="inline-flex items-center gap-3 text-white/40 hover:text-white transition-all group mb-12">
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-2" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Back to Login</span>
          </Link>
          
          <h1 className="text-7xl xl:text-8xl font-black text-white tracking-tighter leading-[0.9] uppercase italic">
            Secure <br/> <span className="text-[#EBB56B]">Credential</span> <br/> Reset.
          </h1>
          
          <p className="text-xl text-white/60 font-medium leading-relaxed">
            Lost your access key? No problem. Identify your account and we will dispatch a secure link to regain control of your dashboard.
          </p>
        </div>
      </div>

      {/* Auth Side */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-24 bg-white relative">
        <div className="w-full max-w-md space-y-16 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex flex-col items-center lg:items-start space-y-8">
            <Link href="/" className="transition-transform hover:scale-105">
              <img src="https://cdn.mignite.app/ws/works_01KM0WR2ZSKYNHV0ZE2MPNM9EF/final-Logo-1--01KM5Y2NCW8720B30G9G0XW18Y.png" alt="Sharcly" className="h-10 w-auto" />
            </Link>
            <div className="space-y-2 text-center lg:text-left">
              <h2 className="text-4xl font-black text-[#062D1B] tracking-tighter uppercase italic leading-none">
                Recover <br/> <span className="text-[#EBB56B]">Account</span>
              </h2>
              <p className="text-[#062D1B]/40 font-bold uppercase tracking-widest text-[10px]">Secure Recovery Protocol</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3 group">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#062D1B]/40 group-focus-within:text-[#062D1B]">Security Email</Label>
              <Input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-16 px-8 rounded-2xl border-2 border-[#062D1B]/5 bg-[#062D1B]/[0.02] focus:border-[#062D1B] focus:bg-white transition-all font-bold text-lg"
              />
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-20 rounded-2xl bg-[#062D1B] text-white hover:bg-[#083a23] transition-all text-[12px] font-black uppercase tracking-[0.4em] shadow-xl shadow-[#062D1B]/10"
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-white/50" />
              ) : (
                <span className="flex items-center gap-3">
                  Initiate Recovery <ShieldCheck className="h-4 w-4 text-[#EBB56B]" />
                </span>
              )}
            </Button>
          </form>

          <div className="pt-12 border-t border-[#062D1B]/5 text-center lg:text-left">
            <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-[#062D1B]/40 hover:text-[#EBB56B] transition-colors">
              Remembered your credentials? <span className="text-[#062D1B] underline underline-offset-4">Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

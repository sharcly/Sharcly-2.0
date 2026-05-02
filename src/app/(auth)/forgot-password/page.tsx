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
      toast.success("Recovery link sent if account exists");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to initiate recovery");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-8 bg-[#020d08] text-white selection:bg-accent selection:text-primary">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="w-full max-w-md space-y-10 text-center relative z-10 animate-in fade-in zoom-in duration-700">
          <div className="mx-auto w-24 h-24 bg-accent/10 backdrop-blur-md rounded-full flex items-center justify-center text-accent border border-accent/20 mb-10 shadow-[0_0_50px_rgba(235,181,107,0.1)]">
            <MailCheck className="h-10 w-10" />
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl font-black italic tracking-tighter text-white uppercase leading-none">
              Recovery <span className="text-accent underline decoration-white/10 underline-offset-8">Dispatched</span>
            </h1>
            <p className="text-white/40 font-medium leading-relaxed">
              We've dispatched a secure recovery link to <span className="text-white font-bold">{email}</span>. 
              The link will remain active for <span className="text-accent font-black">7 hours</span>.
            </p>
          </div>
          <div className="pt-10 border-t border-white/5">
            <Link href="/login">
              <Button className="h-16 px-12 rounded-2xl bg-white text-primary hover:bg-accent hover:scale-105 transition-all font-black uppercase tracking-[0.3em] text-[10px]">
                Return to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#020d08] text-white selection:bg-accent selection:text-primary overflow-hidden">
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
          <Link href="/login" className="inline-flex items-center gap-3 text-white/40 hover:text-white transition-all group mb-12">
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-2 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Back to Login</span>
          </Link>
          
          <h1 className="text-8xl xl:text-9xl font-black tracking-tighter leading-[0.85] italic font-serif">
            SECURE <br/> <span className="text-accent underline decoration-white/10 decoration-[8px] underline-offset-[12px]">RECOVERY.</span>
          </h1>
          
          <p className="text-xl text-white/60 font-medium leading-relaxed max-w-lg">
            Lost access to your dashboard? Enter your registered identifier to initiate a secure credential reset.
          </p>
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
                Reset <span className="text-accent">Access</span>
              </h2>
              <p className="text-white/40 font-medium">Identify yourself to regain control.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3 group">
              <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 group-focus-within:text-accent transition-colors">
                Account Email
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

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-18 py-8 rounded-2xl text-[14px] font-black uppercase tracking-[0.4em] bg-accent text-primary hover:bg-white hover:scale-[1.02] active:scale-95 transition-all duration-500 shadow-[0_20px_50px_rgba(235,181,107,0.15)] group"
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <span className="flex items-center gap-3">
                  Initiate Reset <ShieldCheck className="h-4 w-4 opacity-40 group-hover:opacity-100" />
                </span>
              )}
            </Button>
          </form>

          <div className="pt-10 border-t border-white/5">
            <p className="text-center text-[11px] font-black uppercase tracking-[0.3em] text-white/20">
              Remembered your credentials?{" "}
              <Link href="/login" className="text-accent hover:underline decoration-accent/20">
                Sign In
              </Link>
            </p>
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

"use client";

import { useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ArrowLeft, MailCheck } from "lucide-react";

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
      toast.success("Reset link sent if account exists");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md space-y-8 text-center animate-in fade-in zoom-in duration-500">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
            <MailCheck className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-black italic tracking-tighter text-primary uppercase leading-none">
            Check Your <span className="text-accent">Email</span>
          </h1>
          <p className="text-muted-foreground font-medium">
            We've sent a password reset link to <span className="text-foreground font-bold">{email}</span>. 
            The link will expire in 7 hours.
          </p>
          <div className="pt-6">
            <Link href="/login">
              <Button variant="outline" className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-[10px]">
                Back to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-background overflow-hidden">
      {/* Left Side: Cinematic Narrative (Consistent with Login) */}
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
          <Link href="/login" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-20 group">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Back to Login</span>
          </Link>
          
          <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter italic font-serif leading-none">
            RESET <br/> <span className="text-accent underline decoration-white/20">ACCESS</span>
          </h2>
          
          <p className="text-lg text-white/70 font-medium leading-relaxed">
            Enter your email to receive a secure link to reset your account credentials.
          </p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative">
        <div className="w-full max-w-md space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="text-left space-y-4">
            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-primary uppercase leading-none">
              Forgot <br/> <span className="text-accent underline decoration-primary/10">Password?</span>
            </h1>
            <p className="text-muted-foreground font-medium">No worries, we'll send you reset instructions.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 group">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-primary/50 group-focus-within:text-primary transition-colors">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-14 px-6 rounded-xl border-2 border-primary/5 focus-visible:ring-primary focus-visible:border-primary transition-all bg-primary/[0.02] font-medium"
              />
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-14 rounded-xl text-[12px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>

          <div className="pt-6 border-t border-primary/5">
            <p className="text-center text-[10px] font-black uppercase tracking-widest text-primary/40">
              Remembered your password?{" "}
              <Link href="/login" className="text-primary hover:text-accent transition-colors underline underline-offset-4 decoration-primary/20">
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

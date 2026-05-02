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
      toast.success("Reset link sent.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send reset link.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-8 bg-[#FDFDFB]">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="mx-auto w-16 h-16 bg-[#062D1B]/5 rounded-2xl flex items-center justify-center text-[#062D1B]">
            <MailCheck className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-[#062D1B]">Check your email</h1>
            <p className="text-gray-500 text-sm">
              We've sent a password reset link to <span className="font-bold">{email}</span>. 
              The link will expire in 7 hours.
            </p>
          </div>
          <div className="pt-4">
            <Link href="/login">
              <Button className="w-full h-12 rounded-xl bg-[#062D1B] text-white hover:bg-[#083a23] font-bold">
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
          <Link href="/login" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-all mb-8">
            <ArrowLeft size={16} />
            <span className="text-sm font-bold uppercase tracking-widest">Back to Login</span>
          </Link>
          <h1 className="text-6xl font-bold text-white tracking-tight leading-[1.1]">
            Reset your <br/> <span className="text-[#EBB56B]">Password.</span>
          </h1>
          <p className="text-lg text-white/70 font-medium leading-relaxed">
            Don't worry, it happens. Enter your email address and we'll send you a secure link to get back into your account.
          </p>
        </div>
      </div>

      {/* Auth Side */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-10">
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <img src="https://cdn.mignite.app/ws/works_01KM0WR2ZSKYNHV0ZE2MPNM9EF/final-Logo-1--01KM5Y2NCW8720B30G9G0XW18Y.png" alt="Sharcly" className="h-8 w-auto" />
            </Link>
            <div className="space-y-1">
              <h2 className="text-3xl font-bold text-[#062D1B] tracking-tight">Forgot Password</h2>
              <p className="text-gray-500 text-sm font-medium">Enter your email to receive a reset link.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-[#062D1B]">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 px-4 rounded-xl border-gray-200 focus:border-[#062D1B] transition-all"
              />
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-[#062D1B] text-white hover:bg-[#083a23] font-bold text-sm transition-all"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>

          <div className="pt-8 border-t border-gray-100 text-center">
            <Link href="/login" className="text-sm text-[#062D1B] font-bold hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

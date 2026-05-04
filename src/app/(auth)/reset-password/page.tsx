"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ShieldCheck, Eye, EyeOff, CheckCircle2 } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  
  // Ensure we have a CSRF token before any POST request
  useEffect(() => {
    apiClient.get("/health").catch(() => {});
  }, []);
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast.error("Invalid reset link. Please request a new one.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      await apiClient.post("/auth/reset-password", { token, password });
      setIsSuccess(true);
      toast.success("Password reset successfully!");
      setTimeout(() => router.push("/login"), 3000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reset password. Link may be expired.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-8 bg-[#FDFDFB]">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="mx-auto w-20 h-20 bg-[#062D1B]/5 rounded-3xl flex items-center justify-center text-[#062D1B]">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-[#062D1B]">Password Updated</h1>
            <p className="text-gray-500 text-sm font-medium">
              Your password has been reset successfully. You will be redirected to the login page in a few seconds.
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
          <h1 className="text-6xl font-bold text-white tracking-tight leading-[1.1]">
            Secure <br/> <span className="text-[#EBB56B]">Recovery.</span>
          </h1>
          <p className="text-lg text-white/70 font-medium leading-relaxed">
            Your security is our priority. Create a strong, new password to regain access to your Sharcly account and continue your wellness journey.
          </p>
          <div className="flex gap-8 pt-6 border-t border-white/10">
            <div>
              <p className="text-2xl font-bold text-[#EBB56B]">Safe</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Encrypted</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#EBB56B]">Private</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Secure Access</p>
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
              <h2 className="text-3xl font-bold text-[#062D1B] tracking-tight">Reset Password</h2>
              <p className="text-gray-500 text-sm font-medium">Please enter your new password below.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-[#062D1B]">New Password</Label>
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-[#062D1B]">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="h-12 px-4 rounded-xl border-gray-200 focus:border-[#062D1B] focus:ring-[#062D1B] transition-all"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading || !token}
              className="w-full h-12 rounded-xl bg-[#062D1B] text-white hover:bg-[#083a23] font-bold text-sm transition-all"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Update Password"
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}

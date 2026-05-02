"use client";

import { useState, Suspense } from "react";
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
      <div className="min-h-screen w-full flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md space-y-8 text-center animate-in fade-in zoom-in duration-500">
          <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent mb-6">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-black italic tracking-tighter text-primary uppercase leading-none">
            Password <span className="text-accent">Updated</span>
          </h1>
          <p className="text-muted-foreground font-medium">
            Your password has been reset successfully. Redirecting you to login...
          </p>
          <div className="pt-6">
            <Link href="/login">
              <Button className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-[10px]">
                Login Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
          <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter italic font-serif leading-none">
            SECURE <br/> <span className="text-accent underline decoration-white/20">RECOVERY</span>
          </h2>
          
          <p className="text-lg text-white/70 font-medium leading-relaxed">
            Your security is our priority. Create a strong, new password to regain access to your account.
          </p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative">
        <div className="w-full max-w-md space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="text-left space-y-4">
            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-primary uppercase leading-none">
              Reset <br/> <span className="text-accent underline decoration-primary/10">Password</span>
            </h1>
            <p className="text-muted-foreground font-medium">Please enter your new password below.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 group">
              <Label className="text-[10px] font-black uppercase tracking-widest text-primary/50">New Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-14 px-6 rounded-xl border-2 border-primary/5 focus-visible:ring-primary focus-visible:border-primary transition-all bg-primary/[0.02] font-medium pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/30 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2 group">
              <Label className="text-[10px] font-black uppercase tracking-widest text-primary/50">Confirm New Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-14 px-6 rounded-xl border-2 border-primary/5 focus-visible:ring-primary focus-visible:border-primary transition-all bg-primary/[0.02] font-medium"
              />
            </div>

            <Button 
              type="submit" 
              disabled={isLoading || !token}
              className="w-full h-14 rounded-xl text-[12px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
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

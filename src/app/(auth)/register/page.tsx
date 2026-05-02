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

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [step, setStep] = useState(1);
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
      toast.error("Please fill in all fields.");
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
      toast.success("Verification code sent.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send code.");
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
      login(response.data.accessToken, response.data.refreshToken, response.data.user);
      toast.success("Account created successfully.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Verification failed.");
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
            backgroundImage: 'url("https://i.postimg.cc/mD8Z8L4j/Close-up-of-hemp-plant-leaves.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#062D1B] to-[#062D1B]/80" />
        
        <div className="relative z-20 max-w-lg space-y-8">
          <h1 className="text-6xl font-bold text-white tracking-tight leading-[1.1]">
            Join the <br/> <span className="text-[#EBB56B]">Community.</span>
          </h1>
          <p className="text-lg text-white/70 font-medium leading-relaxed">
            Create an account to track your orders, receive member-only discounts, and stay updated on our latest harvests.
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
              <h2 className="text-3xl font-bold text-[#062D1B] tracking-tight">
                {step === 1 ? "Create Account" : "Verify Email"}
              </h2>
              <p className="text-gray-500 text-sm font-medium">
                {step === 1 ? "Start your journey with Sharcly today." : `Enter the 6-digit code sent to ${formData.email}`}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-[#062D1B]">Full Name</Label>
                  <Input
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="h-12 px-4 rounded-xl border-gray-200 focus:border-[#062D1B] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-[#062D1B]">Email Address</Label>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className="h-12 px-4 rounded-xl border-gray-200 focus:border-[#062D1B] transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-[#062D1B]">Password</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                        className="h-12 px-4 rounded-xl border-gray-200 focus:border-[#062D1B] pr-12"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-[#062D1B]">Confirm</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      required
                      className="h-12 px-4 rounded-xl border-gray-200 focus:border-[#062D1B]"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-[#062D1B]">Verification Code</Label>
                  <Input
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength={6}
                    className="h-16 text-center text-3xl font-bold border-gray-200 rounded-xl focus:border-[#062D1B] tracking-[0.2em]"
                  />
                </div>
                <button type="button" onClick={handleSendOtp} className="w-full text-center text-xs font-bold text-[#EBB56B] hover:underline">
                  Resend code
                </button>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={isLoading || isSendingOtp}
              className="w-full h-12 rounded-xl bg-[#062D1B] text-white hover:bg-[#083a23] font-bold text-sm transition-all"
            >
              {isLoading || isSendingOtp ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                step === 1 ? "Create Account" : "Verify & Sign Up"
              )}
            </Button>
          </form>

          <div className="pt-8 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="text-[#062D1B] font-bold hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

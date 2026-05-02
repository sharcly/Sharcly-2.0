"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ArrowLeft, ShieldCheck, Eye, EyeOff } from "lucide-react";

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
      toast.error("Required fields missing.");
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
      toast.success("Security code sent to email.");
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
      toast.success("Account activated successfully.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Activation failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#FDFDFB]">
      {/* Narrative Side */}
      <div className="hidden lg:flex w-[55%] relative overflow-hidden bg-[#062D1B] items-center justify-center p-24">
        <div 
          className="absolute inset-0 opacity-40 mix-blend-overlay"
          style={{ 
            backgroundImage: 'url("https://i.postimg.cc/mD8Z8L4j/Close-up-of-hemp-plant-leaves.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#062D1B] via-[#062D1B]/90 to-transparent" />
        
        <div className="relative z-20 max-w-xl space-y-12">
          <div className="space-y-6">
            <h1 className="text-7xl xl:text-8xl font-black text-white tracking-tighter leading-[0.9] uppercase italic">
              Exclusive <br/> <span className="text-[#EBB56B]">Member</span> <br/> Access.
            </h1>
            <p className="text-xl text-white/60 font-medium leading-relaxed">
              Join the Sharcly inner circle. Gain priority access to premium batches, member-only insights, and personalized wellness tracking.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 pt-8 border-t border-white/10">
            <div className="space-y-1">
              <p className="text-3xl font-black text-[#EBB56B] italic uppercase tracking-tighter">Verified</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 text-nowrap">Identity Protection</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-black text-[#EBB56B] italic uppercase tracking-tighter">Premium</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 text-nowrap">Exclusive Benefits</p>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Side */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-24 bg-white relative">
        <div className="w-full max-w-md space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex flex-col items-center lg:items-start space-y-8">
            <Link href="/" className="transition-transform hover:scale-105">
              <img src="https://cdn.mignite.app/ws/works_01KM0WR2ZSKYNHV0ZE2MPNM9EF/final-Logo-1--01KM5Y2NCW8720B30G9G0XW18Y.png" alt="Sharcly" className="h-10 w-auto" />
            </Link>
            <div className="space-y-2 text-center lg:text-left">
              <h2 className="text-4xl font-black text-[#062D1B] tracking-tighter uppercase italic leading-none">
                {step === 1 ? <>Account <span className="text-[#EBB56B]">Creation</span></> : <>Security <span className="text-[#EBB56B]">Validation</span></>}
              </h2>
              <p className="text-[#062D1B]/40 font-bold uppercase tracking-widest text-[10px]">Step {step} of 2 • Secure Enrollment</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 ? (
              <div className="space-y-6">
                <div className="space-y-2 group">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#062D1B]/40 group-focus-within:text-[#062D1B]">Full Legal Name</Label>
                  <Input
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="h-16 px-8 rounded-2xl border-2 border-[#062D1B]/5 bg-[#062D1B]/[0.02] focus:border-[#062D1B] focus:bg-white transition-all font-bold text-lg"
                  />
                </div>
                <div className="space-y-2 group">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#062D1B]/40 group-focus-within:text-[#062D1B]">Contact Email</Label>
                  <Input
                    type="email"
                    placeholder="name@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className="h-16 px-8 rounded-2xl border-2 border-[#062D1B]/5 bg-[#062D1B]/[0.02] focus:border-[#062D1B] focus:bg-white transition-all font-bold text-lg"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 group">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#062D1B]/40 group-focus-within:text-[#062D1B]">Password</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                        className="h-16 px-8 rounded-2xl border-2 border-[#062D1B]/5 bg-[#062D1B]/[0.02] focus:border-[#062D1B] pr-12"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#062D1B]/20">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2 group">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#062D1B]/40 group-focus-within:text-[#062D1B]">Confirm</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      required
                      className="h-16 px-8 rounded-2xl border-2 border-[#062D1B]/5 bg-[#062D1B]/[0.02] focus:border-[#062D1B]"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-4 text-center p-8 bg-[#062D1B]/[0.02] border-2 border-[#062D1B]/5 rounded-3xl">
                   <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#062D1B]/40">Verification Code</Label>
                   <Input
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength={6}
                    className="h-20 text-center text-4xl font-black tracking-[0.5em] border-none bg-transparent focus-visible:ring-0"
                   />
                </div>
                <button type="button" onClick={handleSendOtp} className="w-full text-center text-[10px] font-black uppercase tracking-widest text-[#EBB56B] hover:underline">Resend Security Code</button>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={isLoading || isSendingOtp}
              className="w-full h-20 rounded-2xl bg-[#062D1B] text-white hover:bg-[#083a23] transition-all text-[12px] font-black uppercase tracking-[0.4em] shadow-xl shadow-[#062D1B]/10"
            >
              {isLoading || isSendingOtp ? (
                <Loader2 className="h-6 w-6 animate-spin text-white/50" />
              ) : (
                <span className="flex items-center gap-3">
                  {step === 1 ? "Get Access Code" : "Activate Profile"} <ShieldCheck className="h-4 w-4 text-[#EBB56B]" />
                </span>
              )}
            </Button>
          </form>

          <div className="pt-10 border-t border-[#062D1B]/5 flex flex-col items-center lg:items-start gap-4">
            <p className="text-[11px] font-black uppercase tracking-widest text-[#062D1B]/20">Already part of the inner circle?</p>
            <Link href="/login">
              <Button variant="outline" className="h-14 px-10 rounded-2xl border-2 border-[#062D1B]/5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#062D1B] hover:text-white transition-all">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

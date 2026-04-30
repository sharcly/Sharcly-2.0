"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ArrowLeft, CheckCircle2, Eye, EyeOff } from "lucide-react";

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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login } = useAuth();

  const handleSendOtp = async () => {
    if (!formData.email || !formData.name || !formData.password) {
      return toast.error("Please fill in all details first");
    }
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
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
      toast.success("Account created successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-background overflow-hidden font-sans">
      {/* Right Side: Narrative */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-primary items-center justify-center p-20 order-last">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-110"
          style={{ 
            backgroundImage: 'url("https://i.postimg.cc/pLvdHRdR/Evening-unwind-(1).jpg")',
            filter: 'brightness(0.6) contrast(1.1)'
          }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-bl from-primary/40 via-transparent to-transparent" />
        
        <div className="relative z-20 max-w-lg space-y-12 animate-in fade-in slide-in-from-right-8 duration-1000">
          <div className="space-y-4">
             <Badge className="bg-accent/20 text-accent border-accent/30 font-black text-[9px] uppercase tracking-widest px-4 py-1">Community Access</Badge>
             <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter italic font-serif leading-none uppercase">
                Join the <br/> <span className="text-accent">Sharcly</span> <br/> Club.
             </h2>
          </div>
          
          <ul className="space-y-6">
            {[
              "Priority access to new product drops",
              "Detailed lab results & batch tracking",
              "Member-only discounts & offers",
              "Faster checkout & order history"
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-4 text-white/80 group">
                <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center group-hover:bg-accent/40 transition-colors">
                   <CheckCircle2 className="h-3 w-3 text-accent" />
                </div>
                <span className="font-medium tracking-tight">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="bg-white/5 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/10">
             <p className="text-sm font-medium text-white/60 italic leading-relaxed">
               "The best quality and focus I've found. Sharcly is now a non-negotiable part of my morning routine."
             </p>
             <div className="flex items-center gap-4 mt-6">
                <div className="h-10 w-10 rounded-full bg-accent/20 border border-accent/20" />
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-white">Sarah Jenkins</p>
                   <p className="text-[9px] font-bold text-white/40">Verified Member</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Left Side: Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative">
        <div className="w-full max-w-md space-y-12 animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="space-y-4">
             <Link href="/" className="inline-flex items-center gap-2 text-primary/40 hover:text-primary transition-colors mb-4 group">
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Return home</span>
             </Link>
             <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-[0.9]">
               {step === 1 ? "CREATE YOUR" : "VERIFY YOUR"} <br/> {step === 1 ? "ACCOUNT." : "EMAIL."}
             </h1>
             <p className="text-foreground/50 font-medium tracking-tight">
               {step === 1 ? "Join our community in just a few seconds." : `We've sent a 6-digit code to ${formData.email}`}
             </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 ? (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="h-14 rounded-2xl border-primary/5 bg-primary/5 px-6 font-medium focus:ring-accent/20 focus:border-accent/40 transition-all placeholder:text-foreground/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@email.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="h-14 rounded-2xl border-primary/5 bg-primary/5 px-6 font-medium focus:ring-accent/20 focus:border-accent/40 transition-all placeholder:text-foreground/20"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="h-14 rounded-2xl border-primary/5 bg-primary/5 px-6 pr-12 font-medium focus:ring-accent/20 focus:border-accent/40 transition-all"
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
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="h-14 rounded-2xl border-primary/5 bg-primary/5 px-6 pr-12 font-medium focus:ring-accent/20 focus:border-accent/40 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/30 hover:text-primary transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Verification Code</Label>
                  <Input
                    id="otp"
                    placeholder="000000"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="h-20 text-center text-3xl tracking-[1rem] font-black rounded-2xl border-primary/5 bg-primary/5 px-6 focus:ring-accent/20 focus:border-accent/40 transition-all placeholder:text-foreground/10"
                  />
                </div>
                <div className="flex justify-between items-center">
                   <button 
                     type="button" 
                     onClick={() => setStep(1)}
                     className="text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-primary transition-colors"
                   >
                     Change Details
                   </button>
                   <button 
                     type="button" 
                     onClick={handleSendOtp}
                     disabled={isSendingOtp}
                     className="text-[10px] font-black uppercase tracking-widest text-accent hover:text-accent/80 transition-colors"
                   >
                     {isSendingOtp ? "Sending..." : "Resend Code"}
                   </button>
                </div>
              </div>
            )}

            <div className="pt-4">
               <Button className="w-full h-16 rounded-2xl premium-gradient font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-primary/20 group border-none hover:opacity-90" type="submit" disabled={isLoading || isSendingOtp}>
                 {isLoading || isSendingOtp ? (
                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                 ) : (
                   step === 1 ? "Next: Verify Email" : "Complete Registration"
                 )}
               </Button>
            </div>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-primary/5" />
              </div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest leading-none">
                <span className="bg-background px-4 text-foreground/30">Already have an account?</span>
              </div>
            </div>

            <Button variant="ghost" className="w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-primary/5" asChild>
               <Link href="/login">Sign In</Link>
            </Button>
          </form>
          
          <p className="text-center text-[9px] font-bold text-foreground/30 max-w-xs mx-auto leading-relaxed">
             By creating an account, you agree to our <Link href="/terms" className="text-accent underline decoration-accent/20 hover:text-accent/80">Terms of Service</Link> and <Link href="/privacy" className="text-accent underline decoration-accent/20 hover:text-accent/80">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper Badge component if not available, or I'll just use the one from UI
function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </span>
  );
}

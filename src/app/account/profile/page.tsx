"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { apiClient } from "@/lib/api-client";
import { 
  User, 
  Mail, 
  Lock, 
  KeyRound, 
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.patch("/auth/change-password", {
        currentPassword,
        newPassword
      });

      if (response.data.success) {
        toast.success("Password successfully updated.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-px w-8 bg-[#062D1B]/20" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#062D1B]/50">Identity Sequence</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#062D1B]">
          Profile <span className="text-[#EBB56B] italic font-serif">Settings</span>.
        </h2>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Personal Details */}
        <div className="lg:col-span-1 space-y-8">
           <Card className="border-black/5 shadow-sharcly rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="p-8 pb-4">
                 <div className="size-12 rounded-2xl bg-[#062D1B] text-white flex items-center justify-center mb-6">
                    <User className="size-6" />
                 </div>
                 <CardTitle className="text-xl font-bold tracking-tight">Personal Data</CardTitle>
                 <CardDescription className="text-xs font-medium text-gray-400">Your core account identity</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-8">
                 <div className="h-px w-full bg-black/5 my-4" />
                 
                 <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black tracking-[0.2em] text-[#062D1B]/30 block">Full Name</Label>
                    <p className="text-lg font-bold tracking-tight">{user.name}</p>
                 </div>
                 
                 <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black tracking-[0.2em] text-[#062D1B]/30 block">Email Address</Label>
                    <div className="flex items-center gap-3">
                       <p className="text-lg font-bold tracking-tight opacity-70">{user.email}</p>
                       <Badge className="bg-emerald-500/10 text-emerald-600 border-none px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full">
                         Verified
                       </Badge>
                    </div>
                 </div>

                 <div className="pt-8 border-t border-black/5">
                    <div className="flex items-center gap-3 text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em] p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                       <ShieldCheck className="size-4" /> Secure Profile Sequence
                    </div>
                 </div>
              </CardContent>
           </Card>
           
           <div className="p-8 rounded-[2.5rem] bg-[#062D1B] text-white space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 size-48 bg-white/5 rounded-full -mr-24 -mt-24 blur-3xl" />
              <div className="flex items-center gap-4">
                 <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center text-[#EBB56B]">
                    <Sparkles className="size-5" />
                 </div>
                 <p className="text-xs font-black uppercase tracking-widest">Premium Member</p>
              </div>
              <p className="text-white/40 text-xs font-medium leading-relaxed italic">"Your wellness data is encrypted with post-quantum security protocols."</p>
           </div>
        </div>

        {/* Security Settings */}
        <div className="lg:col-span-2">
           <Card className="border-black/5 shadow-sharcly rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="p-10 pb-6 border-b border-black/5">
                 <CardTitle className="text-2xl font-bold tracking-tight flex items-center gap-4">
                    <Lock className="size-6 text-[#062D1B]/20" /> Security Update
                 </CardTitle>
                 <CardDescription className="text-sm font-medium text-gray-500">Rotate your access credentials regularly to ensure sequence integrity.</CardDescription>
              </CardHeader>
              <CardContent className="p-10">
                 <form onSubmit={handlePasswordChange} className="space-y-8 max-w-lg">
                    <div className="space-y-3">
                       <Label className="text-[10px] uppercase font-black tracking-[0.2em] text-[#062D1B]/40">Current Access Key</Label>
                        <div className="relative">
                          <Input 
                            type={showCurrent ? "text" : "password"} 
                            required
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="h-14 rounded-2xl bg-neutral-50 font-bold border-black/5 focus:border-[#062D1B] transition-all focus:bg-white pr-12 text-lg tracking-widest"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrent(!showCurrent)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#062D1B] transition-colors"
                          >
                            {showCurrent ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                       <div className="space-y-3">
                          <Label className="text-[10px] uppercase font-black tracking-[0.2em] text-[#062D1B]/40">New Access Key</Label>
                           <div className="relative">
                             <Input 
                               type={showNew ? "text" : "password"} 
                               required
                               value={newPassword}
                               onChange={(e) => setNewPassword(e.target.value)}
                               className="h-14 rounded-2xl bg-neutral-50 font-bold border-black/5 focus:border-[#062D1B] transition-all focus:bg-white pr-12 text-lg tracking-widest"
                               placeholder="••••••••"
                             />
                             <button
                               type="button"
                               onClick={() => setShowNew(!showNew)}
                               className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#062D1B] transition-colors"
                             >
                               {showNew ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                             </button>
                           </div>
                       </div>
                       
                       <div className="space-y-3">
                          <Label className="text-[10px] uppercase font-black tracking-[0.2em] text-[#062D1B]/40">Confirm New Key</Label>
                           <div className="relative">
                             <Input 
                               type={showConfirm ? "text" : "password"} 
                               required
                               value={confirmPassword}
                               onChange={(e) => setConfirmPassword(e.target.value)}
                               className="h-14 rounded-2xl bg-neutral-50 font-bold border-black/5 focus:border-[#062D1B] transition-all focus:bg-white pr-12 text-lg tracking-widest"
                               placeholder="••••••••"
                             />
                             <button
                               type="button"
                               onClick={() => setShowConfirm(!showConfirm)}
                               className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#062D1B] transition-colors"
                             >
                               {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                             </button>
                           </div>
                       </div>
                    </div>

                    <div className="pt-6">
                       <Button type="submit" disabled={loading} className="rounded-2xl h-16 px-12 bg-[#062D1B] text-white hover:bg-black font-black uppercase tracking-widest gap-4 shadow-xl shadow-[#062D1B]/10 transition-all w-full md:w-auto">
                          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <KeyRound className="h-5 w-5 text-[#EBB56B]" />}
                          {loading ? "Synthesizing Security..." : "Rotate Access Key"}
                       </Button>
                    </div>
                 </form>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { apiClient } from "@/lib/api-client";
import { 
  User, 
  Lock, 
  KeyRound, 
  Loader2,
  Eye,
  EyeOff,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ProfilePage() {
  const { user, logout } = useAuth();
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

  const handleDeactivate = async () => {
    try {
      setLoading(true);
      const response = await apiClient.patch("/auth/deactivate");
      if (response.data.success) {
        toast.success("Account deactivated. You will be logged out.");
        setTimeout(() => {
          logout();
        }, 2000);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to deactivate account.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="space-y-2 border-b border-white/5 pb-8">
        <h2 className="text-4xl font-serif italic text-[#eff8ee]">Account <span className="text-[#EBB56B]">Security</span></h2>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#eff8ee]/40">Manage your personal credentials and safety</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-16">
        {/* Personal Details */}
        <div className="lg:col-span-1 space-y-10">
           <div className="space-y-8">
              <h3 className="text-xl font-serif italic text-[#eff8ee]">Identity Detail</h3>
              <div className="space-y-6">
                 <div className="space-y-1">
                    <Label className="text-[9px] uppercase font-black tracking-widest text-[#eff8ee]/30 ml-1">Full Name</Label>
                    <p className="text-lg font-bold text-[#eff8ee]">{user.name}</p>
                 </div>
                 <div className="space-y-1">
                    <Label className="text-[9px] uppercase font-black tracking-widest text-[#eff8ee]/30 ml-1">Email Address</Label>
                    <p className="text-sm font-medium text-[#eff8ee]/60 italic">{user.email}</p>
                 </div>
              </div>
           </div>

           <div className="pt-8 border-t border-white/5">
              <h3 className="text-xl font-serif italic text-red-400 mb-4">Danger Zone</h3>
              <p className="text-[11px] font-medium text-[#eff8ee]/30 mb-6 leading-relaxed">
                Once you deactivate your account, there is no going back. Please be certain of your decision.
              </p>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full h-12 border-red-400/20 text-red-400 hover:bg-red-400 hover:text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all">
                    Deactivate Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-[2.5rem] border-white/5 bg-[#040e07] text-[#eff8ee]">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-serif italic flex items-center gap-3">
                      <AlertTriangle className="size-6 text-red-400" /> Confirm Deactivation
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm font-medium text-[#eff8ee]/40 pt-2">
                      This action will disable your account and remove your access to Sharcly. Your data will be permanently archived.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="pt-6">
                    <AlertDialogCancel className="rounded-full h-12 border-white/10 bg-white/5 text-[#eff8ee] hover:bg-white/10">Keep Account</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeactivate} className="rounded-full h-12 bg-red-500 hover:bg-red-600 text-white">
                      Confirm Deactivate
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
           </div>
        </div>

        {/* Security Settings */}
        <div className="lg:col-span-2">
           <div className="border border-white/5 rounded-[2.5rem] p-10 bg-[#0d2518] shadow-2xl space-y-10">
              <div className="space-y-3">
                 <h3 className="text-2xl font-serif italic flex items-center gap-4 text-[#eff8ee]">
                    <Lock className="size-6 text-[#EBB56B]" /> Credentials Update
                 </h3>
                 <p className="text-[11px] text-[#eff8ee]/40 font-bold uppercase tracking-widest">Keep your sanctuary secure</p>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-8">
                 <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#eff8ee]/30 ml-1">Current Password</Label>
                    <div className="relative">
                      <Input 
                        type={showCurrent ? "text" : "password"} 
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="h-14 rounded-2xl bg-black/20 border-white/5 focus:bg-black/40 transition-all pr-12 text-sm text-[#eff8ee]"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrent(!showCurrent)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#eff8ee]/20 hover:text-[#EBB56B]"
                      >
                        {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                 </div>
                 
                 <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-[#eff8ee]/30 ml-1">New Password</Label>
                        <div className="relative">
                          <Input 
                            type={showNew ? "text" : "password"} 
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="h-14 rounded-2xl bg-black/20 border-white/5 focus:bg-black/40 transition-all pr-12 text-sm text-[#eff8ee]"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNew(!showNew)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#eff8ee]/20 hover:text-[#EBB56B]"
                          >
                            {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          </button>
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-[#eff8ee]/30 ml-1">Confirm Identity</Label>
                        <div className="relative">
                          <Input 
                            type={showConfirm ? "text" : "password"} 
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="h-14 rounded-2xl bg-black/20 border-white/5 focus:bg-black/40 transition-all pr-12 text-sm text-[#eff8ee]"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#eff8ee]/20 hover:text-[#EBB56B]"
                          >
                            {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          </button>
                        </div>
                    </div>
                 </div>

                 <Button type="submit" disabled={loading} className="rounded-full h-14 px-10 bg-[#EBB56B] text-[#040e07] hover:opacity-90 text-[10px] font-black uppercase tracking-[0.2em] transition-all gap-3 shadow-xl shadow-[#EBB56B]/10">
                    {loading ? <Loader2 className="size-4 animate-spin" /> : <KeyRound className="size-4" />}
                    Rotate Password
                 </Button>
              </form>
           </div>
        </div>
      </div>
    </div>
  );
}

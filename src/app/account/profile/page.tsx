"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { apiClient } from "@/lib/api-client";
import { 
  ArrowLeft,
  User,
  ShieldCheck,
  Mail,
  Lock,
  KeyRound,
  CheckCircle2,
  Loader2,
  Eye,
  EyeOff
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";

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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
        <Link href="/account">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-black/5">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground font-medium">Manage your personal information and security.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Personal info */}
        <div className="md:col-span-1 space-y-8">
           <Card className="border-black/5 shadow-sharcly rounded-3xl overflow-hidden bg-white">
              <CardHeader className="p-8 pb-4">
                 <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <User className="h-4 w-4 text-primary/40" /> Personal Details
                 </CardTitle>
                 <CardDescription className="text-xs">Your registered account data</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-6">
                 <div>
                    <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/40 mb-1.5 block">Full Name</Label>
                    <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-black/5">
                       <User className="h-4 w-4 text-primary/40 shrink-0" />
                       <span className="font-bold text-sm tracking-tight">{user.name}</span>
                    </div>
                 </div>
                 
                 <div>
                    <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/40 mb-1.5 block">Email Address</Label>
                    <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-black/5">
                       <Mail className="h-4 w-4 text-primary/40 shrink-0" />
                       <span className="font-bold text-sm tracking-tight opacity-70">{user.email}</span>
                       <Badge className="ml-auto bg-emerald-500/10 text-emerald-600 border-none px-2 rounded-full hidden sm:flex">
                         Verified
                       </Badge>
                    </div>
                 </div>

                 <div>
                    <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/40 mb-1.5 block">Account Security</Label>
                    <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-widest p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                       <ShieldCheck className="h-4 w-4" /> Secure Profile
                    </div>
                 </div>
              </CardContent>
           </Card>
        </div>

        {/* Right Column: Security configs */}
        <div className="md:col-span-2 space-y-8">
           <Card className="border-black/5 shadow-sharcly rounded-3xl overflow-hidden bg-white">
              <CardHeader className="p-8 pb-4 border-b border-black/5">
                 <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary/40" /> Change Password
                 </CardTitle>
                 <CardDescription className="text-sm">Update your password to keep your account secure.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                 <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md">
                    <div className="space-y-2">
                       <Label className="text-[10px] uppercase font-black tracking-widest text-primary/60">Current Password</Label>
                        <div className="relative">
                          <Input 
                            type={showCurrent ? "text" : "password"} 
                            required
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="h-12 rounded-xl bg-neutral-50 font-medium border-black/5 focus:border-primary/20 transition-all focus:bg-white pr-10"
                            placeholder="Enter your current password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrent(!showCurrent)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-primary transition-colors"
                          >
                            {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                    </div>
                    
                    <div className="h-px w-full bg-black/5 my-4" />
                    
                    <div className="space-y-2">
                       <Label className="text-[10px] uppercase font-black tracking-widest text-primary/60">New Password</Label>
                        <div className="relative">
                          <Input 
                            type={showNew ? "text" : "password"} 
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="h-12 rounded-xl bg-neutral-50 font-medium border-black/5 focus:border-primary/20 transition-all focus:bg-white pr-10"
                            placeholder="Create a new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNew(!showNew)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-primary transition-colors"
                          >
                            {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                       <Label className="text-[10px] uppercase font-black tracking-widest text-primary/60">Confirm New Password</Label>
                        <div className="relative">
                          <Input 
                            type={showConfirm ? "text" : "password"} 
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="h-12 rounded-xl bg-neutral-50 font-medium border-black/5 focus:border-primary/20 transition-all focus:bg-white pr-10"
                            placeholder="Confirm your new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-primary transition-colors"
                          >
                            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                    </div>

                    <Button type="submit" disabled={loading} className="mt-4 rounded-xl h-12 px-8 font-bold uppercase tracking-widest gap-2">
                       {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                       {loading ? "Updating Security..." : "Update Password"}
                    </Button>
                 </form>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { apiClient } from "@/lib/api-client";
import { User, Lock, Mail, Shield, Save, Loader2, Key, Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setSaving(true);
      await apiClient.post("/auth/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Security password updated successfully");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">My Profile</h1>
          <p className="text-sm text-neutral-500 font-medium">Manage your personal account details and security settings.</p>
        </div>
        <Badge className="bg-blue-500 text-white px-6 py-2 rounded-full font-bold text-[10px] tracking-widest border-none shadow-lg shadow-blue-500/20 uppercase">
           {user.role.replace("_", " ")}
        </Badge>
      </div>

      <div className="grid gap-8 md:grid-cols-12">
        <Card className="md:col-span-4 border-black/5 shadow-sm rounded-3xl overflow-hidden bg-white">
          <CardHeader className="bg-neutral-900 p-8 text-white relative">
            <div className="flex flex-col items-center gap-4">
              <div className="size-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl font-bold backdrop-blur-md">
                {user.name?.[0]}
              </div>
              <div className="text-center">
                <CardTitle className="text-xl font-bold tracking-tight">{user.name}</CardTitle>
                <CardDescription className="text-neutral-400 font-medium uppercase tracking-[0.2em] text-[10px] mt-1">
                  System Operator
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-xl bg-neutral-50 border border-black/5 flex items-center justify-center text-neutral-400">
                <Mail className="size-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-black/20">Email Address</span>
                <span className="text-sm font-bold text-neutral-900 truncate max-w-[150px]">{user.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="size-10 rounded-xl bg-neutral-50 border border-black/5 flex items-center justify-center text-neutral-400">
                <Shield className="size-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-black/20">Access Role</span>
                <span className="text-sm font-bold text-neutral-900 uppercase italic">{user.role}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-8 border-black/5 shadow-sm rounded-3xl overflow-hidden bg-white">
          <CardHeader className="p-8 border-b border-black/5">
            <CardTitle className="text-xl font-bold">Account Security</CardTitle>
            <CardDescription className="text-sm font-medium">Keep your account secure by updating your password regularly.</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleChangePassword} className="space-y-6 max-w-md">
              <div className="space-y-2">
                 <Label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">Current Password</Label>
                 <div className="relative">
                   <Input 
                     type={showCurrentPassword ? "text" : "password"} 
                     className="h-12 rounded-xl bg-neutral-50 border-black/5 pr-10" 
                     value={passwordData.currentPassword}
                     onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                     required
                   />
                   <button
                     type="button"
                     onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                     className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900 transition-colors"
                   >
                     {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                   </button>
                 </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                   <Label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">New Password</Label>
                   <div className="relative">
                     <Input 
                       type={showNewPassword ? "text" : "password"} 
                       className="h-12 rounded-xl bg-neutral-50 border-black/5 pr-10" 
                       value={passwordData.newPassword}
                       onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                       required
                     />
                     <button
                       type="button"
                       onClick={() => setShowNewPassword(!showNewPassword)}
                       className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900 transition-colors"
                     >
                       {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                     </button>
                   </div>
                </div>
                <div className="space-y-2">
                   <Label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">Confirm Password</Label>
                   <div className="relative">
                     <Input 
                       type={showConfirmPassword ? "text" : "password"} 
                       className="h-12 rounded-xl bg-neutral-50 border-black/5 pr-10" 
                       value={passwordData.confirmPassword}
                       onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                       required
                     />
                     <button
                       type="button"
                       onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                       className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900 transition-colors"
                     >
                       {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                     </button>
                   </div>
                </div>
              </div>
              <Button type="submit" disabled={saving} className="h-12 px-8 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 transition-all font-bold gap-3 shadow-lg">
                 {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="size-4" />}
                 {saving ? "Updating Password..." : "Change Account Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

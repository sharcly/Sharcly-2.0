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
    <div className="space-y-12 max-w-4xl">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-[#062D1B]">Account Settings</h2>
        <p className="text-gray-500">Manage your personal information and security preferences.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Personal Details */}
        <div className="lg:col-span-1 space-y-6">
           <div className="space-y-6">
              <h3 className="text-lg font-bold">Personal Details</h3>
              <div className="space-y-4">
                 <div className="space-y-1">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-gray-400">Full Name</Label>
                    <p className="font-medium">{user.name}</p>
                 </div>
                 <div className="space-y-1">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-gray-400">Email Address</Label>
                    <p className="font-medium text-gray-500">{user.email}</p>
                 </div>
              </div>
           </div>

           <div className="pt-8 border-t border-gray-100">
              <h3 className="text-lg font-bold text-red-500 mb-4">Danger Zone</h3>
              <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                Once you deactivate your account, there is no going back. Please be certain.
              </p>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full h-11 border-red-200 text-red-500 hover:bg-red-50 hover:border-red-500 rounded-lg text-xs font-bold transition-all">
                    Deactivate Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-2xl border-none">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold flex items-center gap-2">
                      <AlertTriangle className="size-5 text-red-500" /> Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm font-medium text-gray-500 pt-2">
                      This action will disable your account and remove your access to Sharcly. Your order history and saved data will be archived.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="pt-4">
                    <AlertDialogCancel className="rounded-xl h-12 border-gray-100">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeactivate} className="rounded-xl h-12 bg-red-500 hover:bg-red-600">
                      Deactivate Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
           </div>
        </div>

        {/* Security Settings */}
        <div className="lg:col-span-2">
           <div className="border border-gray-100 rounded-2xl p-8 bg-white shadow-sm space-y-8">
              <div className="space-y-2">
                 <h3 className="text-xl font-bold flex items-center gap-3">
                    <Lock className="size-5 text-gray-200" /> Update Password
                 </h3>
                 <p className="text-sm text-gray-500 font-medium">Rotate your password regularly to keep your account secure.</p>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md">
                 <div className="space-y-2">
                    <Label className="text-xs font-bold text-[#062D1B]">Current Password</Label>
                    <div className="relative">
                      <Input 
                        type={showCurrent ? "text" : "password"} 
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="h-11 rounded-lg bg-gray-50 border-gray-100 focus:bg-white transition-all pr-10"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrent(!showCurrent)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#062D1B]"
                      >
                        {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                 </div>
                 
                 <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <Label className="text-xs font-bold text-[#062D1B]">New Password</Label>
                        <div className="relative">
                          <Input 
                            type={showNew ? "text" : "password"} 
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="h-11 rounded-lg bg-gray-50 border-gray-100 focus:bg-white transition-all pr-10"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNew(!showNew)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#062D1B]"
                          >
                            {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          </button>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                       <Label className="text-xs font-bold text-[#062D1B]">Confirm New Password</Label>
                        <div className="relative">
                          <Input 
                            type={showConfirm ? "text" : "password"} 
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="h-11 rounded-lg bg-gray-50 border-gray-100 focus:bg-white transition-all pr-10"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#062D1B]"
                          >
                            {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          </button>
                        </div>
                    </div>
                 </div>

                 <Button type="submit" disabled={loading} className="rounded-lg h-11 px-8 bg-[#062D1B] text-white hover:opacity-90 font-bold text-xs transition-all gap-2">
                    {loading ? <Loader2 className="size-4 animate-spin" /> : <KeyRound className="size-4" />}
                    Update Password
                 </Button>
              </form>
           </div>
        </div>
      </div>
    </div>
  );
}

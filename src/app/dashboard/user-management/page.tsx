"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  UserPlus, 
  Shield,
  Trash2, 
  Ban, 
  Search, 
  Edit2, 
  Mail,
  User as UserIcon,
  Key,
  CheckCircle2,
  XCircle,
  History,
  X,
  Eye,
  EyeOff
} from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Role {
  id: string;
  name: string;
  slug: string;
}

interface User {
  id: string;
  email: string;
  name: string | null;
  roleId: string;
  userRole: Role;
  isBlocked: boolean;
  createdAt: string;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    roleId: ""
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, rolesRes] = await Promise.all([
        apiClient.get("/admin/users"),
        apiClient.get("/admin/roles")
      ]);
      setUsers(usersRes.data.users);
      setRoles(rolesRes.data.roles);
      
      // Set default roleId for new users if roles are loaded
      if (rolesRes.data.roles.length > 0) {
        const userRole = rolesRes.data.roles.find((r: any) => r.slug === 'user');
        setFormData(prev => ({ 
          ...prev, 
          roleId: userRole?.id || rolesRes.data.roles[0]?.id || "" 
        }));
      }
    } catch (error: any) {
      toast.error("Failed to load user list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.roleId) {
      toast.error("Please select a role");
      return;
    }
    try {
      await apiClient.post("/admin/users", formData);
      toast.success("Account created successfully");
      setIsAddModalOpen(false);
      setFormData(prev => ({ ...prev, email: "", password: "", name: "" }));
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Could not create user");
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      await apiClient.patch(`/admin/users/${selectedUser.id}`, formData);
      toast.success("User details updated");
      setIsEditModalOpen(false);
      setSelectedUser(null);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const handleToggleBlock = async (user: User) => {
    try {
      await apiClient.patch(`/admin/users/${user.id}/block`, { isBlocked: !user.isBlocked });
      toast.success(user.isBlocked ? "User account unblocked" : "User account suspended");
      fetchData();
    } catch (error: any) {
      toast.error("Status change failed");
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user? This will permanently remove their access.")) return;
    try {
      await apiClient.delete(`/admin/users/${id}`);
      toast.success("User removed correctly");
      fetchData();
    } catch (error: any) {
      toast.error("Cleanup failed");
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      password: "", 
      name: user.name || "",
      roleId: user.roleId || ""
    });
    setIsEditModalOpen(true);
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <TooltipProvider>
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Staff & Customers</h1>
          <p className="text-muted-foreground font-medium">Manage user accounts, assign roles, and control access levels.</p>
        </div>
        <Button 
          onClick={() => {
            setFormData(prev => ({ ...prev, email: "", password: "", name: "" }));
            setIsAddModalOpen(true);
          }}
          className="gap-2 rounded-xl h-12 px-6 shadow-sm font-bold text-xs uppercase tracking-widest bg-primary hover:opacity-90 transition-opacity text-white"
        >
          <UserPlus className="h-4 w-4" /> Add User
        </Button>
      </div>

      {/* Main Table Card */}
      <Card className="border-border/50 bg-card rounded-2xl shadow-sm border overflow-hidden">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-border/50 bg-muted/20">
           <div>
              <CardTitle className="text-xl font-bold">User Directory</CardTitle>
              <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 mt-1">
                {filteredUsers.length} Users found
              </CardDescription>
           </div>
           <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
              <Input 
                placeholder="Search by name or email..." 
                className="pl-10 h-11 rounded-xl bg-background border-border/50 focus:ring-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="pl-6 py-4 font-bold uppercase text-[10px] tracking-widest text-muted-foreground/70">Full Name</TableHead>
                <TableHead className="py-4 font-bold uppercase text-[10px] tracking-widest text-muted-foreground/70">Access Role</TableHead>
                <TableHead className="py-4 font-bold uppercase text-[10px] tracking-widest text-muted-foreground/70">Account Status</TableHead>
                <TableHead className="py-4 font-bold uppercase text-[10px] tracking-widest text-muted-foreground/70 text-right pr-12">Date Joined</TableHead>
                <TableHead className="text-right pr-6 py-4 font-bold uppercase text-[10px] tracking-widest text-muted-foreground/70">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [1, 2, 3, 4, 5].map((i: number) => (
                  <TableRow key={i} className="border-border/50">
                    <TableCell className="pl-6 py-6"><Skeleton className="h-4 w-32 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-48 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell className="pr-12 text-right"><Skeleton className="h-6 w-16 rounded-full ml-auto" /></TableCell>
                    <TableCell className="pr-6 text-right"><Skeleton className="h-10 w-10 ml-auto rounded-xl" /></TableCell>
                  </TableRow>
                ))
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                   <TableCell colSpan={5} className="h-32 text-center text-muted-foreground font-medium italic">
                     No users found. Try adjusting your search.
                   </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user: User) => (
                  <TableRow key={user.id} className="border-border/50 group hover:bg-muted/10 transition-colors">
                    <TableCell className="pl-6 py-5">
                       <div className="flex items-center gap-4">
                          <div className={cn(
                            "h-11 w-11 rounded-full flex items-center justify-center font-bold text-lg border",
                            user.userRole?.slug === 'admin' ? "bg-primary/10 text-primary border-primary/20" : "bg-muted text-muted-foreground border-border"
                          )}>
                             {(user.name?.[0] || user.email[0]).toUpperCase()}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-sm text-foreground truncate">{user.name || "Customer"}</span>
                            <span className="text-xs text-muted-foreground truncate flex items-center gap-1.5 mt-0.5">
                              <Mail className="h-3 w-3 opacity-50" /> {user.email}
                            </span>
                          </div>
                       </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        "rounded-lg px-2.5 py-1 font-black text-[9px] uppercase tracking-wider",
                        user.userRole?.slug === 'admin' ? "bg-primary/5 text-primary border-primary/20" :
                        user.userRole?.slug === 'manager' ? "bg-blue-500/5 text-blue-500 border-blue-500/20" :
                        user.userRole?.slug === 'content_manager' ? "bg-amber-500/5 text-amber-500 border-amber-500/20" :
                        "bg-muted text-muted-foreground"
                      )}>
                        {user.userRole?.name || "Customer"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.isBlocked ? (
                        <div className="flex items-center gap-2 text-rose-500 font-bold text-[9px] uppercase italic">
                          <XCircle className="h-3 w-3" /> Blocked
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-emerald-500 font-bold text-[9px] uppercase">
                          <CheckCircle2 className="h-3 w-3" /> Active
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-[11px] font-bold text-right pr-12 italic">
                       <div className="flex items-center justify-end gap-2">
                          <History className="size-3 opacity-30" />
                          {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                       </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                              onClick={() => openEditModal(user)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-slate-900 text-white border-none font-bold text-[10px] uppercase tracking-wider">
                            Edit User
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className={cn(
                                "h-8 w-8 rounded-lg transition-colors",
                                user.isBlocked 
                                  ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" 
                                  : "hover:bg-amber-50 hover:text-amber-600"
                              )}
                              onClick={() => handleToggleBlock(user)}
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-slate-900 text-white border-none font-bold text-[10px] uppercase tracking-wider">
                            {user.isBlocked ? "Restore Access" : "Block User"}
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-colors"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-rose-600 text-white border-none font-bold text-[10px] uppercase tracking-wider">
                            Delete User
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add User Sheet */}
      <Sheet open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <SheetContent side="right" className="sm:max-w-[450px] p-0 overflow-hidden border-l border-border/40 bg-white/95 backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleCreateUser} className="h-full flex flex-col">
            <div className="bg-slate-950 px-8 py-8 text-white flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-5">
                <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <SheetTitle className="text-2xl font-black tracking-tight text-white">Add New User</SheetTitle>
                  <p className="text-white/40 text-[11px] font-bold uppercase tracking-wider">Create a new account</p>
                </div>
              </div>
              <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)} className="text-white/30 hover:text-white hover:bg-white/5 rounded-lg h-9 w-9 p-0 transition-all">
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-12 bg-white/50">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2.5">
                  <Label htmlFor="create-name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Full Name</Label>
                  <div className="relative group">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                    <Input 
                      id="create-name" 
                      placeholder="John Doe" 
                      className="rounded-xl h-11 bg-white border-neutral-200/60 pl-11 font-bold text-sm shadow-sm focus:ring-4 focus:ring-primary/5 transition-all"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="create-email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Email</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                    <Input 
                      id="create-email" 
                      type="email" 
                      placeholder="john@example.com" 
                      className="rounded-xl h-11 bg-white border-neutral-200/60 pl-11 font-bold text-sm shadow-sm focus:ring-4 focus:ring-primary/5 transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2.5">
                  <Label htmlFor="create-password" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Password</Label>
                  <div className="relative group">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                    <Input 
                      id="create-password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••"
                      className="rounded-xl h-11 bg-white border-neutral-200/60 pl-11 pr-11 font-bold text-sm shadow-sm focus:ring-4 focus:ring-primary/5 transition-all"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="create-role" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Role</Label>
                  {roles.length > 0 ? (
                    <Select key={formData.roleId} value={formData.roleId} onValueChange={(v: string) => setFormData({...formData, roleId: v})}>
                      <SelectTrigger id="create-role" className="rounded-xl h-11 bg-white border-neutral-200/60 px-5 font-bold text-sm shadow-sm focus:ring-4 focus:ring-primary/5 transition-all">
                        <SelectValue placeholder="Select role">
                          {roles.find(r => r.id === formData.roleId)?.name}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-neutral-200/60 shadow-2xl p-2 bg-white">
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id} className="font-bold py-3 px-4 rounded-lg cursor-pointer">
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="h-11 rounded-xl bg-muted animate-pulse" />
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-neutral-100 bg-white flex gap-4 items-center justify-end">
              <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)} className="h-11 px-6 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:bg-neutral-50">
                Cancel
              </Button>
              <Button type="submit" className="h-11 px-10 rounded-xl bg-slate-950 text-white shadow-xl shadow-slate-950/10 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-900 active:scale-[0.98] transition-all">
                Create User
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      {/* Edit User Sheet */}
      <Sheet open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <SheetContent side="right" className="sm:max-w-[450px] p-0 overflow-hidden border-l border-border/40 bg-white/95 backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleUpdateUser} className="h-full flex flex-col">
            <div className="bg-primary px-8 py-8 text-white flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="h-10 w-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white">
                  <Edit2 className="h-5 w-5" />
                </div>
                <div>
                  <SheetTitle className="text-2xl font-black tracking-tight text-white">Edit User</SheetTitle>
                  <p className="text-white/60 text-[11px] font-bold uppercase tracking-wider">Update user details</p>
                </div>
              </div>
              <Button type="button" variant="ghost" onClick={() => setIsEditModalOpen(false)} className="text-white/30 hover:text-white hover:bg-white/5 rounded-lg h-9 w-9 p-0 transition-all">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-12 bg-white/50">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2.5">
                  <Label htmlFor="edit-name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Full Name</Label>
                  <div className="relative group">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                    <Input 
                      id="edit-name" 
                      className="rounded-xl h-11 bg-white border-neutral-200/60 pl-11 font-bold text-sm shadow-sm focus:ring-4 focus:ring-primary/5 transition-all"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="edit-email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Email</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                    <Input 
                      id="edit-email" 
                      type="email" 
                      className="rounded-xl h-11 bg-white border-neutral-200/60 pl-11 font-bold text-sm shadow-sm focus:ring-4 focus:ring-primary/5 transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2.5">
                  <Label htmlFor="edit-password" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">New Password</Label>
                  <div className="relative group">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                    <Input 
                      id="edit-password" 
                      type={showEditPassword ? "text" : "password"} 
                      placeholder="•••••••• (Optional)"
                      className="rounded-xl h-11 bg-white border-neutral-200/60 pl-11 pr-11 font-bold text-sm shadow-sm focus:ring-4 focus:ring-primary/5 transition-all"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                    <button
                      type="button"
                      onClick={() => setShowEditPassword(!showEditPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-primary transition-colors"
                    >
                      {showEditPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="edit-role" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Role</Label>
                  {roles.length > 0 ? (
                    <Select key={`edit-${formData.roleId}`} value={formData.roleId} onValueChange={(v: string) => setFormData({...formData, roleId: v})}>
                      <SelectTrigger id="edit-role" className="rounded-xl h-11 bg-white border-neutral-200/60 px-5 font-bold text-sm shadow-sm focus:ring-4 focus:ring-primary/5 transition-all">
                        <SelectValue placeholder="Select role">
                          {roles.find(r => r.id === formData.roleId)?.name}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-neutral-200/60 shadow-2xl p-2 bg-white">
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id} className="font-bold py-3 px-4 rounded-lg cursor-pointer">
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="h-11 rounded-xl bg-muted animate-pulse" />
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-neutral-100 bg-white flex gap-4 items-center justify-end">
              <Button type="button" variant="ghost" onClick={() => setIsEditModalOpen(false)} className="h-11 px-6 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:bg-neutral-50">
                Cancel
              </Button>
              <Button type="submit" className="h-11 px-10 rounded-xl bg-primary text-white shadow-xl shadow-primary/10 font-black text-[10px] uppercase tracking-[0.2em] hover:opacity-90 active:scale-[0.98] transition-all">
                Save Changes
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
    </TooltipProvider>
  );
}

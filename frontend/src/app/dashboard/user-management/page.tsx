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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  MoreHorizontal, 
  UserPlus, 
  Shield, 
  Trash2, 
  Ban, 
  Search, 
  Edit2, 
  Key, 
  User as UserIcon,
  Mail,
  CheckCircle2,
  XCircle,
  History
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
  role: Role;
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
        setFormData(prev => ({ 
          ...prev, 
          roleId: rolesRes.data.roles.find((r: any) => r.slug === 'user')?.id || rolesRes.data.roles[0].id 
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
      roleId: user.roleId
    });
    setIsEditModalOpen(true);
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
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
          className="gap-2 rounded-xl h-12 px-6 shadow-sm font-bold text-xs uppercase tracking-widest bg-primary hover:opacity-90 transition-opacity"
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
                            user.role?.slug === 'admin' ? "bg-primary/10 text-primary border-primary/20" : "bg-muted text-muted-foreground border-border"
                          )}>
                             {user.name?.[0].toUpperCase() || user.email[0].toUpperCase()}
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
                        user.role?.slug === 'admin' ? "bg-primary/5 text-primary border-primary/20" :
                        user.role?.slug === 'manager' ? "bg-blue-500/5 text-blue-500 border-blue-500/20" :
                        user.role?.slug === 'content_manager' ? "bg-amber-500/5 text-amber-500 border-amber-500/20" :
                        "bg-muted text-muted-foreground"
                      )}>
                        {user.role?.name || "Customer"}
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 p-1.5 rounded-[1.5rem] border-border/50 shadow-xl overflow-hidden">
                          <DropdownMenuLabel className="font-black text-[9px] uppercase tracking-widest text-muted-foreground/60 px-4 py-3">Account Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator className="opacity-40" />
                          <DropdownMenuItem onClick={() => openEditModal(user)} className="gap-3 rounded-xl py-4 px-4 cursor-pointer">
                            <Edit2 className="h-4 w-4 text-primary" /> <span className="font-bold text-sm">Edit Account</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleBlock(user)} className={cn(
                            "gap-3 rounded-xl py-4 px-4 cursor-pointer",
                            user.isBlocked ? "text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50" : "text-rose-600 focus:text-rose-600 focus:bg-rose-50"
                          )}>
                            <Ban className="h-4 w-4" /> <span className="font-bold text-sm">{user.isBlocked ? "Restore Access" : "Restrict Access"}</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="opacity-40" />
                          <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} className="gap-3 rounded-xl py-4 px-4 cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-50">
                            <Trash2 className="h-4 w-4" /> <span className="font-bold text-sm">Delete User</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add User Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[450px] rounded-[2rem] p-0 overflow-hidden border-none shadow-sharcly">
          <form onSubmit={handleCreateUser} className="bg-white">
            <DialogHeader className="p-10 pb-0 space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <UserPlus className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-3xl font-heading font-black tracking-tight leading-none">Add New User</DialogTitle>
                <DialogDescription className="font-medium text-primary/40 mt-3 italic">
                  Create a new staff or customer account with specific permissions.
                </DialogDescription>
              </div>
              <Separator />
            </DialogHeader>
            <div className="grid gap-8 p-10 py-10">
              <div className="grid gap-2">
                <Label htmlFor="create-name" className="text-[10px] font-black uppercase tracking-widest text-primary/30 pl-1">Full Name</Label>
                <Input 
                  id="create-name" 
                  placeholder="e.g. Samuel Green" 
                  className="rounded-2xl h-14 bg-sage/5 border-black/5 px-6 font-bold"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="create-email" className="text-[10px] font-black uppercase tracking-widest text-primary/30 pl-1">Email Address</Label>
                <Input 
                  id="create-email" 
                  type="email" 
                  placeholder="name@example.com" 
                  className="rounded-2xl h-14 bg-sage/5 border-black/5 px-6 font-bold"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="create-password" className="text-[10px] font-black uppercase tracking-widest text-primary/30 pl-1">Password</Label>
                <Input 
                  id="create-password" 
                  type="password" 
                  className="rounded-2xl h-14 bg-sage/5 border-black/5 px-6 font-bold"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="create-role" className="text-[10px] font-black uppercase tracking-widest text-primary/30 pl-1">Assign Role</Label>
                <Select value={formData.roleId} onValueChange={(v: string) => setFormData({...formData, roleId: v})}>
                  <SelectTrigger id="create-role" className="rounded-2xl h-14 bg-sage/5 border-black/5 px-6 font-bold">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-black/5 shadow-sharcly">
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id} className="font-bold py-4 px-6 rounded-xl m-1">
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="p-10 pt-0">
              <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)} className="rounded-2xl font-black text-xs uppercase tracking-widest text-primary/30">Cancel</Button>
              <Button type="submit" className="rounded-2xl h-14 flex-1 bg-primary text-white shadow-xl font-black text-xs uppercase tracking-[0.2em]">Create User</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[450px] rounded-[2rem] p-0 overflow-hidden border-none shadow-sharcly">
          <form onSubmit={handleUpdateUser} className="bg-white">
            <DialogHeader className="p-10 pb-0 space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Edit2 className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-3xl font-heading font-black tracking-tight">Edit Details</DialogTitle>
                <DialogDescription className="font-medium text-primary/40 mt-3 italic">
                  Update personal data or change the role for {selectedUser?.name || selectedUser?.email}.
                </DialogDescription>
              </div>
              <Separator />
            </DialogHeader>
            <div className="grid gap-8 p-10 py-10">
              <div className="grid gap-2">
                <Label htmlFor="edit-name" className="text-[10px] font-black uppercase tracking-widest text-primary/30 pl-1">Name</Label>
                <Input 
                  id="edit-name" 
                  className="rounded-2xl h-14 bg-sage/5 border-black/5 px-6 font-bold"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email" className="text-[10px] font-black uppercase tracking-widest text-primary/30 pl-1">Email Address</Label>
                <Input 
                  id="edit-email" 
                  type="email" 
                  className="rounded-2xl h-14 bg-sage/5 border-black/5 px-6 font-bold"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="edit-password" className="text-[10px] font-black uppercase tracking-widest text-primary/30 pl-1">New Password</Label>
                  <span className="text-[9px] text-primary/20 font-black uppercase italic">Optional</span>
                </div>
                <Input 
                  id="edit-password" 
                  type="password" 
                  placeholder="Enter new password to change"
                  className="rounded-2xl h-14 bg-sage/5 border-black/5 px-6 font-bold"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role" className="text-[10px] font-black uppercase tracking-widest text-primary/30 pl-1">Access Level</Label>
                <Select value={formData.roleId} onValueChange={(v: string) => setFormData({...formData, roleId: v})}>
                  <SelectTrigger id="edit-role" className="rounded-2xl h-14 bg-sage/5 border-black/5 px-6 font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-black/5 shadow-sharcly">
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id} className="font-bold py-4 px-6 rounded-xl m-1">
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="p-10 pt-0">
              <Button type="button" variant="ghost" onClick={() => setIsEditModalOpen(false)} className="rounded-2xl font-black text-xs uppercase tracking-widest text-primary/30">Close</Button>
              <Button type="submit" className="rounded-2xl h-14 flex-1 bg-primary text-white shadow-xl font-black text-xs uppercase tracking-[0.2em]">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

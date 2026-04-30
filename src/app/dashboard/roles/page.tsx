"use client";

import { useEffect, useState, useMemo } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Shield, 
  Trash2, 
  Edit2, 
  Lock,
  ChevronRight,
  Info,
  Search,
  Filter,
  Users,
  CheckSquare,
  Square,
  Grid,
  AlertTriangle,
  X
} from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface Permission {
  id: string;
  name: string;
  slug: string;
  group: string;
  description: string | null;
}

interface Role {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  permissions: {
    permission: Permission;
  }[];
  _count?: {
    users: number;
  };
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [permSearch, setPermSearch] = useState("");
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  
  // Delete Confirmation state
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    permissionIds: [] as string[]
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rolesRes, permsRes] = await Promise.all([
        apiClient.get("/admin/roles"),
        apiClient.get("/admin/permissions")
      ]);
      setRoles(rolesRes.data.roles);
      setPermissions(permsRes.data.permissions);
    } catch (error: any) {
      toast.error("Failed to load roles and permissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRole) {
        if (editingRole.slug === 'admin') {
           toast.error("Administrator role cannot be modified.");
           return;
        }
        await apiClient.patch(`/admin/roles/${editingRole.id}`, formData);
        toast.success("Role updated successfully");
      } else {
        await apiClient.post("/admin/roles", formData);
        toast.success("New role created");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const executeDeleteRole = async () => {
    if (!roleToDelete) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/admin/roles/${roleToDelete.id}`);
      toast.success("Role deleted successfully");
      setRoleToDelete(null);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete role");
    } finally {
      setIsDeleting(false);
    }
  };

  const openModal = (role: Role | null = null) => {
    if (role) {
      if (role.slug === 'admin') {
         toast.info("The Administrator role is locked for system safety.");
         return;
      }
      setEditingRole(role);
      setFormData({
        name: role.name,
        slug: role.slug,
        description: role.description || "",
        permissionIds: role.permissions.map(p => p.permission.id)
      });
    } else {
      setEditingRole(null);
      setFormData({
        name: "",
        slug: "",
        description: "",
        permissionIds: []
      });
    }
    setPermSearch("");
    setIsModalOpen(true);
  };

  const togglePermission = (id: string) => {
    setFormData(prev => ({
      ...prev,
      permissionIds: prev.permissionIds.includes(id)
        ? prev.permissionIds.filter(pid => pid !== id)
        : [...prev.permissionIds, id]
    }));
  };

  const toggleGroup = (groupName: string, pIds: string[]) => {
    const allSelected = pIds.every(id => formData.permissionIds.includes(id));
    if (allSelected) {
       setFormData(prev => ({
         ...prev,
         permissionIds: prev.permissionIds.filter(id => !pIds.includes(id))
       }));
    } else {
       setFormData(prev => {
         const others = prev.permissionIds.filter(id => !pIds.includes(id));
         return {
           ...prev,
           permissionIds: [...others, ...pIds]
         };
       });
    }
  };

  const filteredPermissions = useMemo(() => {
    return permissions.filter(p => 
      p.name.toLowerCase().includes(permSearch.toLowerCase()) || 
      p.slug.toLowerCase().includes(permSearch.toLowerCase()) ||
      p.group.toLowerCase().includes(permSearch.toLowerCase())
    );
  }, [permissions, permSearch]);

  const groupedPermissions = useMemo(() => {
    const groups: Record<string, Permission[]> = {};
    filteredPermissions.forEach(p => {
      if (!groups[p.group]) groups[p.group] = [];
      groups[p.group].push(p);
    });
    return groups;
  }, [filteredPermissions]);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
           <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                 <Shield className="h-5 w-5" />
              </div>
              <h1 className="text-2xl font-heading font-black tracking-tight text-primary">Roles & Permissions</h1>
           </div>
           <p className="text-primary/40 text-[11px] font-bold uppercase tracking-widest pl-10">Manage user access levels</p>
        </div>
        <Button 
          onClick={() => openModal()}
          className="gap-2 rounded-xl h-11 px-6 shadow-lg shadow-primary/5 font-black text-[9px] uppercase tracking-[0.2em] bg-primary hover:opacity-90 transition-all group"
        >
          <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" /> Add New Role
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <Card className="border-black/[0.03] bg-white rounded-[1.5rem] shadow-organic overflow-hidden">
             <Table>
                <TableHeader className="bg-sage/5">
                  <TableRow className="hover:bg-transparent border-black/[0.03]">
                    <TableHead className="pl-8 py-5 font-black uppercase text-[8px] tracking-[0.2em] text-primary/40">Role Name</TableHead>
                    <TableHead className="py-5 font-black uppercase text-[8px] tracking-[0.2em] text-primary/40">Permissions</TableHead>
                    <TableHead className="py-5 font-black uppercase text-[8px] tracking-[0.2em] text-primary/40">Users</TableHead>
                    <TableHead className="text-right pr-8 py-5 font-black uppercase text-[8px] tracking-[0.2em] text-primary/40">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    [1, 2, 3].map(i => (
                      <TableRow key={i} className="border-black/[0.03]">
                        <TableCell className="pl-8 py-6"><Skeleton className="h-4 w-32 rounded-full" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-48 rounded-full" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-12 rounded-full" /></TableCell>
                        <TableCell className="pr-8 text-right"><Skeleton className="h-9 w-9 ml-auto rounded-lg" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    roles.map((role) => (
                      <TableRow key={role.id} className="border-black/[0.03] group hover:bg-sage/5 transition-colors">
                        <TableCell className="pl-8 py-5">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-extrabold text-sm text-primary flex items-center gap-2">
                              {role.name}
                              {role.slug === 'admin' && <Lock className="h-3 w-3 text-primary/30" />}
                            </span>
                            <span className="text-[8px] font-black text-primary/20 uppercase tracking-widest leading-none">slug: {role.slug}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1.5 max-w-lg">
                            {role.permissions.slice(0, 3).map(p => (
                              <Badge key={p.permission.id} variant="secondary" className="px-2.5 py-0.5 h-5 text-[7px] font-black uppercase tracking-widest bg-sage/10 text-primary/50 border-none rounded-md">
                                {p.permission.name}
                              </Badge>
                            ))}
                            {role.permissions.length > 3 && (
                              <Badge variant="outline" className="px-2 py-0.5 h-5 text-[7px] font-black uppercase tracking-widest border-dashed border-black/10 text-primary/20 rounded-md">
                                +{role.permissions.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                           <div className="flex items-center gap-2">
                              <div className="size-6 rounded-lg bg-primary/5 flex items-center justify-center text-primary/40">
                                 <Users className="h-2.5 w-2.5" />
                              </div>
                              <span className="text-[11px] font-black text-primary/60 tabular-nums">{role._count?.users || 0}</span>
                           </div>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                           <div className="flex justify-end gap-2 translate-x-3 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                disabled={role.slug === 'admin'}
                                onClick={() => openModal(role)}
                                className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-all disabled:opacity-0"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                disabled={role.slug === 'admin'}
                                onClick={() => setRoleToDelete(role)}
                                className="h-8 w-8 rounded-lg hover:bg-red-50 hover:text-red-500 transition-all disabled:opacity-0"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                              {role.slug === 'admin' && (
                                <div className="h-8 flex items-center pr-2">
                                   <Badge className="bg-primary/5 text-primary/40 border-none text-[7px] font-black uppercase tracking-tighter px-2">System Restricted</Badge>
                                </div>
                              )}
                           </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
             </Table>
          </Card>
        </div>

        <div className="space-y-6">
           <Card className="rounded-[1.5rem] border-primary/10 bg-primary/5 shadow-none p-6 space-y-4">
              <div className="flex items-center gap-3 text-primary">
                 <div className="size-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-md shadow-primary/10">
                    <Shield className="h-4 w-4" />
                 </div>
                 <h3 className="text-sm font-black tracking-tight uppercase">User Access</h3>
              </div>
              <p className="text-[10px] font-medium text-primary/40 leading-relaxed italic">
                 Define what different users can do. Permissions control individual features while roles group them together.
              </p>
              <div className="space-y-3 pt-2">
                 {[
                   "Define user roles",
                   "Assign permissions",
                   "Manage staff access"
                 ].map((step, i) => (
                   <div key={i} className="flex gap-3 items-center">
                      <div className="size-5 rounded-md bg-primary/10 flex items-center justify-center text-[8px] font-black text-primary">0{i+1}</div>
                      <p className="text-[10px] font-black uppercase tracking-tighter text-primary/60">{step}</p>
                   </div>
                 ))}
              </div>
           </Card>

           <Card className="rounded-[1.5rem] border-black/[0.03] bg-white p-6">
              <h3 className="text-[9px] font-black uppercase tracking-widest text-primary/40 mb-4 pb-2 border-b border-black/[0.03]">
                 System Roles
              </h3>
              <div className="space-y-2">
                 <div className="p-3 rounded-2xl bg-sage/5 border border-black/[0.03] space-y-1">
                    <code className="text-[10px] font-black text-primary block">admin</code>
                    <p className="text-[8px] font-medium text-primary/30 italic leading-tight">Full system access enabled.</p>
                 </div>
              </div>
           </Card>
        </div>
      </div>

      {/* Role Management Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[80vw] md:max-w-[800px] rounded-[2rem] max-h-[88vh] flex flex-col p-0 overflow-hidden border-none shadow-sharcly">
          <form onSubmit={handleSubmit} className="flex flex-col h-full bg-white">
            <DialogHeader className="p-8 pb-4 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                   <div className="flex items-center gap-2">
                      <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                         <Shield className="h-4 w-4" />
                      </div>
                      <DialogTitle className="text-xl font-heading font-black tracking-tight">{editingRole ? "Edit Role" : "Create New Role"}</DialogTitle>
                   </div>
                </div>
              </div>
              <Separator className="bg-black/[0.03]" />
            </DialogHeader>

            <ScrollArea className="flex-1 px-8">
              <div className="pb-10 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <Label className="text-[8px] font-black uppercase tracking-[0.3em] text-primary/40 pl-1">Name</Label>
                      <Input 
                        placeholder="e.g. Store Manager" 
                        className="rounded-xl h-11 border-black/[0.05] bg-sage/5 focus:bg-white transition-all text-xs font-bold"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-[8px] font-black uppercase tracking-[0.3em] text-primary/40 pl-1">Unique Key (Slug)</Label>
                      <Input 
                        placeholder="e.g. manager" 
                        className="rounded-xl h-11 border-black/[0.05] bg-sage/5 focus:bg-white transition-all font-mono text-[9px] uppercase tracking-widest"
                        value={formData.slug}
                        onChange={(e) => setFormData({...formData, slug: e.target.value})}
                        required
                        disabled={editingRole?.slug === 'admin'}
                      />
                   </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[8px] font-black uppercase tracking-[0.3em] text-primary/40 pl-1">Description</Label>
                  <Input 
                    placeholder="Describe what users with this role can do..." 
                    className="rounded-xl h-11 border-black/[0.05] bg-sage/5 focus:bg-white transition-all text-xs"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="space-y-6 pt-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-black/[0.05] pb-4">
                    <h3 className="text-base font-black tracking-tight flex items-center gap-2">
                      Permissions list <div className="text-[9px] font-black uppercase tracking-widest text-primary/20 italic">{formData.permissionIds.length} Selected</div>
                    </h3>
                    <div className="relative w-full md:w-64">
                       <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3 text-primary/20" />
                       <Input 
                          placeholder="Search permissions..." 
                          className="pl-9 rounded-xl h-10 border-black/[0.05] text-[9px] font-bold"
                          value={permSearch}
                          onChange={(e) => setPermSearch(e.target.value)}
                       />
                    </div>
                  </div>

                  <div className="space-y-10">
                    {Object.entries(groupedPermissions).map(([groupName, groupPerms]) => (
                      <div key={groupName} className="space-y-4">
                        <div className="flex justify-between items-center px-1">
                           <Badge className="bg-primary/5 text-primary border-none font-black text-[7px] tracking-[0.3em] uppercase">
                             {groupName}
                           </Badge>
                           <Button 
                              type="button" 
                              variant="ghost" 
                              onClick={() => toggleGroup(groupName, groupPerms.map(p => p.id))}
                              className="h-6 rounded-lg text-[8px] font-black uppercase tracking-widest text-primary/30 hover:text-primary gap-1.5"
                           >
                              {groupPerms.every(p => formData.permissionIds.includes(p.id)) ? <CheckSquare className="size-2.5" /> : <Square className="size-2.5" />}
                              Select All
                           </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {groupPerms.map((perm) => (
                            <div 
                              key={perm.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                togglePermission(perm.id);
                              }}
                              className={cn(
                                "group p-4 rounded-[1.2rem] border transition-all cursor-pointer flex items-start gap-4 relative overflow-hidden",
                                formData.permissionIds.includes(perm.id) 
                                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/5" 
                                  : "bg-sage/2 border-black/[0.02] hover:bg-sage/5"
                              )}
                            >
                              <div className={cn(
                                "mt-0.5 relative z-10",
                                formData.permissionIds.includes(perm.id) ? "text-white" : "text-primary"
                              )}>
                                 {formData.permissionIds.includes(perm.id) ? <CheckSquare className="size-3.5" /> : <Square className="size-3.5" />}
                              </div>
                              <div className="space-y-1 relative z-10">
                                 <p className="text-[10px] font-black uppercase tracking-widest">{perm.name}</p>
                                 <p className={cn(
                                   "text-[9px] leading-tight italic",
                                   formData.permissionIds.includes(perm.id) ? "text-white/60" : "text-primary/30"
                                 )}>{perm.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>

            <DialogFooter className="p-8 pt-4 bg-sage/5 border-t border-black/[0.03] block">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="h-12 rounded-2xl font-black text-[9px] uppercase tracking-widest text-primary/30 hover:text-primary px-6">Cancel</Button>
                <Button type="submit" className="flex-1 h-12 rounded-2xl bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/10 font-black text-[10px] uppercase tracking-[0.3em] gap-3 group">
                  {editingRole ? "Update Role" : "Add Role"} <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1.5 transition-transform" />
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!roleToDelete} onOpenChange={() => setRoleToDelete(null)}>
        <DialogContent className="sm:max-w-[400px] rounded-[2rem] p-0 overflow-hidden border-none shadow-sharcly">
           <div className="p-8 space-y-6 text-center">
              <div className="size-16 rounded-3xl bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-lg shadow-red-500/10">
                 <AlertTriangle className="size-8" />
              </div>
              <div className="space-y-2">
                 <h2 className="text-xl font-black tracking-tight text-primary">Delete Role?</h2>
                 <p className="text-[11px] font-medium text-primary/40 px-4 leading-relaxed">
                    You are about to delete the <span className="text-primary font-black uppercase italic">"{roleToDelete?.name}"</span> role. This action cannot be undone.
                 </p>
              </div>
              <div className="flex flex-col gap-3">
                 <Button 
                    onClick={executeDeleteRole}
                    disabled={isDeleting}
                    className="h-12 rounded-2xl bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-500/20 font-black text-[10px] uppercase tracking-widest gap-2"
                 >
                    {isDeleting ? "Deleting..." : "Confirm Delete"} <Trash2 className="size-4" />
                 </Button>
                 <Button 
                    variant="ghost" 
                    onClick={() => setRoleToDelete(null)}
                    className="h-12 rounded-2xl font-black text-[9px] uppercase tracking-widest text-primary/20 hover:text-primary"
                 >
                    Nevermind
                 </Button>
              </div>
           </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

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
  Users,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import RoleDrawer from "@/components/admin/RoleDrawer";

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
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  
  // Delete Confirmation state
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
    setEditingRole(role);
    setIsModalOpen(true);
  };


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

      <div className="space-y-6">
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

      {/* Role Management Drawer */}
      <RoleDrawer
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingRole}
        permissions={permissions}
        onSave={async (data) => {
          try {
            if (editingRole) {
              await apiClient.patch(`/admin/roles/${editingRole.id}`, data);
              toast.success("Role updated successfully");
            } else {
              await apiClient.post("/admin/roles", data);
              toast.success("New role created");
            }
            setIsModalOpen(false);
            fetchData();
          } catch (error: any) {
            toast.error(error.response?.data?.message || "Operation failed");
          }
        }}
      />

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

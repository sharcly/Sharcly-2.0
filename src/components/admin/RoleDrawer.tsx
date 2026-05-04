"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  X, 
  Shield, 
  ShieldCheck, 
  Search, 
  CheckSquare, 
  Square, 
  Users, 
  ChevronRight,
  ShieldAlert
} from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

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
}

interface RoleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  initialData: Role | null;
  permissions: Permission[];
}

export default function RoleDrawer({
  isOpen,
  onClose,
  onSave,
  initialData,
  permissions = []
}: RoleDrawerProps) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    permissionIds: [] as string[]
  });
  const [permSearch, setPermSearch] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name,
          slug: initialData.slug,
          description: initialData.description || "",
          permissionIds: initialData.permissions.map(p => p.permission.id)
        });
      } else {
        setFormData({
          name: "",
          slug: "",
          description: "",
          permissionIds: []
        });
      }
      setPermSearch("");
    }
  }, [initialData, isOpen]);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* BACKDROP */}
      <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" onClick={onClose} />

      {/* DRAWER */}
      <div className="relative w-full md:w-[600px] h-full bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-500 font-sans">
        
        {/* MAIN FORM AREA */}
        <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden">
          {/* HEADER */}
          <div className="p-8 pb-4 space-y-4 sticky top-0 bg-white/80 backdrop-blur-md z-20 border-b border-black/[0.05]">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                 <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center shadow-sm">
                       <Shield className="h-5 w-5" />
                    </div>
                    <h2 className="text-2xl font-black tracking-tight text-primary">
                      {initialData ? "Edit Role" : "Create New Role"}
                    </h2>
                 </div>
                 <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest pl-1">
                    {initialData ? `Editing: ${initialData.slug}` : "Setup a new access level"}
                 </p>
              </div>
              <button onClick={onClose} className="size-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all group">
                <X className="size-5 text-gray-400 group-hover:text-gray-900 group-hover:rotate-90 transition-all duration-300" />
              </button>
            </div>
          </div>

          {/* SCROLLABLE CONTENT */}
          <div className="flex-1 overflow-y-auto p-8 pb-32 space-y-12">
            {/* BASIC INFO */}
            <div className="space-y-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 pl-1">Role Name</Label>
                <Input 
                  placeholder="e.g. Manager" 
                  className="rounded-2xl h-14 border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all text-sm font-bold shadow-sm"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 pl-1">Role Slug (Unique)</Label>
                <Input 
                  placeholder="e.g. manager" 
                  className="rounded-2xl h-14 border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all font-mono text-[10px] uppercase tracking-widest shadow-sm"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  required
                  disabled={initialData?.slug === 'admin'}
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 pl-1">Description</Label>
                <Input 
                  placeholder="What can this role do?" 
                  className="rounded-2xl h-14 border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all text-sm shadow-sm"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>

            {/* PERMISSIONS */}
            <div className="space-y-8">
              <div className="flex flex-col gap-6 border-b border-gray-100 pb-8">
                <div className="space-y-1">
                  <h3 className="text-xl font-black tracking-tight text-primary flex items-center gap-4">
                    Permissions 
                    <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] px-3 py-1 rounded-lg">
                      {formData.permissionIds.length} Selected
                    </Badge>
                  </h3>
                  <p className="text-[10px] font-medium text-gray-400 italic">Select the features this role can access.</p>
                </div>
                <div className="relative w-full">
                   <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-gray-300" />
                   <Input 
                      placeholder="Search permissions..." 
                      className="pl-12 rounded-2xl h-12 border-gray-100 bg-gray-50 text-xs font-bold shadow-sm"
                      value={permSearch}
                      onChange={(e) => setPermSearch(e.target.value)}
                   />
                </div>
              </div>

              <div className="space-y-16">
                {Object.entries(groupedPermissions).map(([groupName, groupPerms]) => (
                  <div key={groupName} className="space-y-6">
                    <div className="flex justify-between items-center px-1">
                       <div className="flex items-center gap-3">
                         <div className="size-2 rounded-full bg-primary/20" />
                         <span className="font-black text-[10px] tracking-[0.3em] uppercase text-primary/40">
                           {groupName}
                         </span>
                       </div>
                       <Button 
                          type="button" 
                          variant="ghost" 
                          onClick={() => toggleGroup(groupName, groupPerms.map(p => p.id))}
                          className="h-8 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-300 hover:text-primary hover:bg-gray-100 gap-2 transition-all px-4"
                       >
                          {groupPerms.every(id => formData.permissionIds.includes(id.id)) ? <CheckSquare className="size-3" /> : <Square className="size-3" />}
                          Select All
                       </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {groupPerms.map((perm) => (
                        <div 
                          key={perm.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            togglePermission(perm.id);
                          }}
                          className={cn(
                            "group p-6 rounded-[2rem] border transition-all cursor-pointer flex items-center gap-6 relative overflow-hidden",
                            formData.permissionIds.includes(perm.id) 
                              ? "bg-primary text-white border-primary shadow-xl shadow-primary/20" 
                              : "bg-white border-gray-100 hover:bg-gray-50"
                          )}
                        >
                          <div className={cn(
                            "size-6 flex items-center justify-center rounded-lg border transition-all",
                            formData.permissionIds.includes(perm.id) ? "bg-white text-primary border-white" : "bg-gray-50 border-gray-100 text-transparent"
                          )}>
                             {formData.permissionIds.includes(perm.id) && <CheckSquare className="size-4" />}
                          </div>
                          <div className="space-y-0.5 relative z-10 flex-1">
                             <p className="text-xs font-black uppercase tracking-widest leading-none">{perm.name}</p>
                             <p className={cn(
                                "text-[10px] font-medium leading-tight",
                                formData.permissionIds.includes(perm.id) ? "text-white/50" : "text-gray-400"
                             )}>{perm.description}</p>
                          </div>
                          {formData.permissionIds.includes(perm.id) && (
                            <div className="absolute top-0 right-0 p-3 opacity-5">
                              <Shield className="size-20 -mr-6 -mt-6 rotate-12" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="p-8 pt-6 bg-white border-t border-gray-100 sticky bottom-0 z-30">
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Button type="button" variant="ghost" onClick={onClose} className="h-14 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] text-gray-400 hover:text-gray-900 px-8 transition-all">Cancel</Button>
              <Button 
                onClick={() => onSave(formData)}
                className="flex-1 h-14 rounded-2xl bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/20 font-black text-[12px] uppercase tracking-[0.3em] gap-3 group transition-all"
              >
                {initialData ? "Update Role" : "Confirm & Save"} <ChevronRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

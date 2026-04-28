"use client";

import React, { useState, useEffect } from "react";
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
  Mail,
  CheckCircle2,
  XCircle,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function SettingsUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/admin/users");
      setUsers(response.data.users);
    } catch (error: any) {
      toast.error("Failed to load user directory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Team & Users</h2>
          <p className="text-sm text-neutral-500 font-medium">Oversee system access and management permissions.</p>
        </div>
        <Button className="h-11 px-6 rounded-xl premium-gradient font-bold shadow-lg gap-2">
          <UserPlus className="h-4 w-4" /> Add Member
        </Button>
      </div>

      <Card className="border-black/5 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardHeader className="p-6 border-b border-black/5 bg-neutral-50/50 flex flex-row items-center justify-between">
           <div className="space-y-0.5">
              <CardTitle className="text-lg font-bold">Manage Members</CardTitle>
              <CardDescription className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                {filteredUsers.length} active profiles
              </CardDescription>
           </div>
           <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-300" />
              <Input 
                placeholder="Find member..." 
                className="pl-9 h-10 rounded-xl border-black/5 bg-white text-sm"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
           </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-neutral-50/30">
              <TableRow className="border-black/5">
                <TableHead className="pl-6 py-4 font-black uppercase text-[10px] tracking-widest text-black/40">Profile</TableHead>
                <TableHead className="py-4 font-black uppercase text-[10px] tracking-widest text-black/40">Role Access</TableHead>
                <TableHead className="py-4 font-black uppercase text-[10px] tracking-widest text-black/40">Status</TableHead>
                <TableHead className="pr-6 text-right py-4 font-black uppercase text-[10px] tracking-widest text-black/40">Controls</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [1, 2, 3].map(i => (
                  <TableRow key={i} className="border-black/5">
                    <TableCell className="pl-6 py-5"><Skeleton className="h-10 w-40 rounded-lg" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                    <TableCell className="pr-6 text-right"><Skeleton className="h-9 w-9 ml-auto rounded-lg" /></TableCell>
                  </TableRow>
                ))
              ) : filteredUsers.map(user => (
                <TableRow key={user.id} className="border-black/5 group hover:bg-neutral-50/50 transition-colors">
                  <TableCell className="pl-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">
                        {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-sm text-neutral-900">{user.name || "Anonymous"}</span>
                        <span className="text-[10px] text-neutral-400 font-medium">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="rounded-lg px-2 py-0.5 border-black/10 text-[9px] font-black uppercase tracking-wider">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.isBlocked ? (
                      <span className="flex items-center gap-1.5 text-rose-500 text-[9px] font-black uppercase">
                        <XCircle className="size-3" /> Suspended
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-emerald-500 text-[9px] font-black uppercase">
                        <CheckCircle2 className="size-3" /> Operational
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/5">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 p-2 rounded-xl border-black/5 shadow-xl">
                        <DropdownMenuLabel className="px-2 py-1.5 text-[9px] font-black uppercase tracking-widest text-neutral-400">Administrative</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-black/5" />
                        <DropdownMenuItem className="rounded-lg py-2 gap-2 cursor-pointer font-bold text-xs"><Edit2 className="size-3.5" /> Modify Account</DropdownMenuItem>
                        <DropdownMenuItem className="rounded-lg py-2 gap-2 cursor-pointer font-bold text-xs text-rose-500 focus:bg-rose-50 focus:text-rose-500"><Ban className="size-3.5" /> Revoke Access</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Settings2, RefreshCw, Layers } from "lucide-react";

export default function SettingsPlaceholder({ title, description, icon: Icon = Settings2 }: { title: string, description: string, icon?: any }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">{title}</h2>
          <p className="text-sm text-neutral-500 font-medium">{description}</p>
        </div>
        <Button className="h-11 px-6 rounded-xl premium-gradient font-bold shadow-lg gap-2 border-none">
          <Plus className="h-4 w-4" /> New Entry
        </Button>
      </div>

      <Card className="border-black/5 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardContent className="py-24 text-center space-y-6">
           <div className="size-20 rounded-3xl bg-neutral-50 flex items-center justify-center mx-auto border border-black/5 text-neutral-200">
              <Icon size={40} />
           </div>
           <div className="space-y-2 max-w-sm mx-auto">
              <h3 className="text-lg font-bold text-neutral-900">Setting up {title}</h3>
              <p className="text-sm text-neutral-400 font-medium leading-relaxed">
                 We are preparing the configuration for {title.toLowerCase()}. Your settings will be available to manage here in just a few moments.
              </p>
           </div>
           <Button variant="outline" className="h-10 rounded-xl border-black/5 text-[10px] font-black uppercase tracking-widest gap-2">
              <RefreshCw className="size-3" /> Refresh Page
           </Button>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-3 gap-6 opacity-40">
         {[1,2,3].map(i => (
           <Card key={i} className="h-32 border-black/5 shadow-sm rounded-2xl bg-white border border-dashed flex items-center justify-center p-6">
              <div className="w-full space-y-3">
                 <div className="h-1.5 w-1/2 bg-neutral-100 rounded-full" />
                 <div className="h-1.5 w-3/4 bg-neutral-50 rounded-full" />
              </div>
           </Card>
         ))}
      </div>
    </div>
  );
}

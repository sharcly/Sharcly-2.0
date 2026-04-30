"use client";
import SettingsPlaceholder from "@/components/dashboard/settings-placeholder";
import { Share2 } from "lucide-react";

export default function ChannelsSettingsPage() {
  return (
    <SettingsPlaceholder 
      title="Sales Channels" 
      description="Manage where your products are listed and automate multi-channel sync." 
      icon={Share2}
    />
  );
}

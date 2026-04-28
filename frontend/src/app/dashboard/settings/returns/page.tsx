"use client";
import SettingsPlaceholder from "@/components/dashboard/settings-placeholder";
import { RotateCcw } from "lucide-react";

export default function ReturnsSettingsPage() {
  return (
    <SettingsPlaceholder 
      title="Return Reasons" 
      description="Define and manage why customers return items for better analytics." 
      icon={RotateCcw}
    />
  );
}

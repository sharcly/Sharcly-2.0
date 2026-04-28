"use client";
import SettingsPlaceholder from "@/components/dashboard/settings-placeholder";
import { Undo2 } from "lucide-react";

export default function RefundsSettingsPage() {
  return (
    <SettingsPlaceholder 
      title="Refund Reasons" 
      description="Systematic categorization of refund requests for financial auditing." 
      icon={Undo2}
    />
  );
}

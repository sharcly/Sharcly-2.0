import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default function UnifiedDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout title="Dashboard">
      {children}
    </DashboardLayout>
  );
}

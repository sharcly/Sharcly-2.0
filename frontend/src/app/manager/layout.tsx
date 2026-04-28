import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout title="Management Portal">
      {children}
    </DashboardLayout>
  );
}

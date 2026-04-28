import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout title="My Account">
      {children}
    </DashboardLayout>
  );
}

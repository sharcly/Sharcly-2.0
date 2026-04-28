import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ShoppingBag, 
  Users, 
  ClipboardList, 
  TrendingUp 
} from "lucide-react";

export default function AdminPage() {
  const stats = [
    { title: "Total Revenue", value: "$12,450.00", icon: TrendingUp, trend: "+12.5%" },
    { title: "Active Users", value: "1,240", icon: Users, trend: "+3.2%" },
    { title: "New Orders", value: "48", icon: ClipboardList, trend: "+8.4%" },
    { title: "Products", value: "156", icon: ShoppingBag, trend: "0%" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Super Admin. Here's what's happening today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-primary/10 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-primary font-medium">{stat.trend}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-primary/10">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>No recent activity to show.</p>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3 border-primary/10">
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="flex items-center gap-2">
               <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
               <span className="text-sm font-medium">All systems operational</span>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

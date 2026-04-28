import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ShoppingBag, 
  MapPin, 
  Settings, 
  CreditCard 
} from "lucide-react";

export default function AccountPage() {
  const quickLinks = [
    { title: "My Orders", icon: ShoppingBag, href: "/account/orders", desc: "View your order history" },
    { title: "Saved Addresses", icon: MapPin, href: "/account/addresses", desc: "Manage your shipping locations" },
    { title: "Payment Methods", icon: CreditCard, href: "/account/payments", desc: "Manage your cards and credits" },
    { title: "Account Settings", icon: Settings, href: "/account/profile", desc: "Update your personal information" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
        <p className="text-muted-foreground">Manage your orders and personal settings.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {quickLinks.map((link) => (
          <Card key={link.title} className="group hover:bg-muted/50 transition-all border-primary/10 cursor-pointer overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <link.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{link.title}</h3>
                  <p className="text-sm text-muted-foreground">{link.desc}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-primary/10 overflow-hidden">
        <CardHeader className="bg-muted/30">
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-8 text-center text-muted-foreground">
            <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>You haven't placed any orders yet.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

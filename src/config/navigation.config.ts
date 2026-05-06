import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  ClipboardList,
  Tags,
  Layers,
  Ticket,
  DollarSign,
  BookOpen,
  Mail,
  FileText,
  UserCog,
  MessageSquare,
  User,
  LogOut,
  Settings,
  ShieldCheck,
  Globe,
  Gift,
  BarChart3,
  HelpCircle,
  Truck
} from "lucide-react";

export type Role = "admin" | "super_admin" | "manager" | "content_manager" | "user";

export interface NavItem {
  label: string;
  href: string;
  icon: any;
  allowedRoles: Role[];
  requiredPermission?: string;
  category?: string;
  children?: NavItem[];
}

export const navigationConfig: NavItem[] = [
  // OVERVIEW
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    allowedRoles: ["admin", "super_admin", "manager", "content_manager"],
    requiredPermission: "dashboard.view",
    category: "Overview"
  },
  {
    label: "Sales Analytics",
    href: "/dashboard/sales",
    icon: BarChart3,
    allowedRoles: ["admin", "super_admin", "manager"],
    requiredPermission: "sales.view",
    category: "Overview"
  },

  // CATALOG
  {
    label: "Products",
    href: "/dashboard/products",
    icon: ShoppingBag,
    allowedRoles: ["admin", "super_admin", "manager"],
    requiredPermission: "products.view",
    category: "Catalog"
  },

  // COMMERCE
  {
    label: "Orders",
    href: "/dashboard/orders",
    icon: ClipboardList,
    allowedRoles: ["admin", "super_admin", "manager"],
    requiredPermission: "orders.view",
    category: "Commerce"
  },
  // MANAGEMENT
  {
    label: "User Management",
    href: "/dashboard/user-management",
    icon: UserCog,
    allowedRoles: ["admin", "super_admin"],
    requiredPermission: "users.view",
    category: "Management"
  },
  {
    label: "Roles & Permissions",
    href: "/dashboard/roles",
    icon: ShieldCheck,
    allowedRoles: ["admin", "super_admin"],
    requiredPermission: "roles.view",
    category: "Management"
  },

  // CONTENT
  {
    label: "Blogs",
    href: "/dashboard/blogs",
    icon: BookOpen,
    allowedRoles: ["admin", "super_admin", "manager", "content_manager"],
    requiredPermission: "blogs.view",
    category: "Content"
  },
  {
    label: "Page Content",
    href: "/dashboard/content",
    icon: LayoutDashboard,
    allowedRoles: ["admin", "super_admin", "content_manager"],
    requiredPermission: "content.view",
    category: "Content"
  },
  {
    label: "SEO Manager",
    href: "/dashboard/seo",
    icon: Globe,
    allowedRoles: ["admin", "super_admin", "content_manager"],
    requiredPermission: "seo.view",
    category: "Content"
  },
  {
    label: "Contact Messages",
    href: "/dashboard/messages",
    icon: Mail,
    allowedRoles: ["admin", "super_admin"],
    requiredPermission: "messages.view",
    category: "Content"
  },
  {
    label: "Testimonials",
    href: "/dashboard/testimonials",
    icon: MessageSquare,
    allowedRoles: ["admin", "manager"],
    category: "Content"
  },
  {
    label: "FAQs",
    href: "/dashboard/faqs",
    icon: HelpCircle,
    allowedRoles: ["admin", "super_admin", "content_manager"],
    category: "Content"
  },
  {
    label: "Shipping & Returns",
    href: "/dashboard/content?p=shipping",
    icon: Truck,
    allowedRoles: ["admin", "super_admin", "content_manager"],
    category: "Content"
  },
  {
    label: "Privacy Policy",
    href: "/dashboard/content?p=privacy",
    icon: ShieldCheck,
    allowedRoles: ["admin", "super_admin", "content_manager"],
    category: "Content"
  },
  {
    label: "Terms of Service",
    href: "/dashboard/content?p=terms",
    icon: FileText,
    allowedRoles: ["admin", "super_admin", "content_manager"],
    category: "Content"
  },
  {
    label: "Cookie Policy",
    href: "/dashboard/content?p=cookies",
    icon: Globe,
    allowedRoles: ["admin", "super_admin", "content_manager"],
    category: "Content"
  },

  // BUSINESS
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    allowedRoles: ["admin", "super_admin", "manager"],
    requiredPermission: "settings.view",
    category: "Business"
  },
  {
    label: "Wholesale Enquiries",
    href: "/dashboard/wholesale",
    icon: FileText,
    allowedRoles: ["admin", "super_admin"],
    requiredPermission: "wholesale.view",
    category: "Business"
  },

  // MARKETING
  {
    label: "Welcome Offers",
    href: "/dashboard/marketing/offers",
    icon: Gift,
    allowedRoles: ["admin", "super_admin", "manager"],
    requiredPermission: "offers.view",
    category: "Marketing"
  },
  {
    label: "Offer Claims",
    href: "/dashboard/marketing/claims",
    icon: Users,
    allowedRoles: ["admin", "super_admin", "manager"],
    requiredPermission: "claims.view",
    category: "Marketing"
  },
  {
    label: "Newsletter Subscribers",
    href: "/dashboard/marketing/subscribers",
    icon: Mail,
    allowedRoles: ["admin", "super_admin", "manager"],
    category: "Marketing"
  },

  // CUSTOMER ACCOUNT
  {
    label: "Profile",
    href: "/account/profile",
    icon: User,
    allowedRoles: ["user"],
    category: "Account"
  },
  {
    label: "Orders",
    href: "/account/orders",
    icon: ClipboardList,
    allowedRoles: ["user"],
    category: "Account"
  },
  {
    label: "Security",
    href: "/account/security",
    icon: Settings,
    allowedRoles: ["user"],
    category: "Account"
  },
];

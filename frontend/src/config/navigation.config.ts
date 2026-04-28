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
  Globe
} from "lucide-react";

export type Role = "admin" | "manager" | "content_manager" | "user";

export interface NavItem {
  label: string;
  href: string;
  icon: any;
  allowedRoles: Role[];
  category?: string;
  children?: NavItem[];
}

export const navigationConfig: NavItem[] = [
  // OVERVIEW
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    allowedRoles: ["admin", "manager", "content_manager"],
    category: "Overview"
  },

  // CATALOG
  {
    label: "Products",
    href: "/dashboard/products",
    icon: ShoppingBag,
    allowedRoles: ["admin", "manager"],
    category: "Catalog"
  },

  // COMMERCE
  {
    label: "Orders",
    href: "/dashboard/orders",
    icon: ClipboardList,
    allowedRoles: ["admin", "manager"],
    category: "Commerce"
  },
  // MANAGEMENT
  {
    label: "User Management",
    href: "/dashboard/user-management",
    icon: UserCog,
    allowedRoles: ["admin"],
    category: "Management"
  },
  {
    label: "Roles & Permissions",
    href: "/dashboard/roles",
    icon: ShieldCheck,
    allowedRoles: ["admin"],
    category: "Management"
  },

  // CONTENT
  {
    label: "Blogs",
    href: "/dashboard/blogs",
    icon: BookOpen,
    allowedRoles: ["admin", "manager", "content_manager"],
    category: "Content"
  },
  {
    label: "Page Content",
    href: "/dashboard/content",
    icon: LayoutDashboard,
    allowedRoles: ["admin", "content_manager"],
    category: "Content"
  },
  {
    label: "SEO Manager",
    href: "/dashboard/seo",
    icon: Globe,
    allowedRoles: ["admin", "content_manager"],
    category: "Content"
  },
  {
    label: "Contact Messages",
    href: "/dashboard/messages",
    icon: Mail,
    allowedRoles: ["admin"],
    category: "Content"
  },

  // BUSINESS
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    allowedRoles: ["admin", "manager"],
    category: "Business"
  },
  {
    label: "Wholesale Enquiries",
    href: "/dashboard/wholesale",
    icon: FileText,
    allowedRoles: ["admin"],
    category: "Business"
  },

  // COMMUNICATION
  {
    label: "Messages",
    href: "/dashboard/inbox",
    icon: MessageSquare,
    allowedRoles: ["admin", "manager"],
    category: "Communication"
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
  // {
  //   label: "Logout",
  //   href: "/logout",
  //   icon: LogOut,
  //   allowedRoles: ["user", "admin", "manager", "content_manager"],
  //   category: "Account"
  // }
];

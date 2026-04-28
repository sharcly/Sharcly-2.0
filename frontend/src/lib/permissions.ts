import { Role, navigationConfig } from "@/config/navigation.config";

export function canAccess(role: Role, path: string): boolean {
  // Public paths or paths that don't match our dashboard structure
  if (!path.startsWith("/dashboard") && !path.startsWith("/account")) {
    return true;
  }

  // Find the nav item that matches this path (or a parent of it)
  const item = navigationConfig.find(nav => path.startsWith(nav.href));
  
  if (!item) {
    // If not found in config, default to true for now or customize based on prefix
    if (path.startsWith("/dashboard")) return role === "admin" || role === "manager" || role === "content_manager";
    if (path.startsWith("/account")) return role === "user" || role === "admin";
    return true;
  }

  return item.allowedRoles.includes(role);
}

export function getVisibleNavItems(role: Role) {
  return navigationConfig.filter(item => item.allowedRoles.includes(role));
}

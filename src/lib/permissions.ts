import { Role, navigationConfig } from "@/config/navigation.config";

export function canAccess(role: Role, path: string): boolean {
  console.log(`[Permissions] Checking access for role: ${role}, path: ${path}`);
  
  // Super admin has access to EVERYTHING
  if (role === "super_admin") return true;

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

export function getVisibleNavItems(user: { role: Role; permissions: string[] }) {
  // Super admin sees EVERYTHING
  if (user.role === "super_admin") return navigationConfig;

  return navigationConfig.filter(item => {
    // Check if the role is allowed
    const isRoleAllowed = item.allowedRoles.includes(user.role);
    if (!isRoleAllowed) return false;

    // If a specific permission is required, check if user has it
    if (item.requiredPermission) {
      return user.permissions.includes(item.requiredPermission);
    }

    return true;
  });
}

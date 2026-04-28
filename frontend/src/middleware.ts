import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { canAccess } from "@/lib/permissions";
import { Role } from "@/config/navigation.config";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths
  if (
    pathname === "/login" || 
    pathname === "/register" || 
    pathname === "/" || 
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value as Role | undefined;

  // Protect dashboard routes
  const isDashboardPath = 
    pathname.startsWith("/dashboard") || 
    pathname.startsWith("/account");

  if (isDashboardPath) {
    if (!token || !role) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    if (!canAccess(role, pathname)) {
      // Redirect to their default dashboard if they try to access something unauthorized
      let redirectUrl = "/login";
      if (role === "admin" || role === "manager") redirectUrl = "/dashboard";
      else if (role === "content_manager") redirectUrl = "/dashboard/blogs";
      else if (role === "user") redirectUrl = "/account/orders";
      
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

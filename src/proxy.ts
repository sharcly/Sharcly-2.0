import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { canAccess } from "@/lib/permissions";
import { Role } from "@/config/navigation.config";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback_access_secret"
);

// Verify JWT token signature and expiry
async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths — no auth needed
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

  // Get token from cookie (set by frontend login) or httpOnly cookie (set by backend)
  const token =
    request.cookies.get("token")?.value ||
    request.cookies.get("access_token")?.value;
  const role = request.cookies.get("role")?.value as Role | undefined;

  // Protect dashboard and account routes
  const isDashboardPath =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/account");

  if (isDashboardPath) {
    // Check token exists
    if (!token || !role) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    // Verify JWT signature and expiry
    const isValid = await verifyToken(token);
    if (!isValid) {
      // Check if we have a refresh token. If we do, don't redirect yet.
      // Let the frontend interceptor attempt a refresh on the first API call.
      const hasRefreshToken = 
        request.cookies.get("refreshToken")?.value || 
        request.cookies.get("refresh_token")?.value;

      if (!hasRefreshToken) {
        console.warn(`[Middleware] No valid token or refresh token for path: ${pathname}`);
        const url = new URL("/login", request.url);
        url.searchParams.set("callbackUrl", pathname);
        const response = NextResponse.redirect(url);
        // Clear invalid cookies
        response.cookies.delete("token");
        response.cookies.delete("role");
        return response;
      }
      // If we HAVE a refresh token, we allow the page to load so the interceptor can work.
    }

    // Check role-based access
    if (!canAccess(role, pathname)) {
      console.warn(`[Middleware] Access denied for role: ${role} to path: ${pathname}`);
      
      let redirectUrl = "/login";
      if (role === "admin" || role === "super_admin" || role === "manager") redirectUrl = "/dashboard";
      else if (role === "content_manager") redirectUrl = "/dashboard/blogs";
      else if (role === "user") redirectUrl = "/account/orders";

      // Prevent infinite redirect loops if already at the target redirect URL
      if (pathname === redirectUrl) {
        return NextResponse.next();
      }

      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

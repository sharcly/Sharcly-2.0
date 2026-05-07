import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

/**
 * Decodes the role from the signed access_token JWT.
 * Falls back to the plain 'role' cookie ONLY if no access_token is present
 * (e.g., on initial load before backend cookie is set).
 * 
 * SECURITY: Never trust the plain 'role' cookie alone — users can set it manually.
 * The access_token is httpOnly (JS cannot read it) and is signed by the backend.
 */
async function getRoleFromRequest(request: NextRequest): Promise<string | null> {
  const accessToken = request.cookies.get('access_token')?.value

  if (accessToken) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || '')
      const { payload } = await jwtVerify(accessToken, secret)
      return (payload.role as string) || null
    } catch {
      // Token invalid/expired — treat as unauthenticated
      return null
    }
  }

  // Fallback: plain cookie (only used as UX hint, real auth is always backend-verified)
  return request.cookies.get('role')?.value || null
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const role = await getRoleFromRequest(request)
  
  // Define protected routes
  const isAdminRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname.startsWith('/manager')
  const isUserRoute = pathname.startsWith('/account') || pathname.startsWith('/checkout')
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register')

  // 1. If trying to access admin dashboard without admin role
  if (isAdminRoute) {
    if (!role || !['admin', 'super_admin', 'manager', 'content_manager'].includes(role)) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // 2. If trying to access user account
  if (isUserRoute) {
    if (!role) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    // Only 'user' role can access /account. Others go to /dashboard.
    if (role !== 'user' && pathname.startsWith('/account')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // 3. If already logged in and trying to access login/register
  if (isAuthRoute) {
    if (role) {
      if (['admin', 'super_admin', 'manager', 'content_manager'].includes(role)) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
      return NextResponse.redirect(new URL('/account', request.url))
    }
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/manager/:path*',
    '/account/:path*',
    '/checkout/:path*',
    '/login',
    '/register',
  ],
}

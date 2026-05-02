import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/request'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const role = request.cookies.get('role')?.value
  
  // Define protected routes
  const isAdminRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname.startsWith('/manager')
  const isUserRoute = pathname.startsWith('/account') || pathname.startsWith('/checkout')
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register')

  // 1. If trying to access admin dashboard without admin role
  if (isAdminRoute) {
    if (!role || !['admin', 'manager', 'content_manager'].includes(role)) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // 2. If trying to access user account without any role (not logged in)
  if (isUserRoute) {
    if (!role) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // 3. If already logged in and trying to access login/register
  if (isAuthRoute) {
    if (role) {
      if (['admin', 'manager', 'content_manager'].includes(role)) {
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

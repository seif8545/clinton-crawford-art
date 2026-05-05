import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1. Let users load the login page without getting bounced
  if (path === '/admin/login') {
    return NextResponse.next();
  }

  // 2. Check if they are logged in. 
  // Next.js uses 'admin_session' (or whatever your specific auth cookie is named)
  const isAuthenticated = request.cookies.has('admin_session'); 

  // 3. If they try to access a protected /admin route and aren't logged in, redirect them
  if (path.startsWith('/admin') && !isAuthenticated) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // Allow all other requests (like the public gallery)
  return NextResponse.next();
}

// This tells Next.js to only run this middleware on /admin routes
export const config = {
  matcher: '/admin/:path*',
}
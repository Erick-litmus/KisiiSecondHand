import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET || "kisii_marketplace_secret_key_fallback_do_not_use_in_prod";
const key = new TextEncoder().encode(secretKey);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Pass the pathname to components via headers (useful for layout logic)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  // 2. Protect Admin Routes
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const adminSession = request.cookies.get('admin_session')?.value;
    const userSession = request.cookies.get('session')?.value;

    let isAuthorized = false;

    // Check Admin Session
    if (adminSession) {
      try {
        const { payload } = await jwtVerify(adminSession, key);
        if (payload && (payload.admin || (payload as any).user?.role === 'ADMIN')) {
          isAuthorized = true;
        }
      } catch (e) {}
    }

    // Check User Session (if they are logged in as a normal user with ADMIN role)
    if (!isAuthorized && userSession) {
      try {
        const { payload } = await jwtVerify(userSession, key);
        if (payload && (payload as any).user?.role === 'ADMIN') {
          isAuthorized = true;
        }
      } catch (e) {}
    }

    if (!isAuthorized) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // 3. Protect User Message Routes
  if (pathname.startsWith('/messages')) {
    const userSession = request.cookies.get('session')?.value;
    if (!userSession) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

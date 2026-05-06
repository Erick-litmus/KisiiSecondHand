import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    // Skip login page
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    // Check for legacy admin session cookie
    const adminSession = request.cookies.get("admin_session")?.value;
    
    // Check for modern user session with ADMIN role
    const sessionCookie = request.cookies.get("session")?.value;
    let isAdminUser = false;
    
    if (sessionCookie) {
      try {
        const session = await decrypt(sessionCookie);
        if (session && session.user && session.user.role === "ADMIN") {
          isAdminUser = true;
        }
      } catch (err) {
        // Session invalid
      }
    }

    if (!adminSession && !isAdminUser) {
      // Redirect to admin login if not authorized
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Pass through pathname for layout usage if needed
  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);
  
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

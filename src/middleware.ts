import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Paths that once logged-in you can not go back to
const guestOnlyPaths = ["/login"];

// Paths that you can navigate to at anytime
const publicPaths = ["/products", "/"];

// Paths that require authentication
const authRequiredPaths = ["/profile", "/logout", "/products/add"];

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  // Skip middleware for static files and API routes
  if (pathname.startsWith("/_next") || pathname.startsWith("/static") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Allow public paths without any restrictions
  if (publicPaths.some((path) => pathname === path)) {
    return NextResponse.next();
  }

  // Redirect authenticated users away from guest-only paths
  if (guestOnlyPaths.some((path) => pathname === path) && accessToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect unauthenticated users to login for protected paths
  if (authRequiredPaths.some((path) => pathname === path) && !accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // For any other routes, allow if authenticated, redirect to home if not
  if (!accessToken && !guestOnlyPaths.some((path) => pathname === path)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
};

// This is a Next.js configuration object that specifies the matcher for the middleware.
export const config = {
  // This matcher will match all paths except for the ones starting with: api, _next/static, _next/image, favicon.ico, sitemap.xml, robots.txt
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};

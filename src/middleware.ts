import { jwtDecode } from "jwt-decode";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { calculateCookieExpires } from "src/lib/utils";

// Paths that once logged-in you can not go back to
const guestOnlyPaths = ["/login", "/refresh-token"];

// Paths that you can navigate to at anytime
const publicPaths = ["/"];

// Paths that require employee roles (also its sub-paths like /dashboard/manage, /dashboard/settings,...e.t.c)
const employeePaths = ["/dashboard", "/dashboard/manage", "/dashboard/settings"];

// Paths that require owner roles
const ownerPaths = ["/dashboard/accounts", "/dashboard/settings"].concat(employeePaths);

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const decodedAccessToken = accessToken ? jwtDecode<{ role: string }>(accessToken) : null;
  const userRole = decodedAccessToken?.role;

  // Redirect to the appropriate dashboard based on the user's role
  if (accessToken && userRole) {
    const isOwnerPath =
      ownerPaths.some((path) => pathname.startsWith(path)) && !employeePaths.some((path) => pathname === path);

    if (userRole === "Employee" && isOwnerPath) {
      return NextResponse.redirect(new URL("/dashboard/manage", request.url));
    }
    return NextResponse.next();
  }

  // Skip middleware for static files and API routes
  if (pathname.startsWith("/_next") || pathname.startsWith("/static") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  if (
    (publicPaths.some((path) => pathname.startsWith(path)) || ownerPaths.some((path) => pathname.startsWith(path))) &&
    !accessToken &&
    refreshToken
  ) {
    
    console.log("cookie refreshToken in middleware", refreshToken);
    const result = await fetch("http://localhost:4000/auth/refresh-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });


    if (result.status === 401) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.set("accessToken", "", {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        path: "/",
        expires: new Date(0), // expire ngay lập tức
      });

      response.cookies.set("refreshToken", "", {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        path: "/",
        expires: new Date(0),
      });
      return response;
    }
    
    const data = await result.json().catch((err) => {
      console.log("Error parsing JSON response:", err);
      return NextResponse.redirect(new URL("/login", request.url));
    });

    // Backend returns { message: string, data: { accessToken: string, refreshToken: string } }
    const newAccessToken = data?.data?.accessToken;
    const newRefreshToken = data?.data?.refreshToken;

    if (newAccessToken && newRefreshToken) {
      const decodedAccessToken = jwtDecode(newAccessToken);
      const decodedRefreshToken = jwtDecode(newRefreshToken);
      const response = NextResponse.next();
      response.cookies.set("accessToken", newAccessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        path: "/",
        expires: calculateCookieExpires(decodedAccessToken.exp as number),
      });
      response.cookies.set("refreshToken", newRefreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        path: "/",
        expires: calculateCookieExpires(decodedRefreshToken.exp as number),
      });
      return response;
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Allow public paths without any restrictions
  if (publicPaths.some((path) => pathname === path)) {
    return NextResponse.next();
  }

  // Redirect authenticated users away from guest-only paths
  if (guestOnlyPaths.some((path) => pathname.startsWith(path)) && accessToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // I WILL GET BACK TO THIS METHOD IF THE NEW ONE BELOW HAS BUGS
  // Redirect users that have left the website a long time ago, but the refresh token inside cookie is still valid
  // if (authRequiredPaths.some((path) => pathname.startsWith(path)) && !accessToken && refreshToken) {
  //   const url = new URL("/refresh-token", request.url);
  //   url.searchParams.set("redirect", pathname);
  //   return NextResponse.redirect(url);
  // }

  // Redirect unauthenticated users to login for protected paths
  if (
    (ownerPaths.some((path) => pathname.startsWith(path)) && !accessToken) ||
    (employeePaths.some((path) => pathname.startsWith(path)) && !accessToken)
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // For any other routes, allow if authenticated, redirect to login if not
  if (!accessToken && !guestOnlyPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
};

// This is a Next.js configuration object that specifies the matcher for the middleware.
export const config = {
  // This matcher will match all paths except for the ones starting with: api, _next/static, _next/image, favicon.ico, sitemap.xml, robots.txt
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};

import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Subroutes belonging to the Admin Control Centre
const ADMIN_SUBROUTES = [
  "bookings",
  "costing",
  "payments",
  "suppliers",
  "fleet",
  "guides",
  "merchandise",
  "cms",
  "receptionist",
  "hunter",
  "seo",
  "settings",
  "packages",
];

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host")?.toLowerCase() || "";
  const pathname = url.pathname;

  // Determine if host is standalone admin deployment (e.g., amber-plains-admin.vercel.app)
  const configuredAdminHost = process.env.ADMIN_HOST?.toLowerCase() || "";
  const isStandaloneAdminHost =
    process.env.NEXT_PUBLIC_STANDALONE_ADMIN === "true" ||
    (configuredAdminHost && hostname.includes(configuredAdminHost)) ||
    hostname.startsWith("admin.") ||
    hostname.startsWith("admin-") ||
    hostname.includes("-admin.") ||
    hostname.includes("admin-amber-plains");

  // Standalone domain root route rewrite to /admin
  let targetPath = pathname;
  if (isStandaloneAdminHost && pathname === "/") {
    targetPath = "/admin";
    url.pathname = "/admin";
  }

  // Handle direct root-level admin subroutes (e.g. /suppliers -> /admin/suppliers)
  const firstSegment = targetPath.split("/")[1];
  const isDirectAdminSubroute = ADMIN_SUBROUTES.includes(firstSegment);
  if (isDirectAdminSubroute) {
    targetPath = `/admin${targetPath}`;
    url.pathname = targetPath;
  }

  const isAdminRoute = targetPath === "/admin" || targetPath.startsWith("/admin/");
  const isLoginRoute = pathname === "/login";

  // Check Supabase session
  const { supabaseResponse, user } = await updateSession(request);

  // If visiting an admin route
  if (isAdminRoute) {
    // 1. Require authenticated user
    if (!user) {
      // In development/build if Supabase is intentionally unconfigured, allow pass-through only with mock warning
      const isConfigured =
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

      if (isConfigured) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }
    } else {
      // 2. Require admin role in app_metadata
      const userRole = user.app_metadata?.role;
      if (userRole !== "admin") {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("error", "unauthorized_role");
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  // If already logged in as admin and visiting /login, redirect to /admin
  if (isLoginRoute && user && user.app_metadata?.role === "admin") {
    const adminUrl = new URL(isStandaloneAdminHost ? "/" : "/admin", request.url);
    return NextResponse.redirect(adminUrl);
  }

  // If rewriting was needed (e.g. /suppliers -> /admin/suppliers or standalone root -> /admin)
  if (url.pathname !== pathname) {
    return NextResponse.rewrite(url, {
      headers: supabaseResponse.headers,
    });
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

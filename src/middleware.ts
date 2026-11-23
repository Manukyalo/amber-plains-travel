import { NextRequest, NextResponse } from "next/server";

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

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host")?.toLowerCase() || "";

  // Check if current hostname is designated for standalone Admin deployment
  // Examples:
  // - "admin.amberplains.co.ke"
  // - "admin-amber-plains.vercel.app"
  // - "amber-plains-admin.vercel.app"
  // - or explicitly configured via ADMIN_HOST / NEXT_PUBLIC_STANDALONE_ADMIN
  const configuredAdminHost = process.env.ADMIN_HOST?.toLowerCase() || "";
  const isStandaloneAdminHost =
    process.env.NEXT_PUBLIC_STANDALONE_ADMIN === "true" ||
    (configuredAdminHost && hostname.includes(configuredAdminHost)) ||
    hostname.startsWith("admin.") ||
    hostname.startsWith("admin-") ||
    hostname.includes("-admin.") ||
    hostname.includes("admin-amber-plains");

  if (isStandaloneAdminHost) {
    // 1. Root route "/" on standalone admin domain rewrites to "/admin"
    if (url.pathname === "/") {
      url.pathname = "/admin";
      return NextResponse.rewrite(url);
    }

    // 2. Direct paths like "/bookings", "/costing", "/payments" rewrite to "/admin/bookings", etc.
    const firstSegment = url.pathname.split("/")[1];
    if (ADMIN_SUBROUTES.includes(firstSegment)) {
      url.pathname = `/admin${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  // Allow request to continue normally
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

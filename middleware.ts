import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Next.js middleware for route protection.
 *
 * This middleware:
 * - Runs on every request before the page/API route is accessed
 * - Refreshes Supabase session and checks authentication
 * - Allows public routes: `/`, `/login`, `/auth/callback`
 * - Protects all other routes by redirecting unauthenticated users to login
 * - Preserves the original destination in the redirect URL
 * - Handles API routes separately (returns 401 instead of redirect)
 */

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/auth/callback"];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Allow public routes without authentication check
  if (isPublicRoute) {
    // Still update session to refresh tokens, but don't block access
    const { response } = await updateSession(request);
    return response;
  }

  // For protected routes, check authentication
  const { response, user } = await updateSession(request);

  // If user is not authenticated, redirect to login
  if (!user) {
    // Handle API routes differently - return 401 instead of redirect
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // For page routes, redirect to login with original destination
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // User is authenticated, allow access
  return response;
}

/**
 * Middleware matcher configuration.
 * Excludes static files, Next.js internals, and common assets.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (if any)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

import { createRouteHandlerClient } from "@/lib/supabase/route-handler";
import { NextRequest, NextResponse } from "next/server";

const SAFE_REDIRECT_PATHS = ["/dashboard", "/builder", "/templates"];
const DEFAULT_REDIRECT = "/dashboard";

/**
 * Validates that a redirect path is safe (internal, known path only).
 * Rejects protocol-relative URLs, absolute URLs, path traversal, and unknown paths.
 */
function getSafeRedirect(redirectTo: string | null): string {
  if (!redirectTo) return DEFAULT_REDIRECT;

  // Reject protocol-relative URLs, absolute URLs, and javascript: URIs
  if (
    redirectTo.startsWith("//") ||
    redirectTo.startsWith("http") ||
    redirectTo.includes("..") ||
    redirectTo.includes(":\\") ||
    redirectTo.toLowerCase().startsWith("javascript:")
  ) {
    return DEFAULT_REDIRECT;
  }

  // Ensure it starts with /
  if (!redirectTo.startsWith("/")) {
    return DEFAULT_REDIRECT;
  }

  // Check against allowlist of known safe paths
  const pathOnly = redirectTo.split("?")[0].split("#")[0];
  if (!SAFE_REDIRECT_PATHS.some((safe) => pathOnly === safe || pathOnly.startsWith(safe + "/"))) {
    return DEFAULT_REDIRECT;
  }

  return redirectTo;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const redirectTo = getSafeRedirect(request.nextUrl.searchParams.get("redirect"));

  if (!code) {
    // No code parameter, redirect to login
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent("Invalid authentication code")}`, request.nextUrl.origin)
    );
  }

  try {
    const { supabase, finalizeResponse } = createRouteHandlerClient(request);
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      // If code exchange fails, redirect to login with error
      return finalizeResponse(
        NextResponse.redirect(
          new URL(
            `/login?error=${encodeURIComponent("Authentication failed. Please try again.")}`,
            request.nextUrl.origin,
          ),
        ),
      );
    }

    // Verify that we have a session after code exchange
    if (!data.session || !data.user) {
      return finalizeResponse(
        NextResponse.redirect(
          new URL(
            `/login?error=${encodeURIComponent("Session creation failed")}`,
            request.nextUrl.origin,
          ),
        ),
      );
    }

    const redirectUrl = new URL(redirectTo, request.nextUrl.origin);
    return finalizeResponse(NextResponse.redirect(redirectUrl));
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent("An unexpected error occurred")}`, request.nextUrl.origin)
    );
  }
}

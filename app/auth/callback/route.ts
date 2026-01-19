import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const redirectTo = request.nextUrl.searchParams.get("redirect") || "/dashboard";

  if (!code) {
    // No code parameter, redirect to login
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent("Invalid authentication code")}`, request.nextUrl.origin)
    );
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      // If code exchange fails, redirect to login with error
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent("Authentication failed. Please try again.")}`, request.nextUrl.origin)
      );
    }

    // Verify that we have a session after code exchange
    if (!data.session || !data.user) {
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent("Session creation failed")}`, request.nextUrl.origin)
      );
    }

    // Next.js automatically includes cookies from cookieStore in the redirect response
    // Request.nextUrl for domain-agnostic redirect (works with custom domains, Vercel previews, localhost)
    const redirectUrl = new URL(redirectTo, request.nextUrl.origin);
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent("An unexpected error occurred")}`, request.nextUrl.origin)
    );
  }
}

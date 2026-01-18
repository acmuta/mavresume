import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const redirectTo = request.nextUrl.searchParams.get("redirect") || "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      // If code exchange fails, redirect to login with error
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent("Authentication failed. Please try again.")}`, request.nextUrl.origin)
      );
    }
  }

  // Redirect to the dashboard or the originally requested page
  // Request.nextUrl for domain-agnostic redirect (works with custom domains, Vercel previews, localhost)
  return NextResponse.redirect(new URL(redirectTo, request.nextUrl.origin));
}

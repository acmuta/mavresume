import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirectTo = requestUrl.searchParams.get("redirect") || "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      // If code exchange fails, redirect to login with error
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent("Authentication failed. Please try again.")}`, requestUrl.origin)
      );
    }
  }

  // Redirect to the dashboard or the originally requested page
  return NextResponse.redirect(new URL(redirectTo, requestUrl.origin));
}

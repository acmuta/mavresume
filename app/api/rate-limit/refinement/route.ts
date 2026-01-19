import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getRefinementLimitStatus } from "@/lib/ratelimit";

/**
 * GET /api/rate-limit/refinement
 *
 * Returns the current refinement rate limit status for the authenticated user
 * without consuming a token. Used by the builder header to show remaining refinements.
 */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { limit, remaining, reset } = await getRefinementLimitStatus(user.id);
  return NextResponse.json({ limit, remaining, reset });
}

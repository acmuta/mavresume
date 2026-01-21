import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getRefinementLimitStatus } from "@/lib/ratelimit";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rateLimit = await getRefinementLimitStatus(user.id);
  return NextResponse.json(rateLimit);
}

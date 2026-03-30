import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

type AuthCookie = {
  name: string;
  value: string;
};

export function createRouteHandlerClient(request: NextRequest) {
  const requestCookies = new Map<string, AuthCookie>(
    request.cookies.getAll().map((cookie) => [
      cookie.name,
      { name: cookie.name, value: cookie.value },
    ]),
  );

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_API_KEY!,
    {
      cookies: {
        getAll() {
          return Array.from(requestCookies.values());
        },
        setAll(cookiesToSet) {
          supabaseResponse = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            if (options.maxAge === 0) {
              requestCookies.delete(name);
            } else {
              requestCookies.set(name, { name, value });
            }

            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const finalizeResponse = (response: NextResponse) => {
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      response.cookies.set(cookie);
    });

    return response;
  };

  return {
    supabase,
    finalizeResponse,
  };
}

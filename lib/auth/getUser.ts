import { redirect } from "next/navigation";
import type { User, Session } from "@supabase/supabase-js";
import { createClient } from "../supabase/server";

export type UserRole = "student" | "reviewer" | "admin";

export type AuthenticatedUser = User & {
  app_metadata: {
    user_role?: UserRole;
    [key: string]: unknown;
  };
};

/**
 * Extracts user role from either app_metadata.user_role (preferred) or the
 * JWT payload's top-level user_role claim. Supabase Auth hooks may add
 * user_role at the JWT root instead of inside app_metadata.
 * TODO: Fix to optimize user role fetching
 */
export function getUserRole(user: User, session: Session | null): UserRole | undefined {
  const fromAppMetadata = user.app_metadata?.user_role as UserRole | undefined;
  if (fromAppMetadata) return fromAppMetadata;

  const accessToken = session?.access_token;
  if (!accessToken) return undefined;

  try {
    const payload = JSON.parse(atob(accessToken.split(".")[1]));
    const fromJwt = payload.user_role as UserRole | undefined;
    if (fromJwt && ["student", "reviewer", "admin"].includes(fromJwt)) return fromJwt;
  } catch {
    /* ignore decode errors */
  }
  return undefined;
}

/**
 * Returns the currently authenticated user, or null if not signed in.
 * Uses supabase.auth.getUser() (validates with Auth server).
 *
 * For role, use getUserRole(user, session) with session from getUserWithSession.
 */
export async function getUser(): Promise<AuthenticatedUser | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  return user as AuthenticatedUser;
}

/**
 * Returns user and session for callers that need the role (e.g. via getUserRole).
 * Uses getUser() for auth; getSession() is only used to read JWT for role claim.
 */
export async function getUserWithSession(): Promise<{
  user: AuthenticatedUser;
  session: Session | null;
} | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  const { data: { session } } = await supabase.auth.getSession();
  return { user: user as AuthenticatedUser, session };
}

// Require the user to have one of the given roles
/**
 * Returns the authenticated user if they have one of the required roles.
 * Redirects automatically if unauthenticated or unauthorized — so the
 * caller always receives a valid user and never needs to null-check.
 *
 * Redirect behaviour:
 *   - Not signed in  → /login  (with ?next= param so they return after auth)
 *   - Wrong role     → /dashboard  (safe fallback for all roles)
 *
 * @example
 * // In a reviewer-only Server Component:
 * const user = await requireRole('reviewer', 'admin')
 *
 * // In a server action:
 * const user = await requireRole('reviewer', 'admin')
 * // guaranteed: user.app_metadata.user_role is 'reviewer' or 'admin'
 */
export async function requireRole(
  ...roles: UserRole[]
): Promise<AuthenticatedUser> {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const { data: { session } } = await supabase.auth.getSession();
  const userRole = getUserRole(user, session);

  if (!userRole || !roles.includes(userRole)) {
    redirect("/dashboard");
  }

  return user as AuthenticatedUser;
}
import { createClient } from "./supabase/client";
import type { AuthError } from "@supabase/supabase-js";
import { useSessionStore } from "@/store/useSessionStore";

// Helper function to map Supabase AuthError to user-friendly messages
function getErrorMessage(error: AuthError | Error | null): string {
  if (!error) return "An unexpected error occurred";

  // Handle AuthError from Supabase
  if ("message" in error && "status" in error) {
    const authError = error as AuthError;
    const message = authError.message.toLowerCase();

    if (message.includes("invalid login credentials") || message.includes("invalid_credentials")) {
      return "Invalid email or password";
    }
    if (message.includes("email not confirmed") || message.includes("email_not_confirmed")) {
      return "Please check your email to confirm your account";
    }
    if (message.includes("user already registered") || message.includes("already registered")) {
      return "An account with this email already exists";
    }
    if (message.includes("password")) {
      return "Password must be at least 6 characters";
    }
    if (message.includes("email")) {
      return "Please enter a valid email address";
    }
    if (message.includes("network") || message.includes("fetch")) {
      return "Connection error. Please try again.";
    }

    return authError.message || "An error occurred during authentication";
  }

  // Handle generic Error
  if (error instanceof Error) {
    if (error.message.includes("network") || error.message.includes("fetch")) {
      return "Connection error. Please try again.";
    }
    return error.message;
  }

  return "An unexpected error occurred";
}

// Sign in with email and password
export async function signInWithEmail(email: string, password: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: getErrorMessage(error), data: null };
  }

  // Update session store on successful sign-in
  if (data.user) {
    useSessionStore.getState().setSession(data.user);
  }

  return { error: null, data };
}


// Sign up with email and password

export async function signUpWithEmail(email: string, password: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: getErrorMessage(error), data: null };
  }

  // Only update session store if there's an actual session
  // When email confirmation is required, signUp returns user but no session
  // In that case, we should NOT set the session store to avoid false authentication
  if (data.session && data.user) {
    useSessionStore.getState().setSession(data.user);
  } else if (data.user) {
    // User created but no session (email confirmation required)
    // Clear any existing session to ensure clean state
    useSessionStore.getState().clearSession();
  }

  return { error: null, data };
}

// Sign in with Google OAuth
export async function signInWithGoogle(redirectTo?: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectTo || `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    return { error: getErrorMessage(error), data: null };
  }

  return { error: null, data };
}

// Sign out the current user
export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: getErrorMessage(error) };
  }

  // Clear session store on successful sign-out
  useSessionStore.getState().clearSession();

  return { error: null };
}

/**
 * Get the current authenticated user
 * Note: For client-side use, prefer using the session store directly.
 * This function is kept for server-side use and compatibility.
 */
export async function getCurrentUser() {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return { error: getErrorMessage(error), user: null };
  }

  return { error: null, user };
}

/**
 * Sync session store with Supabase current session
 * Call this to update the store with the latest auth state from Supabase
 */
export async function syncSession() {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    // Clear store if no valid session
    useSessionStore.getState().clearSession();
    return { error: error ? getErrorMessage(error) : null, user: null };
  }

  // Update store with current user
  useSessionStore.getState().setSession(user);
  return { error: null, user };
}

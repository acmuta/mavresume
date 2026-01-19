import { create } from "zustand";
import type { User } from "@supabase/supabase-js";

/**
 * Centralized state management for user session using Zustand.
 *
 * This store:
 * - Tracks authentication status and user data for UI purposes only
 * - Provides reactive updates when auth state changes
 * - Complements Supabase auth by providing a centralized client-side state
 *
 * Data flow: Auth operation → Supabase → Update store → Components re-render
 *
 * Note: This store is for client-side UI state only. Server-side security
 * checks still use Supabase directly via middleware and API routes.
 * Session is synced from Supabase cookies via useSessionSync hook.
 */

export interface SessionState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  setSession: (user: User | null) => void;
  clearSession: () => void;
  setLoading: (loading: boolean) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  // Initial state
  isAuthenticated: false,
  user: null,
  isLoading: false,

  // Set session with user data
  setSession: (user: User | null) =>
    set({
      isAuthenticated: !!user,
      user,
      isLoading: false,
    }),

  // Clear session (on sign out)
  clearSession: () =>
    set({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    }),

  // Set loading state
  setLoading: (loading: boolean) =>
    set({
      isLoading: loading,
    }),
}));

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSessionStore } from "@/store/useSessionStore";

/**
 * Hook to sync session store with Supabase authentication state.
 *
 * This hook:
 * - Syncs store with Supabase on component mount
 * - Subscribes to Supabase auth state changes
 * - Updates store reactively when auth state changes
 * - Cleans up subscription on unmount
 *
 * Usage: Add this hook to any component that needs to stay in sync
 * with authentication state (e.g., dashboard, protected pages).
 */
export function useSessionSync() {
  const { setSession, clearSession, setLoading } = useSessionStore();

  useEffect(() => {
    const supabase = createClient();

    // Initial sync on mount
    const syncSession = async () => {
      setLoading(true);
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        clearSession();
      } else {
        setSession(user);
      }
      setLoading(false);
    };

    syncSession();

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setSession(session.user);
      } else {
        clearSession();
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [setSession, clearSession, setLoading]);
}

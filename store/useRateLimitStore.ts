import { create } from "zustand";

type RateLimitState = {
  limit: number;
  remaining: number;
  reset: number;
  set: (rl: { limit: number; remaining: number; reset: number }) => void;
  load: () => Promise<void>;
};

export const useRateLimitStore = create<RateLimitState>((set) => ({
  limit: 0,
  remaining: 999,
  reset: 0,
  set: (rl) => set(rl),
  load: async () => {
    try {
      const res = await fetch("/api/rate-limit/status");
      if (res.ok) {
        const rl = await res.json();
        set(rl);
      }
    } catch {
      // ignore
    }
  },
}));

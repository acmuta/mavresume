import { getRedis } from "./redis";

/** Default TTL for refinement cache: 7 days (604800 seconds). */
const DEFAULT_TTL_SECONDS = 604800;

/**
 * Builds a deterministic cache key for a refinement request.
 * Uses SHA-256 over canonical JSON of bulletText, context.title, and sorted context.technologies.
 * Edge- and Node-compatible via Web Crypto.
 */
export async function buildRefinementCacheKey(
  userId: string,
  bulletText: string,
  context?: { title?: string; technologies?: string[] }
): Promise<string> {
  const canonical = JSON.stringify({
    b: bulletText.trim(),
    t: context?.title ?? "",
    k: [...(context?.technologies ?? [])].sort(),
  });
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(canonical)
  );
  const hex = Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `refine:${userId}:${hex}`;
}

/**
 * Returns cached refinedText when present; null on miss or when Redis is unavailable.
 * Fails open: Redis errors are caught and null is returned.
 */
export async function getCachedRefinement(key: string): Promise<string | null> {
  const redis = getRedis();
  if (!redis) return null;
  try {
    const val = await redis.get<string>(key);
    return typeof val === "string" ? val : null;
  } catch {
    return null;
  }
}

/**
 * Stores refinedText in Redis with TTL. No-op when Redis is unavailable or on error.
 * TTL from REFINE_CACHE_TTL_SECONDS (default 7 days).
 */
export async function setCachedRefinement(
  key: string,
  refinedText: string
): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  const ttlSeconds = parseInt(
    process.env.REFINE_CACHE_TTL_SECONDS || String(DEFAULT_TTL_SECONDS),
    10
  );
  try {
    await redis.set(key, refinedText, { ex: ttlSeconds });
  } catch {
    // Fail open: refinement was still returned to client
  }
}

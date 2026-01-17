import { Redis } from "@upstash/redis";
import { createHash } from "crypto";

/**
 * Initialize Upstash Redis client for caching.
 * Uses REST API which is compatible with Vercel Serverless/Edge runtimes.
 */
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * Context passed to AI refinement to improve relevance of generated text.
 */
interface RefinementContext {
  title?: string;
  technologies?: string[];
}

/**
 * Cached refinement result stored in Redis.
 */
interface CachedRefinement {
  refinedText: string;
  cachedAt: number; // Unix timestamp in milliseconds
}

/**
 * Cache TTL: 1 hour (3600 seconds)
 * Balances cost savings with allowing users to re-refine if needed.
 */
const CACHE_TTL_SECONDS = 3600;

/**
 * Cache key prefix for bullet refinement results.
 */
const CACHE_KEY_PREFIX = "cache:refine-bullet:";

/**
 * Creates a cache key by hashing the bullet text and context.
 * Identical bullets with same context will produce the same hash,
 * enabling cache hit detection.
 * 
 * @param bulletText - The bullet point text to refine
 * @param context - Optional context (title, technologies)
 * @returns SHA-256 hash string used as cache key
 */
function createCacheKey(
  bulletText: string,
  context?: RefinementContext
): string {
  // Normalize inputs: trim bullet text, sort context arrays for consistency
  const normalizedBullet = bulletText.trim().toLowerCase();
  
  const normalizedContext = context
    ? {
        title: context.title?.trim().toLowerCase() || "",
        technologies: (context.technologies || []).slice().sort().map(t => t.trim().toLowerCase()),
      }
    : {};

  // Create deterministic string representation
  const cacheInput = JSON.stringify({
    bulletText: normalizedBullet,
    context: normalizedContext,
  });

  // Generate SHA-256 hash
  const hash = createHash("sha256").update(cacheInput).digest("hex");

  return `${CACHE_KEY_PREFIX}${hash}`;
}

/**
 * Retrieves a cached refinement result from Redis.
 * 
 * @param bulletText - The bullet point text
 * @param context - Optional context (title, technologies)
 * @returns Cached refinement result or null if not found/cache miss
 * 
 * @example
 * const cached = await getCachedRefinement("Built a web app", { title: "Project" });
 * if (cached) {
 *   return cached.refinedText; // Cache hit!
 * }
 */
export async function getCachedRefinement(
  bulletText: string,
  context?: RefinementContext
): Promise<string | null> {
  try {
    const cacheKey = createCacheKey(bulletText, context);
    const cached = await redis.get<CachedRefinement>(cacheKey);

    if (cached && cached.refinedText) {
      return cached.refinedText;
    }

    return null;
  } catch (error) {
    // Fail-open: if cache lookup fails, log error but allow request to proceed
    // This ensures availability even if Redis is temporarily unavailable
    console.error("Cache lookup failed:", error);
    return null;
  }
}

/**
 * Stores a refinement result in Redis cache with TTL.
 * 
 * @param bulletText - The original bullet point text
 * @param context - Optional context (title, technologies)
 * @param refinedText - The AI-refined bullet point text to cache
 * 
 * @example
 * await setCachedRefinement("Built a web app", { title: "Project" }, "Developed...");
 */
export async function setCachedRefinement(
  bulletText: string,
  context: RefinementContext | undefined,
  refinedText: string
): Promise<void> {
  try {
    const cacheKey = createCacheKey(bulletText, context);
    const cachedData: CachedRefinement = {
      refinedText,
      cachedAt: Date.now(),
    };

    // Store with TTL - Redis automatically expires the key after TTL
    await redis.setex(cacheKey, CACHE_TTL_SECONDS, cachedData);
  } catch (error) {
    // Fail-open: if cache write fails, log error but don't block the request
    // The refinement was successful, caching is just an optimization
    console.error("Cache write failed:", error);
  }
}

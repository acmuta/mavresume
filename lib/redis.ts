import { Redis } from "@upstash/redis";

let _redis: Redis | null | undefined = undefined;

/**
 * Returns a Redis client when UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
 * are set; otherwise null. Lazy-initialized and cached for the lifetime of the isolate.
 * Used for refinement response caching and other server-side cache needs.
 */
export function getRedis(): Redis | null {
  if (_redis !== undefined) return _redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    _redis = null;
    return null;
  }
  _redis = new Redis({ url, token });
  return _redis;
}

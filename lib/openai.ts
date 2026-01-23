import OpenAI from "openai"

let _client: OpenAI | null = null;

/**
 * Returns a singleton OpenAI client instance.
 * Uses lazy initialization - only creates the client when first called,
 * not at module load time. This allows builds to succeed without the API key.
 */
export function getOpenAIClient(): OpenAI {
  if (_client) return _client;

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  _client = new OpenAI({ apiKey });
  return _client;
}

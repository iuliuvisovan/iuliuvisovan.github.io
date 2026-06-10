// Public URL of the Cloudflare Worker that proxies OpenAI (this is NOT a secret).
// Filled in after you deploy the worker (`npm run deploy` prints it), or override
// with VITE_STORY_API_URL at build time.
export const STORY_API_URL =
  import.meta.env.VITE_STORY_API_URL ??
  'https://adam-story.iuliuvisovan.workers.dev'

// Flip to true to re-enable all sounds.
export const SOUNDS_ENABLED = false

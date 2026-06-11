// Cloudflare Worker: OpenAI proxy for the "Tell me a story" button.
// The API key lives ONLY here as a Worker secret (OPENAI_API_KEY) and never
// reaches the browser. The frontend POSTs here; we call OpenAI and return text.
// POST /narrate turns story text into speech (mp3) via OpenAI TTS, with edge caching.

type Env = {
  OPENAI_API_KEY: string
}

// Browser callers we allow (CORS). Add more origins if you serve from elsewhere.
const ALLOWED_ORIGINS = [
  'https://iuliuvisovan.github.io',
  'http://localhost:5173',
]

// Swap for a newer/cheaper OpenAI model whenever you like.
const MODEL = 'gpt-4o-mini'

const NARRATION_MODEL = 'gpt-4o-mini-tts'
const NARRATION_VOICE = 'cedar'
const NARRATION_MAX_CHARS = 4000
const NARRATION_INSTRUCTIONS =
  'Ești un bunic cald care îi spune nepoțelului Adam o poveste de culcare. Vorbește în limba română cu accent natural. Voce caldă și calmă, dar vie și expresivă: intonație bogată, melodioasă, ca un povestitor adevărat. Ritm relaxat dar natural, nu târât. Pauze scurte și firești între propoziții.'

function corsHeaders(origin: string | null): Record<string, string> {
  const allow =
    origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  }
}

async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(text)
  )
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

async function narrate(
  request: Request,
  env: Env,
  cors: Record<string, string>
): Promise<Response> {
  let text = ''
  try {
    const body = (await request.json()) as { text?: unknown }
    if (typeof body?.text === 'string') {
      text = body.text
    }
  } catch {
    // no / invalid body: rejected by the validation below
  }

  if (text.length === 0 || text.length > NARRATION_MAX_CHARS) {
    return new Response(JSON.stringify({ error: 'invalid_text' }), {
      status: 400,
      headers: { ...cors, 'Content-Type': 'application/json' },
    })
  }

  // Edge cache: the same text is only sent to OpenAI once.
  const cache = caches.default
  const cacheKey = new Request('https://narrate.cache/' + (await sha256Hex(text)), {
    method: 'GET',
  })

  const cached = await cache.match(cacheKey)
  if (cached) {
    return new Response(cached.body, {
      headers: { ...cors, 'Content-Type': 'audio/mpeg' },
    })
  }

  const openaiRes = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: NARRATION_MODEL,
      voice: NARRATION_VOICE,
      input: text,
      instructions: NARRATION_INSTRUCTIONS,
      response_format: 'mp3',
    }),
  })

  if (!openaiRes.ok) {
    const detail = await openaiRes.text()
    return new Response(JSON.stringify({ error: 'openai_failed', detail }), {
      status: 502,
      headers: { ...cors, 'Content-Type': 'application/json' },
    })
  }

  // A body can only be read once: clone so one copy goes to the cache and
  // the other to the caller. CORS headers stay out of the cached copy.
  const toCache = new Response(openaiRes.body, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'public, max-age=604800',
    },
  })
  const toReturn = toCache.clone()
  await cache.put(cacheKey, toCache)

  return new Response(toReturn.body, {
    headers: { ...cors, 'Content-Type': 'audio/mpeg' },
  })
}

async function tellStory(
  request: Request,
  env: Env,
  cors: Record<string, string>
): Promise<Response> {
  let prompt = 'Tell me a short, gentle bedtime story for a newborn named Adam.'
  try {
    const body = (await request.json()) as { prompt?: string }
    if (body?.prompt) {
      prompt = body.prompt
    }
  } catch {
    // no / invalid body: fall back to the default prompt
  }

  const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.9,
      max_tokens: 400,
      messages: [
        {
          role: 'system',
          content:
            'You are a warm, gentle storyteller for a newborn baby. Write short, soothing, whimsical bedtime stories in simple language, under 200 words.',
        },
        { role: 'user', content: prompt },
      ],
    }),
  })

  if (!openaiRes.ok) {
    const detail = await openaiRes.text()
    return new Response(JSON.stringify({ error: 'openai_failed', detail }), {
      status: 502,
      headers: { ...cors, 'Content-Type': 'application/json' },
    })
  }

  const data = (await openaiRes.json()) as {
    choices?: { message?: { content?: string } }[]
  }
  const story = data.choices?.[0]?.message?.content ?? ''

  return new Response(JSON.stringify({ story }), {
    headers: { ...cors, 'Content-Type': 'application/json' },
  })
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const cors = corsHeaders(request.headers.get('Origin'))

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: cors })
    }
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: cors })
    }

    const url = new URL(request.url)
    if (url.pathname === '/narrate') {
      return narrate(request, env, cors)
    }

    return tellStory(request, env, cors)
  },
}

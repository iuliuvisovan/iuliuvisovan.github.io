// Cloudflare Worker: OpenAI proxy for the "Tell me a story" button.
// The API key lives ONLY here as a Worker secret (OPENAI_API_KEY) and never
// reaches the browser. The frontend POSTs here; we call OpenAI and return text.

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

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const cors = corsHeaders(request.headers.get('Origin'))

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: cors })
    }
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: cors })
    }

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
  },
}

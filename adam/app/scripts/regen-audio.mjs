// Regenerates the static narration mp3 files for the bedtime story app.
//
// Usage:
//   node scripts/regen-audio.mjs all            regenerate every chunk of every story
//   node scripts/regen-audio.mjs 2              regenerate all 6 chunks of story 2
//   node scripts/regen-audio.mjs 2 1            regenerate only chunk 1 of story 2
//
// Stories live in src/stories.ts (7 stories, 6 paragraphs each). Narration is
// chunked as 1 paragraph per file: chunk N = paragraph N. Files are written to
// public/audio/story-{storyId}-chunk-{chunk}.mp3 (both 1-based).
//
// This script calls ElevenLabs directly, NOT the Cloudflare worker: the worker
// serves edge-cached takes, and the whole point of this script is a fresh take.
// The voice constants below must stay in sync with worker/src/index.ts.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const STORY_COUNT = 7
const PARAGRAPHS_PER_STORY = 6
const PARAGRAPHS_PER_CHUNK = 1
const CHUNKS_PER_STORY = PARAGRAPHS_PER_STORY / PARAGRAPHS_PER_CHUNK

// Must stay in sync with worker/src/index.ts
const VOICE_ID = '8oIq3IoTXaBptRimDDsj'
const MODEL_ID = 'eleven_multilingual_v2'
const LANGUAGE_CODE = 'ro'
const VOICE_SETTINGS = {
  stability: 0.5,
  similarity_boost: 1.0,
  style: 0.5,
  speed: 0.88,
  use_speaker_boost: true,
}

const storiesFileUrl = new URL('../src/stories.ts', import.meta.url)
const audioDirUrl = new URL('../public/audio/', import.meta.url)
const devVarsUrl = new URL('../../worker/.dev.vars', import.meta.url)

function printUsage() {
  console.log('Usage:')
  console.log('  node scripts/regen-audio.mjs all            regenerate every chunk of every story')
  console.log('  node scripts/regen-audio.mjs 2              regenerate all 6 chunks of story 2')
  console.log('  node scripts/regen-audio.mjs 2 1            regenerate only chunk 1 of story 2')
}

function readApiKey() {
  let content
  try {
    content = readFileSync(devVarsUrl, 'utf8')
  } catch {
    console.error(`Could not read ${fileURLToPath(devVarsUrl)}`)
    console.error('Expected the worker .dev.vars file with an ELEVENLABS_API_KEY=... line')
    process.exit(1)
  }
  const line = content.split('\n').find((entry) => entry.trim().startsWith('ELEVENLABS_API_KEY='))
  if (!line) {
    console.error(`No ELEVENLABS_API_KEY line found in ${fileURLToPath(devVarsUrl)}`)
    process.exit(1)
  }
  const value = line
    .slice(line.indexOf('=') + 1)
    .trim()
    .replace(/^['"]|['"]$/g, '')
  if (!value) {
    console.error(`ELEVENLABS_API_KEY in ${fileURLToPath(devVarsUrl)} is empty`)
    process.exit(1)
  }
  return value
}

function readParagraphs() {
  const source = readFileSync(storiesFileUrl, 'utf8')
  const matches = [...source.matchAll(/^      '(.*)',$/gm)]
  const paragraphs = matches.map((match) => match[1])
  const expected = STORY_COUNT * PARAGRAPHS_PER_STORY
  if (paragraphs.length !== expected) {
    console.error(`Expected ${expected} paragraphs in ${fileURLToPath(storiesFileUrl)} but found ${paragraphs.length}`)
    console.error('Paragraphs must be single-quoted strings indented with exactly 6 spaces, one per line, with a trailing comma')
    process.exit(1)
  }
  return paragraphs
}

function textForChunk(paragraphs, storyId, chunk) {
  const start = (storyId - 1) * PARAGRAPHS_PER_STORY + (chunk - 1) * PARAGRAPHS_PER_CHUNK
  return paragraphs.slice(start, start + PARAGRAPHS_PER_CHUNK).join('\n\n')
}

function parseTargets(args) {
  if (args.length === 1 && args[0] === 'all') {
    const targets = []
    for (let storyId = 1; storyId <= STORY_COUNT; storyId++) {
      for (let chunk = 1; chunk <= CHUNKS_PER_STORY; chunk++) {
        targets.push({ storyId, chunk })
      }
    }
    return targets
  }
  if (args.length === 1 || args.length === 2) {
    const storyId = Number(args[0])
    if (!Number.isInteger(storyId) || storyId < 1 || storyId > STORY_COUNT) {
      return null
    }
    if (args.length === 1) {
      const targets = []
      for (let chunk = 1; chunk <= CHUNKS_PER_STORY; chunk++) {
        targets.push({ storyId, chunk })
      }
      return targets
    }
    const chunk = Number(args[1])
    if (!Number.isInteger(chunk) || chunk < 1 || chunk > CHUNKS_PER_STORY) {
      return null
    }
    return [{ storyId, chunk }]
  }
  return null
}

async function fetchNarration(apiKey, text) {
  // Direct ElevenLabs call on purpose: the Cloudflare worker serves
  // edge-cached takes, and we want a fresh take here.
  const endpoint = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      model_id: MODEL_ID,
      language_code: LANGUAGE_CODE,
      voice_settings: VOICE_SETTINGS,
    }),
  })
  if (!response.ok) {
    const body = await response.text()
    console.error(`ElevenLabs request failed with status ${response.status}`)
    console.error(body)
    process.exit(1)
  }
  return Buffer.from(await response.arrayBuffer())
}

async function main() {
  const targets = parseTargets(process.argv.slice(2))
  if (!targets) {
    printUsage()
    process.exit(1)
  }
  const apiKey = readApiKey()
  const paragraphs = readParagraphs()
  mkdirSync(audioDirUrl, { recursive: true })
  for (const target of targets) {
    const text = textForChunk(paragraphs, target.storyId, target.chunk)
    const audio = await fetchNarration(apiKey, text)
    const filename = `story-${target.storyId}-chunk-${target.chunk}.mp3`
    writeFileSync(new URL(filename, audioDirUrl), audio)
    console.log(`Wrote ${filename} (${audio.length} bytes)`)
  }
  console.log('Reminder: run npm run build so the new audio reaches the deployed adam/ output')
}

await main()

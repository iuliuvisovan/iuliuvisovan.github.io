import { SOUNDS_ENABLED } from './config'
import { getLullabyAudio, TARGET_VOLUME } from './lullaby'
import story1Url from './assets/story-1.mp3'
import story2Url from './assets/story-2.mp3'

// Static narration audio, one file per two story paragraphs
const chunkUrls = [story1Url, story2Url]

let currentAudio: HTMLAudioElement | null = null
let betweenTimer: ReturnType<typeof setTimeout> | null = null
let pausedInGap = false
let started = false
// The chunk that plays after the current one (or after the gap we're in)
let nextChunkIndex = 0

// How quiet the lullaby gets while the narration is speaking
const DUCKED_VOLUME = 0.12

// Lullaby-only breathing room between two narration chunks
const GAP_MS = 4000

const RAMP_STEP_MS = 50

// One active ramp per element; starting a new ramp cancels the previous one,
// so a resume mid-fade simply turns the volume back around.
const rampTimers = new Map<HTMLAudioElement, number>()

// Animates `element.volume` toward `target` over `durationMs` in ~50ms steps,
// then calls `done` (if given) once the target is reached.
export function rampVolume(element: HTMLAudioElement, target: number, durationMs: number, done?: () => void) {
  const previous = rampTimers.get(element)
  if (previous !== undefined) {
    clearInterval(previous)
  }
  const start = element.volume
  const steps = Math.max(Math.round(durationMs / RAMP_STEP_MS), 1)
  let step = 0
  const timer = setInterval(() => {
    step += 1
    element.volume = Math.min(Math.max(start + ((target - start) * step) / steps, 0), 1)
    if (step >= steps) {
      clearInterval(timer)
      rampTimers.delete(element)
      if (done) {
        done()
      }
    }
  }, RAMP_STEP_MS)
  rampTimers.set(element, timer)
}

// Fades the whole story soundscape to silence over 1500ms, then pauses it:
// the narration (if it's still speaking) and the lullaby. If we're in the
// breathing gap between chunks, the gap timer is disarmed instead and only
// the lullaby fades out.
export function pauseStoryAudio() {
  if (!SOUNDS_ENABLED) {
    return
  }
  if (betweenTimer !== null) {
    clearTimeout(betweenTimer)
    betweenTimer = null
    pausedInGap = true
  }
  if (currentAudio && !currentAudio.ended) {
    const narration = currentAudio
    rampVolume(narration, 0, 1500, () => narration.pause())
  }
  const lullaby = getLullabyAudio()
  if (lullaby) {
    rampVolume(lullaby, 0, 1500, () => lullaby.pause())
  }
}

// Resumes whatever pauseStoryAudio stopped: the narration fades back to full
// volume and the lullaby returns to its ducked level while the narration is
// still speaking, or to its normal level once the narration is over. If we
// paused inside the breathing gap, the lullaby comes back and the gap timer
// is re-armed for the next chunk with the full GAP_MS.
export function resumeStoryAudio() {
  if (!SOUNDS_ENABLED) {
    return
  }
  if (pausedInGap) {
    pausedInGap = false
    const lullaby = getLullabyAudio()
    if (lullaby) {
      lullaby.play().catch(() => {})
      rampVolume(lullaby, TARGET_VOLUME, 1000)
    }
    betweenTimer = setTimeout(() => {
      betweenTimer = null
      playChunk(nextChunkIndex)
    }, GAP_MS)
    return
  }
  const narrationActive = currentAudio !== null && !currentAudio.ended
  if (currentAudio && narrationActive) {
    currentAudio.play().catch(() => {})
    rampVolume(currentAudio, 1, 1000)
  }
  const lullaby = getLullabyAudio()
  if (lullaby) {
    lullaby.play().catch(() => {})
    rampVolume(lullaby, narrationActive ? DUCKED_VOLUME : TARGET_VOLUME, 1000)
  }
}

// Starts fetching the narration audio for every chunk right away and keeps
// the promises so playNarration can await them later. Idempotent: later
// calls are no-ops. Narration is best-effort, so any failure resolves to ''
// instead of throwing.
export function prefetchNarration(texts: string[]) {
  if (!SOUNDS_ENABLED) {
    return
  }
  if (chunkUrls.length) {
    return
  }
  chunkUrls = texts.map((text) =>
    fetch(`${STORY_API_URL}/narrate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
      .then((response) => {
        if (!response.ok) {
          return ''
        }
        return response.blob().then((blob) => URL.createObjectURL(blob))
      })
      .catch(() => '')
  )
}

// Plays the prefetched chunks in order: the lullaby ducks while a chunk
// speaks, then breathes back up during the gap before the next one.
export async function playNarration() {
  if (!SOUNDS_ENABLED) {
    return
  }
  if (!chunkUrls.length) {
    return
  }
  if (started) {
    return
  }
  started = true
  playChunk(0)
}

// Plays one narration chunk: ducks the lullaby, speaks, then hands off to
// chunkEnded. A failed fetch ('' url) skips straight to chunkEnded.
async function playChunk(index: number) {
  nextChunkIndex = index + 1
  const url = await chunkUrls[index]
  if (!url) {
    chunkEnded()
    return
  }
  const narration = new Audio(url)
  narration.volume = 1
  currentAudio = narration
  const lullaby = getLullabyAudio()
  if (lullaby) {
    rampVolume(lullaby, DUCKED_VOLUME, 500)
  }
  narration.addEventListener('ended', () => {
    currentAudio = null
    chunkEnded()
  })
  narration.play().catch(() => {})
}

// Runs when a chunk finishes speaking (or its fetch failed): the lullaby
// breathes back up to its normal level and, if there is another chunk, the
// gap timer is armed to play it after GAP_MS.
function chunkEnded() {
  const lullaby = getLullabyAudio()
  if (lullaby) {
    rampVolume(lullaby, TARGET_VOLUME, 1000)
  }
  if (nextChunkIndex < chunkUrls.length) {
    betweenTimer = setTimeout(() => {
      betweenTimer = null
      playChunk(nextChunkIndex)
    }, GAP_MS)
  }
}

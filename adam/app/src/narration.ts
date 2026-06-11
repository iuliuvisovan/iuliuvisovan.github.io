import { STORY_API_URL, SOUNDS_ENABLED } from './config'
import { getLullabyAudio, TARGET_VOLUME } from './lullaby'

// Narration audio fetched from the worker, one mp3 per two story paragraphs,
// so three chunks per story. Cached per story so coming back to an already
// fetched story never refetches.
const narrationCache = new Map<number, Promise<string>[]>()

// The chunk promises of the story currently playing
let activeChunks: Promise<string>[] = []

let currentAudio: HTMLAudioElement | null = null
let betweenTimer: ReturnType<typeof setTimeout> | null = null
let pausedInGap = false
// The chunk that plays after the current one (or after the gap we're in)
let nextChunkIndex = 0

// Runs GAP_MS after a story's last chunk finishes, so the app can move on to
// the next story.
let endedCallback: (() => void) | null = null

// Bumped by stopNarration to invalidate everything in flight. Async work
// captures the value it started under and bails if the counter has moved on,
// so switching stories mid-fetch or mid-gap can never start audio from the
// old story.
let session = 0

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
// is re-armed with the full GAP_MS, leading to the next chunk or, after the
// last chunk, to the story-ended callback.
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
    const mySession = session
    const ended = endedCallback
    betweenTimer = setTimeout(() => {
      betweenTimer = null
      if (mySession !== session) {
        return
      }
      if (nextChunkIndex < activeChunks.length) {
        playChunk(nextChunkIndex)
      } else if (ended) {
        ended()
      }
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

// Starts fetching the narration audio for every chunk of a story right away
// and keeps the promises so playChunk can await them later. Idempotent per
// story: later calls for an already-cached story are no-ops. Narration is
// best-effort, so any failure resolves to '' instead of throwing.
export function prefetchNarration(storyId: number, texts: string[]) {
  if (!SOUNDS_ENABLED) {
    return
  }
  if (narrationCache.has(storyId)) {
    return
  }
  narrationCache.set(
    storyId,
    texts.map((text) =>
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
  )
}

// Starts a story from its first chunk: anything still playing or pending from
// a previous story is stopped, the story's chunks are (pre)fetched, and the
// lullaby is brought back in case pauseStoryAudio had silenced it. The
// optional `storyEnded` runs GAP_MS after the last chunk finishes, so the app
// can auto-advance to the next story.
export function startNarration(storyId: number, texts: string[], storyEnded?: () => void) {
  if (!SOUNDS_ENABLED) {
    return
  }
  stopNarration()
  endedCallback = storyEnded ?? null
  prefetchNarration(storyId, texts)
  activeChunks = narrationCache.get(storyId) ?? []
  getLullabyAudio()?.play().catch(() => {})
  playChunk(0)
}

// Stops the current narration outright: in-flight fetches, the gap timer and
// the chunk that's speaking all become stale. Bumping `session` is what makes
// any awaited work bail instead of resuming on top of the next story.
export function stopNarration() {
  session += 1
  if (betweenTimer !== null) {
    clearTimeout(betweenTimer)
    betweenTimer = null
  }
  pausedInGap = false
  endedCallback = null
  if (currentAudio) {
    currentAudio.pause()
    currentAudio = null
  }
}

// Plays one narration chunk: ducks the lullaby, speaks, then hands off to
// chunkEnded. A failed fetch ('' url) skips straight to chunkEnded. The fetch
// await is the dangerous window: if the story changed while we waited, the
// session check makes us walk away.
async function playChunk(index: number) {
  const mySession = session
  nextChunkIndex = index + 1
  const url = await activeChunks[index]
  if (mySession !== session) {
    return
  }
  if (!url) {
    chunkEnded(mySession)
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
    if (mySession !== session) {
      return
    }
    currentAudio = null
    chunkEnded(mySession)
  })
  narration.play().catch(() => {})
}

// Runs when a chunk finishes speaking (or its fetch failed): the lullaby
// breathes back up to its normal level and, if there is another chunk, the
// gap timer is armed to play it after GAP_MS. After the last chunk the same
// gap leads to the story-ended callback instead, so the app can move to the
// next story. Guarded by session so a stale chunk can never schedule work
// for a story that's gone.
function chunkEnded(mySession: number) {
  if (mySession !== session) {
    return
  }
  const lullaby = getLullabyAudio()
  if (lullaby) {
    rampVolume(lullaby, TARGET_VOLUME, 1000)
  }
  if (nextChunkIndex < activeChunks.length) {
    betweenTimer = setTimeout(() => {
      betweenTimer = null
      if (mySession !== session) {
        return
      }
      playChunk(nextChunkIndex)
    }, GAP_MS)
  } else if (endedCallback) {
    const ended = endedCallback
    betweenTimer = setTimeout(() => {
      betweenTimer = null
      if (mySession !== session) {
        return
      }
      ended()
    }, GAP_MS)
  }
}

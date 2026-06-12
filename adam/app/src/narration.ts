import { PLAYBACK_RATE, SOUNDS_ENABLED } from './config'
import { getLullabyAudio, TARGET_VOLUME } from './lullaby'

// Narration ships as static mp3 files bundled with the site, one file per
// story paragraph, so six chunks per story. No network calls at runtime.

// The chunk urls of the story currently playing
let activeChunkUrls: string[] = []

let currentAudio: HTMLAudioElement | null = null
let betweenTimer: ReturnType<typeof setTimeout> | null = null
let pausedInGap = false
// The chunk that plays after the current one (or after the gap we're in)
let nextChunkIndex = 0

// Runs GAP_MS after a story's last chunk finishes, so the app can move on to
// the next story.
let endedCallback: (() => void) | null = null

// Tells the app which chunk is speaking so it can highlight its paragraph.
// Fired with the index when a chunk starts and with null on stop; the gap
// between chunks keeps the previous index, so the highlight only moves when
// the next chunk actually speaks.
let chunkListener: ((chunk: number | null) => void) | null = null

// Bumped by stopNarration to invalidate everything in flight. Async work
// captures the value it started under and bails if the counter has moved on,
// so switching stories mid-fetch or mid-gap can never start audio from the
// old story.
let session = 0

// How quiet the lullaby gets while the narration is speaking
const DUCKED_VOLUME = 0.12

// Per-channel pause flags for the small voice/music toggles. The main
// pause/resume pair below ignores them on pause (it silences everything) and
// clears them on resume, so the big button always brings the whole soundscape
// back. The duck/restore logic in playChunk and chunkEnded checks musicPaused
// so a paused lullaby is never ramped back up behind the listener's back.
let voicePaused = false
let musicPaused = false

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
  // The big button resumes everything, so the per-channel pauses are over
  voicePaused = false
  musicPaused = false
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
      if (nextChunkIndex < activeChunkUrls.length) {
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

// Pauses only the narration voice. A speaking chunk fades out and pauses; if
// we're in the breathing gap, the gap timer is disarmed exactly like
// pauseStoryAudio does (pausedInGap is shared, so either resume path can
// re-arm it). With the voice gone the lullaby no longer needs to stay ducked,
// so it breathes up to its normal level, unless the listener paused it too.
export function pauseVoice() {
  if (!SOUNDS_ENABLED) {
    return
  }
  voicePaused = true
  if (betweenTimer !== null) {
    clearTimeout(betweenTimer)
    betweenTimer = null
    pausedInGap = true
  }
  if (currentAudio && !currentAudio.ended) {
    const narration = currentAudio
    rampVolume(narration, 0, 800, () => narration.pause())
  }
  const lullaby = getLullabyAudio()
  if (lullaby && !musicPaused) {
    rampVolume(lullaby, TARGET_VOLUME, 1000)
  }
}

// The inverse of pauseVoice: a chunk paused mid-speech fades back to full
// volume and the lullaby ducks under it again (unless the music is paused).
// If the voice was paused in the gap, the gap timer is re-armed with the full
// GAP_MS, same as resumeStoryAudio.
export function resumeVoice() {
  if (!SOUNDS_ENABLED) {
    return
  }
  voicePaused = false
  if (pausedInGap) {
    pausedInGap = false
    const mySession = session
    const ended = endedCallback
    betweenTimer = setTimeout(() => {
      betweenTimer = null
      if (mySession !== session) {
        return
      }
      if (nextChunkIndex < activeChunkUrls.length) {
        playChunk(nextChunkIndex)
      } else if (ended) {
        ended()
      }
    }, GAP_MS)
    return
  }
  if (currentAudio && !currentAudio.ended) {
    currentAudio.play().catch(() => {})
    rampVolume(currentAudio, 1, 800)
    const lullaby = getLullabyAudio()
    if (lullaby && !musicPaused) {
      rampVolume(lullaby, DUCKED_VOLUME, 800)
    }
  }
}

// Pauses only the lullaby: fade to silence, then pause. The narration keeps
// speaking over it untouched.
export function pauseMusic() {
  if (!SOUNDS_ENABLED) {
    return
  }
  musicPaused = true
  const lullaby = getLullabyAudio()
  if (lullaby) {
    rampVolume(lullaby, 0, 1000, () => lullaby.pause())
  }
}

// Brings the lullaby back at the level the moment calls for: ducked if a
// narration chunk is actually speaking right now, normal otherwise. The
// `paused` check covers both a voice-paused chunk and a full main pause,
// neither of which should keep the lullaby ducked.
export function resumeMusic() {
  if (!SOUNDS_ENABLED) {
    return
  }
  musicPaused = false
  const lullaby = getLullabyAudio()
  if (!lullaby) {
    return
  }
  const narrationSpeaking = currentAudio !== null && !currentAudio.ended && !currentAudio.paused
  lullaby.play().catch(() => {})
  rampVolume(lullaby, narrationSpeaking ? DUCKED_VOLUME : TARGET_VOLUME, 1000)
}

// The narration files live in app/public/audio and are generated by
// scripts/regen-audio.mjs. File names use 1-based chunk numbers.
function chunkUrl(storyId: number, index: number) {
  return `${import.meta.env.BASE_URL}audio/story-${storyId}-chunk-${index + 1}.mp3`
}

// Starts a story from its first chunk: anything still playing or pending from
// a previous story is stopped, the story's chunk urls are laid out, and the
// lullaby is brought back in case pauseStoryAudio had silenced it. The
// optional `storyEnded` runs GAP_MS after the last chunk finishes, so the app
// can auto-advance to the next story.
export function startNarration(storyId: number, texts: string[], storyEnded?: () => void, chunkChanged?: (chunk: number | null) => void) {
  if (!SOUNDS_ENABLED) {
    return
  }
  stopNarration()
  // A fresh story starts with both channels live
  voicePaused = false
  musicPaused = false
  // Assigned after stopNarration, which clears the previous story's listener
  chunkListener = chunkChanged ?? null
  endedCallback = storyEnded ?? null
  activeChunkUrls = []
  for (let index = 0; index < texts.length; index += 1) {
    activeChunkUrls.push(chunkUrl(storyId, index))
  }
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
  // Clear the highlight before dropping the listener
  chunkListener?.(null)
  chunkListener = null
  if (currentAudio) {
    currentAudio.pause()
    currentAudio = null
  }
}

// Plays one narration chunk: ducks the lullaby, speaks, then hands off to
// chunkEnded. A missing or broken file fires the 'error' listener, which
// skips straight to chunkEnded so the story moves on instead of stalling.
function playChunk(index: number) {
  // While the voice is paused the gap timers are disarmed, so this should be
  // unreachable; the guard enforces that invariant instead of implying it.
  if (voicePaused) {
    return
  }
  const mySession = session
  nextChunkIndex = index + 1
  chunkListener?.(index)
  const url = activeChunkUrls[index]
  const narration = new Audio(url)
  narration.playbackRate = PLAYBACK_RATE
  narration.volume = 1
  currentAudio = narration
  const lullaby = getLullabyAudio()
  if (lullaby && !musicPaused) {
    rampVolume(lullaby, DUCKED_VOLUME, 500)
  }
  narration.addEventListener('ended', () => {
    if (mySession !== session) {
      return
    }
    currentAudio = null
    chunkEnded(mySession)
  })
  narration.addEventListener('error', () => {
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
  if (lullaby && !musicPaused) {
    rampVolume(lullaby, TARGET_VOLUME, 1000)
  }
  if (nextChunkIndex < activeChunkUrls.length) {
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

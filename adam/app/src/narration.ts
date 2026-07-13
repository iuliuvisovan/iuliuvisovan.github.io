import { PLAYBACK_RATE, SOUNDS_ENABLED } from './config'
import { getLullabyAudio, TARGET_VOLUME } from './lullaby'
import { rampLevel, setLevel } from './audio-graph'

// Narration ships as static mp3 files bundled with the site, one file per
// story paragraph, so six chunks per story. No network calls at runtime.

// The chunk urls of the story currently playing
let activeChunkUrls: string[] = []

// The story currently playing, so playChunk can name it on the lockscreen
let activeStoryId = 0

// One persistent element plays every chunk; we swap its src between chunks.
// Mobile browsers apply autoplay rules per element, so a fresh Audio created
// in a background tab may refuse to play, while this element, blessed by the
// user gesture that started the story, keeps playing like a playlist.
let voiceAudio: HTMLAudioElement | null = null
// The session the persistent element is currently working for, so its
// once-attached 'ended'/'error' listeners can tell stale events from live ones
let voiceSession = -1
// The url currently loaded into the persistent element, so playChunk can skip
// a redundant src swap when the gap already preloaded the next chunk
let loadedUrl: string | null = null

// Points at voiceAudio while a chunk is speaking (or paused mid-speech) and is
// null otherwise, which is what the pause/resume paths key off
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
const DUCKED_VOLUME = 0.05

// How loud the narration voice plays; gains live on a GainNode, so the level
// can sit above 1.0 to lift the voice over the lullaby
const VOICE_VOLUME = 1.4

// Per-channel pause flags for the small voice/music toggles. The main
// pause/resume pair below ignores them on pause (it silences everything) and
// clears them on resume, so the big button always brings the whole soundscape
// back. The duck/restore logic in playChunk and chunkEnded checks musicPaused
// so a paused lullaby is never ramped back up behind the listener's back.
let voicePaused = false
let musicPaused = false

// Lullaby-only breathing room between two narration chunks
const GAP_MS = 4000

// Fades an element toward `target` over `durationMs`, then calls `done` (if
// given). Kept under its old name, but the work now happens on the element's
// GainNode in audio-graph.ts: iOS WebKit treats element.volume as read-only,
// so a gain ramp is the only fade that is actually audible there. One active
// ramp per element; starting a new ramp cancels the previous one, so a resume
// mid-fade simply turns the level back around.
export function rampVolume(element: HTMLAudioElement, target: number, durationMs: number, done?: () => void) {
  rampLevel(element, target, durationMs, done)
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
    rampVolume(currentAudio, VOICE_VOLUME, 1000)
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
    rampVolume(currentAudio, VOICE_VOLUME, 800)
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
// The mp3s are served with a 4-hour cache; bump AUDIO_VERSION whenever audio
// is regenerated so cached clients fetch the new takes immediately.
const AUDIO_VERSION = 2

function chunkUrl(storyId: number, index: number) {
  return `${import.meta.env.BASE_URL}audio/story-${storyId}-chunk-${index + 1}.mp3?v=${AUDIO_VERSION}`
}

// Creates the persistent voice element on first use. Must first run inside a
// user gesture (startNarration) so the element earns its autoplay blessing.
// The 'ended'/'error' listeners are attached once and guarded by voiceSession,
// so events from a stopped story fall through harmlessly.
function getVoiceAudio(): HTMLAudioElement {
  if (voiceAudio) {
    return voiceAudio
  }
  const element = new Audio()
  element.defaultPlaybackRate = PLAYBACK_RATE
  element.addEventListener('ended', () => {
    if (voiceSession !== session) {
      return
    }
    currentAudio = null
    chunkEnded(voiceSession)
  })
  element.addEventListener('error', () => {
    if (voiceSession !== session) {
      return
    }
    // A broken preload during the gap: drop the cached url so playChunk
    // reloads it, and let the error fire again once the chunk is actually
    // speaking, where the skip below moves the story along.
    if (currentAudio !== element) {
      loadedUrl = null
      return
    }
    currentAudio = null
    chunkEnded(voiceSession)
  })
  voiceAudio = element
  return element
}

// At most one pending retry; a second rejection while one is armed is folded
// into it.
let retryArmed = false

// Plays the voice element, and if the browser refuses (a background tab with
// no gesture to spend), arms a one-shot retry for the moment the page becomes
// visible or focused again, so the chain stalls instead of dying.
function playVoice(element: HTMLAudioElement, mySession: number) {
  element.play().catch(() => {
    if (retryArmed) {
      return
    }
    retryArmed = true
    const retry = () => {
      document.removeEventListener('visibilitychange', retry)
      window.removeEventListener('focus', retry)
      retryArmed = false
      if (mySession !== session || voicePaused || currentAudio !== element) {
        return
      }
      element.play().catch(() => {})
    }
    document.addEventListener('visibilitychange', retry)
    window.addEventListener('focus', retry)
  })
}

// Lets the lockscreen and notification controls drive the story: metadata
// names what's playing and the play/pause actions map onto the same pair the
// big in-app button uses.
function updateMediaSession(storyId: number, chunkIndex: number) {
  if (!('mediaSession' in navigator)) {
    return
  }
  navigator.mediaSession.metadata = new MediaMetadata({
    title: `Povestea ${storyId}, Paragraful ${chunkIndex + 1}`,
    album: 'Povești pentru Adam',
  })
  try {
    navigator.mediaSession.setActionHandler('play', () => resumeStoryAudio())
    navigator.mediaSession.setActionHandler('pause', () => pauseStoryAudio())
  } catch {
    // Older browsers throw on unknown actions; the metadata alone still helps
  }
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
  activeStoryId = storyId
  activeChunkUrls = []
  for (let index = 0; index < texts.length; index += 1) {
    activeChunkUrls.push(chunkUrl(storyId, index))
  }
  getLullabyAudio()?.play().catch(() => {})
  playChunk(0)
}

// Blesses the persistent voice element inside a user gesture so a narration
// that starts seconds later (past iOS's short gesture window) can still play.
// Called from the button tap: a muted play()/pause() in the same synchronous
// tick is enough to unlock the element for the rest of the session. Without
// this, startNarration creating the element ~12s after the tap gets silently
// blocked by iOS autoplay, and the story never speaks.
export function primeVoice(storyId: number) {
  if (!SOUNDS_ENABLED) {
    return
  }
  const element = getVoiceAudio()
  element.src = chunkUrl(storyId, 0)
  element.muted = true
  element.play().catch(() => {})
  element.pause()
  element.muted = false
  element.currentTime = 0
  // startNarration reloads from scratch, so don't leave this src cached
  loadedUrl = null
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
  // A stopped chunk may sit mid-file in the element; forget the url so the
  // next playChunk reloads it from the start instead of resuming midway
  loadedUrl = null
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
  updateMediaSession(activeStoryId, index)
  const url = activeChunkUrls[index]
  const narration = getVoiceAudio()
  voiceSession = mySession
  if (loadedUrl !== url) {
    narration.src = url
    loadedUrl = url
  }
  // Loading a new resource resets playbackRate to the default, so reassert it
  narration.playbackRate = PLAYBACK_RATE
  setLevel(narration, VOICE_VOLUME)
  currentAudio = narration
  const lullaby = getLullabyAudio()
  if (lullaby && !musicPaused) {
    rampVolume(lullaby, DUCKED_VOLUME, 500)
  }
  playVoice(narration, mySession)
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
    // Preload the next chunk right now, while the ended event is still warm:
    // when the gap timer fires (possibly late in a background tab) the element
    // only has to play what it already holds
    const narration = getVoiceAudio()
    const nextUrl = activeChunkUrls[nextChunkIndex]
    narration.src = nextUrl
    loadedUrl = nextUrl
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

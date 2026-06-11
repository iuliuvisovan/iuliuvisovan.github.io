import { STORY_API_URL, SOUNDS_ENABLED } from './config'
import { setLullabyVolume, getLullabyAudio, TARGET_VOLUME } from './lullaby'

let audio: HTMLAudioElement | null = null
let pending: Promise<string> | null = null

// How quiet the lullaby gets while the narration is speaking
const DUCKED_VOLUME = 0.12

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
// the narration (if it's still speaking) and the lullaby.
export function pauseStoryAudio() {
  if (!SOUNDS_ENABLED) {
    return
  }
  if (audio && !audio.ended) {
    const narration = audio
    rampVolume(narration, 0, 1500, () => narration.pause())
  }
  const lullaby = getLullabyAudio()
  if (lullaby) {
    rampVolume(lullaby, 0, 1500, () => lullaby.pause())
  }
}

// Resumes whatever pauseStoryAudio stopped: the narration fades back to full
// volume and the lullaby returns to its ducked level while the narration is
// still speaking, or to its normal level once the narration is over.
export function resumeStoryAudio() {
  if (!SOUNDS_ENABLED) {
    return
  }
  const narrationActive = audio !== null && !audio.ended
  if (audio && narrationActive) {
    audio.play().catch(() => {})
    rampVolume(audio, 1, 1000)
  }
  const lullaby = getLullabyAudio()
  if (lullaby) {
    lullaby.play().catch(() => {})
    rampVolume(lullaby, narrationActive ? DUCKED_VOLUME : TARGET_VOLUME, 1000)
  }
}

// Starts fetching the narration audio for `text` and keeps the promise so
// playNarration can await it later. Idempotent: later calls are no-ops.
// Narration is best-effort, so any failure resolves to '' instead of throwing.
export function prefetchNarration(text: string) {
  if (!SOUNDS_ENABLED) {
    return
  }
  if (pending) {
    return
  }
  pending = fetch(`${STORY_API_URL}/narrate`, {
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
}

// Plays the prefetched narration once, ducking the lullaby while it speaks
// and restoring it when the narration ends.
export async function playNarration() {
  if (!SOUNDS_ENABLED) {
    return
  }
  if (!pending) {
    return
  }
  if (audio) {
    return
  }
  const url = await pending
  if (!url) {
    return
  }
  audio = new Audio(url)
  audio.volume = 1
  setLullabyVolume(DUCKED_VOLUME)
  audio.addEventListener('ended', () => {
    setLullabyVolume(TARGET_VOLUME)
  })
  audio.play().catch(() => {})
}

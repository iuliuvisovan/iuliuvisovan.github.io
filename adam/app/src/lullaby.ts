import { SOUNDS_ENABLED } from './config'
import lullabyUrl from './assets/lullaby.mp3'

let audio: HTMLAudioElement | null = null

const TARGET_VOLUME = 0.4
const FADE_MS = 3000
const FADE_STEP_MS = 100

// Starts the looping lullaby on the first call and fades it in. Later calls
// are no-ops, so it's safe to fire on every button press.
export function startLullaby() {
  if (!SOUNDS_ENABLED) {
    return
  }
  if (audio) {
    return
  }
  audio = new Audio(lullabyUrl)
  audio.loop = true
  audio.volume = 0

  const step = TARGET_VOLUME / (FADE_MS / FADE_STEP_MS)
  const fadeTimer = setInterval(() => {
    if (!audio) {
      clearInterval(fadeTimer)
      return
    }
    const next = Math.min(audio.volume + step, TARGET_VOLUME)
    audio.volume = next
    if (next >= TARGET_VOLUME) {
      clearInterval(fadeTimer)
    }
  }, FADE_STEP_MS)

  audio.play().catch(() => {})
}

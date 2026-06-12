import { SOUNDS_ENABLED } from './config'
import sparklesUrl from './assets/sparkles.mp3'

// A short fairy-dust shimmer played alongside the whoosh on the main button
// press. Preloading the element keeps the very first play from being silent.
const audio = new Audio(sparklesUrl)
audio.preload = 'auto'
audio.volume = 0.5

export function playSparkles() {
  if (!SOUNDS_ENABLED) {
    return
  }
  audio.currentTime = 0
  audio.play().catch(() => {})
}

import { SOUNDS_ENABLED } from './config'
import { setLevel } from './audio-graph'
import sparklesUrl from './assets/sparkles.mp3'

// A short fairy-dust shimmer played on the main button
// press. Preloading the element keeps the very first play from being silent;
// the gain hookup waits for the press itself so the shared AudioContext is
// created inside a user gesture, never at module load.
const audio = new Audio(sparklesUrl)
audio.preload = 'auto'

const LEVEL = 0.5

export function playSparkles() {
  if (!SOUNDS_ENABLED) {
    return
  }
  setLevel(audio, LEVEL)
  audio.currentTime = 0
  audio.play().catch(() => {})
}

import { SOUNDS_ENABLED } from './config'
import { setLevel } from './audio-graph'
import writingUrl from './assets/writing-x2.mp3'

// A soft pencil-on-paper scribble that accompanies the typewriter intro text.
// The file bakes in two scribbles with a 0.5s pause between them, so a single
// play covers both intro lines with consistent timing (no JS replay timer).
// The element is preloaded so the first play is not silent. The gain hookup
// waits for playWriting, which runs inside the main button press, so the shared
// AudioContext is created inside a user gesture, never at module load.
const audio = new Audio(writingUrl)
audio.preload = 'auto'

const LEVEL = 1

export function playWriting() {
  if (!SOUNDS_ENABLED) {
    return
  }
  setLevel(audio, LEVEL)
  audio.currentTime = 0
  audio.play().catch(() => {})
}

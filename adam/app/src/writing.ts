import { SOUNDS_ENABLED } from './config'
import writingUrl from './assets/writing.mp3'

// A soft pencil-on-paper scribble that accompanies the typewriter intro text.
// It plays once at the start of typing; the element is preloaded so the first
// play is not silent.
const audio = new Audio(writingUrl)
audio.preload = 'auto'
audio.volume = 0.4

export function playWriting() {
  if (!SOUNDS_ENABLED) {
    return
  }
  audio.currentTime = 0
  audio.play().catch(() => {})
}

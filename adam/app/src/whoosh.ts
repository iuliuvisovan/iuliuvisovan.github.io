import { SOUNDS_ENABLED } from './config'
import whooshInUrl from './assets/whoosh-in.mp3'

// The whoosh plays on the card flip, which comes from a real click, so no
// AudioContext unlock dance is needed anymore. Preloading the element keeps
// the very first flip from being silent.
const audio = new Audio(whooshInUrl)
audio.preload = 'auto'
audio.volume = 0.8

export function playWhoosh() {
  if (!SOUNDS_ENABLED) {
    return
  }
  audio.currentTime = 0
  audio.play().catch(() => {})
}

import { SOUNDS_ENABLED } from './config'
import introUrl from './assets/intro.mp3'

// The spoken "A fost odată... ca niciodată..." intro, pre-generated with the
// same ElevenLabs voice as the story narration and bundled as a static asset
// so it starts instantly at flip with no network round trip.
const audio = new Audio(introUrl)
audio.preload = 'auto'

export function playIntro() {
  if (!SOUNDS_ENABLED) {
    return
  }
  audio.play().catch(() => {})
}

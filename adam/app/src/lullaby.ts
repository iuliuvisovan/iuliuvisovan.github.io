import { PLAYBACK_RATE, SOUNDS_ENABLED } from './config'
import { rampLevel, setLevel } from './audio-graph'
import lullabyUrl from './assets/lullaby.mp3'

let audio: HTMLAudioElement | null = null

export const TARGET_VOLUME = 0.18
const FADE_MS = 3000

// Starts the looping lullaby on the first call and fades it in. Later calls
// are no-ops, so it's safe to fire on every button press. The first call
// happens inside a button press, which is exactly when audio-graph.ts wants
// to create its AudioContext, so connecting here keeps it gesture-blessed.
export function startLullaby() {
  if (!SOUNDS_ENABLED) {
    return
  }
  if (audio) {
    return
  }
  audio = new Audio(lullabyUrl)
  audio.playbackRate = PLAYBACK_RATE
  audio.loop = true
  // The level lives on the element's GainNode, not element.volume, so the
  // fade-in and the TARGET_VOLUME ceiling hold on iOS too
  setLevel(audio, 0)
  rampLevel(audio, TARGET_VOLUME, FADE_MS)
  audio.play().catch(() => {})
}

// Exposes the lullaby element so narration.ts can fade and pause/resume it
// together with the story narration.
export function getLullabyAudio(): HTMLAudioElement | null {
  return audio
}

// Sets the lullaby level directly (clamped 0..1). Used by narration to duck
// the lullaby while the story is being read, then restore it.
export function setLullabyVolume(volume: number) {
  if (!audio) {
    return
  }
  setLevel(audio, volume)
}

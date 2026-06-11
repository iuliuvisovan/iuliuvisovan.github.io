import { STORY_API_URL, SOUNDS_ENABLED } from './config'
import { setLullabyVolume, TARGET_VOLUME } from './lullaby'

let audio: HTMLAudioElement | null = null
let pending: Promise<string> | null = null

// How quiet the lullaby gets while the narration is speaking
const DUCKED_VOLUME = 0.12

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

import { SOUNDS_ENABLED } from './config'
import { setLevel } from './audio-graph'
import writingUrl from './assets/writing.mp3'

// A soft pencil-on-paper scribble that accompanies the typewriter intro text.
// It plays twice in a row at the start of typing; the element is preloaded so
// the first play is not silent. The gain hookup waits for playWriting, which
// runs inside the main button press, so the shared AudioContext is created
// inside a user gesture, never at module load.
const audio = new Audio(writingUrl)
audio.preload = 'auto'

const LEVEL = 1

let remainingReplays = 0
let replayTimeout: ReturnType<typeof setTimeout> | undefined

audio.addEventListener('ended', () => {
  if (remainingReplays > 0) {
    remainingReplays -= 1
    replayTimeout = setTimeout(() => {
      replayTimeout = undefined
      audio.currentTime = 0
      audio.play().catch(() => {})
    }, 700)
  }
})

export function playWriting() {
  if (!SOUNDS_ENABLED) {
    return
  }
  if (replayTimeout !== undefined) {
    clearTimeout(replayTimeout)
    replayTimeout = undefined
  }
  remainingReplays = 1
  setLevel(audio, LEVEL)
  audio.currentTime = 0
  audio.play().catch(() => {})
}

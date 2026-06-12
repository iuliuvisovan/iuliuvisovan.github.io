// Volume control routed through Web Audio. iOS WebKit treats
// HTMLMediaElement.volume as read-only, so every element that needs a level
// other than full, or a fade, is piped through its own GainNode here. Where
// Web Audio is unavailable the same calls fall back to element.volume, so
// call sites never care which path they got.

let context: AudioContext | null = null
let resumeListenersInstalled = false

// createMediaElementSource may only ever be called once per element, so each
// element's GainNode is cached for the element's whole life
const gains = new WeakMap<HTMLMediaElement, GainNode>()

// One active ramp per element; starting a new ramp (or a setLevel) cancels
// the previous one including its pending done callback, so a resume mid-fade
// turns the level around instead of firing the pause the fade had scheduled
const activeRamps = new Map<HTMLMediaElement, () => void>()

const FALLBACK_STEP_MS = 50

// Lazily creates the shared AudioContext. The first call happens inside the
// first button press, so the context is born during a user gesture and starts
// unlocked (or at worst resumable right away).
function getContext(): AudioContext | null {
  if (context) {
    return context
  }
  const Constructor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Constructor) {
    return null
  }
  context = new Constructor()
  installResumeListeners()
  return context
}

// Kicks a suspended context back to life. iOS reports the nonstandard
// 'interrupted' state after a screen lock or phone call, so anything other
// than 'running' gets a resume attempt.
export function resumeAudioContext() {
  if (!context) {
    return
  }
  if ((context.state as string) !== 'running') {
    context.resume().catch(() => {})
  }
}

// iOS suspends or interrupts the context on screen lock and backgrounding,
// which silences every element routed through it even though the elements
// themselves keep playing. If iOS refuses the resume while backgrounded,
// audio stays silent until the next foreground moment, where these listeners
// catch it; that window is the smallest we can make it from script.
function installResumeListeners() {
  if (resumeListenersInstalled) {
    return
  }
  resumeListenersInstalled = true
  document.addEventListener('visibilitychange', resumeAudioContext)
  window.addEventListener('focus', resumeAudioContext)
  document.addEventListener('touchstart', resumeAudioContext, { passive: true })
  document.addEventListener('pointerdown', resumeAudioContext)
}

// Routes an element through its dedicated GainNode, wiring
// source -> gain -> destination exactly once per element. Returns null when
// Web Audio is unavailable, in which case the callers below fall back to
// element.volume.
export function connectElement(element: HTMLMediaElement): GainNode | null {
  const existing = gains.get(element)
  if (existing) {
    return existing
  }
  const audioContext = getContext()
  if (!audioContext) {
    return null
  }
  resumeAudioContext()
  try {
    const source = audioContext.createMediaElementSource(element)
    const gain = audioContext.createGain()
    source.connect(gain)
    gain.connect(audioContext.destination)
    gains.set(element, gain)
    return gain
  } catch {
    return null
  }
}

function cancelRamp(element: HTMLMediaElement) {
  const cancel = activeRamps.get(element)
  if (cancel) {
    cancel()
    activeRamps.delete(element)
  }
}

function clampLevel(level: number) {
  return Math.min(Math.max(level, 0), 1)
}

// Sets an element's level immediately, cancelling any ramp in flight (and
// with it the pause that a fade-out may have scheduled).
export function setLevel(element: HTMLMediaElement, level: number) {
  cancelRamp(element)
  const target = clampLevel(level)
  const gain = connectElement(element)
  if (gain && context) {
    gain.gain.cancelScheduledValues(context.currentTime)
    // Assign .value as well: cancelScheduledValues removes events scheduled
    // at exactly currentTime too, so a ramp started in the same tick would
    // otherwise erase this anchor and fall back to the stale intrinsic value
    gain.gain.value = target
    gain.gain.setValueAtTime(target, context.currentTime)
  } else {
    element.volume = target
  }
}

// Animates an element's level toward `target` over `durationMs`, then calls
// `done` (if given). On the Web Audio path the ramp runs on the audio thread,
// immune to background timer throttling; only the done callback needs a
// main-thread timer, so a throttled tab can at worst delay the pause that
// follows a completed fade, never the fade itself.
export function rampLevel(element: HTMLMediaElement, target: number, durationMs: number, done?: () => void) {
  cancelRamp(element)
  const clamped = clampLevel(target)
  const gain = connectElement(element)
  if (gain && context) {
    const now = context.currentTime
    // Read the level before cancelling: cancelScheduledValues drops the
    // in-flight ramp and snaps .value back to its last anchor, so reading
    // afterwards would restart the fade from the wrong place
    const current = gain.gain.value
    gain.gain.cancelScheduledValues(now)
    gain.gain.setValueAtTime(current, now)
    gain.gain.linearRampToValueAtTime(clamped, now + durationMs / 1000)
    const timer = setTimeout(() => {
      activeRamps.delete(element)
      if (done) {
        done()
      }
    }, durationMs)
    activeRamps.set(element, () => clearTimeout(timer))
    return
  }
  // No Web Audio: step element.volume on a timer, like the original ramp
  const start = element.volume
  const steps = Math.max(Math.round(durationMs / FALLBACK_STEP_MS), 1)
  let step = 0
  const timer = setInterval(() => {
    step += 1
    element.volume = clampLevel(start + ((clamped - start) * step) / steps)
    if (step >= steps) {
      clearInterval(timer)
      activeRamps.delete(element)
      if (done) {
        done()
      }
    }
  }, FALLBACK_STEP_MS)
  activeRamps.set(element, () => clearInterval(timer))
}

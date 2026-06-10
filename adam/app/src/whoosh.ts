import whooshInUrl from './assets/whoosh-in.mp3'
import whooshOutUrl from './assets/whoosh-out.mp3'

let context: AudioContext | null = null
let whooshInBuffer: AudioBuffer | null = null
let whooshOutBuffer: AudioBuffer | null = null
let lastPlayedAt = 0

const GAIN = 0.8
const THROTTLE_MS = 120

async function decode(ctx: AudioContext, url: string) {
  const response = await fetch(url)
  const bytes = await response.arrayBuffer()
  return ctx.decodeAudioData(bytes)
}

// Hover doesn't count as user activation, so the AudioContext can only start
// (or resume) after a real gesture like a click or keypress. Decoding also
// kicks off here, since decodeAudioData needs the context anyway.
function unlock() {
  if (!context) {
    context = new AudioContext()
    decode(context, whooshInUrl).then((buffer) => {
      whooshInBuffer = buffer
    })
    decode(context, whooshOutUrl).then((buffer) => {
      whooshOutBuffer = buffer
    })
  }
  if (context.state !== 'running') {
    context.resume()
  }
}

window.addEventListener('pointerdown', unlock, { once: true })
window.addEventListener('keydown', unlock, { once: true })

function play(buffer: AudioBuffer | null) {
  if (!context || context.state !== 'running' || !buffer) {
    return
  }
  const now = performance.now()
  if (now - lastPlayedAt < THROTTLE_MS) {
    return
  }
  lastPlayedAt = now

  const source = context.createBufferSource()
  source.buffer = buffer
  const gain = context.createGain()
  gain.gain.value = GAIN
  source.connect(gain)
  gain.connect(context.destination)
  source.start()
}

export function playWhooshIn() {
  play(whooshInBuffer)
}

export function playWhooshOut() {
  play(whooshOutBuffer)
}

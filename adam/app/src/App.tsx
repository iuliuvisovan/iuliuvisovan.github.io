import { useState } from 'react'
import GlassButton from './components/GlassButton'
import { startLullaby } from './lullaby'
import tellMe from './assets/tellme.png'

// front -> the image button
// back  -> flipped, "A fost odată ca niciodată…" with animated dots
type Phase = 'front' | 'back'

export default function App() {
  const [phase, setPhase] = useState<Phase>('front')

  function flipCard() {
    if (phase === 'back') {
      return
    }
    startLullaby()
    setPhase('back')
  }

  return (
    <div className="scene">
      <div className="flip" data-phase={phase}>
        <div className="flip-face flip-face--front">
          <GlassButton onClick={flipCard}>
            <img className="button-image" src={tellMe} alt="Tell me a story" />
          </GlassButton>
        </div>
        <div className="flip-face flip-face--back">
          <GlassButton fill onClick={flipCard}>
            <i className="loading-text">
              A fost odată ca niciodată<span className="dots"></span>
            </i>
          </GlassButton>
        </div>
      </div>
    </div>
  )
}

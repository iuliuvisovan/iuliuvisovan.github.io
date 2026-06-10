import { useState } from 'react'
import GlassButton from './components/GlassButton'
import { startLullaby } from './lullaby'
import tellMe from './assets/tellme.png'

// front -> the image button
// back  -> flipped, "A fost odată..." label
type Phase = 'front' | 'back'

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default function App() {
  const [phase, setPhase] = useState<Phase>('front')
  const [showSecondLine, setShowSecondLine] = useState(false)

  async function flipCard() {
    if (phase === 'back') {
      return
    }
    startLullaby()
    setPhase('back')
    await wait(2000)
    setShowSecondLine(true)
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
              A fost odată...
              <br />
              <span className={showSecondLine ? 'loading-line2 loading-line2--visible' : 'loading-line2'}>Ca niciodată...</span>
            </i>
          </GlassButton>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import GlassButton from './components/GlassButton'
import { startLullaby } from './lullaby'
import { prefetchNarration, playNarration } from './narration'
import tellMe from './assets/tellme.png'

// front -> the image button
// back  -> flipped, "A fost odată..." label
type Phase = 'front' | 'back'

// Delay between typed letters in TypedLine
const TYPE_INTERVAL_MS = 56

const LINE_1 = 'A fost odată...'
const LINE_2 = 'Ca niciodată...'

const MOCK_STORY = `A fost odată ca niciodată un băiețel pe nume Adam, care locuia într-o căsuță cu acoperiș roșu, la marginea unei păduri liniștite. În fiecare seară, luna se apleca peste fereastra lui ca să-i spună noapte bună.

Într-o seară, Adam a găsit pe pervaz o steluță mică, obosită de atâta strălucit. A învelit-o încet într-o batistă moale și i-a șoptit o poveste, până când steluța a adormit zâmbind.

Drept mulțumire, steluța i-a presărat pe pernă un praf auriu de vise frumoase. Adam a închis ochii, a tras plapuma până la bărbie și a plutit lin spre tărâmul somnului, unde toate poveștile încep cu „a fost odată”.`

// Doubled for now so the expanded card has enough content to scroll
const LONG_STORY = `${MOCK_STORY}\n\n${MOCK_STORY}`

// Only the first two paragraphs get narrated for now
const NARRATION_TEXT = MOCK_STORY.split('\n\n').slice(0, 2).join('\n\n')

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

type TypedLineProps = {
  text: string
  active: boolean
}

// Types `text` letter by letter once `active` becomes true. The untyped
// remainder stays in the DOM with visibility hidden, so the line always
// occupies its full width and the centered text never shifts while letters
// appear.
function TypedLine({ text, active }: TypedLineProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!active) {
      return
    }
    const timer = setInterval(() => {
      setCount((current) => {
        if (current >= text.length) {
          clearInterval(timer)
          return current
        }
        return current + 1
      })
    }, TYPE_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [active, text])

  return (
    <>
      {text.slice(0, count)}
      <span className="untyped">{text.slice(count)}</span>
    </>
  )
}

export default function App() {
  const [phase, setPhase] = useState<Phase>('front')
  const [face, setFace] = useState<Phase>('front')
  const [line1Active, setLine1Active] = useState(false)
  const [line2Active, setLine2Active] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [storyVisible, setStoryVisible] = useState(false)

  async function flipCard() {
    if (phase === 'back') {
      return
    }
    startLullaby()
    prefetchNarration(NARRATION_TEXT)
    setPhase('back')
    // The CSS flip animation runs 700ms; the faces swap at the 90° edge-on
    // midpoint (350ms), driven from React so no filled CSS animation lingers.
    await wait(350)
    setFace('back')
    await wait(350)
    setLine1Active(true)
    // Line 1 finishes typing, then an 800ms breath before line 2 starts
    await wait(LINE_1.length * TYPE_INTERVAL_MS + 800)
    setLine2Active(true)
    // Line 2 finishes typing, an 800ms breath, then the card expands (900ms
    // CSS transition) and the story fades in once the expansion settles.
    await wait(LINE_2.length * TYPE_INTERVAL_MS + 800)
    setExpanded(true)
    await wait(900)
    setStoryVisible(true)
    playNarration()
  }

  return (
    <div className="scene">
      <div className="flip" data-phase={phase} data-face={face} data-expanded={expanded ? 'true' : 'false'}>
        <div className="flip-face flip-face--front">
          <GlassButton onClick={flipCard}>
            <img className="button-image" src={tellMe} alt="Tell me a story" />
          </GlassButton>
        </div>
        <div className="flip-face flip-face--back">
          <GlassButton fill silent onClick={flipCard}>
            <i className="loading-text">
              <TypedLine text={LINE_1} active={line1Active} />
              <br />
              <span className="loading-line2">
                <TypedLine text={LINE_2} active={line2Active} />
              </span>
            </i>
            <div className={storyVisible ? 'story-text story-text--visible' : 'story-text'}>{LONG_STORY}</div>
          </GlassButton>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import GlassButton from './components/GlassButton'
import tellMe from './assets/tellme.png'
import { startLullaby } from './lullaby'
import { playWhoosh } from './whoosh'
import { playIntro } from './intro'
import { startNarration, pauseStoryAudio, resumeStoryAudio } from './narration'
import { STORIES } from './stories'

// front -> the image button
// back  -> flipped, "A fost odată..." label
type Phase = 'front' | 'back'

// Delay between typed letters in TypedLine
const TYPE_INTERVAL_MS = 56

const LINE_1 = 'A fost odată...'
const LINE_2 = 'Ca niciodată...'

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

function PauseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="#964e11" aria-hidden="true">
      <rect x="6" y="4" width="4" height="16" rx="1.5" />
      <rect x="14" y="4" width="4" height="16" rx="1.5" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="#964e11" aria-hidden="true">
      <path d="M8 5 L19 12 L8 19 Z" stroke="#964e11" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

export default function App() {
  const [phase, setPhase] = useState<Phase>('front')
  const [face, setFace] = useState<Phase>('front')
  const [line1Active, setLine1Active] = useState(false)
  const [line2Active, setLine2Active] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [storyVisible, setStoryVisible] = useState(false)
  const [paused, setPaused] = useState(false)
  const [storyId, setStoryId] = useState(1)
  // Index of the narration chunk currently speaking; its two paragraphs get
  // the highlight. Null before playback and after stopNarration.
  const [activeChunk, setActiveChunk] = useState<number | null>(null)
  const storyContentRef = useRef<HTMLSpanElement>(null)
  // The glass highlight is a JS-positioned overlay living in the <button>,
  // outside the masked scrolling span — the span's mask-image creates a
  // backdrop root, so a backdrop-filter inside it could never blur the page.
  const glassPillRef = useRef<HTMLDivElement>(null)

  const selectedStory = STORIES.find((story) => story.id === storyId) ?? STORIES[0]

  // Moves the pill onto the active paragraph. Both the <p> (via the positioned
  // <button>, its offsetParent) and the pill share the button's coordinate
  // space, which does not change with scroll — so offset* values map directly
  // onto the pill's top/left, and CSS transitions animate the morph.
  function placeGlassPill() {
    const pill = glassPillRef.current
    const container = storyContentRef.current
    if (!pill || !container) {
      return
    }
    const paragraph = container.querySelector('.story-paragraph--active') as HTMLElement | null
    if (!paragraph) {
      pill.style.opacity = '0'
      return
    }
    pill.style.top = `${paragraph.offsetTop}px`
    pill.style.left = `${paragraph.offsetLeft}px`
    pill.style.width = `${paragraph.offsetWidth}px`
    pill.style.height = `${paragraph.offsetHeight}px`
    pill.style.opacity = '1'
    // The pill doesn't live in the scroller, so it counters scroll manually
    pill.style.transform = `translateY(${-container.scrollTop}px)`
  }

  // The text scrolls but the pill does not: track scrollTop with a transform.
  // transform is deliberately excluded from the pill's CSS transition list so
  // this tracking is instant, while top/left/width/height morphs stay animated.
  useEffect(() => {
    const container = storyContentRef.current
    if (!container) {
      return
    }
    function followScroll() {
      const pill = glassPillRef.current
      if (pill && container) {
        pill.style.transform = `translateY(${-container.scrollTop}px)`
      }
    }
    window.addEventListener('resize', placeGlassPill)
    container.addEventListener('scroll', followScroll, { passive: true })
    return () => {
      window.removeEventListener('resize', placeGlassPill)
      container.removeEventListener('scroll', followScroll)
    }
  }, [])

  // Keep the narrated paragraphs in view: when the active chunk changes,
  // scroll the story container so the chunk's first paragraph sits 120px below
  // the top. offsetTop is relative to the positioned <button>, not the scrolling
  // span, so the target comes from rect difference plus current scrollTop.
  useEffect(() => {
    if (activeChunk === null) {
      const pill = glassPillRef.current
      if (pill) {
        pill.style.opacity = '0'
      }
      return
    }
    const container = storyContentRef.current
    const paragraph = container?.querySelector('.story-paragraph--active') as HTMLElement | null
    if (!container || !paragraph) {
      return
    }
    const top = paragraph.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop - 120
    container.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' })
    placeGlassPill()
  }, [activeChunk])

  function playStory(id: number) {
    setStoryId(id)
    setPaused(false)
    const story = STORIES.find((candidate) => candidate.id === id) ?? STORIES[0]
    const index = STORIES.findIndex((candidate) => candidate.id === story.id)
    const next = STORIES[(index + 1) % STORIES.length]
    // One narration chunk per paragraph, with a lullaby-only pause between
    startNarration(id, story.paragraphs, () => playStory(next.id), setActiveChunk)
    storyContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function selectStory(id: number) {
    if (id === storyId) {
      return
    }
    playStory(id)
  }

  function toggleStoryAudio() {
    if (paused) {
      resumeStoryAudio()
      setPaused(false)
    } else {
      pauseStoryAudio()
      setPaused(true)
    }
  }

  async function flipCard() {
    if (phase === 'back') {
      return
    }
    startLullaby()
    playWhoosh()
    setTimeout(() => playIntro(), 1000)
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
    playStory(selectedStory.id)
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
          <GlassButton
            fill
            onClick={flipCard}
            contentRef={storyContentRef}
            overlay={<div className="story-glass-pill" ref={glassPillRef} />}
          >
            <i className="loading-text">
              <TypedLine text={LINE_1} active={line1Active} />
              <br />
              <span className="loading-line2">
                <TypedLine text={LINE_2} active={line2Active} />
              </span>
            </i>
            <div className={storyVisible ? 'story-text story-text--visible' : 'story-text'}>
              {selectedStory.paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className={index === activeChunk ? 'story-paragraph story-paragraph--active' : 'story-paragraph'}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </GlassButton>
          {storyVisible && (
            <div className="story-picker">
              {STORIES.map((story) => (
                <button
                  key={story.id}
                  className={story.id === storyId ? 'story-picker-button story-picker-button--active' : 'story-picker-button'}
                  onClick={() => selectStory(story.id)}
                  aria-label={`Povestea ${story.id}`}
                >
                  {story.id}
                </button>
              ))}
            </div>
          )}
          {storyVisible && (
            <button className="pause-button" onClick={toggleStoryAudio} aria-label={paused ? 'Continuă' : 'Pauză'}>
              {paused ? <PlayIcon /> : <PauseIcon />}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

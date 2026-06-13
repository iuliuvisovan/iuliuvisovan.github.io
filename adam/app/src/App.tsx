import { useEffect, useRef, useState } from 'react'
import tellMe from './assets/tellme.png'
import { startLullaby } from './lullaby'
import { playSparkles } from './sparkles'
import { playWriting } from './writing'
import { startNarration, primeVoice, pauseStoryAudio, resumeStoryAudio, pauseVoice, resumeVoice, pauseMusic, resumeMusic } from './narration'
import { STORIES } from './stories'

// button -> the image button on the background
// intro  -> "A fost odată..." typed lines on the background
// story  -> the story player
type Phase = 'button' | 'intro' | 'story'

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

type ChannelIconProps = {
  slashed: boolean
}

// Diagonal slash drawn over a channel icon when that channel is paused. The
// faint white casing keeps the slash readable over the brown icon shapes.
function IconSlash() {
  return (
    <>
      <line x1="4" y1="4" x2="20" y2="20" stroke="rgba(255,255,255,0.9)" strokeWidth="4" strokeLinecap="round" />
      <line x1="4" y1="4" x2="20" y2="20" stroke="#964e11" strokeWidth="2" strokeLinecap="round" />
    </>
  )
}

function VoiceIcon({ slashed }: ChannelIconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#964e11" aria-hidden="true">
      <path
        d="M7 2 H17 A4 4 0 0 1 21 6 V13 A4 4 0 0 1 17 17 H10.5 L5.5 21.5 V16.6 A4 4 0 0 1 3 13 V6 A4 4 0 0 1 7 2 Z"
        fill="none"
        stroke="#964e11"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <rect x="7" y="5.5" width="10" height="2" rx="1" />
      <rect x="7" y="9" width="8" height="2" rx="1" />
      <rect x="7" y="12.5" width="5" height="2" rx="1" />
      {slashed && <IconSlash />}
    </svg>
  )
}

function MusicIcon({ slashed }: ChannelIconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#964e11" aria-hidden="true">
      <circle cx="9" cy="17.5" r="3.5" />
      <rect x="10.5" y="4" width="2" height="14" />
      <path d="M12.5 4 q4.5 1 4.5 5.5 q-2 -2.5 -4.5 -2.5 Z" />
      {slashed && <IconSlash />}
    </svg>
  )
}

export default function App() {
  const [phase, setPhase] = useState<Phase>('button')
  const [buttonFading, setButtonFading] = useState(false)
  const [line1Active, setLine1Active] = useState(false)
  const [line2Active, setLine2Active] = useState(false)
  const [introFading, setIntroFading] = useState(false)
  const [storyShown, setStoryShown] = useState(false)
  const [paused, setPaused] = useState(false)
  const [voicePaused, setVoicePaused] = useState(false)
  const [musicPaused, setMusicPaused] = useState(false)
  const [storyId, setStoryId] = useState(() => STORIES[Math.floor(Math.random() * STORIES.length)].id)
  // Index of the narration chunk currently speaking; its paragraph gets the
  // highlight. Null before playback and after stopNarration.
  const [activeChunk, setActiveChunk] = useState<number | null>(null)
  const storyContentRef = useRef<HTMLDivElement>(null)
  // The glass highlight is a JS-positioned overlay living in .story-stage,
  // outside the masked scroller, the scroller's mask-image creates a backdrop
  // root, so a backdrop-filter inside it could never blur the page.
  const glassPillRef = useRef<HTMLDivElement>(null)

  // Auto-collapse the mobile browser chrome on load: the document carries
  // 400px of extra scroll headroom (see html min-height in app.css), 200px
  // above and 200px below, so scrolling to 200 centers the page and lets it
  // bleed edge-to-edge top and bottom without a manual swipe. Mobile only:
  // the headroom and body margin only exist under the 520px breakpoint, so on
  // desktop there's nothing to scroll and we must not nudge the page.
  useEffect(() => {
    if (window.matchMedia('(max-width: 520px)').matches) {
      window.scrollTo(0, 200)
    }
  }, [])

  const selectedStory = STORIES.find((story) => story.id === storyId) ?? STORIES[0]

  // The pill's fade mask reuses the stage's --story-fade-mask gradient, but
  // the mask box is the pill itself: sizing the mask to the stage and shifting
  // it up by the pill's visual top (offsetTop minus the countered scrollTop)
  // pins the gradient to the stage, so the pill dissolves at the same bands
  // as the masked text.
  function alignPillMask(pill: HTMLElement, visualTop: number) {
    const stage = pill.parentElement
    if (!stage) {
      return
    }
    const size = `100% ${stage.clientHeight}px`
    const position = `0px ${-visualTop}px`
    pill.style.setProperty('mask-size', size)
    pill.style.setProperty('mask-position', position)
    pill.style.setProperty('-webkit-mask-size', size)
    pill.style.setProperty('-webkit-mask-position', position)
  }

  // Moves the pill onto the active paragraph. Both the <p> (via .story-stage,
  // its offsetParent, the scroller is unpositioned) and the pill share the
  // stage's coordinate space, which does not change with scroll, so offset*
  // values map directly onto the pill's top/left, and CSS transitions animate
  // the morph.
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
    alignPillMask(pill, paragraph.offsetTop - container.scrollTop)
  }

  // The text scrolls but the pill does not: track scrollTop with a transform.
  // transform is deliberately excluded from the pill's CSS transition list so
  // this tracking is instant, while top/left/width/height morphs stay animated.
  // The scroller only exists in the story phase, so listeners attach then.
  useEffect(() => {
    if (phase !== 'story') {
      return
    }
    const container = storyContentRef.current
    if (!container) {
      return
    }
    function followScroll() {
      const pill = glassPillRef.current
      if (pill && container) {
        pill.style.transform = `translateY(${-container.scrollTop}px)`
        alignPillMask(pill, parseFloat(pill.style.top || '0') - container.scrollTop)
      }
    }
    window.addEventListener('resize', placeGlassPill)
    container.addEventListener('scroll', followScroll, { passive: true })
    return () => {
      window.removeEventListener('resize', placeGlassPill)
      container.removeEventListener('scroll', followScroll)
    }
  }, [phase])

  // Keep the narrated paragraph in view: when the active chunk changes,
  // scroll the story container so the paragraph sits 120px below the top.
  // offsetTop is relative to the positioned .story-stage, not the scroller,
  // so the target comes from rect difference plus current scrollTop.
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
    // startNarration resets the audio module's channel flags; mirror it here
    setVoicePaused(false)
    setMusicPaused(false)
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
      // resumeStoryAudio brings everything back, so the channel toggles reset
      setVoicePaused(false)
      setMusicPaused(false)
    } else {
      pauseStoryAudio()
      setPaused(true)
    }
  }

  function toggleVoice() {
    if (voicePaused) {
      resumeVoice()
      setVoicePaused(false)
    } else {
      pauseVoice()
      setVoicePaused(true)
    }
  }

  function toggleMusic() {
    if (musicPaused) {
      resumeMusic()
      setMusicPaused(false)
    } else {
      pauseMusic()
      setMusicPaused(true)
    }
  }

  async function beginStorySequence() {
    if (phase !== 'button' || buttonFading) {
      return
    }
    // Bless the voice element inside the tap gesture so the delayed narration
    // (it starts seconds later) can still play on iOS.
    primeVoice(selectedStory.id)
    playSparkles()
    setButtonFading(true)
    await wait(1400)
    await wait(500)
    playWriting()
    await wait(500)
    startLullaby()
    setPhase('intro')
    await wait(20)
    setLine1Active(true)
    // Line 1 finishes typing, then line 2 starts a touch before the line 1
    // typing fully settles
    await wait(LINE_1.length * TYPE_INTERVAL_MS - 200)
    setLine2Active(true)
    // Line 2 finishes typing, an 800ms breath, then the intro fades out
    await wait(LINE_2.length * TYPE_INTERVAL_MS + 800)
    setIntroFading(true)
    await wait(700)
    setPhase('story')
    // The stage mounts at opacity 0; a beat later the visible class lands so
    // the 800ms fade-in actually transitions instead of snapping.
    await wait(20)
    setStoryShown(true)
    // Let the stage finish fading in and settle for a beat before the
    // narration audio starts (visuals/animations above are unaffected).
    await wait(1000)
    playStory(selectedStory.id)
  }

  return (
    <>
      {phase === 'button' && (
        <button
          className={buttonFading ? 'tell-button tell-button--fading' : 'tell-button'}
          onClick={beginStorySequence}
        >
          <img src={tellMe} alt="Tell me a story" />
        </button>
      )}
      {phase === 'intro' && (
        <div className={introFading ? 'intro-text intro-text--fading' : 'intro-text'}>
          <TypedLine text={LINE_1} active={line1Active} />
          <br />
          <span className="intro-line2">
            <TypedLine text={LINE_2} active={line2Active} />
          </span>
        </div>
      )}
      {phase === 'story' && (
        <div className={storyShown ? 'story-stage story-stage--visible' : 'story-stage'}>
          <div className="story-glass-pill" ref={glassPillRef} />
          <div className="story-scroll" ref={storyContentRef}>
            <div className="story-text">
              {selectedStory.paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className={index === activeChunk ? 'story-paragraph story-paragraph--active' : 'story-paragraph'}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
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
          <div className="audio-controls">
            <button
              className="channel-button"
              onClick={toggleVoice}
              aria-label={voicePaused ? 'Pornește vocea' : 'Oprește vocea'}
            >
              <VoiceIcon slashed={voicePaused} />
            </button>
            <button className="pause-button" onClick={toggleStoryAudio} aria-label={paused ? 'Continuă' : 'Pauză'}>
              {paused ? <PlayIcon /> : <PauseIcon />}
            </button>
            <button
              className="channel-button"
              onClick={toggleMusic}
              aria-label={musicPaused ? 'Pornește muzica' : 'Oprește muzica'}
            >
              <MusicIcon slashed={musicPaused} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

import { useState } from 'react'
import GlassButton from './components/GlassButton'
import tellMe from './assets/tellme.png'

// Backend is mocked for now. To restore the real Cloudflare Worker call,
// re-import STORY_API_URL from './config' and fetch it (see git history).
const MOCK_STORY = `Once upon a time, in a cozy little forest, there lived a tiny bunny named Adam. He had the softest, fluffiest fur, and big, twinkling eyes that shimmered like stars. Every evening, as the sun began to set, Adam would hop around his favorite meadow, filled with bright flowers that danced in the gentle breeze.

One magical night, Adam found a sparkling moonbeam shining down just for him. Curious, he followed the moonbeam to a glistening pond. There, he saw his reflection glowing like the night sky. "Hello, little bunny!" said the moonbeam, "Would you like to meet the stars?"

With a happy little hop, Adam nodded. The moonbeam lifted him up, and suddenly, he was flying high into the sky! The stars twinkled and giggled, welcoming him to their sparkling party. They danced and played, sharing stories of dreams and wishes.

As the night grew deep, the moonbeam gently brought Adam back to his cozy meadow. Tired but happy, Adam snuggled down into the soft grass. "Goodnight, stars," he whispered, knowing they would always be there, shining bright just for him.

And with that, little Adam drifted off to sleep, dreaming of his starry adventures.`

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default function App() {
  const [loading, setLoading] = useState(false)
  const [story, setStory] = useState('')

  async function tellStory() {
    if (loading) {
      return
    }
    setLoading(true)
    setStory('')
    await delay(1500)
    setStory(MOCK_STORY)
    setLoading(false)
  }

  return (
    <>
      <GlassButton onClick={tellStory}>
        {loading ? (
          <i>Once upon a time…</i>
        ) : (
          <img className="button-image" src={tellMe} alt="Tell me a story" />
        )}
      </GlassButton>
      {story && <div className="story">{story}</div>}
    </>
  )
}

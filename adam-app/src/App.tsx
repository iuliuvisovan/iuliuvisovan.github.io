import { useState } from 'react'
import GlassButton from './components/GlassButton'
import { STORY_API_URL } from './config'

export default function App() {
  const [loading, setLoading] = useState(false)
  const [story, setStory] = useState('')
  const [error, setError] = useState('')

  async function tellStory() {
    if (loading) {
      return
    }
    setLoading(true)
    setError('')
    setStory('')
    try {
      const res = await fetch(STORY_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }
      const data = (await res.json()) as { story?: string }
      setStory(data.story ?? '')
    } catch {
      setError('Could not fetch a story. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <GlassButton onClick={tellStory}>
        {loading ? 'Once upon a time…' : 'Tell me a story'}
      </GlassButton>
      {story && <div className="story">{story}</div>}
      {error && <div className="story story--error">{error}</div>}
    </>
  )
}

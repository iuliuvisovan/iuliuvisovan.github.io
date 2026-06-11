import type { ReactNode, Ref } from 'react'

type Props = {
  children: ReactNode
  onClick?: () => void
  // When true, the glass stretches to fill its parent (used for the flip's
  // back face so both faces share the front's size). Default auto-sizes.
  fill?: boolean
  // Ref to the inner content span (used by the back face to scroll the story
  // back to the top when a different story is picked).
  contentRef?: Ref<HTMLSpanElement>
}

// Liquid-glass button (Petr-Knoll "Glass Button"). Styles live in glass.css.
export default function GlassButton({ children, onClick, fill, contentRef }: Props) {
  return (
    <div className={fill ? 'button-wrap button-wrap--fill' : 'button-wrap'}>
      <button onClick={onClick}>
        <span ref={contentRef}>{children}</span>
      </button>
      <div className="button-shadow"></div>
    </div>
  )
}

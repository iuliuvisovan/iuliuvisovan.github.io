import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  onClick?: () => void
}

// Liquid-glass button (Petr-Knoll "Glass Button"). The text sits in <span><i>
// so the gradient fill (background-clip: text on <i>) and its drop-shadow live
// on their own layer, keeping the shadow behind the glyphs. Styles in glass.css.
export default function GlassButton({ children, onClick }: Props) {
  return (
    <div className="button-wrap">
      <button onClick={onClick}>
        <span><i>{children}</i></span>
      </button>
      <div className="button-shadow"></div>
    </div>
  )
}

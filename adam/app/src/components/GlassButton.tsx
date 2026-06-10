import type { ReactNode } from 'react'
import { playWhooshIn, playWhooshOut } from '../whoosh'

type Props = {
  children: ReactNode
  onClick?: () => void
  // When true, the glass stretches to fill its parent (used for the flip's
  // back face so both faces share the front's size). Default auto-sizes.
  fill?: boolean
}

// Liquid-glass button (Petr-Knoll "Glass Button"). Styles live in glass.css.
export default function GlassButton({ children, onClick, fill }: Props) {
  return (
    <div className={fill ? 'button-wrap button-wrap--fill' : 'button-wrap'}>
      <button onClick={onClick} onPointerEnter={playWhooshIn} onPointerLeave={playWhooshOut}>
        <span>{children}</span>
      </button>
      <div className="button-shadow"></div>
    </div>
  )
}

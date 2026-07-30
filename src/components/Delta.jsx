import { ArrowUp, ArrowDown, Minus } from 'lucide-react'

const toneClasses = {
  clean: 'text-clean',
  danger: 'text-danger',
  neutral: 'text-muted dark:text-muted-dark'
}

// goodDirection: which direction of change counts as an improvement ('down' for
// metrics where lower is better, e.g. NTU; 'up' where higher is better).
// neutral: render informationally (gray) regardless of direction — for metrics
// that are expected to trend one way naturally (e.g. filter wear) rather than
// representing good/bad news.
export default function Delta({ percent, goodDirection = 'down', neutral = false, suffix = 'vs yesterday' }) {
  const rounded = Math.round(percent)

  if (rounded === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-muted dark:text-muted-dark">
        <Minus size={12} />
        No change {suffix}
      </span>
    )
  }

  const direction = rounded > 0 ? 'up' : 'down'
  const isGood = direction === goodDirection
  const tone = neutral ? 'neutral' : isGood ? 'clean' : 'danger'
  const Icon = direction === 'up' ? ArrowUp : ArrowDown

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${toneClasses[tone]}`}>
      <Icon size={12} />
      {Math.abs(rounded)}% {suffix}
    </span>
  )
}

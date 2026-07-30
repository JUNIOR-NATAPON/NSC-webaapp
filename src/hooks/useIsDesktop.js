import { useEffect, useState } from 'react'

// Tracks whether the viewport is at Tailwind's md breakpoint (768px) or wider.
// Used to bump chart tick/dot sizing so charts feel proportionate on larger
// screens instead of staying phone-sized inside a bigger box.
export default function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 768 : false
  )

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const handler = (e) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return isDesktop
}

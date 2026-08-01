import { useEffect, useRef } from 'react'
import bodyMask from '../assets/human-mask.png'
import bodyOutline from '../assets/human-outline.png'

// Matches the pixel dimensions of human-outline.png / human-mask.png so the
// wave fill lines up exactly with the silhouette they were derived from.
const IMG_WIDTH = 281
const IMG_HEIGHT = 401
const WAVE_PERIOD = IMG_WIDTH / 4
const WAVE_DURATION_MS = 4000

const fillForTone = { clean: 'fill-clean', warn: 'fill-warn', danger: 'fill-danger' }

function buildWavePath(waveY) {
  // Draws extra periods past both edges so the loop can scroll by exactly
  // one period and repeat seamlessly, however the mask crops it.
  let d = `M -${WAVE_PERIOD} ${waveY}`
  const segments = Math.ceil((IMG_WIDTH + WAVE_PERIOD * 2) / WAVE_PERIOD)
  for (let i = 0; i < segments; i++) {
    const x0 = -WAVE_PERIOD + WAVE_PERIOD * i + WAVE_PERIOD / 2
    const x1 = -WAVE_PERIOD + WAVE_PERIOD * (i + 1)
    d += ` C ${x0} ${waveY - 7}, ${x0} ${waveY + 7}, ${x1} ${waveY}`
  }
  const rightEdge = -WAVE_PERIOD + WAVE_PERIOD * segments
  d += ` L ${rightEdge} ${IMG_HEIGHT} L -${WAVE_PERIOD} ${IMG_HEIGHT} Z`
  return d
}

export default function BodyFillGauge({ percent, tone = 'clean', width = 70, height = 100 }) {
  const clamped = Math.min(100, Math.max(0, percent))
  const waveY = IMG_HEIGHT - (clamped / 100) * IMG_HEIGHT
  const wavePath = buildWavePath(waveY)
  const pathRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frameId
    const start = performance.now()
    function tick(now) {
      const elapsed = (now - start) % WAVE_DURATION_MS
      const x = -(elapsed / WAVE_DURATION_MS) * WAVE_PERIOD
      pathRef.current?.setAttribute('transform', `translate(${x} 0)`)
      frameId = requestAnimationFrame(tick)
    }
    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [])

  return (
    <div className="relative shrink-0" style={{ width, height }}>
      <div
        className="absolute inset-0"
        style={{
          WebkitMaskImage: `url(${bodyMask})`,
          maskImage: `url(${bodyMask})`,
          WebkitMaskMode: 'alpha',
          maskMode: 'alpha',
          WebkitMaskSize: '100% 100%',
          maskSize: '100% 100%',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat'
        }}
      >
        <svg viewBox={`0 0 ${IMG_WIDTH} ${IMG_HEIGHT}`} className="w-full h-full">
          <path ref={pathRef} d={wavePath} className={`${fillForTone[tone]} transition-[fill] duration-700 ease-out`} />
        </svg>
      </div>

      <img src={bodyOutline} alt="" className="absolute inset-0 w-full h-full object-contain dark:invert" />
    </div>
  )
}

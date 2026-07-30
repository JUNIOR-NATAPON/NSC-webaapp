const strokeForTone = { clean: 'stroke-clean', warn: 'stroke-warn', danger: 'stroke-danger' }

export default function RadialGauge({ percent, tone = 'clean', size = 96, strokeWidth = 10, children }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.min(100, Math.max(0, percent))
  const offset = circumference * (1 - clamped / 100)

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          className="stroke-black/5 dark:stroke-white/10"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          className={`${strokeForTone[tone]} transition-[stroke-dashoffset] duration-700 ease-out`}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  )
}

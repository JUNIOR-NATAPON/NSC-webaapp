const tones = {
  clean: 'bg-clean-bg text-clean',
  warn: 'bg-warn-bg text-warn',
  danger: 'bg-danger-bg text-danger'
}

export default function Badge({ children, tone = 'clean' }) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 md:px-4 md:py-1.5 rounded-full text-xs md:text-sm font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  )
}

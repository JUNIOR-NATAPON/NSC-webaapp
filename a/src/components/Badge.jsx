const tones = {
  clean: 'bg-clean-bg text-clean dark:bg-clean/15',
  warn: 'bg-warn-bg text-warn dark:bg-warn/15',
  danger: 'bg-danger-bg text-danger dark:bg-danger/15'
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

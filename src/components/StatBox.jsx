export default function StatBox({ label, value, unit = 'NTU' }) {
  return (
    <div className="flex-1 text-center">
      <p className="text-xs md:text-sm text-muted dark:text-muted-dark mb-1">{label}</p>
      <p className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-ink dark:text-white">
        {value}
      </p>
      <p className="text-[11px] md:text-sm text-muted dark:text-muted-dark">{unit}</p>
    </div>
  )
}

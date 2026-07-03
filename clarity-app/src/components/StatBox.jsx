export default function StatBox({ label, value, unit = 'NTU' }) {
  return (
    <div className="flex-1 text-center">
      <p className="text-xs text-muted mb-1">{label}</p>
      <p className="font-display font-extrabold text-2xl sm:text-3xl text-ink">
        {value}
      </p>
      <p className="text-[11px] text-muted">{unit}</p>
    </div>
  )
}

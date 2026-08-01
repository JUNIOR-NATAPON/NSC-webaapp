import { ArrowUpRight } from 'lucide-react'
import Card from '../components/Card.jsx'
import RadialGauge from '../components/RadialGauge.jsx'
import { useDevice } from '../context/DeviceContext.jsx'

function toneForRemaining(pct) {
  if (pct >= 50) return 'clean'
  if (pct >= 20) return 'warn'
  return 'danger'
}

export default function Filter() {
  const { device, filterLog, loading } = useDevice()

  if (loading) return <p className="text-sm text-muted dark:text-muted-dark">Loading...</p>

  const remaining = device?.filterPercentRemaining ?? null

  return (
    <div className="space-y-6 md:max-w-lg lg:max-w-2xl">
      <h1 className="font-display font-bold text-xl md:text-2xl lg:text-3xl">Status</h1>

      <Card className="flex flex-col items-center text-center">
        {remaining === null ? (
          <p className="text-sm text-muted dark:text-muted-dark py-6">No device paired yet.</p>
        ) : (
          <>
            <RadialGauge percent={remaining} tone={toneForRemaining(remaining)} size={120} strokeWidth={11}>
              <span className="font-display font-extrabold text-3xl">{remaining}%</span>
              <span className="text-xs text-muted dark:text-muted-dark">remaining</span>
            </RadialGauge>
            <p className="text-sm font-semibold mt-3">Filter life remaining</p>
          </>
        )}
      </Card>

      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px bg-black/10 dark:bg-white/10 flex-1" />
          <p className="text-sm font-semibold text-muted dark:text-muted-dark">Filter Log</p>
          <div className="h-px bg-black/10 dark:bg-white/10 flex-1" />
        </div>

        <Card className="p-0 overflow-hidden">
          {filterLog.length === 0 ? (
            <p className="text-sm text-muted dark:text-muted-dark px-5 py-4">No filter changes logged yet.</p>
          ) : (
            filterLog.map((item, i) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 px-5 py-4 text-sm ${
                  i !== filterLog.length - 1 ? 'border-b border-black/5 dark:border-white/10' : ''
                }`}
              >
                <ArrowUpRight size={16} className="text-brand" />
                <span className="font-medium flex-1">
                  {item.timestamp?.toDate ? item.timestamp.toDate().toLocaleDateString() : '—'}
                </span>
                <span className="text-muted dark:text-muted-dark">
                  {item.timestamp?.toDate
                    ? item.timestamp.toDate().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
                    : ''}
                </span>
              </div>
            ))
          )}
        </Card>
      </div>
    </div>
  )
}

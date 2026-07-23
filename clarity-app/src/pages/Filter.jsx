import { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import Card from '../components/Card.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { subscribeToFilterLog, subscribeToPrimaryDevice } from '../lib/firestore.js'

export default function Filter() {
  const { user } = useAuth()
  const [device, setDevice] = useState(null)
  const [log, setLog] = useState([])

  useEffect(() => {
    if (!user) return
    const unsubDevice = subscribeToPrimaryDevice(user.uid, (d) => {
      setDevice(d)
      if (d) {
        return subscribeToFilterLog(d.id, setLog)
      }
      setLog([])
    })
    return unsubDevice
  }, [user])

  const remaining = device?.filterPercentRemaining ?? null
  const needReplacement = remaining !== null ? 100 - remaining : null

  return (
    <div className="space-y-6 md:max-w-lg lg:max-w-2xl">
      <h1 className="font-display font-bold text-xl md:text-2xl lg:text-3xl">Status</h1>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted mb-1">Need replacement</p>
          </div>
          <span
            className={`text-white font-display font-extrabold text-2xl px-5 py-2 rounded-xl ${
              needReplacement === null
                ? 'bg-muted'
                : needReplacement >= 80
                ? 'bg-danger'
                : needReplacement >= 40
                ? 'bg-warn'
                : 'bg-clean'
            }`}
          >
            {needReplacement === null ? '—' : `${needReplacement}%`}
          </span>
        </div>
      </Card>

      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px bg-black/10 flex-1" />
          <p className="text-sm font-semibold text-muted">Filter Log</p>
          <div className="h-px bg-black/10 flex-1" />
        </div>

        <Card className="p-0 overflow-hidden">
          {log.length === 0 ? (
            <p className="text-sm text-muted px-5 py-4">No filter changes logged yet.</p>
          ) : (
            log.map((item, i) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 px-5 py-4 text-sm ${
                  i !== log.length - 1 ? 'border-b border-black/5' : ''
                }`}
              >
                <ArrowUpRight size={16} className="text-brand" />
                <span className="font-medium flex-1">
                  {item.timestamp?.toDate ? item.timestamp.toDate().toLocaleDateString() : '—'}
                </span>
                <span className="text-muted">
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

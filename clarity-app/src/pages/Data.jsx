import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { History as HistoryIcon, ChevronRight } from 'lucide-react'
import Card from '../components/Card.jsx'
import Badge from '../components/Badge.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { subscribeToPrimaryDevice } from '../lib/firestore.js'

const guide = [
  { range: '0-4 NTU', label: 'clean, safe', tone: 'clean' },
  { range: '4-10 NTU', label: 'moderate', tone: 'warn' },
  { range: '>10 NTU', label: 'high, filter need', tone: 'danger' }
]

function toneForValue(v) {
  if (v <= 4) return 'clean'
  if (v <= 10) return 'warn'
  return 'danger'
}

function labelForValue(v) {
  if (v <= 4) return 'Clean'
  if (v <= 10) return 'Moderate'
  return 'High'
}

export default function Data() {
  const { user } = useAuth()
  const [device, setDevice] = useState(null)

  useEffect(() => {
    if (!user) return
    return subscribeToPrimaryDevice(user.uid, setDevice)
  }, [user])

  if (!device) {
    return (
      <div className="space-y-6 md:max-w-lg lg:max-w-2xl">
        <h1 className="font-display font-bold text-xl md:text-2xl lg:text-3xl">Current turbidity</h1>
        <Card className="text-center py-10">
          <p className="text-sm text-muted">No device paired yet.</p>
        </Card>
      </div>
    )
  }

  const before = device.ntuBefore ?? 0
  const after = device.ntuAfter ?? 0
  const efficiency = before > 0 ? (((before - after) / before) * 100).toFixed(2) : '0.00'

  return (
    <div className="space-y-6 md:max-w-lg lg:max-w-2xl">
      <h1 className="font-display font-bold text-xl md:text-2xl lg:text-3xl">Current turbidity</h1>

      <Card className="text-center">
        <p className="font-display font-extrabold text-6xl md:text-7xl lg:text-8xl mb-1">{after}</p>
        <p className="text-sm text-muted mb-3">NTU</p>
        <Badge tone={toneForValue(after)}>{labelForValue(after)}</Badge>
      </Card>

      <Card>
        <Row label="Before filter" value={`${before} NTU`} tone={toneForValue(before)} />
        <Row label="After filter" value={`${after} NTU`} tone={toneForValue(after)} />
        <Row label="Filter efficiency" value={`${efficiency}%`} tone="clean" isLast />
      </Card>

      <Card>
        <p className="text-sm font-semibold mb-4">NTU Range Guide</p>
        <div className="space-y-3">
          {guide.map((g) => (
            <div key={g.range} className="flex items-center gap-3">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  g.tone === 'clean' ? 'bg-clean' : g.tone === 'warn' ? 'bg-warn' : 'bg-danger'
                }`}
              />
              <span className="text-sm text-muted flex-1">
                {g.range} - {g.label}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Link
        to="/history"
        className="flex items-center justify-between bg-white rounded-2xl shadow-card px-5 py-4"
      >
        <span className="flex items-center gap-3 text-sm font-semibold">
          <HistoryIcon size={18} className="text-muted" />
          History
        </span>
        <ChevronRight size={16} className="text-muted" />
      </Link>
    </div>
  )
}

function Row({ label, value, tone, isLast }) {
  return (
    <div className={`flex justify-between items-center py-2.5 ${!isLast ? 'border-b border-black/5' : ''}`}>
      <span className="text-sm text-muted">{label}</span>
      <Badge tone={tone}>{value}</Badge>
    </div>
  )
}

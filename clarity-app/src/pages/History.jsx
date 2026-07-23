import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { BarChart, Bar, ResponsiveContainer, XAxis, Cell } from 'recharts'
import useIsDesktop from '../hooks/useIsDesktop.js'
import Card from '../components/Card.jsx'
import StatBox from '../components/StatBox.jsx'
import Badge from '../components/Badge.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { subscribeToPrimaryDevice, subscribeToRecentReadings } from '../lib/firestore.js'

const colors = { clean: '#22B26A', warn: '#E0A824', danger: '#E5484D' }

function toneForValue(v) {
  if (v <= 4) return 'clean'
  if (v <= 10) return 'warn'
  return 'danger'
}

export default function History() {
  const navigate = useNavigate()
  const isDesktop = useIsDesktop()
  const { user } = useAuth()
  const [readings, setReadings] = useState([]) // newest-first, straight from Firestore

  useEffect(() => {
    if (!user) return
    const unsubDevice = subscribeToPrimaryDevice(user.uid, (device) => {
      if (!device) {
        setReadings([])
        return
      }
      return subscribeToRecentReadings(device.id, setReadings, 30)
    })
    return unsubDevice
  }, [user])

  const values = readings.map((r) => r.ntuAfter ?? 0)
  const average = values.length ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1) : '—'
  const best = values.length ? Math.min(...values).toFixed(1) : '—'
  const now = values.length ? values[0].toFixed(1) : '—'

  // Chart wants oldest-first, last 7 readings.
  const chartData = [...readings]
    .slice(0, 7)
    .reverse()
    .map((r) => ({
      name: r.timestamp?.toDate
        ? r.timestamp.toDate().toLocaleDateString([], { weekday: 'short' })
        : '',
      ntu: r.ntuAfter ?? 0,
      tone: toneForValue(r.ntuAfter ?? 0)
    }))

  return (
    <div className="space-y-6 md:max-w-lg lg:max-w-2xl">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate('/data')} aria-label="Back to data">
          <ChevronLeft size={22} />
        </button>
        <h1 className="font-display font-bold text-xl md:text-2xl lg:text-3xl">Stats</h1>
      </div>

      <Card>
        <div className="flex divide-x divide-black/5 mb-5">
          <StatBox label="Average NTU" value={average} />
          <StatBox label="Best NTU" value={best} />
          <StatBox label="NTU Now" value={now} />
        </div>
        <div className="h-40 sm:h-52 md:h-64 lg:h-72">
          {chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-muted">
              No readings yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: isDesktop ? 13 : 11, fill: '#6B7280' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Bar dataKey="ntu" radius={[6, 6, 0, 0]}>
                  {chartData.map((d, i) => (
                    <Cell key={i} fill={colors[d.tone]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      <Card>
        <p className="text-sm md:text-base font-semibold mb-4">Recent</p>
        {readings.length === 0 ? (
          <p className="text-sm text-muted">No readings yet.</p>
        ) : (
          <div className="space-y-3">
            {readings.slice(0, 10).map((r) => (
              <div key={r.id} className="flex justify-between items-center">
                <div className="text-sm">
                  <p className="font-medium">
                    {r.timestamp?.toDate ? r.timestamp.toDate().toLocaleDateString() : '—'}
                  </p>
                  <p className="text-muted text-xs">
                    {r.timestamp?.toDate
                      ? r.timestamp.toDate().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
                      : ''}
                  </p>
                </div>
                <Badge tone={toneForValue(r.ntuAfter ?? 0)}>{(r.ntuAfter ?? 0).toFixed(1)} NTU</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { ResponsiveContainer, XAxis, Tooltip, Area, AreaChart } from 'recharts'
import useIsDesktop from '../hooks/useIsDesktop.js'
import Card from '../components/Card.jsx'
import Badge from '../components/Badge.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import {
  subscribeToPrimaryDevice,
  subscribeToRecentReadings,
  subscribeToUserProfile
} from '../lib/firestore.js'

// Same clean / moderate / high thresholds as the NTU Range Guide on the Data page
function colorForValue(v) {
  if (v <= 4) return '#22B26A' // clean
  if (v <= 10) return '#E0A824' // moderate
  return '#E5484D' // high
}

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

export default function Home() {
  const isDesktop = useIsDesktop()
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [device, setDevice] = useState(null)
  const [readings, setReadings] = useState([])

  useEffect(() => {
    if (!user) return
    const unsubProfile = subscribeToUserProfile(user.uid, setProfile)
    const unsubDevice = subscribeToPrimaryDevice(user.uid, (d) => {
      setDevice(d)
      if (d) {
        // Readings live under the device doc, so we only start listening
        // once we know which device belongs to this user.
        return subscribeToRecentReadings(d.id, (docs) => {
          // Firestore gives newest-first; the chart wants oldest-first.
          const chronological = [...docs].reverse().map((r) => ({
            time: r.timestamp?.toDate
              ? r.timestamp.toDate().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
              : '',
            ntu: r.ntuAfter ?? 0
          }))
          setReadings(chronological)
        })
      }
    })
    return () => {
      unsubProfile()
      unsubDevice()
    }
  }, [user])

  const latest = readings[readings.length - 1]
  const hasDevice = Boolean(device)

  return (
    <div className="space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
      <div className="md:col-span-2">
        <h1 className="font-display font-bold text-xl md:text-2xl lg:text-3xl">
          Good Morning, {profile?.username || user?.displayName || 'there'}
        </h1>
      </div>

      {!hasDevice ? (
        <Card className="md:col-span-2 text-center py-10">
          <p className="text-sm text-muted">
            No device paired yet. Once your Clarity device is connected, live readings will show up
            here automatically.
          </p>
        </Card>
      ) : (
        <>
          <Card>
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-xs md:text-sm text-muted mb-1">NTU now</p>
                <p className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl">
                  {device.ntuBefore ?? '—'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs md:text-sm text-muted mb-1">After filter</p>
                <p className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl text-brand">
                  {device.ntuAfter ?? '—'}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm md:text-base text-muted">Before filter</p>
              <Badge tone={toneForValue(device.ntuBefore ?? 0)}>
                {labelForValue(device.ntuBefore ?? 0)}
              </Badge>
            </div>
          </Card>

          <Card>
            <p className="text-sm md:text-base font-semibold mb-3">Quick Status</p>
            <div className="space-y-3">
              <Row
                label={`Filter ${device.filterPercentRemaining ?? '—'}% remaining`}
                tone={
                  (device.filterPercentRemaining ?? 100) > 20
                    ? 'clean'
                    : (device.filterPercentRemaining ?? 100) > 5
                    ? 'warn'
                    : 'danger'
                }
                value={(device.filterPercentRemaining ?? 100) > 20 ? 'OK' : 'Low'}
              />
              <Row
                label="Water Quality"
                tone={toneForValue(device.ntuAfter ?? 0)}
                value={labelForValue(device.ntuAfter ?? 0)}
              />
            </div>
          </Card>

          <Card className="md:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm md:text-base font-semibold">Today's NTU trend</p>
              {latest && <Badge tone={toneForValue(latest.ntu)}>{labelForValue(latest.ntu)}</Badge>}
            </div>
            <p className="text-xs md:text-sm text-muted mb-4">Live after-filter readings from your device</p>
            <div className="h-40 sm:h-52 md:h-64 lg:h-72">
              {readings.length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm text-muted">
                  Waiting for readings...
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={readings} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
                    <defs>
                      <linearGradient id="lineColor" x1="0" y1="0" x2="1" y2="0">
                        {readings.map((d, i) => (
                          <stop
                            key={i}
                            offset={`${(i / Math.max(readings.length - 1, 1)) * 100}%`}
                            stopColor={colorForValue(d.ntu)}
                          />
                        ))}
                      </linearGradient>
                      <linearGradient id="ntuFill" x1="0" y1="0" x2="1" y2="0">
                        {readings.map((d, i) => (
                          <stop
                            key={i}
                            offset={`${(i / Math.max(readings.length - 1, 1)) * 100}%`}
                            stopColor={colorForValue(d.ntu)}
                            stopOpacity={0.22}
                          />
                        ))}
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: isDesktop ? 13 : 11, fill: '#6B7280' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      formatter={(value) => [`${value} NTU`, 'Reading']}
                      contentStyle={{
                        borderRadius: 12,
                        border: '1px solid rgba(0,0,0,0.08)',
                        fontSize: 12
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="ntu"
                      stroke="url(#lineColor)"
                      strokeWidth={2.5}
                      fill="url(#ntuFill)"
                      dot={<ColorDot isDesktop={isDesktop} />}
                      activeDot={{ r: isDesktop ? 7 : 5 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  )
}

function ColorDot({ cx, cy, payload, isDesktop }) {
  return <circle cx={cx} cy={cy} r={isDesktop ? 4.5 : 3} fill={colorForValue(payload.ntu)} stroke="none" />
}

function Row({ label, value, tone }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-muted">{label}</span>
      <Badge tone={tone}>{value}</Badge>
    </div>
  )
}

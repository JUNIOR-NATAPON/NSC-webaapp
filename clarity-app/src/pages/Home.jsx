import { ResponsiveContainer, XAxis, Tooltip, Area, AreaChart } from 'recharts'
import useIsDesktop from '../hooks/useIsDesktop.js'
import Card from '../components/Card.jsx'
import Badge from '../components/Badge.jsx'
import Delta from '../components/Delta.jsx'
import DeviceStatus from '../components/DeviceStatus.jsx'
import MicroplasticCard from '../components/MicroplasticCard.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useDevice } from '../context/DeviceContext.jsx'
import {
  estimateMicroplasticExposure,
  estimateDailyMicroplastic,
  averageForDay,
  percentChange
} from '../lib/estimates.js'

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 18) return 'Good Afternoon'
  return 'Good Evening'
}

function colorForValue(v) {
  if (v <= 4) return '#22B26A'
  if (v <= 10) return '#E0A824'
  return '#E5484D'
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
function toneForRemaining(pct) {
  if (pct >= 50) return 'clean'
  if (pct >= 20) return 'warn'
  return 'danger'
}

export default function Home() {
  const isDesktop = useIsDesktop()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const { user } = useAuth()
  const { device, recentReadings, monthlyReadings, loading } = useDevice()

  // Chart wants oldest-first; Firestore gives newest-first.
  const todayTrend = [...recentReadings]
    .reverse()
    .map((r) => ({
      time: r.timestamp?.toDate
        ? r.timestamp.toDate().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
        : '',
      ntu: r.ntuBefore ?? 0
    }))
  const latest = todayTrend[todayTrend.length - 1]

  const { accumulatedMg } = estimateMicroplasticExposure(monthlyReadings)
  const todayMg = estimateDailyMicroplastic(monthlyReadings, 0)
  const yesterdayMg = estimateDailyMicroplastic(monthlyReadings, 1)
  const microplasticPrevious = todayMg !== null && yesterdayMg !== null ? yesterdayMg : null

  const yesterdayBefore = averageForDay(monthlyReadings, 'ntuBefore', 1)

  if (loading) {
    return <p className="text-sm text-muted dark:text-muted-dark">Loading...</p>
  }

  if (!device) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-display font-bold text-xl md:text-2xl lg:text-3xl">
            {greeting()}, {user?.displayName || 'there'}
          </h1>
        </div>
        <Card className="text-center py-10">
          <p className="text-sm text-muted dark:text-muted-dark">
            No device paired yet. Once your Clarity device is connected, live readings will show
            up here automatically.
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
      <div className="md:col-span-2">
        <h1 className="font-display font-bold text-xl md:text-2xl lg:text-3xl">
          {greeting()}, {user?.displayName || 'there'}
        </h1>
        <DeviceStatus className="mt-1" />
      </div>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-xs md:text-sm text-muted dark:text-muted-dark mb-1">NTU now</p>
            <p className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl">
              {device.ntuBefore ?? '—'}
            </p>
            {yesterdayBefore !== null && (
              <Delta percent={percentChange(device.ntuBefore ?? 0, yesterdayBefore)} goodDirection="down" />
            )}
          </div>
          <div className="text-right">
            <p className="text-xs md:text-sm text-muted dark:text-muted-dark mb-1">After filter</p>
            <p className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl text-brand">
              {device.ntuAfter ?? '—'}
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm md:text-base text-muted dark:text-muted-dark">Before filter</p>
          <Badge tone={toneForValue(device.ntuBefore ?? 0)}>{labelForValue(device.ntuBefore ?? 0)}</Badge>
        </div>
      </Card>

      <Card>
        <p className="text-sm md:text-base font-semibold mb-3">Quick Status</p>
        <div className="space-y-3">
          <div>
            <Row
              label={`Filter ${device.filterPercentRemaining ?? '—'}% remaining`}
              tone={toneForRemaining(device.filterPercentRemaining ?? 100)}
              value={(device.filterPercentRemaining ?? 100) > 20 ? 'OK' : 'Low'}
            />
          </div>
          <Row
            label="Water Quality"
            tone={toneForValue(device.ntuAfter ?? 0)}
            value={labelForValue(device.ntuAfter ?? 0)}
          />
        </div>
      </Card>

      <MicroplasticCard accumulatedMg={accumulatedMg} previousMg={microplasticPrevious} />

      <Card className="md:col-span-2">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm md:text-base font-semibold">Today's NTU trend</p>
          {latest && <Badge tone={toneForValue(latest.ntu)}>{labelForValue(latest.ntu)}</Badge>}
        </div>
        <p className="text-xs md:text-sm text-muted dark:text-muted-dark mb-4">
          Before-filter readings from your device
        </p>
        <div className="h-40 sm:h-52 md:h-64 lg:h-72">
          {todayTrend.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-muted dark:text-muted-dark">
              Waiting for readings...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={todayTrend} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
                <defs>
                  <linearGradient id="lineColor" x1="0" y1="0" x2="1" y2="0">
                    {todayTrend.map((d, i) => (
                      <stop key={i} offset={`${(i / Math.max(todayTrend.length - 1, 1)) * 100}%`} stopColor={colorForValue(d.ntu)} />
                    ))}
                  </linearGradient>
                  <linearGradient id="ntuFill" x1="0" y1="0" x2="1" y2="0">
                    {todayTrend.map((d, i) => (
                      <stop
                        key={i}
                        offset={`${(i / Math.max(todayTrend.length - 1, 1)) * 100}%`}
                        stopColor={colorForValue(d.ntu)}
                        stopOpacity={0.22}
                      />
                    ))}
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: isDesktop ? 13 : 11, fill: isDark ? '#9AA7BD' : '#6B7280' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value) => [`${value} NTU`, 'Reading']}
                  contentStyle={{
                    borderRadius: 12,
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
                    fontSize: 12,
                    background: isDark ? '#1B2236' : '#FFFFFF',
                    color: isDark ? '#FFFFFF' : '#12172B'
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
    </div>
  )
}

function ColorDot({ cx, cy, payload, isDesktop }) {
  return <circle cx={cx} cy={cy} r={isDesktop ? 4.5 : 3} fill={colorForValue(payload.ntu)} stroke="none" />
}

function Row({ label, value, tone }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-muted dark:text-muted-dark">{label}</span>
      <Badge tone={tone}>{value}</Badge>
    </div>
  )
}

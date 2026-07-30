import { ResponsiveContainer, XAxis, Tooltip, Area, AreaChart } from 'recharts'
import useIsDesktop from '../hooks/useIsDesktop.js'
import Card from '../components/Card.jsx'
import Badge from '../components/Badge.jsx'
import Delta from '../components/Delta.jsx'
import DeviceStatus from '../components/DeviceStatus.jsx'
import MicroplasticCard from '../components/MicroplasticCard.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import {
  current,
  todayTrend,
  toneForValue,
  labelForValue,
  colorForValue,
  filterStatus,
  toneForRemaining,
  yesterday,
  percentChange
} from '../data/sampleData.js'

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 18) return 'Good Afternoon'
  return 'Good Evening'
}

export default function Home() {
  const isDesktop = useIsDesktop()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const latest = todayTrend[todayTrend.length - 1]

  return (
    <div className="space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
      <div className="md:col-span-2">
        <h1 className="font-display font-bold text-xl md:text-2xl lg:text-3xl">{greeting()}, User</h1>
        <DeviceStatus className="mt-1" />
      </div>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-xs md:text-sm text-muted dark:text-muted-dark mb-1">NTU now</p>
            <p className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl">{current.before}</p>
            <Delta percent={percentChange(current.before, yesterday.before)} goodDirection="down" />
          </div>
          <div className="text-right">
            <p className="text-xs md:text-sm text-muted dark:text-muted-dark mb-1">After filter</p>
            <p className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl text-brand">{current.after}</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm md:text-base text-muted dark:text-muted-dark">Before filter</p>
          <Badge tone="clean">Clean</Badge>
        </div>
      </Card>

      <Card>
        <p className="text-sm md:text-base font-semibold mb-3">Quick Status</p>
        <div className="space-y-3">
          <div>
            <Row
              label={`Filter ${filterStatus.remainingPercent}% remaining`}
              tone={toneForRemaining(filterStatus.remainingPercent)}
              value="OK"
            />
            <Delta
              percent={percentChange(filterStatus.remainingPercent, filterStatus.yesterdayRemainingPercent)}
              neutral
            />
          </div>
          <Row label="Water Quality" tone="clean" value="Clean" />
        </div>
      </Card>

      <MicroplasticCard />

      <Card className="md:col-span-2">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm md:text-base font-semibold">Today's NTU trend</p>
          <Badge tone={toneForValue(latest.ntu)}>{labelForValue(latest.ntu)}</Badge>
        </div>
        <p className="text-xs md:text-sm text-muted dark:text-muted-dark mb-4">Before-filter readings, every 3 hours</p>
        <div className="h-40 sm:h-52 md:h-64 lg:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={todayTrend} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
              <defs>
                <linearGradient id="lineColor" x1="0" y1="0" x2="1" y2="0">
                  {todayTrend.map((d, i) => (
                    <stop key={i} offset={`${(i / (todayTrend.length - 1)) * 100}%`} stopColor={colorForValue(d.ntu)} />
                  ))}
                </linearGradient>
                <linearGradient id="ntuFill" x1="0" y1="0" x2="1" y2="0">
                  {todayTrend.map((d, i) => (
                    <stop
                      key={i}
                      offset={`${(i / (todayTrend.length - 1)) * 100}%`}
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

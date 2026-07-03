import { ResponsiveContainer, XAxis, Tooltip, Area, AreaChart } from 'recharts'
import Card from '../components/Card.jsx'
import Badge from '../components/Badge.jsx'

const trend = [
  { time: '6am', ntu: 2.8 },
  { time: '9am', ntu: 2.1 },
  { time: '12pm', ntu: 3.4 },
  { time: '3pm', ntu: 11.2 },
  { time: '6pm', ntu: 6.5 },
  { time: '9pm', ntu: 2.4 }
]

// Same clean / moderate / high thresholds as the NTU Range Guide on the Data page
function colorForValue(v) {
  if (v <= 4) return '#22B26A' // clean
  if (v <= 10) return '#E0A824' // moderate
  return '#E5484D' // high
}

export default function Home() {
  return (
    <div className="space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
      <div className="md:col-span-2">
        <h1 className="font-display font-bold text-xl">Good Morning, User</h1>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-xs text-muted mb-1">NTU now</p>
            <p className="font-display font-extrabold text-3xl">2.4</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted mb-1">After filter</p>
            <p className="font-display font-extrabold text-3xl text-brand">0.3</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted">Before filter</p>
          <Badge tone="clean">Clean</Badge>
        </div>
      </Card>

      <Card>
        <p className="text-sm font-semibold mb-3">Quick Status</p>
        <div className="space-y-3">
          <Row label="Filter 68% remaining" tone="clean" value="OK" />
          <Row label="Water Quality" tone="clean" value="Clean" />
        </div>
      </Card>

      <Card className="md:col-span-2">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-semibold">Today's NTU trend</p>
          <Badge tone={trend[trend.length - 1].ntu <= 4 ? 'clean' : trend[trend.length - 1].ntu <= 10 ? 'warn' : 'danger'}>
            {trend[trend.length - 1].ntu <= 4 ? 'Clean' : trend[trend.length - 1].ntu <= 10 ? 'Moderate' : 'High'}
          </Badge>
        </div>
        <p className="text-xs text-muted mb-4">After-filter readings, every 3 hours</p>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
              <defs>
                {/* Line color shifts along the path to match each point's NTU level */}
                <linearGradient id="lineColor" x1="0" y1="0" x2="1" y2="0">
                  {trend.map((d, i) => (
                    <stop
                      key={i}
                      offset={`${(i / (trend.length - 1)) * 100}%`}
                      stopColor={colorForValue(d.ntu)}
                    />
                  ))}
                </linearGradient>
                <linearGradient id="ntuFill" x1="0" y1="0" x2="1" y2="0">
                  {trend.map((d, i) => (
                    <stop
                      key={i}
                      offset={`${(i / (trend.length - 1)) * 100}%`}
                      stopColor={colorForValue(d.ntu)}
                      stopOpacity={0.22}
                    />
                  ))}
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                tick={{ fontSize: 11, fill: '#6B7280' }}
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
                dot={<ColorDot />}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}

function ColorDot({ cx, cy, payload }) {
  return <circle cx={cx} cy={cy} r={3} fill={colorForValue(payload.ntu)} stroke="none" />
}

function Row({ label, value, tone }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-muted">{label}</span>
      <Badge tone={tone}>{value}</Badge>
    </div>
  )
}

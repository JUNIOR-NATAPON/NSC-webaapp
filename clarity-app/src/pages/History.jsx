import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { BarChart, Bar, ResponsiveContainer, XAxis, Cell } from 'recharts'
import Card from '../components/Card.jsx'
import StatBox from '../components/StatBox.jsx'
import Badge from '../components/Badge.jsx'

const chartData = [
  { name: 'Mon', ntu: 3, tone: 'clean' },
  { name: 'Tue', ntu: 2, tone: 'clean' },
  { name: 'Wed', ntu: 2, tone: 'clean' },
  { name: 'Thu', ntu: 11, tone: 'danger' },
  { name: 'Fri', ntu: 6, tone: 'warn' },
  { name: 'Sat', ntu: 5, tone: 'warn' },
  { name: 'Sun', ntu: 4, tone: 'clean' }
]

const colors = { clean: '#22B26A', warn: '#E0A824', danger: '#E5484D' }

const log = [
  { date: '02/07/2026', time: '10:32', value: '2.4 NTU', tone: 'clean' },
  { date: '02/07/2026', time: '08:15', value: '1.8 NTU', tone: 'clean' },
  { date: '01/07/2026', time: '19:18', value: '11.4 NTU', tone: 'danger' },
  { date: '01/07/2026', time: '09:52', value: '5.6 NTU', tone: 'warn' }
]

export default function History() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6 md:max-w-lg">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate('/data')} aria-label="Back to data">
          <ChevronLeft size={22} />
        </button>
        <h1 className="font-display font-bold text-xl">Stats</h1>
      </div>

      <Card>
        <div className="flex divide-x divide-black/5 mb-5">
          <StatBox label="Average NTU" value="3.1" />
          <StatBox label="Best NTU" value="0.2" />
          <StatBox label="NTU Now" value="11.4" />
        </div>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <Bar dataKey="ntu" radius={[6, 6, 0, 0]}>
                {chartData.map((d, i) => (
                  <Cell key={i} fill={colors[d.tone]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <p className="text-sm font-semibold mb-4">Recent</p>
        <div className="space-y-3">
          {log.map((item, i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="text-sm">
                <p className="font-medium">{item.date}</p>
                <p className="text-muted text-xs">{item.time}</p>
              </div>
              <Badge tone={item.tone}>{item.value}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

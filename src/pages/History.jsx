import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { BarChart, Bar, ResponsiveContainer, XAxis, Cell } from 'recharts'
import useIsDesktop from '../hooks/useIsDesktop.js'
import Card from '../components/Card.jsx'
import StatBox from '../components/StatBox.jsx'
import Badge from '../components/Badge.jsx'
import { weeklyTrend, weeklyStats, recentLog, toneForValue } from '../data/sampleData.js'
import { useTheme } from '../context/ThemeContext.jsx'

const colors = { clean: '#22B26A', warn: '#E0A824', danger: '#E5484D' }

export default function History() {
  const navigate = useNavigate()
  const isDesktop = useIsDesktop()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className="space-y-6 md:max-w-lg lg:max-w-2xl">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate('/data')} aria-label="Back to data">
          <ChevronLeft size={22} />
        </button>
        <h1 className="font-display font-bold text-xl md:text-2xl lg:text-3xl">Stats</h1>
      </div>

      <Card>
        <div className="flex divide-x divide-black/5 dark:divide-white/10 mb-5">
          <StatBox label="Average NTU" value={weeklyStats.average} />
          <StatBox label="Best NTU" value={weeklyStats.best} />
          <StatBox label="NTU Now" value={weeklyStats.now} />
        </div>
        <div className="h-40 sm:h-52 md:h-64 lg:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyTrend}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: isDesktop ? 13 : 11, fill: isDark ? '#9AA7BD' : '#6B7280' }}
                axisLine={false}
                tickLine={false}
              />
              <Bar dataKey="ntu" radius={[6, 6, 0, 0]}>
                {weeklyTrend.map((d, i) => (
                  <Cell key={i} fill={colors[toneForValue(d.ntu)]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <p className="text-sm md:text-base font-semibold mb-4">Recent</p>
        <div className="space-y-3">
          {recentLog.map((item, i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="text-sm">
                <p className="font-medium">{item.date}</p>
                <p className="text-muted dark:text-muted-dark text-xs">{item.time}</p>
              </div>
              <Badge tone={item.tone}>{item.value}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

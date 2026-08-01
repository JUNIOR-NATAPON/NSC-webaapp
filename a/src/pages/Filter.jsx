import { ArrowUpRight } from 'lucide-react'
import Card from '../components/Card.jsx'
import Delta from '../components/Delta.jsx'
import RadialGauge from '../components/RadialGauge.jsx'
import { filterStatus, toneForRemaining, percentChange } from '../data/sampleData.js'

const log = [
  { date: '14/01/2026', time: '10:32' },
  { date: '12/02/2026', time: '08:15' },
  { date: '16/03/2026', time: '19:18' },
  { date: '15/04/2026', time: '09:52' }
]

export default function Filter() {
  return (
    <div className="space-y-6 md:max-w-lg lg:max-w-2xl">
      <h1 className="font-display font-bold text-xl md:text-2xl lg:text-3xl">Status</h1>

      <Card className="flex flex-col items-center text-center">
        <RadialGauge percent={filterStatus.remainingPercent} tone={toneForRemaining(filterStatus.remainingPercent)} size={120} strokeWidth={11}>
          <span className="font-display font-extrabold text-3xl">{filterStatus.remainingPercent}%</span>
          <span className="text-xs text-muted dark:text-muted-dark">remaining</span>
        </RadialGauge>
        <p className="text-sm font-semibold mt-3">Filter life remaining</p>
        <div className="mt-1">
          <Delta percent={percentChange(filterStatus.remainingPercent, filterStatus.yesterdayRemainingPercent)} neutral />
        </div>
      </Card>

      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px bg-black/10 dark:bg-white/10 flex-1" />
          <p className="text-sm font-semibold text-muted dark:text-muted-dark">Filter Log</p>
          <div className="h-px bg-black/10 dark:bg-white/10 flex-1" />
        </div>

        <Card className="p-0 overflow-hidden">
          {log.map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-5 py-4 text-sm ${
                i !== log.length - 1 ? 'border-b border-black/5 dark:border-white/10' : ''
              }`}
            >
              <ArrowUpRight size={16} className="text-brand" />
              <span className="font-medium flex-1">{item.date}</span>
              <span className="text-muted dark:text-muted-dark">{item.time}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}

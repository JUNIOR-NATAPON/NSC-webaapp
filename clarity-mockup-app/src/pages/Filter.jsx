import { ArrowUpRight } from 'lucide-react'
import Card from '../components/Card.jsx'

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

      <Card>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted mb-1">Need replacement</p>
          <span className="bg-warn text-white font-display font-extrabold text-2xl px-5 py-2 rounded-xl">5%</span>
        </div>
      </Card>

      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px bg-black/10 flex-1" />
          <p className="text-sm font-semibold text-muted">Filter Log</p>
          <div className="h-px bg-black/10 flex-1" />
        </div>

        <Card className="p-0 overflow-hidden">
          {log.map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-5 py-4 text-sm ${
                i !== log.length - 1 ? 'border-b border-black/5' : ''
              }`}
            >
              <ArrowUpRight size={16} className="text-brand" />
              <span className="font-medium flex-1">{item.date}</span>
              <span className="text-muted">{item.time}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}

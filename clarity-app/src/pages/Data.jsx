import { Link } from 'react-router-dom'
import { History as HistoryIcon, ChevronRight } from 'lucide-react'
import Card from '../components/Card.jsx'
import Badge from '../components/Badge.jsx'

const guide = [
  { range: '0-4 NTU', label: 'clean, safe', tone: 'clean' },
  { range: '4-10 NTU', label: 'moderate', tone: 'warn' },
  { range: '>10 NTU', label: 'high, filter need', tone: 'danger' }
]

export default function Data() {
  return (
    <div className="space-y-6 md:max-w-lg">
      <h1 className="font-display font-bold text-xl">Current turbidity</h1>

      <Card className="text-center">
        <p className="font-display font-extrabold text-6xl mb-1">0.3</p>
        <p className="text-sm text-muted mb-3">NTU</p>
        <Badge tone="clean">Clean</Badge>
      </Card>

      <Card>
        <Row label="Before filter" value="2.4 NTU" tone="warn" />
        <Row label="After filter" value="0.3 NTU" tone="clean" />
        <Row label="Filter efficiency" value="87.75%" tone="clean" isLast />
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

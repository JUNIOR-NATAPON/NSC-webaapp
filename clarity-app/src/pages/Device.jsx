import { useNavigate } from 'react-router-dom'
import { ChevronLeft, CheckCircle2, Search, XCircle } from 'lucide-react'
import Card from '../components/Card.jsx'
import Badge from '../components/Badge.jsx'

const devices = [
  { name: 'Clarity-001', status: 'Connected', tone: 'clean', icon: CheckCircle2 },
  { name: 'Clarity-002', status: 'Searching', tone: 'warn', icon: Search },
  { name: 'Clarity-003', status: 'Unconnected', tone: 'danger', icon: XCircle }
]

export default function Device() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6 md:max-w-lg">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate('/profile')} aria-label="Back to profile">
          <ChevronLeft size={22} />
        </button>
        <h1 className="font-display font-bold text-xl">Device</h1>
      </div>

      <Card className="p-0 overflow-hidden">
        {devices.map((d, i) => (
          <div
            key={d.name}
            className={`flex items-center justify-between px-5 py-4 ${
              i !== devices.length - 1 ? 'border-b border-black/5' : ''
            }`}
          >
            <span className="flex items-center gap-3 text-sm font-medium">
              <d.icon
                size={18}
                className={
                  d.tone === 'clean' ? 'text-clean' : d.tone === 'warn' ? 'text-warn' : 'text-danger'
                }
              />
              {d.name}
            </span>
            <Badge tone={d.tone}>{d.status}</Badge>
          </div>
        ))}
      </Card>
    </div>
  )
}

import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { useState } from 'react'
import Card from '../components/Card.jsx'

const initial = [
  { key: 'filterLow', label: 'Filter low alert', on: true },
  { key: 'highNtu', label: 'High NTU alert', on: true },
  { key: 'dailySummary', label: 'Daily summary', on: true }
]

export default function Notification() {
  const navigate = useNavigate()
  const [toggles, setToggles] = useState(initial)

  function toggle(key) {
    setToggles((prev) => prev.map((t) => (t.key === key ? { ...t, on: !t.on } : t)))
  }

  return (
    <div className="space-y-6 md:max-w-lg">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate('/profile')} aria-label="Back to profile">
          <ChevronLeft size={22} />
        </button>
        <h1 className="font-display font-bold text-xl">Notification</h1>
      </div>

      <Card className="p-0 overflow-hidden">
        {toggles.map((t, i) => (
          <div
            key={t.key}
            className={`flex items-center justify-between px-5 py-4 ${
              i !== toggles.length - 1 ? 'border-b border-black/5' : ''
            }`}
          >
            <span className="text-sm font-medium">{t.label}</span>
            <Switch on={t.on} onClick={() => toggle(t.key)} />
          </div>
        ))}
      </Card>
    </div>
  )
}

function Switch({ on, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className={`h-7 w-12 rounded-full transition-colors relative shrink-0 ${
        on ? 'bg-brand' : 'bg-black/15'
      }`}
    >
      <span
        className={`absolute top-0.5 h-6 w-6 bg-white rounded-full shadow transition-transform ${
          on ? 'translate-x-[22px]' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}

import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { useState } from 'react'
import Card from '../components/Card.jsx'
import { useToast } from '../context/ToastContext.jsx'

const initial = [
  { key: 'filterLow', label: 'Filter low alert', on: true },
  { key: 'highNtu', label: 'High NTU alert', on: true },
  { key: 'dailySummary', label: 'Daily summary', on: false }
]

export default function Notification() {
  const navigate = useNavigate()
  const [toggles, setToggles] = useState(initial)
  const { showToast } = useToast()

  function toggle(key) {
    setToggles((prev) =>
      prev.map((t) => {
        if (t.key !== key) return t
        const next = !t.on
        showToast(`${t.label} turned ${next ? 'on' : 'off'}`)
        return { ...t, on: next }
      })
    )
  }

  return (
    <div className="space-y-6 md:max-w-lg lg:max-w-2xl">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate('/profile')} aria-label="Back to profile">
          <ChevronLeft size={22} />
        </button>
        <h1 className="font-display font-bold text-xl md:text-2xl lg:text-3xl">Notification</h1>
      </div>

      <Card className="p-0 overflow-hidden">
        {toggles.map((t, i) => (
          <div
            key={t.key}
            className={`flex items-center justify-between px-5 py-4 ${
              i !== toggles.length - 1 ? 'border-b border-black/5 dark:border-white/10' : ''
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
      className={`h-7 w-12 rounded-full transition-colors shrink-0 flex items-center p-0.5 ${
        on ? 'bg-brand justify-end' : 'bg-black/15 dark:bg-white/15 justify-start'
      }`}
    >
      <span className="h-6 w-6 bg-white rounded-full shadow transition-all" />
    </button>
  )
}

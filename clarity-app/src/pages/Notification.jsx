import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import Card from '../components/Card.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { subscribeToUserProfile, updateNotificationSettings } from '../lib/firestore.js'

const labels = {
  filterLow: 'Filter low alert',
  highNtu: 'High NTU alert',
  dailySummary: 'Daily summary'
}
const defaultSettings = { filterLow: true, highNtu: true, dailySummary: false }

export default function Notification() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showToast } = useToast()
  const [settings, setSettings] = useState(defaultSettings)

  useEffect(() => {
    if (!user) return
    return subscribeToUserProfile(user.uid, (profile) => {
      if (profile?.notificationSettings) setSettings(profile.notificationSettings)
    })
  }, [user])

  async function toggle(key) {
    const next = { ...settings, [key]: !settings[key] }
    setSettings(next) // update immediately so the switch feels instant
    showToast(`${labels[key]} turned ${next[key] ? 'on' : 'off'}`)
    try {
      await updateNotificationSettings(user.uid, next)
    } catch (err) {
      setSettings(settings) // revert on failure
      showToast('Could not save — please try again')
    }
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
        {Object.keys(labels).map((key, i) => (
          <div
            key={key}
            className={`flex items-center justify-between px-5 py-4 ${
              i !== Object.keys(labels).length - 1 ? 'border-b border-black/5 dark:border-white/10' : ''
            }`}
          >
            <span className="text-sm font-medium">{labels[key]}</span>
            <Switch on={Boolean(settings[key])} onClick={() => toggle(key)} />
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

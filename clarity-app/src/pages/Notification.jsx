import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import Card from '../components/Card.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { subscribeToUserProfile, updateNotificationSettings } from '../lib/firestore.js'

const labels = {
  filterLow: 'Filter low alert',
  highNtu: 'High NTU alert',
  dailySummary: 'Daily summary'
}
const defaultSettings = { filterLow: true, highNtu: true, dailySummary: true }

export default function Notification() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [settings, setSettings] = useState(defaultSettings)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) return
    return subscribeToUserProfile(user.uid, (profile) => {
      if (profile?.notificationSettings) setSettings(profile.notificationSettings)
    })
  }, [user])

  async function toggle(key) {
    const next = { ...settings, [key]: !settings[key] }
    setSettings(next) // update immediately so the switch feels instant
    setSaving(true)
    try {
      await updateNotificationSettings(user.uid, next)
    } catch (err) {
      setSettings(settings) // revert on failure
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 md:max-w-lg lg:max-w-2xl">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate('/profile')} aria-label="Back to profile">
          <ChevronLeft size={22} />
        </button>
        <h1 className="font-display font-bold text-xl md:text-2xl lg:text-3xl">Notification</h1>
        {saving && <span className="text-xs text-muted ml-2">Saving...</span>}
      </div>

      <Card className="p-0 overflow-hidden">
        {Object.keys(labels).map((key, i) => (
          <div
            key={key}
            className={`flex items-center justify-between px-5 py-4 ${
              i !== Object.keys(labels).length - 1 ? 'border-b border-black/5' : ''
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
        on ? 'bg-brand justify-end' : 'bg-black/15 justify-start'
      }`}
    >
      <span className="h-6 w-6 bg-white rounded-full shadow transition-all" />
    </button>
  )
}

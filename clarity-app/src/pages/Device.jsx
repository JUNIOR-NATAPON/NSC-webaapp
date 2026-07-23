import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, CheckCircle2, Search, XCircle } from 'lucide-react'
import Card from '../components/Card.jsx'
import Badge from '../components/Badge.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { subscribeToUserDevices } from '../lib/firestore.js'

const statusMeta = {
  connected: { label: 'Connected', tone: 'clean', icon: CheckCircle2 },
  searching: { label: 'Searching', tone: 'warn', icon: Search },
  unconnected: { label: 'Unconnected', tone: 'danger', icon: XCircle }
}

export default function Device() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [devices, setDevices] = useState([])

  useEffect(() => {
    if (!user) return
    return subscribeToUserDevices(user.uid, setDevices)
  }, [user])

  return (
    <div className="space-y-6 md:max-w-lg lg:max-w-2xl">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate('/profile')} aria-label="Back to profile">
          <ChevronLeft size={22} />
        </button>
        <h1 className="font-display font-bold text-xl md:text-2xl lg:text-3xl">Device</h1>
      </div>

      <Card className="p-0 overflow-hidden">
        {devices.length === 0 ? (
          <p className="text-sm text-muted px-5 py-4">
            No devices paired yet. Follow the pairing steps on your Clarity hardware to connect one.
          </p>
        ) : (
          devices.map((d, i) => {
            const meta = statusMeta[d.status] || statusMeta.unconnected
            const Icon = meta.icon
            return (
              <div
                key={d.id}
                className={`flex items-center justify-between px-5 py-4 ${
                  i !== devices.length - 1 ? 'border-b border-black/5' : ''
                }`}
              >
                <span className="flex items-center gap-3 text-sm font-medium">
                  <Icon
                    size={18}
                    className={
                      meta.tone === 'clean' ? 'text-clean' : meta.tone === 'warn' ? 'text-warn' : 'text-danger'
                    }
                  />
                  {d.name}
                </span>
                <Badge tone={meta.tone}>{meta.label}</Badge>
              </div>
            )
          })
        )}
      </Card>
    </div>
  )
}

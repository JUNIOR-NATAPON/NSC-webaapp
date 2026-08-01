import { useDevice } from '../context/DeviceContext.jsx'

function Dot({ connected }) {
  const tone = connected ? 'bg-clean' : 'bg-danger'
  return (
    <span className="relative flex h-2 w-2 shrink-0">
      {connected && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${tone} opacity-75`} />}
      <span className={`relative inline-flex h-2 w-2 rounded-full ${tone}`} />
    </span>
  )
}

function minutesAgo(timestamp) {
  if (!timestamp?.toDate) return null
  const diffMs = Date.now() - timestamp.toDate().getTime()
  return Math.max(0, Math.round(diffMs / 60000))
}

// showLabel=false renders just the pulsing dot (for tight chrome like the NavBar),
// with the same info available via the title tooltip.
export default function DeviceStatus({ showLabel = true, className = '' }) {
  const { device, loading } = useDevice()

  const connected = Boolean(device) && device.status !== 'unconnected'
  const mins = device ? minutesAgo(device.lastUpdated) : null
  const label = loading
    ? 'Checking...'
    : !device
    ? 'No device paired'
    : connected
    ? `Connected${mins !== null ? ` · synced ${mins}m ago` : ''}`
    : 'Disconnected'

  if (!showLabel) {
    return (
      <span title={`${device?.name || 'Clarity'} — ${label}`} className={className}>
        <Dot connected={connected} />
      </span>
    )
  }

  return (
    <span className={`inline-flex items-center gap-2 text-xs text-muted dark:text-muted-dark ${className}`}>
      <Dot connected={connected} />
      {label}
    </span>
  )
}

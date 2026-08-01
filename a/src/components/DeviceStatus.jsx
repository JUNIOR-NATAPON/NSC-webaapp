import { deviceStatus } from '../data/sampleData.js'

function Dot() {
  const tone = deviceStatus.connected ? 'bg-clean' : 'bg-danger'
  return (
    <span className="relative flex h-2 w-2 shrink-0">
      {deviceStatus.connected && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${tone} opacity-75`} />}
      <span className={`relative inline-flex h-2 w-2 rounded-full ${tone}`} />
    </span>
  )
}

// showLabel=false renders just the pulsing dot (for tight chrome like the NavBar),
// with the same info available via the title tooltip.
export default function DeviceStatus({ showLabel = true, className = '' }) {
  const label = deviceStatus.connected
    ? `Connected · synced ${deviceStatus.lastSyncedMinutesAgo}m ago`
    : 'Disconnected'

  if (!showLabel) {
    return (
      <span title={`${deviceStatus.deviceName} — ${label}`} className={className}>
        <Dot />
      </span>
    )
  }

  return (
    <span className={`inline-flex items-center gap-2 text-xs text-muted dark:text-muted-dark ${className}`}>
      <Dot />
      {label}
    </span>
  )
}

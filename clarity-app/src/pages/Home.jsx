import Card from '../components/Card.jsx'
import Badge from '../components/Badge.jsx'

export default function Home() {
  return (
    <div className="space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
      <div className="md:col-span-2">
        <h1 className="font-display font-bold text-xl">Good Morning, User</h1>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-xs text-muted mb-1">NTU now</p>
            <p className="font-display font-extrabold text-3xl">2.4</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted mb-1">After filter</p>
            <p className="font-display font-extrabold text-3xl text-brand">0.3</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted">Before filter</p>
          <Badge tone="clean">Clean</Badge>
        </div>
      </Card>

      <Card>
        <p className="text-sm font-semibold mb-3">Quick Status</p>
        <div className="space-y-3">
          <Row label="Filter 68% remaining" tone="clean" value="OK" />
          <Row label="Water Quality" tone="clean" value="Clean" />
        </div>
      </Card>
    </div>
  )
}

function Row({ label, value, tone }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-muted">{label}</span>
      <Badge tone={tone}>{value}</Badge>
    </div>
  )
}

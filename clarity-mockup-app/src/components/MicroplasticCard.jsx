import { Atom } from 'lucide-react'
import Card from './Card.jsx'
import Badge from './Badge.jsx'

// This is an ESTIMATE, not a direct sensor measurement — the device measures
// turbidity (NTU), which does not itself quantify microplastic content.
// accumulatedMg is a rough illustrative figure; swap the calculation once
// you have a real basis (e.g. tied to unfiltered water volume consumed).
function levelFor(mg) {
  if (mg <= 3) return { tone: 'clean', label: 'Low' }
  if (mg <= 6) return { tone: 'warn', label: 'Moderate' }
  return { tone: 'danger', label: 'High' }
}

export default function MicroplasticCard({ accumulatedMg = 4.8, monthlyBenchmarkMg = 8 }) {
  const level = levelFor(accumulatedMg)
  const percent = Math.min(100, Math.round((accumulatedMg / monthlyBenchmarkMg) * 100))

  return (
    <Card className="md:col-span-2">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm md:text-base font-semibold flex items-center gap-2">
          <Atom size={16} className="text-muted" />
          Microplastic Exposure
        </p>
        <Badge tone={level.tone}>{level.label}</Badge>
      </div>
      <p className="text-xs md:text-sm text-muted mb-4">
        Estimated, not directly measured — based on average unfiltered tap water studies
      </p>

      <div className="flex items-end justify-between mb-2">
        <div>
          <p className="font-display font-extrabold text-3xl md:text-4xl">
            {accumulatedMg}
            <span className="text-base md:text-lg font-semibold text-muted ml-1">mg</span>
          </p>
          <p className="text-xs text-muted mt-0.5">accumulated this month</p>
        </div>
        <p className="text-xs text-muted text-right">
          Goal: under {monthlyBenchmarkMg}mg/mo
        </p>
      </div>

      <div className="h-2.5 rounded-full bg-black/5 overflow-hidden">
        <div
          className={`h-full rounded-full ${
            level.tone === 'clean' ? 'bg-clean' : level.tone === 'warn' ? 'bg-warn' : 'bg-danger'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="text-[11px] text-muted mt-3">
        Filtering your water reduces exposure — this figure reflects your filtered intake only.
      </p>
    </Card>
  )
}

import { Atom, Info } from 'lucide-react'
import Card from './Card.jsx'
import Badge from './Badge.jsx'
import Delta from './Delta.jsx'
import BodyFillGauge from './BodyFillGauge.jsx'
import useIsDesktop from '../hooks/useIsDesktop.js'
import { percentChange, yesterday } from '../data/sampleData.js'

// This is an ESTIMATE, not a direct sensor measurement — the device measures
// turbidity (NTU), which does not itself quantify microplastic content.
// accumulatedMg is a rough illustrative figure; swap the calculation once
// you have a real basis (e.g. tied to unfiltered water volume consumed).
const DISCLAIMER =
  'Estimated, not directly measured — based on average unfiltered tap water studies. Filtering your water reduces exposure; this reflects your filtered intake only.'

function levelFor(mg) {
  if (mg <= 3) return { tone: 'clean', label: 'Low' }
  if (mg <= 6) return { tone: 'warn', label: 'Moderate' }
  return { tone: 'danger', label: 'High' }
}

const barForTone = { clean: 'bg-clean', warn: 'bg-warn', danger: 'bg-danger' }

export default function MicroplasticCard({
  accumulatedMg = 4.8,
  monthlyBenchmarkMg = 8,
  previousMg = yesterday.microplasticMg
}) {
  const level = levelFor(accumulatedMg)
  const percent = Math.min(100, Math.round((accumulatedMg / monthlyBenchmarkMg) * 100))
  const isDesktop = useIsDesktop()
  const gaugeWidth = isDesktop ? 96 : 76
  const gaugeHeight = isDesktop ? 137 : 108

  return (
    <Card className="md:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm md:text-base font-semibold flex items-center gap-1.5">
          <Atom size={16} className="text-muted dark:text-muted-dark" />
          Microplastic Exposure
          <button
            type="button"
            aria-label="About this estimate"
            title={DISCLAIMER}
            className="text-muted dark:text-muted-dark hover:text-ink dark:hover:text-white transition-colors"
          >
            <Info size={14} />
          </button>
        </p>
        <Badge tone={level.tone}>{level.label}</Badge>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex flex-col items-center">
          <BodyFillGauge percent={percent} tone={level.tone} width={gaugeWidth} height={gaugeHeight} />
          <span className="text-xs font-semibold mt-1">{percent}% of goal</span>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="w-80 text-center">
            <p className="font-display font-extrabold text-4xl md:text-5xl">
              {accumulatedMg}
              <span className="text-lg md:text-xl font-semibold text-muted dark:text-muted-dark ml-1">mg</span>
            </p>
            <p className="text-sm md:text-base text-muted dark:text-muted-dark mb-1">
              accumulated this month · goal {monthlyBenchmarkMg}mg
            </p>
            <div className="flex justify-center">
              <Delta percent={percentChange(accumulatedMg, previousMg)} goodDirection="down" />
            </div>
          </div>
        </div>
      </div>

      <div className="h-4 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden mt-5">
        <div
          className={`h-full rounded-full ${barForTone[level.tone]} transition-all duration-700 ease-out`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </Card>
  )
}

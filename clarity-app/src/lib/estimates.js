// There is no real NTU -> microplastic-mg conversion; no consumer turbidity
// sensor can measure plastic particle count or mass. This is a documented,
// illustrative estimate derived from your device's real readings, not a lab
// measurement. Treat the constants below as placeholders to tune, not
// scientific fact — swap them out if you get real reference data later.

const MG_PER_NTU_PER_LITER = 0.15 // illustrative conversion constant
const ASSUMED_DAILY_INTAKE_LITERS = 2 // assumed water consumption per day

/**
 * Estimates accumulated microplastic exposure (mg) for the current month,
 * from a device's real Firestore readings.
 *
 * @param {Array<{ntuAfter: number, timestamp: {toDate: () => Date}}>} readings
 *   Readings as returned by subscribeToRecentReadings — newest first.
 * @returns {{ accumulatedMg: number, daysCounted: number, avgNtuAfter: number }}
 */
export function estimateMicroplasticExposure(readings) {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const thisMonthReadings = readings.filter((r) => {
    const d = r.timestamp?.toDate ? r.timestamp.toDate() : null
    return d && d >= startOfMonth
  })

  if (thisMonthReadings.length === 0) {
    return { accumulatedMg: 0, daysCounted: 0, avgNtuAfter: 0 }
  }

  const avgNtuAfter =
    thisMonthReadings.reduce((sum, r) => sum + (r.ntuAfter ?? 0), 0) / thisMonthReadings.length

  const daysElapsed = Math.max(
    1,
    Math.ceil((now - startOfMonth) / (1000 * 60 * 60 * 24))
  )

  const accumulatedMg =
    avgNtuAfter * MG_PER_NTU_PER_LITER * ASSUMED_DAILY_INTAKE_LITERS * daysElapsed

  return {
    accumulatedMg: Math.round(accumulatedMg * 10) / 10,
    daysCounted: daysElapsed,
    avgNtuAfter: Math.round(avgNtuAfter * 10) / 10
  }
}

function startOfDayOffset(daysAgo) {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - daysAgo)
  return d
}

/**
 * Average of a single field across readings that fall on one specific
 * calendar day (today minus daysAgo). Used to build "vs yesterday"
 * comparisons from real data instead of a fabricated number.
 *
 * @param {Array} readings
 * @param {'ntuBefore'|'ntuAfter'} field
 * @param {number} daysAgo 0 = today, 1 = yesterday, etc.
 * @returns {number|null} average value, or null if no readings that day
 */
export function averageForDay(readings, field, daysAgo) {
  const dayStart = startOfDayOffset(daysAgo)
  const dayEnd = startOfDayOffset(daysAgo - 1)

  const dayReadings = readings.filter((r) => {
    const d = r.timestamp?.toDate ? r.timestamp.toDate() : null
    return d && d >= dayStart && d < dayEnd
  })

  if (dayReadings.length === 0) return null

  const sum = dayReadings.reduce((acc, r) => acc + (r[field] ?? 0), 0)
  return Math.round((sum / dayReadings.length) * 10) / 10
}

/**
 * Same illustrative mg estimate as estimateMicroplasticExposure, but scoped
 * to a single calendar day instead of month-to-date — used only for the
 * "vs yesterday" trend direction, not displayed as an absolute figure.
 */
export function estimateDailyMicroplastic(readings, daysAgo) {
  const avgNtuAfter = averageForDay(readings, 'ntuAfter', daysAgo)
  if (avgNtuAfter === null) return null
  const mg = avgNtuAfter * MG_PER_NTU_PER_LITER * ASSUMED_DAILY_INTAKE_LITERS
  return Math.round(mg * 10) / 10
}

export function percentChange(currentValue, previousValue) {
  if (!previousValue) return 0
  return ((currentValue - previousValue) / previousValue) * 100
}

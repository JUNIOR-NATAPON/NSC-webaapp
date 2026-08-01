// Single source of truth for mock readings so numbers agree across
// Home / Data / History instead of each page hardcoding its own values.

export const current = {
  before: 2.4, // raw (before-filter) NTU right now
  after: 0.3 // after-filter NTU right now
}

// Raw (before-filter) reading every 3 hours today. Last point matches
// `current.before` — filtered output stays low and stable, so the swings
// here represent the unfiltered sensor, not the after-filter line.
export const todayTrend = [
  { time: '6am', ntu: 2.8 },
  { time: '9am', ntu: 2.1 },
  { time: '12pm', ntu: 3.4 },
  { time: '3pm', ntu: 11.2 },
  { time: '6pm', ntu: 6.5 },
  { time: '9pm', ntu: current.before }
]

// Daily average raw NTU for the past week. Today (Sun) matches current.before.
export const weeklyTrend = [
  { name: 'Mon', ntu: 3 },
  { name: 'Tue', ntu: 2 },
  { name: 'Wed', ntu: 2 },
  { name: 'Thu', ntu: 11 },
  { name: 'Fri', ntu: 6 },
  { name: 'Sat', ntu: 5 },
  { name: 'Sun', ntu: current.before }
]

export const weeklyStats = {
  average: (weeklyTrend.reduce((sum, d) => sum + d.ntu, 0) / weeklyTrend.length).toFixed(1),
  best: 0.2,
  now: current.before
}

export const recentLog = [
  { date: '02/07/2026', time: '10:32', value: '2.4 NTU', tone: 'clean' },
  { date: '02/07/2026', time: '08:15', value: '1.8 NTU', tone: 'clean' },
  { date: '01/07/2026', time: '19:18', value: '11.4 NTU', tone: 'danger' },
  { date: '01/07/2026', time: '09:52', value: '5.6 NTU', tone: 'warn' }
]

export function toneForValue(v) {
  if (v <= 4) return 'clean'
  if (v <= 10) return 'warn'
  return 'danger'
}

export function labelForValue(v) {
  if (v <= 4) return 'Clean'
  if (v <= 10) return 'Moderate'
  return 'High'
}

export function colorForValue(v) {
  if (v <= 4) return '#22B26A'
  if (v <= 10) return '#E0A824'
  return '#E5484D'
}

// Shared with the Home quick-status row so "remaining" agrees everywhere.
export const filterStatus = {
  remainingPercent: 68,
  yesterdayRemainingPercent: 71
}

export function toneForRemaining(pct) {
  if (pct >= 50) return 'clean'
  if (pct >= 20) return 'warn'
  return 'danger'
}

// Yesterday's reference point for trend/delta indicators. Reuses Saturday
// from weeklyTrend so the "vs yesterday" comparison agrees with the weekly chart.
export const yesterday = {
  before: weeklyTrend.find((d) => d.name === 'Sat').ntu,
  microplasticMg: 5.6
}

export function percentChange(currentValue, previousValue) {
  if (!previousValue) return 0
  return ((currentValue - previousValue) / previousValue) * 100
}

// Matches the "Clarity-001" connected device on the Device settings page.
export const deviceStatus = {
  connected: true,
  deviceName: 'Clarity-001',
  lastSyncedMinutesAgo: 2
}

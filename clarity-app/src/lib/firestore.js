import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where
} from 'firebase/firestore'
import { db, dbDevices, ensureDeviceAuthReady } from './firebase.js'

/*
Firestore schema this app expects:

users/{uid}                                    <- primary project
  username: string
  email: string
  notificationSettings: { filterLow: bool, highNtu: bool, dailySummary: bool }

devices/{deviceId}                              <- device project (see firebase.js)
  ownerUid: string        // uid of the user who owns/paired this device
  name: string            // e.g. "Clarity-001"
  status: "connected" | "searching" | "unconnected"
  ntuBefore: number
  ntuAfter: number
  filterPercentRemaining: number   // 0-100, used for "Need replacement"
  lastUpdated: server timestamp

devices/{deviceId}/readings/{readingId}
  ntuBefore: number
  ntuAfter: number
  timestamp: server timestamp

devices/{deviceId}/filterLog/{logId}
  timestamp: server timestamp

Your hardware/IoT device should write to `devices/{deviceId}` (current
status) and push a new doc into `devices/{deviceId}/readings` on every
sensor reading. Everything below just listens for those changes.

If VITE_FIREBASE_DEVICE_* env vars are set, all of the device/readings/
filterLog functions below talk to that separate Firebase project instead of
the primary one — see README for setup and the security tradeoff involved.
*/

// Wraps an onSnapshot-based subscription so it waits for anonymous auth on
// the device project to be ready first (no-op if using the primary
// project). Still returns an unsubscribe function synchronously, so it
// drops straight into a useEffect cleanup like a normal subscription.
function subscribeAfterDeviceAuth(setup) {
  let unsubscribe = null
  let cancelled = false
  ensureDeviceAuthReady().then(() => {
    if (cancelled) return
    unsubscribe = setup()
  })
  return () => {
    cancelled = true
    if (unsubscribe) unsubscribe()
  }
}

// ---- User profile (always the primary project) ----

export function subscribeToUserProfile(uid, callback) {
  return onSnapshot(doc(db, 'users', uid), (snap) => {
    callback(snap.exists() ? snap.data() : null)
  })
}

export function updateUserProfile(uid, data) {
  return updateDoc(doc(db, 'users', uid), data)
}

export function updateNotificationSettings(uid, settings) {
  return updateDoc(doc(db, 'users', uid), { notificationSettings: settings })
}

// ---- Devices (device project) ----

// Returns the user's first paired device (used for Home/Data/Filter, which
// assume a single primary device). If a user can have multiple devices,
// swap this for a device picker later.
export function subscribeToPrimaryDevice(uid, callback) {
  return subscribeAfterDeviceAuth(() => {
    const q = query(collection(dbDevices, 'devices'), where('ownerUid', '==', uid), limit(1))
    return onSnapshot(q, (snap) => {
      if (snap.empty) {
        callback(null)
        return
      }
      const docSnap = snap.docs[0]
      callback({ id: docSnap.id, ...docSnap.data() })
    })
  })
}

// All devices belonging to a user, for the Device settings page.
export function subscribeToUserDevices(uid, callback) {
  return subscribeAfterDeviceAuth(() => {
    const q = query(collection(dbDevices, 'devices'), where('ownerUid', '==', uid))
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
  })
}

// ---- Readings (for History chart + recent log) ----

export function subscribeToRecentReadings(deviceId, callback, count = 20) {
  return subscribeAfterDeviceAuth(() => {
    const q = query(
      collection(dbDevices, 'devices', deviceId, 'readings'),
      orderBy('timestamp', 'desc'),
      limit(count)
    )
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
  })
}

// All readings from the start of the current calendar month onward — used
// for month-scoped estimates (e.g. the microplastic exposure card) where a
// small fixed limit could miss readings on a high-frequency device.
export function subscribeToMonthlyReadings(deviceId, callback) {
  return subscribeAfterDeviceAuth(() => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const q = query(
      collection(dbDevices, 'devices', deviceId, 'readings'),
      where('timestamp', '>=', Timestamp.fromDate(startOfMonth)),
      orderBy('timestamp', 'desc')
    )
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
  })
}

// ---- Filter replacement log ----

export function subscribeToFilterLog(deviceId, callback, count = 20) {
  return subscribeAfterDeviceAuth(() => {
    const q = query(
      collection(dbDevices, 'devices', deviceId, 'filterLog'),
      orderBy('timestamp', 'desc'),
      limit(count)
    )
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
  })
}

// Convenience for hardware/testing: writes a new reading + bumps the
// device's current status in one call. Not used by the UI directly, but
// handy to call from a test script or a temporary "simulate reading" button.
export async function pushReading(deviceId, { ntuBefore, ntuAfter, filterPercentRemaining }) {
  await ensureDeviceAuthReady()
  await setDoc(
    doc(collection(dbDevices, 'devices', deviceId, 'readings')),
    { ntuBefore, ntuAfter, timestamp: serverTimestamp() }
  )
  await updateDoc(doc(dbDevices, 'devices', deviceId), {
    ntuBefore,
    ntuAfter,
    ...(filterPercentRemaining !== undefined ? { filterPercentRemaining } : {}),
    lastUpdated: serverTimestamp()
  })
}

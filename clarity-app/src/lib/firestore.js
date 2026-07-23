import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore'
import { db } from './firebase.js'

/*
Firestore schema this app expects:

users/{uid}
  username: string
  email: string
  notificationSettings: { filterLow: bool, highNtu: bool, dailySummary: bool }

devices/{deviceId}
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
*/

// ---- User profile ----

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

// ---- Devices ----

// Returns the user's first paired device (used for Home/Data/Filter, which
// assume a single primary device). If a user can have multiple devices,
// swap this for a device picker later.
export function subscribeToPrimaryDevice(uid, callback) {
  const q = query(collection(db, 'devices'), where('ownerUid', '==', uid), limit(1))
  return onSnapshot(q, (snap) => {
    if (snap.empty) {
      callback(null)
      return
    }
    const docSnap = snap.docs[0]
    callback({ id: docSnap.id, ...docSnap.data() })
  })
}

// All devices belonging to a user, for the Device settings page.
export function subscribeToUserDevices(uid, callback) {
  const q = query(collection(db, 'devices'), where('ownerUid', '==', uid))
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  })
}

// ---- Readings (for History chart + recent log) ----

export function subscribeToRecentReadings(deviceId, callback, count = 20) {
  const q = query(
    collection(db, 'devices', deviceId, 'readings'),
    orderBy('timestamp', 'desc'),
    limit(count)
  )
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  })
}

// ---- Filter replacement log ----

export function subscribeToFilterLog(deviceId, callback, count = 20) {
  const q = query(
    collection(db, 'devices', deviceId, 'filterLog'),
    orderBy('timestamp', 'desc'),
    limit(count)
  )
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  })
}

// Convenience for hardware/testing: writes a new reading + bumps the
// device's current status in one call. Not used by the UI directly, but
// handy to call from a test script or a temporary "simulate reading" button.
export async function pushReading(deviceId, { ntuBefore, ntuAfter, filterPercentRemaining }) {
  await setDoc(
    doc(collection(db, 'devices', deviceId, 'readings')),
    { ntuBefore, ntuAfter, timestamp: serverTimestamp() }
  )
  await updateDoc(doc(db, 'devices', deviceId), {
    ntuBefore,
    ntuAfter,
    ...(filterPercentRemaining !== undefined ? { filterPercentRemaining } : {}),
    lastUpdated: serverTimestamp()
  })
}

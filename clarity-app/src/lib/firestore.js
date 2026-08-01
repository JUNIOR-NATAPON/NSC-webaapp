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
import { db, deviceDb } from './firebase.js'

/*
Firestore schema this app expects (written by ESP32 via REST API):

devices/{deviceId}
  ownerUid: string        // uid of the user who owns/paired this device
  name: string            // e.g. "NSC-ESP32-001"
  status: "connected" | "searching" | "unconnected"
  ntuBefore: number       // turbidity value (NTU)
  ntuAfter: number        // post-filter turbidity (0 if no post-filter sensor)
  filterPercentRemaining: number   // 0-100
  particles_per_L: number // microplastics count from AI
  class: "high" | "medium" | "low"   // AI classification
  lastUpdated: timestamp

devices/{deviceId}/readings/{readingId}
  ntuBefore: number
  ntuAfter: number
  particles_per_L: number
  class: string
  transmittance_450: number
  transmittance_525: number
  transmittance_650: number
  timestamp: timestamp

devices/{deviceId}/filterLog/{logId}
  timestamp: timestamp

Note: deviceDb is used for all device-related collections.
      This may point to a separate Firebase project (configured via
      VITE_FIREBASE_DEVICE_* env vars) or fall back to the main project.
*/

// ---- User profile (uses main db — always in the auth project) ----

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

// ---- Devices (uses deviceDb — may be a separate project) ----

// Returns the user's first paired device (used for Home/Data/Filter, which
// assume a single primary device). If a user can have multiple devices,
// swap this for a device picker later.
export function subscribeToPrimaryDevice(uid, callback) {
  const q = query(collection(deviceDb, 'devices'), where('ownerUid', '==', uid), limit(1))
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
  const q = query(collection(deviceDb, 'devices'), where('ownerUid', '==', uid))
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  })
}

// ---- Readings (for History chart + recent log) ----

export function subscribeToRecentReadings(deviceId, callback, count = 20) {
  const q = query(
    collection(deviceDb, 'devices', deviceId, 'readings'),
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
    collection(deviceDb, 'devices', deviceId, 'filterLog'),
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
    doc(collection(deviceDb, 'devices', deviceId, 'readings')),
    { ntuBefore, ntuAfter, timestamp: serverTimestamp() }
  )
  await updateDoc(doc(deviceDb, 'devices', deviceId), {
    ntuBefore,
    ntuAfter,
    ...(filterPercentRemaining !== undefined ? { filterPercentRemaining } : {}),
    lastUpdated: serverTimestamp()
  })
}

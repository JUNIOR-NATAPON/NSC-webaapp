import { initializeApp } from 'firebase/app'
import { getAuth, signInAnonymously } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// ---- Primary project: user accounts (auth + `users` collection) ----
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

if (!firebaseConfig.apiKey) {
  console.warn(
    '[Clarity] Firebase config is missing. Copy .env.example to .env and fill in your project keys.'
  )
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

// ---- Secondary project: device/sensor data only (`devices`, `readings`, `filterLog`) ----
// Optional — only used if VITE_FIREBASE_DEVICE_* env vars are set. Lets your
// hardware/IoT data live in a completely separate Firebase project from user
// accounts, e.g. one managed by a different team or kept isolated on
// purpose. See README for setup steps.
const deviceFirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_DEVICE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_DEVICE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_DEVICE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_DEVICE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_DEVICE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_DEVICE_APP_ID
}

export const usingSeparateDeviceProject = Boolean(deviceFirebaseConfig.apiKey)

// Falls back to the primary app/db if no second project is configured, so
// nothing breaks for people who don't use this feature.
export const deviceApp = usingSeparateDeviceProject
  ? initializeApp(deviceFirebaseConfig, 'deviceData')
  : app
export const deviceAuth = usingSeparateDeviceProject ? getAuth(deviceApp) : auth
export const dbDevices = usingSeparateDeviceProject ? getFirestore(deviceApp) : db

// Firestore rules on the device project require *some* authenticated
// request (not tied to a specific user — see the note in README about the
// security tradeoff of splitting projects this way). Anonymous auth is
// enough to satisfy that. No-op if using the primary project.
let deviceAuthReadyPromise = null
export function ensureDeviceAuthReady() {
  if (!usingSeparateDeviceProject) return Promise.resolve()
  if (!deviceAuthReadyPromise) {
    deviceAuthReadyPromise = deviceAuth.currentUser
      ? Promise.resolve()
      : signInAnonymously(deviceAuth)
  }
  return deviceAuthReadyPromise
}

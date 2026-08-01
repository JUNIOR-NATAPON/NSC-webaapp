import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// --- Main Firebase project (Auth + Firestore) ---
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Helpful console warning if someone forgets to fill in .env — otherwise
// Firebase throws a cryptic "auth/invalid-api-key" error that's hard to trace.
if (!firebaseConfig.apiKey) {
  console.warn(
    '[Clarity] Firebase config is missing. Copy .env.example to .env and fill in your project keys.'
  )
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

// --- (Optional) Separate Firebase project for device/sensor data ---
// If VITE_FIREBASE_DEVICE_API_KEY is set in .env, device data (devices,
// readings, filterLog) is read from that project instead of the main one.
// If not set, the main project is used for everything — no extra config needed.
const deviceConfig = import.meta.env.VITE_FIREBASE_DEVICE_API_KEY
  ? {
      apiKey: import.meta.env.VITE_FIREBASE_DEVICE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_DEVICE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_DEVICE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_DEVICE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_DEVICE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_DEVICE_APP_ID,
    }
  : null

const deviceApp = deviceConfig ? initializeApp(deviceConfig, 'device') : app
export const deviceDb = getFirestore(deviceApp)

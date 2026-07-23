import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  updateProfile
} from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fires on load, and again whenever the user signs in/out — this is
    // what makes the app "remember" a signed-in user on refresh.
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function signUp({ email, password, username }) {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName: username })

    // Create the Firestore profile doc every other page (Account,
    // Notification) reads/writes from.
    await setDoc(doc(db, 'users', cred.user.uid), {
      username,
      email,
      notificationSettings: { filterLow: true, highNtu: true, dailySummary: true },
      createdAt: serverTimestamp()
    })

    return cred.user
  }

  function signIn({ email, password }) {
    return signInWithEmailAndPassword(auth, email, password).then((cred) => cred.user)
  }

  async function signInWithGoogle() {
    const cred = await signInWithPopup(auth, new GoogleAuthProvider())
    // Ensure a profile doc exists even for first-time Google sign-ins.
    await setDoc(
      doc(db, 'users', cred.user.uid),
      {
        username: cred.user.displayName || '',
        email: cred.user.email,
        notificationSettings: { filterLow: true, highNtu: true, dailySummary: true }
      },
      { merge: true }
    )
    return cred.user
  }

  function logOut() {
    return firebaseSignOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signInWithGoogle, logOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}

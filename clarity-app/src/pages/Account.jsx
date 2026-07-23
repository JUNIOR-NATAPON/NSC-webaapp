import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, User, Lock, Mail, Check } from 'lucide-react'
import { sendPasswordResetEmail, updateProfile } from 'firebase/auth'
import Card from '../components/Card.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { auth } from '../lib/firebase.js'
import { subscribeToUserProfile, updateUserProfile } from '../lib/firestore.js'

export default function Account() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [username, setUsername] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  useEffect(() => {
    if (!user) return
    return subscribeToUserProfile(user.uid, (profile) => {
      setUsername(profile?.username || user.displayName || '')
    })
  }, [user])

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    try {
      // Keep Firestore (source of truth for the rest of the app) and
      // Firebase Auth's displayName in sync.
      await updateUserProfile(user.uid, { username })
      await updateProfile(auth.currentUser, { displayName: username })
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  async function handlePasswordReset() {
    await sendPasswordResetEmail(auth, user.email)
    setResetSent(true)
  }

  return (
    <div className="space-y-6 md:max-w-lg lg:max-w-2xl">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate('/profile')} aria-label="Back to profile">
          <ChevronLeft size={22} />
        </button>
        <h1 className="font-display font-bold text-xl md:text-2xl lg:text-3xl">Account</h1>
      </div>

      <Card className="space-y-5">
        <div>
          <label className="block text-sm font-semibold mb-1.5">Username</label>
          <div className="relative">
            <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-black/10 bg-surface pl-11 pr-4 py-3 text-sm focus:border-brand outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5">Email</label>
          <div className="relative">
            <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={user?.email || ''}
              disabled
              className="w-full rounded-xl border border-black/10 bg-black/5 pl-11 pr-4 py-3 text-sm text-muted"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5">Password</label>
          <button
            type="button"
            onClick={handlePasswordReset}
            className="w-full flex items-center gap-3 rounded-xl border border-black/10 bg-surface pl-4 pr-4 py-3 text-sm text-left hover:bg-black/5 transition-colors"
          >
            <Lock size={18} className="text-muted" />
            {resetSent ? 'Reset email sent — check your inbox' : 'Send password reset email'}
          </button>
        </div>
      </Card>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark disabled:opacity-60 transition-colors text-white font-semibold rounded-xl py-3.5"
      >
        {saved && !saving ? <Check size={18} /> : null}
        {saving ? 'Saving...' : saved ? 'Saved' : 'Save changes'}
      </button>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, User, Lock, Mail, Check } from 'lucide-react'
import { sendPasswordResetEmail, updateProfile } from 'firebase/auth'
import Card from '../components/Card.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { auth } from '../lib/firebase.js'
import { subscribeToUserProfile, updateUserProfile } from '../lib/firestore.js'

export default function Account() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showToast } = useToast()
  const [username, setUsername] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

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
      showToast('Account changes saved')
    } finally {
      setSaving(false)
    }
  }

  async function handlePasswordReset() {
    await sendPasswordResetEmail(auth, user.email)
    showToast('Password reset email sent')
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
          <label htmlFor="account-username" className="block text-sm font-semibold mb-1.5">Username</label>
          <div className="relative">
            <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted dark:text-muted-dark" />
            <input
              id="account-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-surface dark:bg-white/5 pl-11 pr-4 py-3 text-sm focus:border-brand outline-none"
            />
          </div>
        </div>
        <div>
          <label htmlFor="account-email" className="block text-sm font-semibold mb-1.5">Email</label>
          <div className="relative">
            <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted dark:text-muted-dark" />
            <input
              id="account-email"
              value={user?.email || ''}
              disabled
              className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 pl-11 pr-4 py-3 text-sm text-muted dark:text-muted-dark"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">Password</label>
          <button
            type="button"
            onClick={handlePasswordReset}
            className="w-full flex items-center gap-3 rounded-xl border border-black/10 dark:border-white/10 bg-surface dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 transition-colors pl-4 pr-4 py-3 text-sm text-left"
          >
            <Lock size={18} className="text-muted dark:text-muted-dark" />
            Send password reset email
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

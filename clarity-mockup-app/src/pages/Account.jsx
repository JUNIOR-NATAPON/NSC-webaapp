import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ChevronLeft, User, Lock, Mail, Check } from 'lucide-react'
import Card from '../components/Card.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function Account() {
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)
  const { showToast } = useToast()

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
              defaultValue="username"
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
              defaultValue="user@email.com"
              disabled
              className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 pl-11 pr-4 py-3 text-sm text-muted dark:text-muted-dark"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">Password</label>
          <button
            type="button"
            onClick={() => showToast('Password reset email sent')}
            className="w-full flex items-center gap-3 rounded-xl border border-black/10 dark:border-white/10 bg-surface dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 transition-colors pl-4 pr-4 py-3 text-sm text-left"
          >
            <Lock size={18} className="text-muted dark:text-muted-dark" />
            Send password reset email
          </button>
        </div>
      </Card>

      <button
        onClick={() => {
          setSaved(true)
          showToast('Account changes saved')
        }}
        className="w-full flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark transition-colors text-white font-semibold rounded-xl py-3.5"
      >
        {saved ? <Check size={18} /> : null}
        {saved ? 'Saved' : 'Save changes'}
      </button>
    </div>
  )
}

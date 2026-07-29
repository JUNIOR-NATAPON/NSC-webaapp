import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ChevronLeft, User, Lock, Mail, Check } from 'lucide-react'
import Card from '../components/Card.jsx'

export default function Account() {
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)

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
              defaultValue="username"
              className="w-full rounded-xl border border-black/10 bg-surface pl-11 pr-4 py-3 text-sm focus:border-brand outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">Email</label>
          <div className="relative">
            <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              defaultValue="user@email.com"
              disabled
              className="w-full rounded-xl border border-black/10 bg-black/5 pl-11 pr-4 py-3 text-sm text-muted"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">Password</label>
          <div className="w-full flex items-center gap-3 rounded-xl border border-black/10 bg-surface pl-4 pr-4 py-3 text-sm text-left">
            <Lock size={18} className="text-muted" />
            Send password reset email
          </div>
        </div>
      </Card>

      <button
        onClick={() => setSaved(true)}
        className="w-full flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark transition-colors text-white font-semibold rounded-xl py-3.5"
      >
        {saved ? <Check size={18} /> : null}
        {saved ? 'Saved' : 'Save changes'}
      </button>
    </div>
  )
}

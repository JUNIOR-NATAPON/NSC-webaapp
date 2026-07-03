import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, Droplets } from 'lucide-react'
import { useState } from 'react'

export default function Login() {
  const navigate = useNavigate()
  const [showPw, setShowPw] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    navigate('/home')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10 bg-surface">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="h-20 w-20 rounded-2xl bg-brand-light flex items-center justify-center mb-3">
            <Droplets size={32} className="text-brand" />
          </div>
          <h1 className="font-display font-extrabold text-2xl text-brand">Clarity</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Field icon={Mail} label="Email" type="email" placeholder="you@email.com" />
          <div>
            <label className="block text-sm font-semibold mb-1.5">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full rounded-xl border border-black/10 bg-white pl-11 pr-11 py-3 text-sm focus:border-brand outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted"
                aria-label="Toggle password visibility"
              >
                <Eye size={18} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-brand hover:bg-brand-dark transition-colors text-white font-semibold rounded-xl py-3.5"
          >
            Sign In
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="h-px bg-black/10 flex-1" />
          <span className="text-xs text-muted">OR</span>
          <div className="h-px bg-black/10 flex-1" />
        </div>

        <button className="w-full border border-black/10 rounded-xl py-3.5 font-semibold text-sm bg-white">
          Continue with Google
        </button>

        <p className="text-center text-sm text-muted mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-brand font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

function Field({ icon: Icon, label, type, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5">{label}</label>
      <div className="relative">
        <Icon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type={type}
          placeholder={placeholder}
          className="w-full rounded-xl border border-black/10 bg-white pl-11 pr-4 py-3 text-sm focus:border-brand outline-none"
        />
      </div>
    </div>
  )
}

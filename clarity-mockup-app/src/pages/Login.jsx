import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import logo from '../assets/logo.png'

// Visual mockup only — no auth wired up. "Sign in" just goes to /home.
export default function Login() {
  const navigate = useNavigate()
  const [showPw, setShowPw] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10 bg-surface">
      <div className="w-full max-w-sm md:max-w-md lg:max-w-lg">
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Clarity — smart water bottle cap" className="w-40 md:w-48 object-contain" />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            navigate('/home')
          }}
          className="space-y-5"
        >
          <div>
            <label className="block text-sm font-semibold mb-1.5">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="email"
                placeholder="you@email.com"
                className="w-full rounded-xl border border-black/10 bg-white pl-11 pr-4 py-3 md:py-3.5 text-sm md:text-base focus:border-brand outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full rounded-xl border border-black/10 bg-white pl-11 pr-11 py-3 md:py-3.5 text-sm md:text-base focus:border-brand outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted"
                aria-label="Toggle password visibility"
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-brand hover:bg-brand-dark transition-colors text-white font-semibold rounded-xl py-3.5 md:py-4 md:text-lg"
          >
            Sign In
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="h-px bg-black/10 flex-1" />
          <span className="text-xs text-muted">OR</span>
          <div className="h-px bg-black/10 flex-1" />
        </div>

        <button
          onClick={() => navigate('/home')}
          className="w-full border border-black/10 rounded-xl py-3.5 font-semibold text-sm bg-white"
        >
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

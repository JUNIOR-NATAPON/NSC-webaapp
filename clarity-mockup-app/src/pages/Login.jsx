import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import logo from '../assets/logo.png'

// Visual mockup only — no auth wired up. "Sign in" just goes to /home.
export default function Login() {
  const navigate = useNavigate()
  const [showPw, setShowPw] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10 bg-surface dark:bg-surface-dark bg-[radial-gradient(circle_at_50%_-10%,_#EAF0FE_0%,_transparent_55%)] dark:bg-[radial-gradient(circle_at_50%_-10%,_rgba(42,95,224,0.18)_0%,_transparent_55%)]">
      <div className="w-full max-w-sm md:max-w-md lg:max-w-lg">
        <div className="flex flex-col items-center mb-8">
          <img
            src={logo}
            alt="Clarity — smart water bottle cap"
            className="w-40 md:w-48 object-contain dark:brightness-0 dark:invert"
          />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            navigate('/home')
          }}
          className="space-y-5"
        >
          <div>
            <label htmlFor="login-email" className="block text-sm font-semibold mb-1.5">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted dark:text-muted-dark" />
              <input
                id="login-email"
                type="email"
                placeholder="you@email.com"
                className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-card-dark pl-11 pr-4 py-3 md:py-3.5 text-sm md:text-base focus:border-brand outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="login-password" className="block text-sm font-semibold mb-1.5">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted dark:text-muted-dark" />
              <input
                id="login-password"
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-card-dark pl-11 pr-11 py-3 md:py-3.5 text-sm md:text-base focus:border-brand outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted dark:text-muted-dark"
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
          <div className="h-px bg-black/10 dark:bg-white/10 flex-1" />
          <span className="text-xs text-muted dark:text-muted-dark">OR</span>
          <div className="h-px bg-black/10 dark:bg-white/10 flex-1" />
        </div>

        <button
          onClick={() => navigate('/home')}
          className="w-full border border-black/10 dark:border-white/10 rounded-xl py-3.5 font-semibold text-sm bg-white dark:bg-card-dark"
        >
          Continue with Google
        </button>

        <p className="text-center text-sm text-muted dark:text-muted-dark mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-brand font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

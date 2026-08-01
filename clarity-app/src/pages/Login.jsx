import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import logo from '../assets/logo.png'
import { useAuth } from '../context/AuthContext.jsx'

function firebaseErrorMessage(err) {
  switch (err.code) {
    case 'auth/invalid-email':
      return 'That email address looks invalid.'
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.'
    default:
      return 'Something went wrong signing in. Please try again.'
  }
}

export default function Login() {
  const navigate = useNavigate()
  const { signIn, signInWithGoogle } = useAuth()
  const [showPw, setShowPw] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await signIn({ email, password })
      navigate('/home')
    } catch (err) {
      setError(firebaseErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleGoogle() {
    setError('')
    setSubmitting(true)
    try {
      await signInWithGoogle()
      navigate('/home')
    } catch (err) {
      setError('Google sign-in failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

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

        {error && (
          <div className="mb-5 rounded-xl bg-danger-bg text-danger text-sm px-4 py-3">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="login-email" className="block text-sm font-semibold mb-1.5">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted dark:text-muted-dark" />
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            disabled={submitting}
            className="w-full bg-brand hover:bg-brand-dark disabled:opacity-60 transition-colors text-white font-semibold rounded-xl py-3.5 md:py-4 md:text-lg"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="h-px bg-black/10 dark:bg-white/10 flex-1" />
          <span className="text-xs text-muted dark:text-muted-dark">OR</span>
          <div className="h-px bg-black/10 dark:bg-white/10 flex-1" />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={submitting}
          className="w-full border border-black/10 dark:border-white/10 rounded-xl py-3.5 font-semibold text-sm bg-white dark:bg-card-dark disabled:opacity-60"
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

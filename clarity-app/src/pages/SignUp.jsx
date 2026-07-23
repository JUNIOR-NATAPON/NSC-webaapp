import { Link, useNavigate } from 'react-router-dom'
import { Mail, User, Lock, Droplets } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

function firebaseErrorMessage(err) {
  switch (err.code) {
    case 'auth/email-already-in-use':
      return 'An account with that email already exists.'
    case 'auth/invalid-email':
      return 'That email address looks invalid.'
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.'
    default:
      return 'Something went wrong creating your account. Please try again.'
  }
}

export default function SignUp() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [form, setForm] = useState({ email: '', username: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    if (!form.username.trim()) {
      setError('Please choose a username.')
      return
    }

    setSubmitting(true)
    try {
      await signUp({ email: form.email, password: form.password, username: form.username })
      navigate('/home')
    } catch (err) {
      setError(firebaseErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10 bg-surface">
      <div className="w-full max-w-sm md:max-w-md lg:max-w-lg">
        <div className="flex flex-col items-center mb-8">
          <div className="h-20 w-20 md:h-24 md:w-24 rounded-2xl bg-brand-light flex items-center justify-center mb-3">
            <Droplets size={32} className="text-brand" />
          </div>
          <h1 className="font-display font-extrabold text-2xl md:text-3xl text-brand">Clarity</h1>
        </div>

        {error && (
          <div className="mb-5 rounded-xl bg-danger-bg text-danger text-sm px-4 py-3">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Field icon={Mail} label="Email" type="email" placeholder="you@email.com" value={form.email} onChange={update('email')} />
          <Field icon={User} label="Username" type="text" placeholder="username" value={form.username} onChange={update('username')} />
          <Field icon={Lock} label="Password" type="password" placeholder="••••••••" value={form.password} onChange={update('password')} />
          <Field icon={Lock} label="Confirm Password" type="password" placeholder="••••••••" value={form.confirm} onChange={update('confirm')} />

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand hover:bg-brand-dark disabled:opacity-60 transition-colors text-white font-semibold rounded-xl py-3.5 md:py-4 md:text-lg"
          >
            {submitting ? 'Creating account...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brand font-semibold">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

function Field({ icon: Icon, label, type, placeholder, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5">{label}</label>
      <div className="relative">
        <Icon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type={type}
          required
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-xl border border-black/10 bg-white pl-11 pr-4 py-3 md:py-3.5 text-sm md:text-base focus:border-brand outline-none"
        />
      </div>
    </div>
  )
}

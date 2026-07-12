import { Link, useNavigate } from 'react-router-dom'
import { Mail, User, Lock, Droplets } from 'lucide-react'

export default function SignUp() {
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    navigate('/home')
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

        <form onSubmit={handleSubmit} className="space-y-5">
          <Field icon={Mail} label="Email" type="email" placeholder="you@email.com" />
          <Field icon={User} label="Username" type="text" placeholder="username" />
          <Field icon={Lock} label="Password" type="password" placeholder="••••••••" />
          <Field icon={Lock} label="Confirm Password" type="password" placeholder="••••••••" />

          <button
            type="submit"
            className="w-full bg-brand hover:bg-brand-dark transition-colors text-white font-semibold rounded-xl py-3.5 md:py-4 md:text-lg"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-base text-muted mt-6">
          Don't have an account?{' '}
          <Link to="/login" className="text-brand font-semibold">
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
          className="w-full rounded-xl border border-black/10 bg-white pl-11 pr-4 py-3 md:py-3.5 text-sm md:text-base focus:border-brand outline-none"
        />
      </div>
    </div>
  )
}

import { Link, useNavigate } from 'react-router-dom'
import { Mail, User, Lock } from 'lucide-react'
import logo from '../assets/logo.png'

// Visual mockup only — no auth wired up. "Sign in" just goes to /home.
export default function SignUp() {
  const navigate = useNavigate()

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
          <Field icon={Mail} label="Email" type="email" placeholder="you@email.com" />
          <Field icon={User} label="Username" type="text" placeholder="username" />
          <Field icon={Lock} label="Password" type="password" placeholder="••••••••" />
          <Field icon={Lock} label="Confirm Password" type="password" placeholder="••••••••" />

          <button
            type="submit"
            className="w-full bg-brand hover:bg-brand-dark transition-colors text-white font-semibold rounded-xl py-3.5 md:py-4 md:text-lg"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-muted dark:text-muted-dark mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brand font-semibold">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

function Field({ icon: Icon, label, type, placeholder }) {
  const id = `signup-${label.toLowerCase().replace(/\s+/g, '-')}`
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold mb-1.5">{label}</label>
      <div className="relative">
        <Icon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted dark:text-muted-dark" />
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-card-dark pl-11 pr-4 py-3 md:py-3.5 text-sm md:text-base focus:border-brand outline-none"
        />
      </div>
    </div>
  )
}

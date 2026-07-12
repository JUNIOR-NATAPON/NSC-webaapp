import { useNavigate } from 'react-router-dom'
import { ChevronLeft, User, Lock, Mail } from 'lucide-react'
import Card from '../components/Card.jsx'

export default function Account() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6 md:max-w-lg lg:max-w-2xl">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate('/profile')} aria-label="Back to profile">
          <ChevronLeft size={22} />
        </button>
        <h1 className="font-display font-bold text-xl md:text-2xl lg:text-3xl">Account</h1>
      </div>

      <Card className="space-y-5">
        <Field icon={User} label="Username" value="**********" />
        <Field icon={Lock} label="Password" value="**************" type="password" />
        <Field icon={Mail} label="Email" value="*****@email.com" />
      </Card>

      <button className="w-full bg-brand hover:bg-brand-dark transition-colors text-white font-semibold rounded-xl py-3.5">
        Save changes
      </button>
    </div>
  )
}

function Field({ icon: Icon, label, value }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5">{label}</label>
      <div className="relative">
        <Icon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input
          defaultValue={value}
          className="w-full rounded-xl border border-black/10 bg-surface pl-11 pr-4 py-3 text-sm focus:border-brand outline-none"
        />
      </div>
    </div>
  )
}

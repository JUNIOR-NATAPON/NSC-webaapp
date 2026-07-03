import { useNavigate } from 'react-router-dom'
import { Smartphone, User, Bell, ChevronRight, LogOut } from 'lucide-react'
import Card from '../components/Card.jsx'

const items = [
  { label: 'Device', icon: Smartphone, to: '/settings/device' },
  { label: 'Account', icon: User, to: '/settings/account' },
  { label: 'Notification', icon: Bell, to: '/settings/notification' }
]

export default function Profile() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6 md:max-w-md">
      <div className="flex flex-col items-center py-4">
        <div className="h-24 w-24 rounded-full bg-ink flex items-center justify-center mb-3">
          <User size={44} className="text-white" />
        </div>
        <h1 className="font-display font-bold text-xl">User</h1>
        <p className="text-sm text-muted">********@email.com</p>
      </div>

      <Card className="p-0 overflow-hidden">
        <p className="text-sm font-semibold px-5 pt-4 pb-2 text-muted">Setting</p>
        {items.map(({ label, icon: Icon, to }, i) => (
          <button
            key={label}
            onClick={() => navigate(to)}
            className={`w-full flex items-center justify-between px-5 py-4 text-sm font-medium hover:bg-surface transition-colors ${
              i !== items.length - 1 ? 'border-b border-black/5' : ''
            }`}
          >
            <span className="flex items-center gap-3">
              <Icon size={18} className="text-muted" />
              {label}
            </span>
            <ChevronRight size={16} className="text-muted" />
          </button>
        ))}
      </Card>

      <button
        onClick={() => navigate('/login')}
        className="w-full flex items-center justify-center gap-2 border border-danger/30 text-danger rounded-xl py-3.5 font-semibold text-sm bg-white"
      >
        <LogOut size={16} />
        Sign Out
      </button>
    </div>
  )
}

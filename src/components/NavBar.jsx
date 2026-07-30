import { NavLink, useLocation } from 'react-router-dom'
import { Home, Database, Filter, User } from 'lucide-react'
import logoMark from '../assets/logo-mark.png'
import ThemeToggle from './ThemeToggle.jsx'
import DeviceStatus from './DeviceStatus.jsx'

const links = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/data', label: 'Data', icon: Database, matchPrefixes: ['/history'] },
  { to: '/filter', label: 'Filter', icon: Filter },
  { to: '/profile', label: 'Profile', icon: User, matchPrefixes: ['/settings'] }
]

function LinkItem({ to, label, icon: Icon, vertical, matchPrefixes = [] }) {
  const { pathname } = useLocation()
  return (
    <NavLink
      to={to}
      className={({ isActive }) => {
        const active = isActive || matchPrefixes.some((p) => pathname.startsWith(p))
        return [
          'flex items-center gap-3 transition-colors',
          vertical
            ? 'flex-row w-full rounded-xl px-4 py-3 text-sm font-medium'
            : 'flex-col justify-center py-2 text-xs font-medium flex-1',
          active
            ? vertical
              ? 'bg-brand-light text-brand dark:bg-brand/20'
              : 'text-brand'
            : vertical
            ? 'text-muted dark:text-muted-dark hover:bg-surface dark:hover:bg-white/5'
            : 'text-muted dark:text-muted-dark'
        ].join(' ')
      }}
    >
      <Icon size={vertical ? 20 : 22} strokeWidth={2} />
      <span>{label}</span>
    </NavLink>
  )
}

export default function NavBar() {
  return (
    <>
      {/* Desktop / tablet sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-60 md:shrink-0 md:h-screen md:sticky md:top-0 border-r border-black/5 dark:border-white/10 bg-white dark:bg-card-dark px-4 py-6">
        <div className="flex items-center justify-between gap-2 px-2 mb-8">
          <div className="flex items-center gap-2">
            <img src={logoMark} alt="Clarity" className="h-9 w-9 object-contain" />
            <span className="font-display font-bold text-lg text-brand">Clarity</span>
            <DeviceStatus showLabel={false} />
          </div>
          <ThemeToggle />
        </div>
        <nav className="flex flex-col gap-1">
          {links.map((l) => (
            <LinkItem key={l.to} {...l} vertical />
          ))}
        </nav>
      </aside>

      {/* Mobile bottom bar */}
      <BottomNav />
    </>
  )
}

function BottomNav() {
  const { pathname } = useLocation()
  const activeIndex = links.findIndex(
    (l) => pathname === l.to || (l.matchPrefixes || []).some((p) => pathname.startsWith(p))
  )

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-20 bg-white dark:bg-card-dark border-t border-black/5 dark:border-white/10 flex px-2 pt-1 pb-[env(safe-area-inset-bottom)] relative">
      {activeIndex >= 0 && (
        <span
          className="absolute top-0 h-0.5 w-1/4 rounded-full bg-brand transition-[left] duration-300 ease-out"
          style={{ left: `${activeIndex * 25}%` }}
        />
      )}
      {links.map((l) => (
        <LinkItem key={l.to} {...l} />
      ))}
    </nav>
  )
}

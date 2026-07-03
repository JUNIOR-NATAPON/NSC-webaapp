import { NavLink } from 'react-router-dom'
import { Home, Database, Filter, User, Droplets } from 'lucide-react'

const links = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/data', label: 'Data', icon: Database, matchPrefixes: ['/history'] },
  { to: '/filter', label: 'Filter', icon: Filter },
  { to: '/profile', label: 'Profile', icon: User, matchPrefixes: ['/settings'] }
]

function LinkItem({ to, label, icon: Icon, vertical, matchPrefixes = [] }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => {
        const path = window.location.pathname
        const active = isActive || matchPrefixes.some((p) => path.startsWith(p))
        return [
          'flex items-center gap-3 transition-colors',
          vertical
            ? 'flex-row w-full rounded-xl px-4 py-3 text-sm font-medium'
            : 'flex-col justify-center py-2 text-xs font-medium flex-1',
          active
            ? vertical
              ? 'bg-brand-light text-brand'
              : 'text-brand'
            : vertical
            ? 'text-muted hover:bg-surface'
            : 'text-muted'
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
      <aside className="hidden md:flex md:flex-col md:w-60 md:shrink-0 md:h-screen md:sticky md:top-0 border-r border-black/5 bg-white px-4 py-6">
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="h-9 w-9 rounded-full bg-brand-light flex items-center justify-center">
            <Droplets size={18} className="text-brand" />
          </div>
          <span className="font-display font-bold text-lg text-brand">Clarity</span>
        </div>
        <nav className="flex flex-col gap-1">
          {links.map((l) => (
            <LinkItem key={l.to} {...l} vertical />
          ))}
        </nav>
      </aside>

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-20 bg-white border-t border-black/5 flex px-2 pt-1 pb-[env(safe-area-inset-bottom)]">
        {links.map((l) => (
          <LinkItem key={l.to} {...l} />
        ))}
      </nav>
    </>
  )
}

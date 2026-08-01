import logoMark from '../assets/logo-mark.png'
import ThemeToggle from './ThemeToggle.jsx'
import DeviceStatus from './DeviceStatus.jsx'

export default function TopBar({ title }) {
  return (
    <header className="md:hidden sticky top-0 z-10 bg-white dark:bg-card-dark border-b border-black/5 dark:border-white/10 px-5 py-3 flex items-center gap-2">
      <img src={logoMark} alt="Clarity" className="h-8 w-8 object-contain" />
      <span className="font-display font-bold text-brand flex-1">{title || 'Clarity'}</span>
      <DeviceStatus showLabel={false} />
      <ThemeToggle />
    </header>
  )
}

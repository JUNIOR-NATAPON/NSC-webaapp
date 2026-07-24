import logoMark from '../assets/logo-mark.png'

export default function TopBar({ title }) {
  return (
    <header className="md:hidden sticky top-0 z-10 bg-white border-b border-black/5 px-5 py-3 flex items-center gap-2">
      <img src={logoMark} alt="Clarity" className="h-8 w-8 object-contain" />
      <span className="font-display font-bold text-brand">{title || 'Clarity'}</span>
    </header>
  )
}

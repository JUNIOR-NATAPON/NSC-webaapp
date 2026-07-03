import { Droplets } from 'lucide-react'

export default function TopBar({ title }) {
  return (
    <header className="md:hidden sticky top-0 z-10 bg-white border-b border-black/5 px-5 py-3 flex items-center gap-2">
      <div className="h-8 w-8 rounded-full bg-brand-light flex items-center justify-center">
        <Droplets size={16} className="text-brand" />
      </div>
      <span className="font-display font-bold text-brand">{title || 'Clarity'}</span>
    </header>
  )
}

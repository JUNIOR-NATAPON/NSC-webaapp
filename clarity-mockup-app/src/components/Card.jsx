export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl md:rounded-3xl shadow-card p-5 md:p-7 lg:p-8 ${className}`}>
      {children}
    </div>
  )
}

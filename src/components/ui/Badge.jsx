export function Badge({ children, variant = 'default', className = '', ...props }) {
  const variants = {
    default: 'bg-slate-700 text-slate-300 border-slate-600',
    success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    error: 'bg-red-500/20 text-red-400 border-red-500/50',
    info: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50',
  }
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}

import { forwardRef } from 'react'

const Button = forwardRef(({ className = '', variant = 'default', size = 'default', ...props }, ref) => {
  const base = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 disabled:pointer-events-none disabled:opacity-50'
  const variants = {
    default: 'bg-cyan-500 text-slate-950 hover:bg-cyan-400',
    secondary: 'bg-slate-700 text-white hover:bg-slate-600',
    destructive: 'bg-red-500 text-white hover:bg-red-400',
    ghost: 'hover:bg-slate-800 text-slate-300',
    outline: 'border border-slate-600 bg-transparent hover:bg-slate-800',
  }
  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-8 px-3 text-sm',
    lg: 'h-12 px-6 text-lg',
    icon: 'h-10 w-10',
  }
  return (
    <button
      ref={ref}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  )
})
Button.displayName = 'Button'
export { Button }

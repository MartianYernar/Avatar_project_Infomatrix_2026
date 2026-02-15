import { useState, useRef, useEffect, Children } from 'react'

export function Select({ value, onValueChange, children, placeholder = 'Select...', className = '', disabled }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const items = Children.toArray(children).filter(Boolean)
  const selectedChild = items.find(c => c?.props?.value === value)
  const displayValue = selectedChild?.props?.children ?? placeholder

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className="flex h-10 w-full items-center justify-between rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-2 text-sm text-white outline-none ring-cyan-500 focus:ring-2 disabled:opacity-50"
      >
        <span className="truncate">{displayValue}</span>
        <svg className="h-4 w-4 shrink-0 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-slate-600 bg-slate-900 shadow-lg">
          {items.map((child) => (
            <button
              key={child?.props?.value}
              type="button"
              className="flex w-full cursor-pointer items-center px-3 py-2 text-sm text-white hover:bg-slate-700"
              onClick={() => {
                onValueChange?.(child?.props?.value)
                setOpen(false)
              }}
            >
              {child?.props?.children}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function SelectItem({ value, children }) {
  return null
}
SelectItem.displayName = 'SelectItem'

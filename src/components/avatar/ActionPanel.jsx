import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Hand, Package, Home, AlertOctagon, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const ACTIONS = [
  { id: 'grab', label: 'Grab', icon: Hand, gradient: 'from-cyan-500 to-blue-600' },
  { id: 'place', label: 'Place', icon: Package, gradient: 'from-violet-500 to-purple-600' },
  { id: 'return', label: 'Return Home', icon: Home, gradient: 'from-emerald-500 to-teal-600' },
]

export function ActionPanel({ onAction, disabled = false }) {
  const [activeAction, setActiveAction] = useState(null)
  const [completedAction, setCompletedAction] = useState(null)

  const handleAction = (id) => {
    if (disabled || activeAction) return
    setActiveAction(id)
    onAction?.(id)
    setTimeout(() => {
      setActiveAction(null)
      setCompletedAction(id)
      setTimeout(() => setCompletedAction(null), 1500)
    }, 2000)
  }

  const handleEmergencyStop = () => {
    if (disabled) return
    onAction?.('emergency_stop')
  }

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900/80 backdrop-blur-xl p-4">
      <h3 className="text-sm font-bold text-white mb-3">Preset Actions</h3>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {ACTIONS.map(({ id, label, icon: Icon, gradient }) => (
          <motion.button
            key={id}
            type="button"
            disabled={disabled || !!activeAction}
            onClick={() => handleAction(id)}
            className={`relative flex flex-col items-center justify-center gap-1 rounded-lg bg-gradient-to-br ${gradient} p-3 text-white transition hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed`}
            whileHover={!disabled && !activeAction ? { scale: 1.05 } : {}}
            whileTap={!disabled && !activeAction ? { scale: 0.98 } : {}}
          >
            <AnimatePresence mode="wait">
              {activeAction === id ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-6 w-6 rounded-full border-2 border-white border-t-transparent animate-spin"
                />
              ) : completedAction === id ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="rounded-full bg-white/20 p-0.5"
                >
                  <Check className="h-5 w-5" />
                </motion.div>
              ) : (
                <Icon key="icon" className="h-6 w-6" />
              )}
            </AnimatePresence>
            <span className="text-xs font-medium">{label}</span>
          </motion.button>
        ))}
      </div>
      <Button
        variant="destructive"
        className="w-full"
        disabled={disabled}
        onClick={handleEmergencyStop}
      >
        <AlertOctagon className="h-4 w-4 mr-2 inline" />
        Emergency Stop
      </Button>
    </div>
  )
}

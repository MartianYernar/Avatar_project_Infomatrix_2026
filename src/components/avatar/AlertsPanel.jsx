import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, AlertTriangle, Info, CheckCircle, X } from 'lucide-react'

const TYPE_CONFIG = {
  error: { icon: AlertCircle, bg: 'bg-red-500/10 border-red-500/50', text: 'text-red-400', iconColor: 'text-red-400' },
  warning: { icon: AlertTriangle, bg: 'bg-yellow-500/10 border-yellow-500/50', text: 'text-yellow-400', iconColor: 'text-yellow-400' },
  info: { icon: Info, bg: 'bg-cyan-500/10 border-cyan-500/50', text: 'text-cyan-400', iconColor: 'text-cyan-400' },
  success: { icon: CheckCircle, bg: 'bg-emerald-500/10 border-emerald-500/50', text: 'text-emerald-400', iconColor: 'text-emerald-400' },
}

export function AlertsPanel({ alerts = [], onDismiss }) {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900/80 backdrop-blur-xl p-4">
      <h3 className="text-sm font-bold text-white mb-3">Alerts</h3>
      <div className="max-h-[200px] overflow-y-auto space-y-2">
        <AnimatePresence mode="popLayout">
          {alerts.length === 0 ? (
            <motion.p
              key="nominal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-slate-400 py-2"
            >
              All systems nominal
            </motion.p>
          ) : (
            alerts.map((alert) => {
              const config = TYPE_CONFIG[alert.type] || TYPE_CONFIG.info
              const Icon = config.icon
              return (
                <motion.div
                  key={alert.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className={`flex items-start gap-2 rounded-lg border p-2 ${config.bg}`}
                >
                  <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${config.iconColor}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${config.text}`}>{alert.message}</p>
                    {alert.timestamp && (
                      <p className="text-xs text-slate-500 mt-0.5">{alert.timestamp}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => onDismiss?.(alert.id)}
                    className="shrink-0 rounded p-1 text-slate-400 hover:text-white hover:bg-slate-700/50 transition"
                    aria-label="Dismiss"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

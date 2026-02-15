import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Download, Hand, Package, Home, Move, AlertOctagon, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Select, SelectItem } from '@/components/ui/Select'
import { createPageUrl } from '@/utils'

const ACTION_ICONS = {
  grab: Hand,
  place: Package,
  return: Home,
  manual_move: Move,
  emergency_stop: AlertOctagon,
}

const SAMPLE_TASKS = [
  { id: '1', action_type: 'grab', object_detected: 'Cube', duration_ms: 1200, success: true, grip_force_used: 65, created_date: '2025-02-15T10:32:00' },
  { id: '2', action_type: 'place', object_detected: 'Bin A', duration_ms: 980, success: true, grip_force_used: 70, created_date: '2025-02-15T10:28:00' },
  { id: '3', action_type: 'return', object_detected: null, duration_ms: 2100, success: true, grip_force_used: 0, created_date: '2025-02-15T10:25:00' },
  { id: '4', action_type: 'grab', object_detected: 'Cylinder', duration_ms: 1500, success: false, grip_force_used: 80, created_date: '2025-02-15T10:20:00' },
  { id: '5', action_type: 'manual_move', object_detected: null, duration_ms: 3400, success: true, grip_force_used: 0, created_date: '2025-02-15T10:15:00' },
  { id: '6', action_type: 'place', object_detected: 'Bin B', duration_ms: 1100, success: true, grip_force_used: 72, created_date: '2025-02-15T10:10:00' },
  { id: '7', action_type: 'grab', object_detected: 'Sphere', duration_ms: 890, success: true, grip_force_used: 58, created_date: '2025-02-15T10:05:00' },
  { id: '8', action_type: 'emergency_stop', object_detected: null, duration_ms: 0, success: false, grip_force_used: 0, created_date: '2025-02-15T09:58:00' },
]

export function TaskHistory() {
  const [filter, setFilter] = useState('all')

  const filtered = SAMPLE_TASKS.filter((t) => {
    if (filter === 'successful') return t.success
    if (filter === 'failed') return !t.success
    return true
  })

  const total = SAMPLE_TASKS.length
  const successful = SAMPLE_TASKS.filter((t) => t.success).length
  const failed = total - successful
  const avgDuration = Math.round(
    SAMPLE_TASKS.reduce((a, t) => a + t.duration_ms, 0) / total
  )

  const formatTime = (iso) => {
    try {
      const d = new Date(iso)
      return d.toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })
    } catch {
      return iso
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <Link to={createPageUrl('/')}>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </motion.header>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-bold text-white mb-6"
        >
          Task History
        </motion.h1>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total', value: total, color: 'text-slate-300' },
            { label: 'Successful', value: successful, color: 'text-emerald-400' },
            { label: 'Failed', value: failed, color: 'text-red-400' },
            { label: 'Avg Duration', value: `${avgDuration} ms`, color: 'text-cyan-400' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-slate-700/50 bg-slate-900/80 backdrop-blur-xl p-4"
            >
              <p className="text-xs text-slate-400">{stat.label}</p>
              <p className={`text-xl font-semibold ${stat.color}`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Filter */}
        <div className="mb-4">
          <label className="text-sm text-slate-400 mr-2">Filter:</label>
          <Select value={filter} onValueChange={setFilter} className="inline-block w-40">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="successful">Successful</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </Select>
        </div>

        {/* Task list */}
        <ul className="space-y-2">
          {filtered.map((task, index) => {
            const Icon = ACTION_ICONS[task.action_type] || Package
            return (
              <motion.li
                key={task.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-xl border border-slate-700/50 bg-slate-900/80 backdrop-blur-xl p-4 flex items-center gap-4 hover:border-slate-600/50 transition"
              >
                <div className={`rounded-lg p-2 ${
                  task.action_type === 'emergency_stop' ? 'bg-red-500/20' : 'bg-cyan-500/20'
                }`}>
                  <Icon className={`h-5 w-5 ${
                    task.action_type === 'emergency_stop' ? 'text-red-400' : 'text-cyan-400'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white capitalize">
                    {task.action_type.replace('_', ' ')}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {task.object_detected && (
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                        {task.object_detected}
                      </span>
                    )}
                    <span className="text-xs text-slate-500">
                      {formatTime(task.created_date)}
                    </span>
                    <span className="text-xs text-slate-500">
                      {task.duration_ms} ms · Grip {task.grip_force_used}%
                    </span>
                  </div>
                </div>
                <div className="shrink-0">
                  {task.success ? (
                    <Check className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <X className="h-5 w-5 text-red-400" />
                  )}
                </div>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

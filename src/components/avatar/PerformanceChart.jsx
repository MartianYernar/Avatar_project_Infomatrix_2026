import { useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

const defaultData = [
  { time: '00:00', accuracy: 92, speed: 78 },
  { time: '04:00', accuracy: 88, speed: 82 },
  { time: '08:00', accuracy: 95, speed: 85 },
  { time: '12:00', accuracy: 90, speed: 88 },
  { time: '16:00', accuracy: 94, speed: 90 },
  { time: '20:00', accuracy: 96, speed: 92 },
]

export function PerformanceChart({ taskLogs }) {
  const data = useMemo(() => taskLogs ? deriveChartData(taskLogs) : defaultData, [taskLogs])

  const successRate = taskLogs
    ? taskLogs.length
      ? Math.round((taskLogs.filter((t) => t.success).length / taskLogs.length) * 100)
      : 0
    : 94
  const avgResponse = taskLogs?.length
    ? Math.round(taskLogs.reduce((a, t) => a + (t.duration_ms || 0), 0) / taskLogs.length)
    : 1240
  const tasksToday = taskLogs?.length ?? 12

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900/80 backdrop-blur-xl p-4">
      <h3 className="text-sm font-bold text-white mb-4">Performance</h3>
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="rounded-lg bg-slate-800/80 p-2 text-center">
          <p className="text-xs text-slate-400">Success Rate</p>
          <p className="text-lg font-semibold text-emerald-400">{successRate}%</p>
        </div>
        <div className="rounded-lg bg-slate-800/80 p-2 text-center">
          <p className="text-xs text-slate-400">Avg Response</p>
          <p className="text-lg font-semibold text-cyan-400">{avgResponse} ms</p>
        </div>
        <div className="rounded-lg bg-slate-800/80 p-2 text-center">
          <p className="text-xs text-slate-400">Tasks Today</p>
          <p className="text-lg font-semibold text-violet-400">{tasksToday}</p>
        </div>
      </div>
      <div className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="speedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 10 }} />
            <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 10 }} domain={[0, 100]} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: 8 }}
              labelStyle={{ color: '#94a3b8' }}
              formatter={(value) => [value, '']}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Area type="monotone" dataKey="accuracy" stroke="#22d3ee" fill="url(#accGrad)" strokeWidth={2} name="Accuracy" />
            <Area type="monotone" dataKey="speed" stroke="#a78bfa" fill="url(#speedGrad)" strokeWidth={2} name="Speed" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-4 mt-2">
        <span className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="h-2 w-2 rounded-full bg-cyan-400" /> Accuracy
        </span>
        <span className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="h-2 w-2 rounded-full bg-violet-400" /> Speed
        </span>
      </div>
    </div>
  )
}

function deriveChartData(taskLogs) {
  if (!taskLogs?.length) return defaultData
  const buckets = 6
  const chunk = Math.ceil(taskLogs.length / buckets)
  return Array.from({ length: buckets }, (_, i) => {
    const slice = taskLogs.slice(i * chunk, (i + 1) * chunk)
    const accuracy = slice.length
      ? Math.round((slice.filter((t) => t.success).length / slice.length) * 100)
      : 0
    const speed = slice.length
      ? Math.min(100, Math.round(100 - (slice.reduce((a, t) => a + (t.duration_ms || 0), 0) / slice.length / 50)))
      : 0
    return {
      time: `${i * 4}:00`,
      accuracy,
      speed,
    }
  })
}

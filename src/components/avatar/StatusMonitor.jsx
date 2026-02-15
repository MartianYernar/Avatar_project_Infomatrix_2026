import { motion } from 'framer-motion'
import { BatteryLow, BatteryWarning, Battery, Grip } from 'lucide-react'

function GaugeRing({ value, max = 100, color = 'cyan', size = 64, strokeWidth = 6 }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(Math.max(value / max, 0), 1)
  const strokeDashoffset = circumference * (1 - progress)

  const colorClass = color === 'cyan' ? 'stroke-cyan-400' : color === 'red' ? 'stroke-red-400' : color === 'yellow' ? 'stroke-yellow-400' : 'stroke-emerald-400'

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-slate-700"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        className={colorClass}
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset }}
        transition={{ duration: 0.5 }}
      />
    </svg>
  )
}

export function StatusMonitor({ robotStatus }) {
  if (!robotStatus) return null

  const { battery_level = 0, grip_force = 0, motor_temperatures = [], joint_angles = [] } = robotStatus

  const batteryColor = battery_level <= 20 ? 'red' : battery_level <= 50 ? 'yellow' : 'emerald'
  const BatteryIcon = battery_level <= 20 ? BatteryLow : battery_level <= 50 ? BatteryWarning : Battery

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900/80 backdrop-blur-xl p-4">
      <h3 className="text-sm font-bold text-white mb-4">System Telemetry</h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <GaugeRing value={battery_level} color={batteryColor} size={72} strokeWidth={8} />
            <div className="absolute inset-0 flex items-center justify-center">
              <BatteryIcon className={`h-6 w-6 ${
                battery_level <= 20 ? 'text-red-400' : battery_level <= 50 ? 'text-yellow-400' : 'text-emerald-400'
              }`} />
            </div>
          </div>
          <span className="text-xs text-slate-400">Battery</span>
          <span className="text-sm font-semibold text-white">{battery_level}%</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <GaugeRing value={grip_force} color="cyan" size={72} strokeWidth={8} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Grip className="h-6 w-6 text-cyan-400" />
            </div>
          </div>
          <span className="text-xs text-slate-400">Grip Force</span>
          <span className="text-sm font-semibold text-white">{grip_force}%</span>
        </div>
      </div>

      {motor_temperatures?.length > 0 && (
        <div className="mb-4">
          <span className="text-xs text-slate-400 block mb-2">Motor Temperatures</span>
          <div className="flex gap-2 justify-between">
            {motor_temperatures.slice(0, 5).map((temp, i) => {
              const barHeight = Math.min((temp / 80) * 60, 60)
              return (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div className="w-full h-[60px] rounded-t bg-slate-700 flex items-end justify-center overflow-hidden">
                    <motion.div
                      className={`w-full rounded-t ${
                        temp >= 60 ? 'bg-red-500' : temp >= 45 ? 'bg-orange-500' : 'bg-emerald-500'
                      }`}
                      initial={{ height: 0 }}
                      animate={{ height: barHeight }}
                      transition={{ duration: 0.5 }}
                      style={{ minHeight: barHeight > 0 ? 4 : 0 }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1">M{i + 1}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {joint_angles?.length > 0 && (
        <div>
          <span className="text-xs text-slate-400 block mb-2">Joint Angles</span>
          <div className="grid grid-cols-3 gap-2">
            {joint_angles.slice(0, 6).map((angle, i) => (
              <div key={i} className="rounded-lg bg-slate-800/80 px-2 py-1.5 text-center">
                <span className="text-xs text-slate-500">J{i + 1}</span>
                <p className="text-sm font-semibold text-cyan-400">{angle}°</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

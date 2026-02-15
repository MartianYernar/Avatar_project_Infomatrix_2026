import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bot, Settings, History } from 'lucide-react'
import { LiveFeed } from '@/components/avatar/LiveFeed'
import { JoystickControl } from '@/components/avatar/JoystickControl'
import { StatusMonitor } from '@/components/avatar/StatusMonitor'
import { ActionPanel } from '@/components/avatar/ActionPanel'
import { AlertsPanel } from '@/components/avatar/AlertsPanel'
import { PerformanceChart } from '@/components/avatar/PerformanceChart'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { createPageUrl } from '@/utils'

const defaultRobotStatus = {
  battery_level: 87,
  connection_latency: 42,
  motor_temperatures: [38, 42, 45, 41, 39],
  joint_angles: [0, 15, -30, 45, 0, 12],
  grip_force: 0,
  status: 'online',
  active_alerts: [],
}

export function Dashboard() {
  const [isConnected, setIsConnected] = useState(true)
  const [latency, setLatency] = useState(42)
  const [robotStatus, setRobotStatus] = useState(defaultRobotStatus)
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    const t = setInterval(() => {
      setLatency((l) => Math.max(20, Math.min(200, l + (Math.random() - 0.5) * 30)))
      setRobotStatus((s) => ({
        ...s,
        grip_force: Math.max(0, Math.min(100, s.grip_force + (Math.random() - 0.5) * 10)),
        motor_temperatures: (s.motor_temperatures || []).map((temp) =>
          Math.max(30, Math.min(70, temp + (Math.random() - 0.5) * 4))
        ),
      }))
    }, 1000)
    return () => clearInterval(t)
  }, [])

  const handleMove = (pos) => {
    if (Math.abs(pos.x) > 0.01 || Math.abs(pos.y) > 0.01) {
      console.log('Joystick:', pos)
    }
  }

  const handleAction = (actionId) => {
    console.log('Action:', actionId)
    if (actionId === 'emergency_stop') {
      setAlerts((a) => [
        ...a,
        {
          id: `alert-${Date.now()}`,
          type: 'error',
          message: 'Emergency stop activated',
          timestamp: new Date().toLocaleTimeString(),
        },
      ])
    }
  }

  const dismissAlert = (id) => {
    setAlerts((a) => a.filter((x) => x.id !== id))
  }

  const toggleConnection = () => {
    setIsConnected((c) => !c)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
              <Bot className="h-10 w-10 text-cyan-400" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-white">Avatar Hub</h1>
              <p className="text-sm text-slate-400">Control Center</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? 'success' : 'error'}>
              {isConnected ? 'Online' : 'Offline'}
            </Badge>
            <Button variant="ghost" size="icon" onClick={toggleConnection} title="Toggle connection">
              <Settings className="h-5 w-5" />
            </Button>
            <Link to={createPageUrl('/task-history')}>
              <Button variant="outline" size="sm">
                <History className="h-4 w-4 mr-2" />
                History
              </Button>
            </Link>
          </div>
        </motion.header>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Live feed + controls */}
          <div className="space-y-4">
            <LiveFeed isConnected={isConnected} latency={latency} />
            <JoystickControl onMove={handleMove} disabled={!isConnected} />
            <ActionPanel onAction={handleAction} disabled={!isConnected} />
          </div>

          {/* Right column: Alerts + Status + Chart */}
          <div className="lg:col-span-2 space-y-4">
            <AlertsPanel alerts={alerts} onDismiss={dismissAlert} />
            <StatusMonitor robotStatus={robotStatus} />
            <PerformanceChart />
          </div>
        </div>
      </div>
    </div>
  )
}

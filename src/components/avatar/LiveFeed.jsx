import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wifi, WifiOff, Maximize2, Minimize2, Crosshair } from 'lucide-react'

export function LiveFeed({ isConnected = true, latency = 0 }) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const latencyStatus = latency <= 50 ? 'good' : latency <= 150 ? 'warning' : 'error'
  const signalColor = latencyStatus === 'good' ? 'text-emerald-400' : latencyStatus === 'warning' ? 'text-yellow-400' : 'text-red-400'

  return (
    <motion.div
      layout
      className={`rounded-xl border border-slate-700/50 bg-slate-900/80 backdrop-blur-xl overflow-hidden ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}
    >
      {/* Live feed area - background image as camera feed */}
      <div className="relative aspect-video bg-slate-800 bg-[url('https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800')] bg-cover bg-center">
        {/* Animated grid overlay */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(6, 182, 212, 0.15) 1px, transparent 1px),
                linear-gradient(90deg, rgba(6, 182, 212, 0.15) 1px, transparent 1px)
              `,
              backgroundSize: '24px 24px',
            }}
          />
        </div>

        {/* Crosshair targeting UI */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Crosshair className="h-12 w-12 text-cyan-400/60" strokeWidth={1.5} />
        </div>

        {/* Animated hand tracking box */}
        <motion.div
          className="absolute w-24 h-24 border-2 border-cyan-400/70 rounded-lg"
          style={{ left: '50%', top: '45%', marginLeft: -48, marginTop: -48 }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Connection status badge - top left */}
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
              isConnected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
            }`}
          >
            {isConnected ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
            {isConnected ? 'LIVE' : 'OFFLINE'}
          </span>
          {isConnected && (
            <span className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium bg-slate-800/90 ${signalColor}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${
                latencyStatus === 'good' ? 'bg-emerald-400' : latencyStatus === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
              }`} />
              {latency} ms
            </span>
          )}
        </div>

        {/* Fullscreen toggle - top right */}
        <button
          type="button"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="absolute right-3 top-3 rounded-lg bg-slate-800/80 p-2 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>

        {/* Bottom info bar - camera specs */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
          <p className="text-xs text-slate-400">1920×1080 @ 30fps</p>
        </div>
      </div>
    </motion.div>
  )
}

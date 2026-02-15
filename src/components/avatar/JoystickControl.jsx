import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Lock, Unlock } from 'lucide-react'

const RADIUS = 50

export function JoystickControl({ onMove, disabled = false }) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const containerRef = useRef(null)

  const constrain = useCallback((x, y) => {
    const dist = Math.sqrt(x * x + y * y)
    if (dist <= RADIUS) return { x, y }
    const scale = RADIUS / dist
    return { x: x * scale, y: y * scale }
  }, [])

  const getCenter = useCallback(() => {
    if (!containerRef.current) return { cx: 0, cy: 0 }
    const rect = containerRef.current.getBoundingClientRect()
    return { cx: rect.left + rect.width / 2, cy: rect.top + rect.height / 2 }
  }, [])

  const handlePointerDown = (e) => {
    if (disabled || isLocked) return
    setIsDragging(true)
  }

  const handlePointerMove = (e) => {
    if (!isDragging || disabled || isLocked) return
    const { cx, cy } = getCenter()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    let dx = clientX - cx
    let dy = clientY - cy
    const { x, y } = constrain(dx, dy)
    setPosition({ x, y })
    const nx = x / RADIUS
    const ny = -y / RADIUS
    onMove?.({ x: nx, y: ny })
  }

  const handlePointerUp = () => {
    if (!isDragging) return
    setIsDragging(false)
    setPosition({ x: 0, y: 0 })
    onMove?.({ x: 0, y: 0 })
  }

  useEffect(() => {
    if (!isDragging) return
    const onPointerUp = () => handlePointerUp()
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointermove', handlePointerMove)
    return () => {
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointermove', handlePointerMove)
    }
  }, [isDragging, disabled, isLocked])

  const normalizedX = (position.x / RADIUS).toFixed(2)
  const normalizedY = (-position.y / RADIUS).toFixed(2)

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900/80 backdrop-blur-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-300">Manual Control</span>
        <button
          type="button"
          onClick={() => setIsLocked(!isLocked)}
          className={`flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium transition-colors ${
            isLocked ? 'bg-red-500/20 text-red-400' : 'bg-slate-700/80 text-slate-400'
          }`}
        >
          {isLocked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
          {isLocked ? 'Locked' : 'Unlocked'}
        </button>
      </div>

      <div
        ref={containerRef}
        className="relative mx-auto flex h-[120px] w-[120px] items-center justify-center touch-none select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        style={{ cursor: disabled || isLocked ? 'not-allowed' : 'grab' }}
      >
        {/* Circular boundary */}
        <div className="absolute h-[100px] w-[100px] rounded-full border-2 border-slate-600" />

        {/* Draggable stick */}
        <motion.div
          className="absolute h-12 w-12 rounded-full bg-slate-700 border-2 border-cyan-500/80 flex items-center justify-center"
          style={{
            left: '50%',
            top: '50%',
            marginLeft: -24 + position.x,
            marginTop: -24 + position.y,
            boxShadow: isDragging ? '0 0 20px rgba(34, 211, 238, 0.5)' : undefined,
          }}
          animate={{ scale: isDragging ? 1.05 : 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          drag={false}
        />
      </div>

      <div className="mt-2 flex justify-center gap-4 text-xs text-slate-400">
        <span>X: {normalizedX}</span>
        <span>Y: {normalizedY}</span>
      </div>
    </div>
  )
}

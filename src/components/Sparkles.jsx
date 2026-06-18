import { motion } from 'framer-motion'

const SPARKLE_COUNT = 28
const COLORS = [
  '#7dd3fc', '#93c5fd', '#38bdf8', '#bae6fd',
  '#a5f3fc', '#60a5fa', '#c4b5fd', '#fbbf24',
]

export default function Sparkles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {Array.from({ length: SPARKLE_COUNT }).map((_, i) => {
        const x = Math.random() * 100
        const y = Math.random() * 100
        const size = Math.random() * 5 + 2
        const color = COLORS[Math.floor(Math.random() * COLORS.length)]

        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              background: color,
              boxShadow: `0 0 ${size * 2}px ${color}88`,
              willChange: 'transform, opacity',
            }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.6, 0] }}
            transition={{
              duration: Math.random() * 2 + 2,
              delay: Math.random() * 4,
              repeat: Infinity,
              repeatDelay: Math.random() * 3 + 1,
            }}
          />
        )
      })}
    </div>
  )
}

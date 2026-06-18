import { motion } from 'framer-motion'

const HEARTS = ['💙', '🩵', '⭐', '✨', '❄️', '💫', '🌊', '🌟', '💎', '🫧']

function Heart({ id }) {
  const x = Math.random() * 100
  const size = Math.random() * 16 + 13
  const delay = Math.random() * 5
  const duration = Math.random() * 6 + 9
  const emoji = HEARTS[Math.floor(Math.random() * HEARTS.length)]
  const swayX = (Math.random() - 0.5) * 90

  return (
    <motion.div
      key={id}
      className="absolute pointer-events-none select-none"
      style={{
        left: `${x}%`,
        bottom: '-60px',
        fontSize: `${size}px`,
        zIndex: 1,
        willChange: 'transform, opacity',
      }}
      initial={{ y: 0, x: 0, opacity: 0.8 }}
      animate={{
        y: -(window.innerHeight + 100),
        x: swayX,
        opacity: [0.8, 0.65, 0.35, 0],
      }}
      transition={{ duration, delay, ease: 'linear', repeat: Infinity, repeatDelay: Math.random() * 3 }}
    >
      {emoji}
    </motion.div>
  )
}

export default function FloatingHearts({ count = 18 }) {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
      {Array.from({ length: count }, (_, i) => <Heart key={i} id={i} />)}
    </div>
  )
}

import { motion } from 'framer-motion'
import FloatingHearts from '../components/FloatingHearts'
import Sparkles from '../components/Sparkles'

export default function Page1Envelope({ onOpen }) {
  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 35%, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%)' }}
    >
      <Sparkles />
      <FloatingHearts count={20} />

      <motion.div
        className="relative z-10 text-center mb-6 sm:mb-10 px-4"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: 'easeOut' }}
      >
        <motion.p
          className="text-sky-400 text-sm sm:text-base font-sans tracking-widest uppercase mb-2 font-semibold"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          💙 Dành riêng cho em 💙
        </motion.p>
        <h1
          className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold"
          style={{
            color: '#075985',
            textShadow: '0 2px 20px rgba(56,189,248,0.3), 0 0 40px rgba(56,189,248,0.12)',
          }}
        >
          Có một điều...
        </h1>
        <p className="font-sans text-base sm:text-xl mt-2 sm:mt-3 font-light" style={{ color: '#0369a1' }}>
          anh muốn nói với em 💙
        </p>
      </motion.div>

      <motion.div
        className="relative z-10 cursor-pointer select-none"
        initial={{ scale: 0, rotate: -8, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.5, type: 'spring', stiffness: 180, damping: 14 }}
        whileHover={{ scale: 1.06, y: -8 }}
        whileTap={{ scale: 0.95 }}
        onClick={onOpen}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <EnvelopeSVG />
        </motion.div>

        <motion.div
          className="absolute inset-0 rounded-xl"
          style={{ border: '2px solid rgba(56,189,248,0.45)' }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.2, repeat: Infinity }}
        />

        <motion.p
          className="absolute -bottom-8 sm:-bottom-9 w-full text-center font-sans text-xs sm:text-sm font-semibold"
          style={{ color: '#0ea5e9' }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Nhấn vào con dấu để mở 💌
        </motion.p>
      </motion.div>

      <motion.div
        className="absolute bottom-6 sm:bottom-8 left-0 right-0 flex justify-center gap-4 text-xl sm:text-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        {['💙', '🩵', '💙'].map((e, i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.35 }}
          >
            {e}
          </motion.span>
        ))}
      </motion.div>
    </div>
  )
}

function EnvelopeSVG() {
  const W = 280, H = 190, FH = 80
  const SX = W / 2, SY = 136

  return (
    <div
      className="relative"
      style={{
        width: 'min(72vw, 280px)',
        height: 'min(49vw, 190px)',
        filter: 'drop-shadow(0 8px 28px rgba(56,189,248,0.22))',
      }}
    >
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="envBg1" x1="0" y1="0" x2="0" y2={H} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="100%" stopColor="#bae6fd" />
          </linearGradient>
          <linearGradient id="flapG1" x1="0" y1="0" x2="0" y2={FH} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>

        {/* Thân phong thư */}
        <rect x="8" y="8" width={W - 16} height={H - 16} rx="10" fill="url(#envBg1)" />
        <rect x="8" y="8" width={W - 16} height={H - 16} rx="10" stroke="#7dd3fc" strokeWidth="1.5" fill="none" />

        {/* Góc trang trí (L-bracket) */}
        <path d="M8,26 L8,8 L26,8"         stroke="#93c5fd" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M${W-26},8 L${W-8},8 L${W-8},26`}   stroke="#93c5fd" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M8,${H-26} L8,${H-8} L26,${H-8}`}   stroke="#93c5fd" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M${W-26},${H-8} L${W-8},${H-8} L${W-8},${H-26}`} stroke="#93c5fd" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />

        {/* Nắp phong thư */}
        <path d={`M8,8 L${SX},${FH} L${W-8},8 Z`} fill="url(#flapG1)" />
        <path d={`M14,10 L${SX},${FH-8} L${W-14},10`} stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" fill="none" />

        {/* Nếp gấp đáy nhẹ */}
        <path d={`M8,${H-8} L${SX},${H * 0.56} L${W-8},${H-8}`} stroke="#bae6fd" strokeWidth="1" fill="none" opacity="0.85" />

        {/* Con dấu */}
        <circle cx={SX} cy={SY} r="23" fill="white" opacity="0.95" />
        <circle cx={SX} cy={SY} r="18" fill="#0ea5e9" />
      </svg>

      {/* Emoji trên con dấu */}
      <div
        className="absolute pointer-events-none select-none"
        style={{ top: `${(SY / H) * 100}%`, left: '50%', transform: 'translate(-50%,-50%)', fontSize: 'min(6.5vw, 22px)' }}
      >
        <motion.span animate={{ scale: [1, 1.28, 1] }} transition={{ duration: 1.3, repeat: Infinity }}>
          💙
        </motion.span>
      </div>

      {/* Accent nhỏ ở góc */}
      {[
        { top: '2%', left: '5%', emoji: '✨', delay: 0 },
        { top: '4%', right: '5%', emoji: '⭐', delay: 0.6 },
        { bottom: '15%', left: '1%', emoji: '❄️', delay: 1.1 },
        { bottom: '15%', right: '1%', emoji: '❄️', delay: 1.7 },
      ].map((s, i) => (
        <motion.span
          key={i}
          className="absolute"
          style={{ top: s.top, left: s.left, right: s.right, bottom: s.bottom, fontSize: 'min(4.5vw, 17px)' }}
          animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.3, 0.8] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: s.delay }}
        >
          {s.emoji}
        </motion.span>
      ))}
    </div>
  )
}

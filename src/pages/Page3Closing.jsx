import { motion, useAnimation } from 'framer-motion'
import { useState, useEffect } from 'react'
import FloatingHearts from '../components/FloatingHearts'
import Sparkles from '../components/Sparkles'

// ── Kích thước khớp với Page2 ────────────────────────────────────────────────
const EW = 260
const EH = 175
const FH = 70
const LW = 194
const LH = 148

const ET_C = 130   // envelope top trong close container
const CONTAINER_H_C = ET_C + EH + 50   // = 355

const L_LEFT = (EW - LW) / 2

// Letter "vừa đọc xong": thò ra 88px phía trên phong thư
const L_TOP_READ = ET_C - 88    // = 42

// Letter "đóng hoàn toàn": top đủ sâu bên trong (> ET_C) → bị clip wrapper che
const L_TOP_INSIDE = ET_C + EH - LH  // = 130+175-148 = 157
const L_TRAVEL_CLOSE = L_TOP_INSIDE - L_TOP_READ  // = 157-42 = 115  (trượt xuống)

const LOVE_MESSAGES = [
  'Em là điều tuyệt vời nhất anh có 🌹',
  'Mỗi ngày bên em là một món quà ✨',
  'Anh yêu em hơn tất cả những ngôi sao trên trời 💫',
  'Cảm ơn em đã xuất hiện trong cuộc đời anh 💕',
]

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

export default function Page3Closing({ onRestart }) {
  const [showThanks, setShowThanks] = useState(false)

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 35%, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%)' }}
    >
      <Sparkles />
      <FloatingHearts count={22} />

      {!showThanks && (
        <div className="relative z-10">
          <EnvelopeCloseScene onDone={() => setShowThanks(true)} />
        </div>
      )}

      {showThanks && (
        <motion.div
          className="relative z-10 flex flex-col items-center text-center px-6 max-w-xs sm:max-w-sm w-full overflow-y-auto py-6"
          style={{ maxHeight: '100dvh' }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <motion.div className="mb-4"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
            <SealedEnvelopeIcon />
          </motion.div>

          <motion.p
            className="font-serif text-3xl sm:text-4xl font-bold mb-3"
            style={{ color: '#075985', textShadow: '0 2px 20px rgba(56,189,248,0.4)' }}
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}>
            Công chúa ! 💕
          </motion.p>

          <motion.p className="font-sans text-sm sm:text-base leading-relaxed" style={{ color: '#0369a1' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            Cảm ơn em đã đọc thư của anh.<br />Anh chờ câu trả lời của em nhé 🥺
          </motion.p>


          <motion.div className="text-5xl sm:text-6xl mt-5"
            animate={{ scale: [1, 1.3, 1], rotate: [-5, 5, -5] }}
            transition={{ duration: 1.5, repeat: Infinity }}>❤️</motion.div>

          <motion.button onClick={onRestart}
            className="mt-5 px-8 py-3 rounded-full font-sans font-semibold text-white text-sm tracking-wide"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(251,113,133,0.5)' }}
            whileTap={{ scale: 0.95 }}>
            Đọc lại từ đầu 💌
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}

// ── Closing animation scene ──────────────────────────────────────────────────
function EnvelopeCloseScene({ onDone }) {
  const letterCtrl = useAnimation()
  const flapCtrl = useAnimation()
  const sealCtrl = useAnimation()

  const scale = typeof window !== 'undefined' ? Math.min(1, (window.innerWidth - 32) / EW) : 1

  useEffect(() => {
    let alive = true
    async function run() {
      await delay(380)
      if (!alive) return
      // Thiệp trượt xuống vào trong phong thư
      await letterCtrl.start({ y: L_TRAVEL_CLOSE, transition: { duration: 0.68, ease: [0.25, 0.46, 0.45, 0.94] } })
      if (!alive) return
      await delay(80)
      // Nắp đóng lại (scaleY: 2D, GPU-composited)
      await flapCtrl.start({ scaleY: 1, opacity: 1, transition: { duration: 0.55, ease: 'easeInOut' } })
      if (!alive) return
      await delay(140)
      // Con dấu hiện ra
      await sealCtrl.start({ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 260, damping: 14 } })
      if (!alive) return
      await delay(480)
      onDone()
    }
    run()
    return () => { alive = false }
  }, [])

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}>
      <div style={{ position: 'relative', width: EW, height: CONTAINER_H_C }}>

        {/* ── z=1: Mặt sau phong thư ─────────────────────────────────────── */}
        <div style={{ position: 'absolute', top: ET_C, left: 0, zIndex: 1 }}>
          <EnvBackSVG />
        </div>

        {/* ── z=2: Clip wrapper — chỉ hiện phần letter thò ra trên miệng thư */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: L_LEFT,
          width: LW,
          height: ET_C,
          overflow: 'hidden',
          zIndex: 2,
          pointerEvents: 'none',
        }}>
          <motion.div
            style={{
              position: 'absolute', top: L_TOP_READ, left: 0, width: LW, height: LH,
              willChange: 'transform',
            }}
            animate={letterCtrl}
          >
            <LetterCardClose />
          </motion.div>
        </div>

        {/* ── z=3: Mặt trước phong thư ───────────────────────────────────── */}
        <div style={{ position: 'absolute', top: ET_C, left: 0, zIndex: 3, pointerEvents: 'none' }}>
          <EnvFrontSVG />
        </div>

        {/* ── z=4: Con dấu ❤️ ────────────────────────────────────────────── */}
        <div style={{
          position: 'absolute',
          top: ET_C + FH + (EH - FH) / 2,
          left: EW / 2,
          transform: 'translate(-50%, -50%)',
          zIndex: 4,
        }}>
          <motion.div initial={{ scale: 0, opacity: 0 }} animate={sealCtrl}>
            <SealBadge />
          </motion.div>
        </div>

        {/* ── z=5: Nắp phong thư — bắt đầu MỞ (scaleY=0) rồi đóng lại ── */}
        <motion.div
          style={{
            position: 'absolute', top: ET_C, left: 0,
            width: EW, height: FH,
            zIndex: 5,
            transformOrigin: 'top center',
            willChange: 'transform, opacity',
          }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={flapCtrl}
        >
          <FlapSVG />
        </motion.div>

        {/* Sparkle burst khi con dấu xuất hiện */}
        <SparkleBurst cx={EW / 2} cy={ET_C + FH + (EH - FH) / 2} />

        <motion.p
          className="absolute w-full text-center font-sans text-sm font-semibold"
          style={{ color: '#0ea5e9', bottom: 12 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          Đang đóng thư lại... 💌
        </motion.p>
      </div>
    </div>
  )
}

// ── SVG helpers (khớp với Page2) ─────────────────────────────────────────────
function EnvBackSVG() {
  return (
    <svg width={EW} height={EH} viewBox={`0 0 ${EW} ${EH}`}>
      <defs>
        <linearGradient id="envBk3" x1="0" y1="0" x2="0" y2={EH} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#bae6fd" />
        </linearGradient>
      </defs>
      <rect width={EW} height={EH} rx="10" fill="url(#envBk3)" />
      <path d="M0,16 L0,0 L16,0"                               stroke="#93c5fd" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d={`M${EW-16},0 L${EW},0 L${EW},16`}             stroke="#93c5fd" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d={`M0,${EH-16} L0,${EH} L16,${EH}`}             stroke="#93c5fd" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d={`M${EW-16},${EH} L${EW},${EH} L${EW},${EH-16}`} stroke="#93c5fd" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d={`M0,${EH} L${EW/2},${EH*0.52} L${EW},${EH}`} stroke="#bae6fd" strokeWidth="1" fill="none" opacity="0.85" />
      <rect width={EW} height={EH} rx="10" stroke="#7dd3fc" strokeWidth="1.5" fill="none" />
    </svg>
  )
}

function EnvFrontSVG() {
  return (
    <svg width={EW} height={EH} viewBox={`0 0 ${EW} ${EH}`}>
      <defs>
        <linearGradient id="envFront3" x1="0" y1="0" x2="0" y2={EH} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#bae6fd" />
        </linearGradient>
      </defs>
      <rect width={EW} height={EH} rx="10" fill="url(#envFront3)" />
      <path d="M0,16 L0,0 L16,0"                               stroke="#93c5fd" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d={`M${EW-16},0 L${EW},0 L${EW},16`}             stroke="#93c5fd" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d={`M0,${EH-16} L0,${EH} L16,${EH}`}             stroke="#93c5fd" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d={`M${EW-16},${EH} L${EW},${EH} L${EW},${EH-16}`} stroke="#93c5fd" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d={`M0,${EH} L${EW/2},${EH*0.52} L${EW},${EH}`} stroke="#93c5fd" strokeWidth="1" fill="none" opacity="0.55" />
      <rect width={EW} height={EH} rx="10" stroke="#7dd3fc" strokeWidth="1.5" fill="none" />
    </svg>
  )
}

function FlapSVG() {
  return (
    <svg width={EW} height={FH} viewBox={`0 0 ${EW} ${FH}`}>
      <defs>
        <linearGradient id="flapG3" x1="0" y1="0" x2="0" y2={FH} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
      </defs>
      <path d={`M0,0 L${EW/2},${FH} L${EW},0 Z`} fill="url(#flapG3)" />
      <path d={`M6,2 L${EW/2},${FH-6} L${EW-6},2`} stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" fill="none" />
    </svg>
  )
}

function LetterCardClose() {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(160deg,#ffffff 0%,#f0f9ff 60%,#ffffff 100%)',
      borderRadius: 10,
      boxShadow: '0 10px 32px rgba(56,189,248,0.18), inset 0 0 0 1.5px rgba(147,197,253,0.5)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '14px 18px', gap: 7,
    }}>
      <span style={{ fontSize: 32 }}>💙</span>
      <p style={{ fontFamily: '"Playfair Display",serif', color: '#0369a1', fontSize: 14, fontWeight: 700, textAlign: 'center' }}>
        Thiệp Mời Đi Date
      </p>
      {[74, 58, 80, 54].map((w, i) => (
        <div key={i} style={{
          width: `${w}%`, height: 1.5,
          background: 'linear-gradient(to right,transparent,#93c5fd 30%,#93c5fd 70%,transparent)',
          borderRadius: 1,
        }} />
      ))}
      <p style={{ fontFamily: '"Playfair Display",serif', color: '#0ea5e9', fontSize: 11, fontStyle: 'italic', opacity: 0.75, marginTop: 2 }}>
        Dành riêng cho em 💙
      </p>
    </div>
  )
}

function SealBadge() {
  return (
    <div style={{
      width: 46, height: 46,
      background: 'radial-gradient(circle, #bae6fd, #0ea5e9)',
      borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 4px 18px rgba(14,165,233,0.35)',
      fontSize: 24,
    }}>💙</div>
  )
}

function SealedEnvelopeIcon() {
  return (
    <svg width={130} height={90} viewBox={`0 0 ${EW} ${EH}`}>
      <defs>
        <linearGradient id="sealG" x1="0" y1="0" x2="0" y2={EH} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#bae6fd" />
        </linearGradient>
        <linearGradient id="flapGI" x1="0" y1="0" x2="0" y2={FH} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
      </defs>
      {/* Thân */}
      <rect width={EW} height={EH} rx="10" fill="url(#sealG)" />
      {/* Góc trang trí */}
      <path d="M0,14 L0,0 L14,0"                               stroke="#93c5fd" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d={`M${EW-14},0 L${EW},0 L${EW},14`}             stroke="#93c5fd" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d={`M0,${EH-14} L0,${EH} L14,${EH}`}             stroke="#93c5fd" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d={`M${EW-14},${EH} L${EW},${EH} L${EW},${EH-14}`} stroke="#93c5fd" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Nắp đóng */}
      <path d={`M0,0 L${EW/2},${FH} L${EW},0 Z`} fill="url(#flapGI)" />
      {/* Con dấu */}
      <circle cx={EW/2} cy={FH + (EH - FH) / 2} r="22" fill="white" opacity="0.95" />
      <circle cx={EW/2} cy={FH + (EH - FH) / 2} r="17" fill="#0ea5e9" />
      {/* Viền */}
      <rect width={EW} height={EH} rx="10" stroke="#7dd3fc" strokeWidth="1.5" fill="none" />
      <text x={EW/2} y={FH + (EH - FH) / 2 + 8} textAnchor="middle" fontSize="20">💙</text>
    </svg>
  )
}

function SparkleBurst({ cx, cy }) {
  return (
    <>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <motion.div
          key={i}
          style={{ position: 'absolute', top: cy, left: cx, fontSize: 10, zIndex: 6 }}
          initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            x: Math.cos((angle * Math.PI) / 180) * 38,
            y: Math.sin((angle * Math.PI) / 180) * 38,
          }}
          transition={{ delay: 1.45, duration: 0.65 }}
        >✨</motion.div>
      ))}
    </>
  )
}

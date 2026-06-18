import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import emailjs from '@emailjs/browser'
import FloatingHearts from '../components/FloatingHearts'

// ── Kích thước (px, desktop) ────────────────────────────────────────────────
const EW = 260   // envelope width
const EH = 175   // envelope height
const FH = 70    // flap triangle height
const LW = 194   // letter card width
const LH = 148   // letter card height
const ET = 115   // y‑top của phong thư trong container
const CONTAINER_H = ET + EH + 48

const L_LEFT = (EW - LW) / 2

// Letter bắt đầu: bottom của letter khớp bottom của phong thư → hoàn toàn trong phong thư
const L_TOP_INIT = ET + EH - LH - 4   // = 115+175-148-4 = 138

// Clip wrapper cao đúng bằng ET → chỉ cho thấy phần thò ra trên miệng phong thư
// Letter trượt lên để top đạt y=8 (trong clip wrapper), bottom = 8+148=156 → 41px còn trong phong thư
const L_TRAVEL_OPEN = -(L_TOP_INIT - 8)  // = -(138-8) = -130

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

// ── DATE PLAN ───────────────────────────────────────────────────────────────
const DATE_PLAN = [
  { icon: '🕐', time: '18:30', activity: 'Đón em tại nhà — anh sẽ đến đúm giờ ạ 🌹' },
  { icon: '🍽️', time: '19:00', activity: 'Ăn tối 4P, chỉ có hai đứa mình thôi 🕯️' },
  { icon: '☕', time: 'ăn xong thì 2 chúm mìn di chiển', activity: 'Cà phê ngồi chill chill' },
]

// ── Main ────────────────────────────────────────────────────────────────────
export default function Page2Letter({ onClose }) {
  const [stage, setStage] = useState('scene')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [reply, setReply] = useState('')
  const [name, setName] = useState('')

  const handleSend = async (e) => {
    e.preventDefault()
    if (!reply.trim()) return
    setSending(true)
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { from_name: name || 'Em yêu', message: reply, to_email: import.meta.env.VITE_TO_EMAIL },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      setSent(true)
    } catch (err) {
      console.error(err)
      alert('Có lỗi xảy ra, thử lại sau nhé!')
    }
    setSending(false)
  }

  return (
    <div
      className="relative w-full h-full flex items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 35%, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%)' }}
    >
      <FloatingHearts count={10} />

      <AnimatePresence mode="wait">
        {stage === 'scene' ? (
          <motion.div key="scene" exit={{ opacity: 0, scale: 0.88 }} transition={{ duration: 0.35 }}>
            <EnvelopeOpenScene onDone={() => setStage('letter')} />
          </motion.div>
        ) : (
          <motion.div
            key="letter"
            className="relative z-10 w-full h-full flex items-start sm:items-center justify-center px-3 sm:px-4 py-3 sm:py-4"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <motion.div
              className="letter-paper rounded-2xl w-full max-w-lg relative flex flex-col"
              style={{ maxHeight: '96dvh' }}
            >
              <div className="px-4 sm:px-8 pt-4 sm:pt-7 pb-3 sm:pb-4 border-b border-amber-100 flex-shrink-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-serif text-xs sm:text-sm text-amber-700 italic">Gửi công chúa,</p>
                    <h2 className="font-serif text-lg sm:text-2xl font-bold text-sky-700 mt-0.5 sm:mt-1">Thiệp Mời Đi Date 💌</h2>
                  </div>
                  <motion.span className="text-2xl sm:text-3xl flex-shrink-0 ml-2"
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}>🌹</motion.span>
                </div>
              </div>

              <div className="overflow-y-auto letter-scroll px-4 sm:px-8 py-4 sm:py-5 flex-1 min-h-0">
                <p className="font-serif text-gray-700 text-sm sm:text-base italic leading-relaxed mb-4">
                  Em ơi, anh muốn mời em một ngày thật đặc biệt — một ngày chỉ dành riêng cho hai đứa mình.
                  Anh đã lên kế hoạch như sau 💕
                </p>

                <div className="space-y-2 sm:space-y-3 mb-4">
                  <h3 className="font-serif text-sky-600 font-semibold text-base sm:text-lg border-b border-sky-200 pb-1">📅 Kế hoạch ngày hẹn</h3>
                  {DATE_PLAN.map((item, i) => (
                    <motion.div key={i}
                      className="flex items-start gap-2 sm:gap-3 bg-sky-50 rounded-xl px-3 sm:px-4 py-2.5"
                      initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 + i * 0.07 }}>
                      <span className="text-xl sm:text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
                      <div>
                        <p className="text-sky-500 text-xs font-sans font-semibold tracking-wider">{item.time}</p>
                        <p className="text-gray-700 text-xs sm:text-sm font-sans leading-snug">{item.activity}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <p className="font-serif text-gray-600 text-xs sm:text-sm italic text-center my-3">
                  "Mỗi khoảnh khắc bên em đều là kỷ niệm đẹp nhất của anh." 🌸
                </p>
                <p className="font-serif text-sky-600 font-bold text-base sm:text-lg">Bee ❤️</p>
                <div className="border-t border-sky-200 my-4" />

                {!sent ? (
                  <form onSubmit={handleSend} className="space-y-2.5 sm:space-y-3">
                    <h3 className="font-serif text-sky-600 font-semibold text-sm sm:text-base">💬 Phản hồi của em</h3>
                    <input type="text" placeholder="Tên em..." value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full border border-sky-200 rounded-xl px-4 py-3 font-sans text-gray-700 bg-white outline-none focus:border-sky-400 focus:ring-2 focus:ring-rose-100 transition" />
                    <textarea placeholder="Em có đồng ý không...? 🥺" value={reply}
                      onChange={e => setReply(e.target.value)} rows={3}
                      className="w-full border border-sky-200 rounded-xl px-4 py-3 font-sans text-gray-700 bg-white outline-none focus:border-sky-400 focus:ring-2 focus:ring-rose-100 transition resize-none" />
                    <motion.button type="submit" disabled={sending || !reply.trim()}
                      className="w-full py-3 rounded-xl font-sans font-semibold text-white text-sm tracking-wide disabled:opacity-50"
                      style={{ background: 'linear-gradient(135deg, #ec4899, #f472b6)' }}
                      whileTap={{ scale: 0.97 }}>
                      {sending ? '💌 Đang gửi...' : '💌 Gửi cho anh'}
                    </motion.button>
                  </form>
                ) : (
                  <motion.div className="text-center py-4"
                    initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }}>
                    <p className="text-3xl mb-2">💌</p>
                    <p className="font-serif text-sky-600 font-bold text-lg">Anh đã nhận được rồi!</p>
                    <p className="font-sans text-gray-500 text-sm mt-1">Cảm ơn em yêu 🥰</p>
                    <motion.button onClick={onClose}
                      className="mt-4 px-6 py-3 rounded-xl font-sans text-sm font-semibold text-white"
                      style={{ background: 'linear-gradient(135deg, #ec4899, #f472b6)' }}
                      whileTap={{ scale: 0.95 }}>Đóng thư 💕</motion.button>
                  </motion.div>
                )}
              </div>

              {!sent && (
                <div className="px-4 sm:px-8 pb-4 sm:pb-5 pt-2 border-t border-amber-100 flex-shrink-0">
                  <motion.button onClick={onClose}
                    className="w-full py-3 rounded-xl font-sans font-semibold text-sky-600 text-sm border-2 border-sky-300 bg-transparent active:bg-sky-50 transition"
                    whileTap={{ scale: 0.97 }}>Đóng thư 💌</motion.button>
                </div>
              )}
              <div className="absolute top-2 right-3 text-lg opacity-20 pointer-events-none">🌸</div>
              <div className="absolute bottom-14 left-3 text-lg opacity-20 pointer-events-none">🌸</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Envelope opening scene ───────────────────────────────────────────────────
function EnvelopeOpenScene({ onDone }) {
  const flapCtrl = useAnimation()
  const letterCtrl = useAnimation()
  const scale = typeof window !== 'undefined' ? Math.min(1, (window.innerWidth - 32) / EW) : 1

  useEffect(() => {
    let alive = true
    async function run() {
      await delay(400)
      if (!alive) return
      // Nắp mở ra (scaleY: 2D, GPU-composited, không giật)
      await flapCtrl.start({ scaleY: 0, opacity: 0, transition: { duration: 0.55, ease: 'easeInOut' } })
      if (!alive) return
      await delay(60)
      // Thiệp trượt lên
      await letterCtrl.start({ y: L_TRAVEL_OPEN, transition: { duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] } })
      if (!alive) return
      await delay(420)
      onDone()
    }
    run()
    return () => { alive = false }
  }, [])

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}>
      <div style={{ position: 'relative', width: EW, height: CONTAINER_H }}>

        {/* ── z=1: Mặt sau phong thư ─────────────────────────────────────── */}
        <div style={{ position: 'absolute', top: ET, left: 0, zIndex: 1 }}>
          <EnvBackSVG />
        </div>

        {/* ── z=2: Clip wrapper — chỉ hiện phần letter thò ra trên miệng thư */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: L_LEFT,
          width: LW,
          height: ET,
          overflow: 'hidden',
          zIndex: 2,
          pointerEvents: 'none',
        }}>
          <motion.div
            style={{
              position: 'absolute', top: L_TOP_INIT, left: 0, width: LW, height: LH,
              willChange: 'transform',
            }}
            animate={letterCtrl}
          >
            <LetterCard />
          </motion.div>
        </div>

        {/* ── z=3: Mặt trước phong thư (che letter khi còn bên trong) ──── */}
        <div style={{ position: 'absolute', top: ET, left: 0, zIndex: 3, pointerEvents: 'none' }}>
          <EnvFrontSVG />
        </div>

        {/* ── z=5: Nắp phong thư (scaleY — 2D, không giật) ───────────────── */}
        <motion.div
          style={{
            position: 'absolute', top: ET, left: 0,
            width: EW, height: FH,
            zIndex: 5,
            transformOrigin: 'top center',
            willChange: 'transform, opacity',
          }}
          animate={flapCtrl}
        >
          <FlapSVG />
        </motion.div>

        <motion.p
          className="absolute w-full text-center font-sans text-sm font-semibold"
          style={{ bottom: 12, color: '#0ea5e9' }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          Đang mở thư... 💌
        </motion.p>
      </div>
    </div>
  )
}

// ── SVG helpers ─────────────────────────────────────────────────────────────
function EnvBackSVG() {
  return (
    <svg width={EW} height={EH} viewBox={`0 0 ${EW} ${EH}`}>
      <defs>
        <linearGradient id="envBk2" x1="0" y1="0" x2="0" y2={EH} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#bae6fd" />
        </linearGradient>
      </defs>
      <rect width={EW} height={EH} rx="10" fill="url(#envBk2)" />
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
        <linearGradient id="envFront2" x1="0" y1="0" x2="0" y2={EH} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#bae6fd" />
        </linearGradient>
      </defs>
      <rect width={EW} height={EH} rx="10" fill="url(#envFront2)" />
      {/* Góc trang trí */}
      <path d="M0,16 L0,0 L16,0"                               stroke="#93c5fd" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d={`M${EW-16},0 L${EW},0 L${EW},16`}             stroke="#93c5fd" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d={`M0,${EH-16} L0,${EH} L16,${EH}`}             stroke="#93c5fd" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d={`M${EW-16},${EH} L${EW},${EH} L${EW},${EH-16}`} stroke="#93c5fd" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Nếp gấp đáy nhẹ */}
      <path d={`M0,${EH} L${EW/2},${EH*0.52} L${EW},${EH}`} stroke="#93c5fd" strokeWidth="1" fill="none" opacity="0.55" />
      <rect width={EW} height={EH} rx="10" stroke="#7dd3fc" strokeWidth="1.5" fill="none" />
    </svg>
  )
}

function FlapSVG() {
  return (
    <svg width={EW} height={FH} viewBox={`0 0 ${EW} ${FH}`}>
      <defs>
        <linearGradient id="flapG2" x1="0" y1="0" x2="0" y2={FH} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
      </defs>
      <path d={`M0,0 L${EW/2},${FH} L${EW},0 Z`} fill="url(#flapG2)" />
      <path d={`M6,2 L${EW/2},${FH-6} L${EW-6},2`} stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" fill="none" />
    </svg>
  )
}

// ── Letter card (thiệp bên trong) ────────────────────────────────────────────
function LetterCard() {
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
      <p style={{ fontFamily: '"Playfair Display",serif', color: '#0ea5e9', fontSize: 11, fontStyle: 'italic', opacity: 0.9, marginTop: 2 }}>
        Dành riêng cho em 💙
      </p>
    </div>
  )
}

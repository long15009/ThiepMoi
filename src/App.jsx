import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Page1Envelope from './pages/Page1Envelope'
import Page2Letter from './pages/Page2Letter'
import Page3Closing from './pages/Page3Closing'

const PAGE_VARIANTS = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.04 },
}

export default function App() {
  const [page, setPage] = useState(1)

  return (
    <div className="w-screen overflow-hidden relative" style={{ height: '100dvh' }}>
      <AnimatePresence mode="wait">
        {page === 1 && (
          <motion.div
            key="page1"
            className="absolute inset-0"
            variants={PAGE_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            <Page1Envelope onOpen={() => setPage(2)} />
          </motion.div>
        )}
        {page === 2 && (
          <motion.div
            key="page2"
            className="absolute inset-0"
            variants={PAGE_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            <Page2Letter onClose={() => setPage(3)} />
          </motion.div>
        )}
        {page === 3 && (
          <motion.div
            key="page3"
            className="absolute inset-0"
            variants={PAGE_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            <Page3Closing onRestart={() => setPage(1)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

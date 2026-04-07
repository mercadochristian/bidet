'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { usePwaInstall } from '@/hooks/use-pwa-install'

const SESSION_KEY = 'pwa_install_dismissed'

export function InstallPrompt() {
  const { canInstall, isIOS, promptInstall, dismiss } = usePwaInstall()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!canInstall) return

    // Only show once per session
    if (sessionStorage.getItem(SESSION_KEY)) return

    // Delay 3 seconds before showing
    const timer = setTimeout(() => setVisible(true), 3000)
    return () => clearTimeout(timer)
  }, [canInstall])

  const handleDismiss = () => {
    setVisible(false)
    dismiss()
    sessionStorage.setItem(SESSION_KEY, '1')
  }

  const handleInstall = async () => {
    await promptInstall()
    setVisible(false)
    sessionStorage.setItem(SESSION_KEY, '1')
  }

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/50"
            onClick={handleDismiss}
          />

          {/* Bottom sheet */}
          <motion.div
            key="sheet"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[61] mx-auto max-w-lg rounded-t-2xl bg-card border-t border-border p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-2xl"
          >
            {/* Drag handle */}
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-muted" />

            {/* Dismiss X */}
            <button
              onClick={handleDismiss}
              className="absolute right-4 top-4 cursor-pointer rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Dismiss"
            >
              <X size={18} />
            </button>

            {/* App icon */}
            <div className="flex flex-col items-center text-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-4xl shadow-inner">
                💧
              </div>

              {isIOS ? (
                <>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Add to Home Screen</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Install Bidet for quick access to bidet locations near you
                    </p>
                  </div>

                  <ol className="mt-1 w-full space-y-2 rounded-xl bg-muted/50 p-4 text-left text-sm text-foreground">
                    <li className="flex items-start gap-2">
                      <span className="font-semibold text-primary">1.</span>
                      <span>
                        Tap the share button{' '}
                        <span className="font-semibold">⬆️</span> at the bottom of your browser
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-semibold text-primary">2.</span>
                      <span>
                        Scroll down and tap{' '}
                        <span className="font-semibold">&ldquo;Add to Home Screen&rdquo;</span>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-semibold text-primary">3.</span>
                      <span>Tap &ldquo;Add&rdquo; to confirm</span>
                    </li>
                  </ol>

                  <button
                    onClick={handleDismiss}
                    className="mt-2 w-full cursor-pointer rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 active:scale-[0.98]"
                  >
                    Got it
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Install Bidet</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Get quick access from your home screen
                    </p>
                  </div>

                  <div className="mt-2 flex w-full flex-col gap-2">
                    <button
                      onClick={handleInstall}
                      className="w-full cursor-pointer rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 active:scale-[0.98]"
                    >
                      Install
                    </button>
                    <button
                      onClick={handleDismiss}
                      className="w-full cursor-pointer rounded-xl py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Not now
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

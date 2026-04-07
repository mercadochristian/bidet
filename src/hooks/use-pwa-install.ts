'use client'

import { useState, useEffect, useCallback } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface UsePwaInstallReturn {
  canInstall: boolean
  isIOS: boolean
  promptInstall: () => Promise<void>
  dismiss: () => void
}

export function usePwaInstall(): UsePwaInstallReturn {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [canInstall, setCanInstall] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Detect iOS Safari
    const ua = navigator.userAgent
    const isIOSDevice = /iphone|ipad|ipod/i.test(ua)
    const isSafari = /safari/i.test(ua) && !/chrome|crios|fxios/i.test(ua)
    const isIOSSafari = isIOSDevice && isSafari

    // Check if already installed (standalone mode)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true)

    if (isStandalone) {
      // Already installed — don't show prompt
      setCanInstall(false)
      return
    }

    if (isIOSSafari) {
      setIsIOS(true)
      setCanInstall(true)
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setCanInstall(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
    setCanInstall(false)
  }, [deferredPrompt])

  const dismiss = useCallback(() => {
    setCanInstall(false)
    setDeferredPrompt(null)
  }, [])

  return { canInstall, isIOS, promptInstall, dismiss }
}

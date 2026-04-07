'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import Link from 'next/link'
import { useGeolocation } from '@/hooks/use-geolocation'
import { useNearbyAlert } from '@/hooks/use-nearby-alert'

export function NearbyAlert() {
  const { lat, lng } = useGeolocation()
  const { nearbyLocation, dismissNearby } = useNearbyAlert(lat, lng)

  // Auto-dismiss after 8 seconds
  useEffect(() => {
    if (!nearbyLocation) return
    const timer = setTimeout(dismissNearby, 8000)
    return () => clearTimeout(timer)
  }, [nearbyLocation, dismissNearby])

  const distanceLabel =
    nearbyLocation
      ? nearbyLocation.distanceMeters < 1
        ? 'right here'
        : `${Math.round(nearbyLocation.distanceMeters)}m away`
      : ''

  return (
    <AnimatePresence>
      {nearbyLocation && (
        <motion.div
          key="nearby-alert"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 280 }}
          className="mx-4 mb-3 overflow-hidden rounded-xl border border-primary/30 bg-primary/10 shadow-lg"
        >
          <div className="flex items-center gap-3 px-4 py-3">
            {/* Icon */}
            <span className="text-2xl shrink-0">🚿</span>

            {/* Text */}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-primary leading-tight">Bidet nearby!</p>
              <p className="truncate text-xs text-foreground/80 mt-0.5">
                {nearbyLocation.name}
                <span className="ml-1.5 text-muted-foreground">· {distanceLabel}</span>
              </p>
            </div>

            {/* View button */}
            <Link
              href={`/location/${nearbyLocation.id}`}
              onClick={dismissNearby}
              className="shrink-0 cursor-pointer rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 active:scale-95"
            >
              View
            </Link>

            {/* Dismiss */}
            <button
              onClick={dismissNearby}
              className="shrink-0 cursor-pointer rounded-full p-1 text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

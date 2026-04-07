'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { MapPin, List } from 'lucide-react'
import { useGeolocation } from '@/hooks/use-geolocation'

// Leaflet must not run on the server — ssr: false ensures browser-only rendering
const MapView = dynamic(() => import('@/components/map-view'), { ssr: false })

// Tab bar height: ~5rem (80px) including credit line + safe area
const TAB_BAR_HEIGHT = 80

export default function MapPage() {
  const { lat, lng, city } = useGeolocation()

  return (
    <div className="flex flex-col" style={{ height: '100dvh' }}>
      {/* Header */}
      <div className="shrink-0 z-40 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="px-4 py-3 flex items-center justify-between max-w-lg mx-auto">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">💧 Bidet</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <MapPin size={11} />
              {city}
            </p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <List size={13} />
            List
          </Link>
        </div>
      </div>

      {/* Map area — fills remaining space above tab bar */}
      <div
        className="relative flex-1"
        style={{ paddingBottom: `calc(${TAB_BAR_HEIGHT}px + env(safe-area-inset-bottom))` }}
      >
        <MapView lat={lat} lng={lng} />

        {/* Legend — bottom-left, above tab bar */}
        <div
          className="absolute left-3 z-10 rounded-xl border border-border bg-card/90 backdrop-blur-md px-3 py-2.5 space-y-1.5"
          style={{ bottom: `calc(${TAB_BAR_HEIGHT + 12}px + env(safe-area-inset-bottom))` }}
        >
          <LegendRow color="#4ade80" label="Has bidet" />
          <LegendRow color="#f87171" label="No bidet" />
          <LegendRow color="#facc15" label="Mixed" />
        </div>
      </div>
    </div>
  )
}

function LegendRow({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="w-3 h-3 rounded-full shrink-0"
        style={{ background: color }}
      />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

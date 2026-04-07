'use client'

import { useState, useEffect, useCallback } from 'react'
import { haversineDistance } from '@/lib/geo-utils'

const SESSION_PREFIX = 'nearby_alerted_'
const NEARBY_THRESHOLD_METERS = 100

interface NearbyLocation {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  distanceMeters: number
}

interface UseNearbyAlertReturn {
  nearbyLocation: NearbyLocation | null
  dismissNearby: () => void
}

export function useNearbyAlert(
  lat: number | null,
  lng: number | null
): UseNearbyAlertReturn {
  const [nearbyLocation, setNearbyLocation] = useState<NearbyLocation | null>(null)

  useEffect(() => {
    if (lat === null || lng === null) return

    fetch('/api/locations')
      .then((res) => res.json())
      .then((locations: { id: string; name: string; address: string; lat: number; lng: number; status: string }[]) => {
        let closest: NearbyLocation | null = null

        for (const loc of locations) {
          if (loc.status !== 'has_bidet') continue

          const dist = haversineDistance(lat, lng, loc.lat, loc.lng)
          if (dist > NEARBY_THRESHOLD_METERS) continue

          if (sessionStorage.getItem(`${SESSION_PREFIX}${loc.id}`)) continue

          if (!closest || dist < closest.distanceMeters) {
            closest = {
              id: loc.id,
              name: loc.name,
              address: loc.address,
              lat: loc.lat,
              lng: loc.lng,
              distanceMeters: dist,
            }
          }
        }

        if (closest) setNearbyLocation(closest)
      })
      .catch(() => {})
  }, [lat, lng])

  const dismissNearby = useCallback(() => {
    if (nearbyLocation) {
      sessionStorage.setItem(`${SESSION_PREFIX}${nearbyLocation.id}`, '1')
    }
    setNearbyLocation(null)
  }, [nearbyLocation])

  return { nearbyLocation, dismissNearby }
}

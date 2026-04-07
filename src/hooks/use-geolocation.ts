'use client'

import { useState, useEffect } from 'react'

interface GeolocationState {
  lat: number | null
  lng: number | null
  city: string
  loading: boolean
  error: string | null
}

const FALLBACK_LAT = 14.5995
const FALLBACK_LNG = 120.9842
const FALLBACK_CITY = 'Metro Manila'

export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    lat: null,
    lng: null,
    city: FALLBACK_CITY,
    loading: true,
    error: null,
  })

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        lat: FALLBACK_LAT,
        lng: FALLBACK_LNG,
        city: FALLBACK_CITY,
        loading: false,
        error: 'Geolocation not supported',
      })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          city: FALLBACK_CITY, // Reverse geocoding is a future enhancement
          loading: false,
          error: null,
        })
      },
      (err) => {
        setState({
          lat: FALLBACK_LAT,
          lng: FALLBACK_LNG,
          city: FALLBACK_CITY,
          loading: false,
          error: err.message,
        })
      },
      { timeout: 10000, maximumAge: 300000 }
    )
  }, [])

  return state
}

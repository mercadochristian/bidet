'use client'

import { useState, useEffect, useRef } from 'react'

export interface SearchResult {
  placeId: string
  name: string
  address: string
  type: string
  lat: number
  lng: number
}

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'
const DEBOUNCE_MS = 400
const MIN_QUERY_LENGTH = 3

export function useLocationSearch(query: string) {
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (query.trim().length < MIN_QUERY_LENGTH) {
      setResults([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    const timeout = setTimeout(async () => {
      // Cancel previous in-flight request
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      try {
        const params = new URLSearchParams({
          q: query,
          format: 'json',
          addressdetails: '1',
          countrycodes: 'ph',
          limit: '5',
        })

        const res = await fetch(`${NOMINATIM_URL}?${params}`, {
          signal: controller.signal,
          headers: {
            'Accept-Language': 'en',
          },
        })

        if (!res.ok) {
          setResults([])
          setIsLoading(false)
          return
        }

        const data = await res.json()

        const mapped: SearchResult[] = data.map((item: {
          place_id: number
          display_name: string
          lat: string
          lon: string
          type: string
          address?: Record<string, string>
        }) => {
          const addr = item.address
          const shortAddress = [
            addr?.road,
            addr?.suburb || addr?.neighbourhood,
            addr?.city || addr?.town || addr?.municipality,
          ]
            .filter(Boolean)
            .join(', ') || item.display_name.split(',').slice(0, 3).join(',')

          return {
            placeId: String(item.place_id),
            name: extractName(item),
            address: shortAddress,
            type: formatType(item.type),
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
          }
        })

        setResults(mapped)
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setResults([])
        }
      } finally {
        setIsLoading(false)
      }
    }, DEBOUNCE_MS)

    return () => {
      clearTimeout(timeout)
      abortRef.current?.abort()
    }
  }, [query])

  return { results, isLoading }
}

function extractName(item: {
  display_name: string
  address?: Record<string, string>
}): string {
  const addr = item.address
  // Prefer specific name fields over display_name
  return (
    addr?.amenity ||
    addr?.building ||
    addr?.shop ||
    addr?.leisure ||
    addr?.tourism ||
    addr?.office ||
    item.display_name.split(',')[0]
  )
}

function formatType(type: string): string {
  return type
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

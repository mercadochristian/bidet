'use client'

import 'leaflet/dist/leaflet.css'

import { useEffect, useRef, useState } from 'react'
import type { BidetStatus } from '@/lib/mock-data'

const FALLBACK_LAT = 14.5995
const FALLBACK_LNG = 120.9842

interface MapLocation {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  type: string
  status: BidetStatus
  reportCount: number
}

function getMarkerColor(status: BidetStatus): string {
  if (status === 'has_bidet') return '#4ade80'
  if (status === 'no_bidet') return '#f87171'
  return '#facc15'
}

function getMarkerIcon(status: BidetStatus): string {
  if (status === 'has_bidet') return '✅'
  if (status === 'no_bidet') return '❌'
  return '⚠️'
}

function createPopupHTML(location: MapLocation): string {
  const statusColor =
    location.status === 'has_bidet' ? '#4ade80'
    : location.status === 'no_bidet' ? '#f87171'
    : '#facc15'
  const statusText =
    location.status === 'has_bidet' ? '✅ Has Bidet'
    : location.status === 'no_bidet' ? '❌ No Bidet'
    : '⚠️ Unconfirmed'

  return `
    <div style="
      background: #1c1c1c;
      border: 1px solid #333;
      border-radius: 12px;
      overflow: hidden;
      width: 220px;
      font-family: Inter, system-ui, sans-serif;
    ">
      <div style="padding: 10px 12px 12px;">
        <p style="margin: 0 0 2px; font-size: 14px; font-weight: 700; color: #f0f0f0; line-height: 1.3;">${location.name}</p>
        <p style="margin: 0 0 6px; font-size: 11px; color: #888;">
          ${location.type} &middot; ${location.reportCount} reports
        </p>
        <p style="
          margin: 0 0 8px;
          font-size: 12px;
          font-weight: 600;
          color: ${statusColor};
        ">${statusText}</p>
        <a href="/location/${location.id}" style="
          display: inline-block;
          font-size: 12px;
          color: #4ade80;
          text-decoration: none;
          font-weight: 500;
        ">View details &rarr;</a>
      </div>
    </div>
  `
}

interface MapViewProps {
  lat: number | null
  lng: number | null
}

export default function MapView({ lat, lng }: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<unknown>(null)
  const [locations, setLocations] = useState<MapLocation[]>([])

  // Fetch locations
  useEffect(() => {
    fetch('/api/locations')
      .then((res) => res.json())
      .then((data) => setLocations(data))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!mapContainerRef.current) return
    if (mapRef.current) return
    if (locations.length === 0 && !lat && !lng) return

    const centerLat = lat ?? FALLBACK_LAT
    const centerLng = lng ?? FALLBACK_LNG

    // Inject dark theme styles
    if (!document.getElementById('bidet-leaflet-styles')) {
      const style = document.createElement('style')
      style.id = 'bidet-leaflet-styles'
      style.textContent = `
        @keyframes pulse-blue {
          0%   { box-shadow: 0 0 0 0 rgba(59,130,246,0.6); }
          70%  { box-shadow: 0 0 0 10px rgba(59,130,246,0); }
          100% { box-shadow: 0 0 0 0 rgba(59,130,246,0); }
        }
        .leaflet-popup-content-wrapper {
          background: transparent !important;
          padding: 0 !important;
          border-radius: 12px !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.6) !important;
          border: none !important;
        }
        .leaflet-popup-content { margin: 0 !important; width: auto !important; }
        .leaflet-popup-tip-container { display: none !important; }
        .leaflet-popup-close-button {
          color: #888 !important; font-size: 18px !important;
          top: 6px !important; right: 8px !important;
          background: transparent !important; z-index: 10;
        }
        .leaflet-popup-close-button:hover { color: #fff !important; background: transparent !important; }
        .leaflet-control-zoom {
          border: 1px solid #333 !important; border-radius: 8px !important; overflow: hidden;
        }
        .leaflet-control-zoom a {
          background: #1c1c1c !important; color: #f0f0f0 !important;
          border-bottom: 1px solid #333 !important;
        }
        .leaflet-control-zoom a:hover { background: #2a2a2a !important; color: #fff !important; }
        .leaflet-control-attribution {
          background: rgba(28,28,28,0.85) !important; color: #666 !important; font-size: 10px !important;
        }
        .leaflet-control-attribution a { color: #888 !important; }
      `
      document.head.appendChild(style)
    }

    import('leaflet').then((L) => {
      const map = L.default.map(mapContainerRef.current!, {
        center: [centerLat, centerLng],
        zoom: 13,
        zoomControl: false,
      })

      mapRef.current = map

      L.default.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 20,
        }
      ).addTo(map)

      L.default.control.zoom({ position: 'bottomright' }).addTo(map)

      // Location markers
      locations.forEach((location) => {
        const color = getMarkerColor(location.status)
        const icon = getMarkerIcon(location.status)

        const divIcon = L.default.divIcon({
          className: '',
          html: `<div style="
            width: 36px; height: 36px; border-radius: 50%;
            background: ${color}22; border: 2px solid ${color};
            display: flex; align-items: center; justify-content: center;
            font-size: 16px; cursor: pointer;
            box-shadow: 0 0 8px ${color}55;
          ">${icon}</div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
          popupAnchor: [0, -20],
        })

        L.default.marker([location.lat, location.lng], { icon: divIcon })
          .bindPopup(createPopupHTML(location), { maxWidth: 240, closeButton: true })
          .addTo(map)
      })

      // User location dot
      const userIcon = L.default.divIcon({
        className: '',
        html: `<div style="
          width: 20px; height: 20px; border-radius: 50%;
          background: #3b82f6; border: 3px solid white;
          animation: pulse-blue 2s infinite;
        "></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      })

      L.default.marker([centerLat, centerLng], { icon: userIcon }).addTo(map)
    })

    return () => {
      if (mapRef.current) {
        (mapRef.current as { remove: () => void }).remove()
        mapRef.current = null
      }
    }
  }, [lat, lng, locations])

  return <div ref={mapContainerRef} className="absolute inset-0" />
}

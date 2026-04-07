'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, MapPin, ThumbsUp, ThumbsDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useGeolocation } from '@/hooks/use-geolocation'
import type { BidetStatus } from '@/lib/mock-data'
import { NearbyAlert } from '@/components/nearby-alert'

interface ApiLocation {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  type: string
  status: BidetStatus
  reportCount: number
  upvotes: number
  downvotes: number
  createdAt: string
}

type FilterType = 'all' | 'has_bidet' | 'no_bidet'
type SortType = 'nearest' | 'newest' | 'most_voted'

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: custom * 0.08 },
  }),
}

function statusBadge(status: BidetStatus) {
  if (status === 'has_bidet') return <Badge variant="success">HAS BIDET</Badge>
  if (status === 'no_bidet') return <Badge variant="danger">NO BIDET</Badge>
  return <Badge variant="warning">UNCONFIRMED</Badge>
}

function LocationCard({ location, index }: { location: ApiLocation; index: number }) {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={fadeUpVariants}
    >
      <Link href={`/location/${location.id}`}>
        <Card className="overflow-hidden active:scale-[0.98] transition-transform cursor-pointer">
          {/* Card body */}
          <div className="p-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-foreground leading-tight">{location.name}</h3>
              {statusBadge(location.status)}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="default">{location.type}</Badge>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin size={11} />
                {location.address}
              </span>
            </div>

            <div className="flex items-center gap-4 pt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <ThumbsUp size={13} className="text-success" />
                {location.upvotes}
              </span>
              <span className="flex items-center gap-1">
                <ThumbsDown size={13} className="text-danger" />
                {location.downvotes}
              </span>
              <span className="ml-auto">{location.reportCount} reports</span>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}

const FILTER_PILLS: { id: FilterType; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'has_bidet', label: 'Has Bidet' },
  { id: 'no_bidet', label: 'No Bidet' },
]

const SORT_PILLS: { id: SortType; label: string }[] = [
  { id: 'nearest', label: 'Nearest' },
  { id: 'newest', label: 'Newest' },
  { id: 'most_voted', label: 'Most Voted' },
]

const PAGE_SIZE = 8

export default function HomePage() {
  const { city } = useGeolocation()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [sort, setSort] = useState<SortType>('nearest')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [locations, setLocations] = useState<ApiLocation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Fetch locations from API
  useEffect(() => {
    fetch('/api/locations')
      .then((res) => res.json())
      .then((data) => {
        setLocations(data)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  const filteredLocations = locations.filter((loc) => {
    const matchesSearch =
      search === '' ||
      loc.name.toLowerCase().includes(search.toLowerCase()) ||
      loc.address.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || loc.status === filter
    return matchesSearch && matchesFilter
  })

  const visibleLocations = filteredLocations.slice(0, visibleCount)
  const hasMore = visibleCount < filteredLocations.length

  // Reset visible count when filters/search change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [search, filter, sort])

  // Infinite scroll via IntersectionObserver
  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredLocations.length))
  }, [filteredLocations.length])

  useEffect(() => {
    const el = loadMoreRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore()
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [loadMore])

  return (
    <div className="min-h-screen bg-background">
      {/* Nearby bidet alert */}
      <div className="pt-3 max-w-lg mx-auto">
        <NearbyAlert />
      </div>

      {/* Sticky header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="px-4 pt-3 pb-2 space-y-2.5 max-w-lg mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Bidet</h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin size={11} />
                {city}
              </p>
            </div>
          </div>

          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Search places..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Filter pills */}
        <div className="overflow-x-auto scrollbar-none pb-2.5 max-w-lg mx-auto">
          <div className="flex gap-1.5 px-4 w-max">
            {FILTER_PILLS.map((pill) => (
              <button
                key={pill.id}
                onClick={() => setFilter(pill.id)}
                className={`shrink-0 cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  filter === pill.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {pill.label}
              </button>
            ))}
            <div className="w-px bg-border mx-1 self-stretch" />
            {SORT_PILLS.map((pill) => (
              <button
                key={pill.id}
                onClick={() => setSort(pill.id)}
                className={`shrink-0 cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  sort === pill.id
                    ? 'bg-accent text-accent-foreground ring-1 ring-primary/40'
                    : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="px-4 pt-3 pb-8 space-y-2.5 max-w-lg mx-auto">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-primary" />
          </div>
        ) : filteredLocations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <span className="text-4xl mb-3">🚿</span>
            <p className="text-sm">No locations found</p>
          </div>
        ) : (
          <>
            {visibleLocations.map((loc, i) => (
              <LocationCard key={loc.id} location={loc} index={i} />
            ))}

            {hasMore && (
              <div ref={loadMoreRef} className="flex justify-center py-6">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-primary" />
              </div>
            )}

            {!hasMore && filteredLocations.length > PAGE_SIZE && (
              <p className="text-center text-xs text-muted-foreground py-4">
                All {filteredLocations.length} locations loaded
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

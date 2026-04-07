'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, ThumbsUp, ThumbsDown, Navigation } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useGeolocation } from '@/hooks/use-geolocation'
import type { BidetStatus, BidetType, CleanlinessRating } from '@/lib/mock-data'

interface ApiSubmission {
  id: string
  nickname: string
  hasBidet: boolean
  bidetType?: BidetType | null
  cleanliness?: CleanlinessRating | null
  isPaid?: boolean | null
  notes?: string | null
  upvotes: number
  downvotes: number
  date: string
}

interface ApiLocationDetail {
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
  submissions: ApiSubmission[]
}

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: custom * 0.1 },
  }),
}

function statusLabel(status: BidetStatus) {
  if (status === 'has_bidet') return { icon: '✅', label: 'YES — Has Bidet', color: 'text-success' }
  if (status === 'no_bidet') return { icon: '❌', label: 'NO — No Bidet', color: 'text-danger' }
  return { icon: '⚠️', label: 'UNCONFIRMED', color: 'text-warning' }
}

function bidetTypeLabel(type: string): string {
  const map: Record<string, string> = {
    handheld: 'Handheld',
    seat_integrated: 'Seat Integrated',
    standalone: 'Standalone',
    spray_hose: 'Spray Hose',
    built_in_seat: 'Built-in Seat',
    other: 'Other',
  }
  return map[type] ?? type
}

function cleanlinessStars(rating: number): string {
  return '⭐'.repeat(rating)
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function ConsensusCard({
  status,
  hasBidetCount,
  reportCount,
}: {
  status: BidetStatus
  hasBidetCount: number
  reportCount: number
}) {
  const yesPercent = reportCount > 0 ? Math.round((hasBidetCount / reportCount) * 100) : 0
  const { icon, label, color } = statusLabel(status)

  return (
    <Card>
      <CardContent className="pt-5 space-y-4">
        <div className="flex flex-col items-center text-center gap-2">
          <span className="text-5xl">{icon}</span>
          <p className={`text-xl font-bold tracking-tight ${color}`}>{label}</p>
          <p className="text-sm text-muted-foreground">
            {reportCount} report{reportCount !== 1 ? 's' : ''}
          </p>
        </div>

        {reportCount > 0 && (
          <div className="space-y-2">
            <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-success transition-all duration-700"
                style={{ width: `${yesPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className="font-medium text-success">{yesPercent}% say yes</span>
              <span>{reportCount} reports</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function SubmissionCard({ submission, index }: { submission: ApiSubmission; index: number }) {
  const [votes, setVotes] = useState({
    up: submission.upvotes,
    down: submission.downvotes,
    voted: null as 'up' | 'down' | null,
  })

  const vote = (direction: 'up' | 'down') => {
    setVotes((prev) => {
      if (prev.voted === direction) {
        return {
          up: direction === 'up' ? prev.up - 1 : prev.up,
          down: direction === 'down' ? prev.down - 1 : prev.down,
          voted: null,
        }
      }
      const wasUp = prev.voted === 'up'
      const wasDown = prev.voted === 'down'
      return {
        up: direction === 'up' ? prev.up + 1 : wasUp ? prev.up - 1 : prev.up,
        down: direction === 'down' ? prev.down + 1 : wasDown ? prev.down - 1 : prev.down,
        voted: direction,
      }
    })
  }

  return (
    <motion.div custom={index} initial="hidden" animate="visible" variants={fadeUpVariants}>
      <Card>
        <CardContent className="pt-4 space-y-3">
          {/* Author row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-base">
                👤
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{submission.nickname}</p>
                <p className="text-xs text-muted-foreground">{formatDate(submission.date)}</p>
              </div>
            </div>
            {submission.hasBidet ? (
              <Badge variant="success">✅ YES</Badge>
            ) : (
              <Badge variant="danger">❌ NO</Badge>
            )}
          </div>

          {/* Detail pills */}
          {(submission.bidetType || submission.cleanliness || submission.isPaid !== null) && (
            <div className="flex flex-wrap gap-1.5">
              {submission.bidetType && (
                <Badge variant="default">{bidetTypeLabel(submission.bidetType)}</Badge>
              )}
              {submission.cleanliness && (
                <Badge variant="default">{cleanlinessStars(submission.cleanliness)}</Badge>
              )}
              {submission.isPaid !== null && submission.isPaid !== undefined && (
                <Badge variant={submission.isPaid ? 'warning' : 'success'}>
                  {submission.isPaid ? 'Paid' : 'Free'}
                </Badge>
              )}
            </div>
          )}

          {/* Notes */}
          {submission.notes && (
            <p className="text-sm text-muted-foreground leading-relaxed">{submission.notes}</p>
          )}

          {/* Vote buttons */}
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <button
              onClick={() => vote('up')}
              className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                votes.voted === 'up'
                  ? 'bg-success/20 text-success'
                  : 'bg-muted text-muted-foreground hover:bg-success/10 hover:text-success'
              }`}
            >
              <ThumbsUp size={13} />
              <span>{votes.up}</span>
            </button>
            <button
              onClick={() => vote('down')}
              className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                votes.voted === 'down'
                  ? 'bg-danger/20 text-danger'
                  : 'bg-muted text-muted-foreground hover:bg-danger/10 hover:text-danger'
              }`}
            >
              <ThumbsDown size={13} />
              <span>{votes.down}</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function LocationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [location, setLocation] = useState<ApiLocationDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const { lat: userLat, lng: userLng } = useGeolocation()

  useEffect(() => {
    fetch(`/api/locations/${id}`)
      .then((res) => {
        if (res.status === 404) {
          setNotFound(true)
          setIsLoading(false)
          return null
        }
        return res.json()
      })
      .then((data) => {
        if (data) setLocation(data)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [id])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
      </div>
    )
  }

  if (notFound || !location) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
        <span className="text-5xl mb-4">🚽</span>
        <h1 className="text-xl font-bold text-foreground">Location not found</h1>
        <p className="mt-2 text-muted-foreground">This spot doesn&apos;t exist yet.</p>
        <Button className="mt-6" onClick={() => router.push('/')}>
          Back to feed
        </Button>
      </div>
    )
  }

  const { icon: statusIcon } = statusLabel(location.status)

  return (
    <div className="min-h-screen bg-background">
      {/* Back navigation */}
      <div className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <button
            onClick={() => router.back()}
            className="flex cursor-pointer items-center gap-1 text-sm font-medium text-primary transition-opacity hover:opacity-70"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          <h1 className="flex-1 truncate text-center text-sm font-semibold text-foreground pr-12">
            {location.name}
          </h1>
        </div>
      </div>

      {/* Status hero */}
      <div className="h-20 w-full flex items-center justify-center bg-muted">
        <span className="text-4xl">{statusIcon}</span>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-lg space-y-4 px-4 py-4 pb-10">
        {/* Location info */}
        <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUpVariants}>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold leading-tight text-foreground">{location.name}</h2>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="default">{location.type}</Badge>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin size={13} />
                {location.address}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Consensus */}
        <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUpVariants}>
          <ConsensusCard
            status={location.status}
            hasBidetCount={location.submissions.filter((s) => s.hasBidet).length}
            reportCount={location.reportCount}
          />
        </motion.div>

        {/* Get directions */}
        <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUpVariants}>
          <a
            href={`https://www.google.com/maps/dir/?api=1${userLat && userLng ? `&origin=${userLat},${userLng}` : ''}&destination=${location.lat},${location.lng}&travelmode=walking`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Card className="cursor-pointer active:scale-[0.98] transition-transform">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3 rounded-lg bg-primary/10 px-4 py-3">
                  <Navigation size={20} className="shrink-0 text-primary" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Get Directions</p>
                    <p className="text-xs text-muted-foreground">Opens in Google Maps</p>
                  </div>
                </div>
                <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin size={14} className="shrink-0" />
                  {location.address}
                </p>
              </CardContent>
            </Card>
          </a>
        </motion.div>

        {/* Submissions */}
        <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUpVariants}>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-foreground">
              Reports ({location.submissions.length})
            </h3>
            <span className="text-xs text-muted-foreground">Newest first</span>
          </div>
        </motion.div>

        {location.submissions.length === 0 ? (
          <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUpVariants}>
            <Card>
              <CardContent className="flex flex-col items-center gap-2 py-8 text-center pt-8">
                <span className="text-4xl">🚿</span>
                <p className="text-sm text-muted-foreground">No reports yet. Be the first!</p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {[...location.submissions]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((sub, i) => (
                <SubmissionCard key={sub.id} submission={sub} index={i + 4} />
              ))}
          </div>
        )}

        {/* Submit CTA */}
        <motion.div
          custom={5 + location.submissions.length}
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
        >
          <Link href={`/submit?location_id=${location.id}`} className="block">
            <Button size="lg" className="w-full gap-2">
              + Submit a Report
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

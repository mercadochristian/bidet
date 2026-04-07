'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { ArrowLeft, Search, Plus, X, Camera, Star, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useLocationSearch, type SearchResult } from '@/hooks/use-location-search'
import { submissionSchema, type SubmissionFormData } from '@/lib/validations/submission'

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: custom * 0.08 },
  }),
}

const BIDET_TYPES: { value: SubmissionFormData['bidetType']; label: string }[] = [
  { value: 'spray_hose', label: '🚿 Spray hose' },
  { value: 'built_in_seat', label: '🪑 Built-in seat' },
  { value: 'standalone', label: '🚽 Standalone' },
  { value: 'other', label: '❓ Other' },
]

export default function SubmitPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Photo state (not part of form schema — handled separately)
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([])

  // Location mode: 'search' | 'new'
  const [locationMode, setLocationMode] = useState<'search' | 'new'>('search')
  const [locationSearch, setLocationSearch] = useState('')
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<SearchResult | null>(null)

  // Star hover state
  const [starHover, setStarHover] = useState(0)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      nickname: '',
      notes: '',
    },
  })

  const hasBidet = watch('hasBidet')
  const cleanliness = watch('cleanliness')
  const bidetType = watch('bidetType')
  const isPaid = watch('isPaid')
  const notes = watch('notes') ?? ''

  // Nominatim location search
  const { results: searchResults, isLoading: isSearching } = useLocationSearch(locationSearch)

  const handleSelectLocation = useCallback(
    (result: SearchResult) => {
      setSelectedLocation(result)
      setLocationSearch(result.name)
      setShowLocationDropdown(false)
      // Store as new location since all Nominatim results are external
      setValue('locationId', undefined)
      setValue('newLocationName', result.name)
      setValue('newLocationAddress', result.address)
      setValue('lat', result.lat)
      setValue('lng', result.lng)
      setValue('placeType', result.type)
    },
    [setValue]
  )

  const handleSwitchToNew = () => {
    setLocationMode('new')
    setSelectedLocation(null)
    setLocationSearch('')
    setValue('locationId', undefined)
  }

  const handleSwitchToSearch = () => {
    setLocationMode('search')
    setValue('newLocationName', undefined)
    setValue('newLocationAddress', undefined)
  }

  // Photo handlers
  const handlePhotoAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    const remaining = 5 - photos.length
    const toAdd = files.slice(0, remaining)

    const newPhotos = toAdd.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))
    setPhotos((prev) => [...prev, ...newPhotos])

    // Reset input so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handlePhotoRemove = (index: number) => {
    setPhotos((prev) => {
      const next = [...prev]
      URL.revokeObjectURL(next[index].preview)
      next.splice(index, 1)
      return next
    })
  }

  const onSubmit = async (data: SubmissionFormData) => {
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        toast.error(err.error ?? 'Failed to submit report')
        return
      }

      toast.success('Report submitted!')
      router.push('/')
    } catch {
      toast.error('Something went wrong. Please try again.')
    }
  }

  // Determine if submit should be enabled
  const canSubmit =
    !isSubmitting &&
    (hasBidet === true || hasBidet === false) &&
    (selectedLocation !== null ||
      (watch('newLocationName') && watch('newLocationAddress')))

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handlePhotoAdd}
      />

      {/* Sticky header */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="flex items-center px-4 py-3 max-w-lg mx-auto">
          <button
            type="button"
            onClick={() => router.back()}
            className="cursor-pointer flex items-center gap-1 text-sm font-medium text-primary hover:opacity-80 transition-opacity"
          >
            <ArrowLeft size={16} />
            Cancel
          </button>
          <h1 className="flex-1 text-center text-base font-semibold text-foreground">
            Submit Report
          </h1>
          {/* Spacer to balance cancel */}
          <div className="w-[64px]" />
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="px-4 pt-4 pb-4 space-y-5 max-w-lg mx-auto">

          {/* 1. Nickname */}
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            className="space-y-2"
          >
            <label className="text-sm font-medium text-foreground">
              Your Nickname <span className="text-danger">*</span>
            </label>
            <Input
              {...register('nickname')}
              placeholder="e.g. bidetfinder_ph"
              autoComplete="off"
            />
            {errors.nickname && (
              <p className="text-xs text-danger">{errors.nickname.message}</p>
            )}
          </motion.div>

          {/* 2. Location */}
          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Location <span className="text-danger">*</span>
              </label>
              {locationMode === 'search' ? (
                <button
                  type="button"
                  onClick={handleSwitchToNew}
                  className="cursor-pointer flex items-center gap-1 text-xs text-primary hover:opacity-80 transition-opacity"
                >
                  <Plus size={13} />
                  Add New
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSwitchToSearch}
                  className="cursor-pointer flex items-center gap-1 text-xs text-primary hover:opacity-80 transition-opacity"
                >
                  <Search size={13} />
                  Search Existing
                </button>
              )}
            </div>

            {locationMode === 'search' ? (
              <div className="relative">
                <div className="relative">
                  <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    value={locationSearch}
                    onChange={(e) => {
                      setLocationSearch(e.target.value)
                      setShowLocationDropdown(true)
                      if (selectedLocation) {
                        setSelectedLocation(null)
                        setValue('locationId', undefined)
                      }
                    }}
                    onFocus={() => setShowLocationDropdown(true)}
                    onBlur={() => setTimeout(() => setShowLocationDropdown(false), 150)}
                    placeholder="Search places..."
                    className="pl-9"
                    autoComplete="off"
                  />
                  {selectedLocation && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedLocation(null)
                        setLocationSearch('')
                        setValue('locationId', undefined)
                        setValue('newLocationName', undefined)
                        setValue('newLocationAddress', undefined)
                      }}
                      className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Dropdown */}
                {showLocationDropdown && !selectedLocation && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-[var(--radius)] border border-border bg-card shadow-lg overflow-hidden">
                    {isSearching ? (
                      <div className="px-3 py-3 text-sm text-muted-foreground text-center">
                        Searching...
                      </div>
                    ) : locationSearch.trim().length < 3 ? (
                      <div className="px-3 py-3 text-sm text-muted-foreground text-center">
                        Type at least 3 characters
                      </div>
                    ) : searchResults.length === 0 ? (
                      <div className="px-3 py-3 text-sm text-muted-foreground text-center">
                        No locations found
                      </div>
                    ) : (
                      searchResults.map((result) => (
                        <button
                          key={result.placeId}
                          type="button"
                          onMouseDown={() => handleSelectLocation(result)}
                          className="cursor-pointer w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-muted transition-colors"
                        >
                          <MapPin size={18} className="shrink-0 text-primary" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground truncate">{result.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{result.address}</p>
                          </div>
                          <span className="shrink-0 text-[10px] text-muted-foreground">{result.type}</span>
                        </button>
                      ))
                    )}
                  </div>
                )}

                {/* Selected location chip */}
                {selectedLocation && (
                  <div className="mt-2 flex items-center gap-2 rounded-[var(--radius)] border border-primary/40 bg-primary/10 px-3 py-2">
                    <MapPin size={16} className="shrink-0 text-primary" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{selectedLocation.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{selectedLocation.address}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Input
                  {...register('newLocationName')}
                  placeholder="Location name (e.g. SM Megamall)"
                />
                {errors.newLocationName && (
                  <p className="text-xs text-danger">{errors.newLocationName.message}</p>
                )}
                <Input
                  {...register('newLocationAddress')}
                  placeholder="Address (e.g. EDSA, Mandaluyong City)"
                />
                {errors.newLocationAddress && (
                  <p className="text-xs text-danger">{errors.newLocationAddress.message}</p>
                )}
              </div>
            )}

            {errors.locationId && (
              <p className="text-xs text-danger">{errors.locationId.message}</p>
            )}
          </motion.div>

          {/* 3. Has bidet? */}
          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            className="space-y-2"
          >
            <label className="text-sm font-medium text-foreground">
              Does this place have a bidet? <span className="text-danger">*</span>
            </label>
            <Controller
              name="hasBidet"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-3">
                  {/* Yes */}
                  <button
                    type="button"
                    onClick={() => field.onChange(true)}
                    className={`cursor-pointer rounded-[var(--radius)] border-2 p-4 flex flex-col items-center gap-2 transition-all ${
                      field.value === true
                        ? 'border-success bg-success/10 text-success'
                        : 'border-border bg-card text-muted-foreground hover:border-success/40 hover:bg-success/5'
                    }`}
                  >
                    <span className="text-3xl">✅</span>
                    <span className="text-sm font-semibold">Yes</span>
                  </button>
                  {/* No */}
                  <button
                    type="button"
                    onClick={() => field.onChange(false)}
                    className={`cursor-pointer rounded-[var(--radius)] border-2 p-4 flex flex-col items-center gap-2 transition-all ${
                      field.value === false
                        ? 'border-danger bg-danger/10 text-danger'
                        : 'border-border bg-card text-muted-foreground hover:border-danger/40 hover:bg-danger/5'
                    }`}
                  >
                    <span className="text-3xl">❌</span>
                    <span className="text-sm font-semibold">No</span>
                  </button>
                </div>
              )}
            />
            {errors.hasBidet && (
              <p className="text-xs text-danger">{errors.hasBidet.message}</p>
            )}
          </motion.div>

          {/* 4. Photo upload */}
          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            className="space-y-2"
          >
            <label className="text-sm font-medium text-foreground">
              Photos
              <span className="ml-1 text-xs font-normal text-muted-foreground">(optional, up to 5)</span>
            </label>

            <div className="grid grid-cols-4 gap-2">
              {/* Existing photo thumbnails */}
              {photos.map((photo, i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-[var(--radius)] overflow-hidden border border-border"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.preview}
                    alt={`Photo ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handlePhotoRemove(i)}
                    className="cursor-pointer absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black/90 transition-colors"
                  >
                    <X size={11} />
                  </button>
                </div>
              ))}

              {/* Add button — show only if under 5 photos */}
              {photos.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer aspect-square rounded-[var(--radius)] border-2 border-dashed border-border bg-card flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
                >
                  {photos.length === 0 ? (
                    <>
                      <Camera size={20} />
                      <span className="text-[10px] font-medium">Add</span>
                    </>
                  ) : (
                    <Plus size={20} />
                  )}
                </button>
              )}
            </div>

            {photos.length === 0 && (
              <p className="text-xs text-muted-foreground">Tap to add a photo of the bathroom</p>
            )}
          </motion.div>

          {/* Divider */}
          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            className="flex items-center gap-3"
          >
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs font-medium text-muted-foreground tracking-widest">
              OPTIONAL
            </span>
            <div className="flex-1 h-px bg-border" />
          </motion.div>

          {/* 5. Bidet type */}
          <motion.div
            custom={5}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            className="space-y-2"
          >
            <label className="text-sm font-medium text-foreground">Bidet Type</label>
            <div className="flex flex-wrap gap-2">
              {BIDET_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() =>
                    setValue('bidetType', bidetType === type.value ? undefined : type.value)
                  }
                  className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    bidetType === type.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* 6. Cleanliness */}
          <motion.div
            custom={6}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            className="space-y-2"
          >
            <label className="text-sm font-medium text-foreground">Cleanliness</label>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setStarHover(star)}
                  onMouseLeave={() => setStarHover(0)}
                  onClick={() =>
                    setValue('cleanliness', cleanliness === star ? undefined : star)
                  }
                  className="cursor-pointer p-0.5 transition-transform hover:scale-110 active:scale-95"
                  aria-label={`${star} star${star !== 1 ? 's' : ''}`}
                >
                  <Star
                    size={28}
                    className={`transition-colors ${
                      star <= (starHover || cleanliness || 0)
                        ? 'text-warning fill-warning'
                        : 'text-muted-foreground'
                    }`}
                  />
                </button>
              ))}
              {cleanliness && (
                <span className="ml-1 self-center text-sm text-muted-foreground">
                  {cleanliness}/5
                </span>
              )}
            </div>
          </motion.div>

          {/* 7. Access */}
          <motion.div
            custom={7}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            className="space-y-2"
          >
            <label className="text-sm font-medium text-foreground">Access</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setValue('isPaid', isPaid === false ? undefined : false)}
                className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  isPaid === false
                    ? 'bg-success/20 text-success ring-1 ring-success/40'
                    : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                🆓 Free
              </button>
              <button
                type="button"
                onClick={() => setValue('isPaid', isPaid === true ? undefined : true)}
                className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  isPaid === true
                    ? 'bg-warning/20 text-warning ring-1 ring-warning/40'
                    : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                💰 Paid
              </button>
            </div>
          </motion.div>

          {/* 8. Notes */}
          <motion.div
            custom={8}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Notes</label>
              <span className="text-xs text-muted-foreground">{notes.length}/500</span>
            </div>
            <textarea
              {...register('notes')}
              placeholder="e.g. 3rd floor near cinema, very clean"
              rows={3}
              className="flex w-full rounded-[var(--radius)] border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
            {errors.notes && (
              <p className="text-xs text-danger">{errors.notes.message}</p>
            )}
          </motion.div>

          {/* Submit button */}
          <motion.div
            custom={9}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
          >
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={!canSubmit}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Submitting…
                </span>
              ) : (
                'Submit Report'
              )}
            </Button>

            {/* Hint about required fields */}
            {!canSubmit && !isSubmitting && (
              <p className="mt-2 text-center text-xs text-muted-foreground">
                {hasBidet === undefined
                  ? 'Select yes or no for bidet'
                  : 'Select or add a location to continue'}
              </p>
            )}
          </motion.div>

        </div>
      </form>
    </div>
  )
}

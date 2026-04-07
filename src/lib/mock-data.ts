export type BidetStatus = 'has_bidet' | 'no_bidet' | 'unconfirmed'
export type BidetType = 'handheld' | 'seat_integrated' | 'standalone' | 'spray_hose'
export type CleanlinessRating = 1 | 2 | 3 | 4 | 5

export interface Submission {
  id: string
  locationId: string
  nickname: string
  date: string
  hasBidet: boolean
  bidetType?: BidetType
  cleanliness?: CleanlinessRating
  isPaid?: boolean
  notes?: string
  upvotes: number
  downvotes: number
  gradientFrom: string
  gradientTo: string
}

export interface Location {
  id: string
  name: string
  type: string
  address: string
  distance: string
  status: BidetStatus
  emoji: string
  gradientFrom: string
  gradientTo: string
  photoCount: number
  upvotes: number
  downvotes: number
  reportCount: number
  lat: number
  lng: number
}

// ─── Locations ───────────────────────────────────────────────────────────────
// Add locations here. Example:
// {
//   id: 'loc-001',
//   name: 'SM Megamall',
//   type: 'Mall',
//   address: 'Julia Vargas Ave, Ortigas Center, Mandaluyong City',
//   distance: '5.2 km',
//   status: 'has_bidet',
//   emoji: '🏬',
//   gradientFrom: '#1a2e1a',
//   gradientTo: '#0d1a0d',
//   photoCount: 1,
//   upvotes: 12,
//   downvotes: 0,
//   reportCount: 1,
//   lat: 14.5858,
//   lng: 121.0563,
// },
export const LOCATIONS: Location[] = [
]

// ─── Submissions ─────────────────────────────────────────────────────────────
// Add submissions here. Each must reference a location via locationId. Example:
// {
//   id: 'sub-001',
//   locationId: 'loc-001',
//   nickname: 'meronbangbidet',
//   date: '2025-11-15',
//   hasBidet: true,
//   bidetType: 'spray_hose',
//   cleanliness: 4,
//   isPaid: false,
//   notes: 'MERON! Clean spray hose in every stall.',
//   upvotes: 12,
//   downvotes: 0,
//   gradientFrom: '#1a2e1a',
//   gradientTo: '#0d1a0d',
// },
export const SUBMISSIONS: Submission[] = [
]

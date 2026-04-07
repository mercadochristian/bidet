import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/api'
import { submissionSchema } from '@/lib/validations/submission'

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'

async function geocodeAddress(name: string, address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const params = new URLSearchParams({
      q: `${name}, ${address}, Philippines`,
      format: 'json',
      limit: '1',
    })
    const res = await fetch(`${NOMINATIM_URL}?${params}`, {
      headers: { 'User-Agent': 'BidetFinder/1.0' },
    })
    if (!res.ok) return null
    const data = await res.json()
    if (data.length === 0) return null
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = submissionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const supabase = createClient()
  const data = parsed.data

  let locationId = data.locationId

  // If new location, check if it already exists by name (case-insensitive)
  if (!locationId && data.newLocationName && data.newLocationAddress) {
    const { data: existing } = await supabase
      .from('locations')
      .select('id')
      .ilike('name', data.newLocationName)
      .limit(1)
      .maybeSingle()

    if (existing) {
      // Reuse existing location
      locationId = existing.id
    } else {
      // Geocode if lat/lng are missing or zero (custom address)
      let lat = data.lat ?? 0
      let lng = data.lng ?? 0
      if (lat === 0 && lng === 0) {
        const coords = await geocodeAddress(data.newLocationName, data.newLocationAddress)
        if (coords) {
          lat = coords.lat
          lng = coords.lng
        }
      }

      const { data: newLoc, error: locError } = await supabase
        .from('locations')
        .insert({
          name: data.newLocationName,
          address: data.newLocationAddress,
          lat,
          lng,
          place_type: data.placeType ?? 'other',
        })
        .select('id')
        .single()

      if (locError) {
        return NextResponse.json({ error: locError.message }, { status: 500 })
      }
      locationId = newLoc.id
    }
  }

  if (!locationId) {
    return NextResponse.json({ error: 'Location is required' }, { status: 400 })
  }

  // Insert submission
  const { data: submission, error: subError } = await supabase
    .from('submissions')
    .insert({
      location_id: locationId,
      submitted_by: data.nickname,
      has_bidet: data.hasBidet,
      bidet_type: data.bidetType ?? null,
      cleanliness: data.cleanliness ?? null,
      is_paid: data.isPaid ?? null,
      notes: data.notes ?? null,
    })
    .select('id')
    .single()

  if (subError) {
    return NextResponse.json({ error: subError.message }, { status: 500 })
  }

  return NextResponse.json({ locationId, submissionId: submission.id }, { status: 201 })
}

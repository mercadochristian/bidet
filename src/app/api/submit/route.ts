import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { submissionSchema } from '@/lib/validations/submission'

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

  const supabase = await createClient()
  const data = parsed.data

  let locationId = data.locationId

  // If new location, insert it first
  if (!locationId && data.newLocationName && data.newLocationAddress) {
    const { data: newLoc, error: locError } = await supabase
      .from('locations')
      .insert({
        name: data.newLocationName,
        address: data.newLocationAddress,
        lat: data.lat ?? 0,
        lng: data.lng ?? 0,
        place_type: data.placeType ?? 'other',
      })
      .select('id')
      .single()

    if (locError) {
      return NextResponse.json({ error: locError.message }, { status: 500 })
    }
    locationId = newLoc.id
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

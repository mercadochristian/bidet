import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/api'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createClient()

  const { data: location, error } = await supabase
    .from('locations')
    .select(`
      id,
      name,
      address,
      lat,
      lng,
      place_type,
      created_at,
      submissions (
        id,
        submitted_by,
        has_bidet,
        bidet_type,
        cleanliness,
        is_paid,
        notes,
        upvotes,
        downvotes,
        created_at
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const subs = location.submissions ?? []
  const hasBidetCount = subs.filter((s) => s.has_bidet).length
  const noBidetCount = subs.filter((s) => !s.has_bidet).length
  const totalUp = subs.reduce((sum, s) => sum + s.upvotes, 0)
  const totalDown = subs.reduce((sum, s) => sum + s.downvotes, 0)

  let status: 'has_bidet' | 'no_bidet' | 'unconfirmed' = 'unconfirmed'
  if (subs.length > 0) {
    status = hasBidetCount >= noBidetCount ? 'has_bidet' : 'no_bidet'
  }

  return NextResponse.json({
    id: location.id,
    name: location.name,
    address: location.address,
    lat: location.lat,
    lng: location.lng,
    type: location.place_type,
    status,
    reportCount: subs.length,
    upvotes: totalUp,
    downvotes: totalDown,
    createdAt: location.created_at,
    submissions: subs.map((s) => ({
      id: s.id,
      nickname: s.submitted_by,
      hasBidet: s.has_bidet,
      bidetType: s.bidet_type,
      cleanliness: s.cleanliness,
      isPaid: s.is_paid,
      notes: s.notes,
      upvotes: s.upvotes,
      downvotes: s.downvotes,
      date: s.created_at,
    })),
  })
}

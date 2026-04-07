import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  const { data: locations, error } = await supabase
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
        has_bidet,
        upvotes,
        downvotes
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Transform to include computed fields
  const transformed = locations.map((loc) => {
    const subs = loc.submissions ?? []
    const totalUp = subs.reduce((sum, s) => sum + s.upvotes, 0)
    const totalDown = subs.reduce((sum, s) => sum + s.downvotes, 0)
    const hasBidetCount = subs.filter((s) => s.has_bidet).length
    const noBidetCount = subs.filter((s) => !s.has_bidet).length

    let status: 'has_bidet' | 'no_bidet' | 'unconfirmed' = 'unconfirmed'
    if (subs.length > 0) {
      status = hasBidetCount >= noBidetCount ? 'has_bidet' : 'no_bidet'
    }

    return {
      id: loc.id,
      name: loc.name,
      address: loc.address,
      lat: loc.lat,
      lng: loc.lng,
      type: loc.place_type,
      status,
      reportCount: subs.length,
      upvotes: totalUp,
      downvotes: totalDown,
      createdAt: loc.created_at,
    }
  })

  return NextResponse.json(transformed)
}

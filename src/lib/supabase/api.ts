import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Simple Supabase client for API routes — no cookies/auth needed for this MVP
export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
  )
}

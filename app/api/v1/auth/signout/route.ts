import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const outed = await supabase.auth.signOut()

  return NextResponse.json(outed)
}

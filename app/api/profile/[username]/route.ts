import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params: { username } }: { params: { username: string } }
) {
  const supabase = createClient()
  const result = await supabase
    .from('profiles')
    .select()
    .eq('username', username)
    .limit(1)
    .single()

  if (result?.error) {
    return NextResponse.json(
      { data: null, error: result?.error },
      { status: 400 }
    )
  }

  return NextResponse.json({ data: result?.data, error: null })
}

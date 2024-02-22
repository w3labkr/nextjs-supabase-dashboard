import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()

  const supabase = createClient()
  const signed = await supabase.auth.updateUser({
    password: formData.get('password') as string,
  })

  if (signed?.error || !signed?.data?.user) {
    return NextResponse.json(signed)
  }

  const outed = await supabase.auth.signOut()

  return NextResponse.json(outed)
}

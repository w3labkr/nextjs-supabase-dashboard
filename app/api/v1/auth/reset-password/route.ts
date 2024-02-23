import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()

  const supabase = createClient()
  const updated = await supabase.auth.updateUser({
    password: formData.get('password') as string,
  })

  if (updated?.error || !updated?.data?.user) {
    return NextResponse.json(updated)
  }

  const outed = await supabase.auth.signOut()

  return NextResponse.json(outed)
}

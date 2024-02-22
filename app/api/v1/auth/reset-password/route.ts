import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const formData = await request.formData()

  const signed = await supabase.auth.updateUser({
    password: formData.get('password') as string,
  })

  if (signed?.error || !signed?.data?.user) {
    return NextResponse.json(signed)
  }

  const outed = await supabase.auth.signOut()

  return NextResponse.json(outed)
}

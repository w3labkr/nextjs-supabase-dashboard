import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/supabase/server'
import { ApiError, revalidatePaths } from '@/lib/utils'
import { authorize } from '@/queries/server/auth'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId') as string

  const { authorized } = await authorize(userId)

  if (!authorized) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  const supabase = createClient()
  const { data: emails, error } = await supabase
    .from('emails')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    return NextResponse.json({ data: null, error }, { status: 400 })
  }

  return NextResponse.json({ data: emails, error: null })
}

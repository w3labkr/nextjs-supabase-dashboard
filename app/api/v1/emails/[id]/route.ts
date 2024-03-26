import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { authorize } from '@/lib/supabase/auth'

export async function GET(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const { isAuthorized } = await authorize(id)

  if (!isAuthorized) {
    return NextResponse.json(
      { data: null, error: { message: 'Unauthorized' } },
      { status: 401 }
    )
  }

  try {
    const supabase = createClient()
    const result = await supabase.from('emails').select().eq('user_id', id)

    if (result?.error) throw new Error(result?.error?.message)

    return NextResponse.json({ data: result?.data, error: null })
  } catch (e: unknown) {
    return NextResponse.json(
      { data: null, error: { message: (e as Error)?.message } },
      { status: 400 }
    )
  }
}

import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { authenticate } from '@/lib/supabase/auth'

export async function GET(
  request: NextRequest,
  { params: { userId } }: { params: { userId: string } }
) {
  let data = null

  try {
    const supabase = createClient()
    const result = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (result?.error) throw new Error(result?.error?.message)

    data = result?.data
  } catch (e: unknown) {
    return NextResponse.json(
      { data: null, error: { message: (e as Error)?.message } },
      { status: 400 }
    )
  }

  return NextResponse.json({ data, error: null })
}

export async function POST(
  request: NextRequest,
  { params: { userId } }: { params: { userId: string } }
) {
  const { authenticated, user } = await authenticate()

  if (!authenticated) {
    return NextResponse.json(
      { data: null, error: { message: 'Unauthorized' } },
      { status: 401 }
    )
  }

  if (user?.id !== userId) {
    return NextResponse.json(
      { data: null, error: { message: 'Forbidden' } },
      { status: 403 }
    )
  }

  try {
    const response = await request.json()
    const supabase = createClient()
    const result = await supabase
      .from('profiles')
      .update(response)
      .eq('user_id', userId)

    if (result?.error) throw new Error(result?.error?.message)
  } catch (e: unknown) {
    return NextResponse.json(
      { data: null, error: { message: (e as Error)?.message } },
      { status: 400 }
    )
  }

  return NextResponse.json({ data: null, error: null })
}

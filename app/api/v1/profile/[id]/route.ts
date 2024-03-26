import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { authorize } from '@/lib/supabase/auth'

export async function GET(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const result = await supabase
      .from('profiles')
      .select()
      .eq('user_id', id)
      .single()

    if (result?.error) throw new Error(result?.error?.message)

    return NextResponse.json({ data: result?.data, error: null })
  } catch (e: unknown) {
    return NextResponse.json(
      { data: null, error: { message: (e as Error)?.message } },
      { status: 400 }
    )
  }
}

export async function POST(
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

  const data = await request.json()

  try {
    const supabase = createClient()
    const updated = await supabase
      .from('profiles')
      .update(data)
      .eq('user_id', id)

    if (updated?.error) throw new Error(updated?.error?.message)

    return NextResponse.json({ data: null, error: null })
  } catch (e: unknown) {
    return NextResponse.json(
      { data: null, error: { message: (e as Error)?.message } },
      { status: 400 }
    )
  }
}

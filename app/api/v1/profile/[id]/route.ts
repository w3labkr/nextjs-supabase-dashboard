import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { authorize } from '@/lib/supabase/auth'

export async function GET(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const response = await supabase
      .from('profiles')
      .select()
      .eq('user_id', id)
      .single()

    if (response?.error) throw new Error(response?.error?.message)

    return NextResponse.json({ data: response?.data, error: null })
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

  try {
    const data = await request.json()
    const supabase = createClient()
    const response = await supabase
      .from('profiles')
      .update(data)
      .eq('user_id', id)

    if (response?.error) throw new Error(response?.error?.message)

    return NextResponse.json({ data: null, error: null })
  } catch (e: unknown) {
    return NextResponse.json(
      { data: null, error: { message: (e as Error)?.message } },
      { status: 400 }
    )
  }
}

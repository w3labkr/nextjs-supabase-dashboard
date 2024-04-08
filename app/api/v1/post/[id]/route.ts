import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ApiError } from '@/lib/utils'
import { authorize } from '@/hooks/async/user'

export async function GET(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const supabase = createClient()
  const result = await supabase
    .from('posts')
    .select('*, user:users(*)')
    .eq('id', id)

  if (result?.error) {
    return NextResponse.json(
      { data: null, error: result?.error },
      { status: 400 }
    )
  }

  return NextResponse.json({ data: result?.data, error: null })
}

export async function POST(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  // const { user } = await authorize(id)

  // if (!user) {
  //   return NextResponse.json(
  //     { data: null, error: new ApiError(401) },
  //     { status: 401 }
  //   )
  // }

  const body = await request.json()
  const supabase = createClient()
  const result = await supabase
    .from('posts')
    .update(body)
    .eq('id', id)
    .select('*, users(*)')
    .single()

  if (result?.error) {
    return NextResponse.json(
      { data: null, error: result?.error },
      { status: 400 }
    )
  }

  return NextResponse.json({ data: result?.data, error: null })
}

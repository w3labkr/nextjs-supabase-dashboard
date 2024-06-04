import { NextResponse, type NextRequest } from 'next/server'
import { createClient, createAdminClient } from '@/supabase/server'
import { ApiError, revalidates } from '@/lib/utils'
import { authorize } from '@/queries/server/auth'

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId') as string

  const { data, options } = await request.json()
  const { authorized } = await authorize(userId)

  if (!authorized) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  const supabaseAdmin = createAdminClient()
  const { error } = await supabaseAdmin.updateUserById(userId, {
    email: data?.email,
    user_metadata: { email: data?.email },
  })

  if (error) {
    return NextResponse.json({ data: null, error }, { status: 400 })
  }

  return NextResponse.json({
    data: null,
    error: null,
    revalidated: revalidates(options),
    now: Date.now(),
  })
}

export async function PUT(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId') as string

  const { data, options } = await request.json()
  const { authorized } = await authorize(userId)

  if (!authorized) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  const supabase = createClient()
  const { data: email, error } = await supabase
    .from('emails')
    .insert({ email: data?.email, user_id: userId })
    .select('*')
    .single()

  if (error) {
    return NextResponse.json({ data: null, error }, { status: 400 })
  }

  return NextResponse.json({
    data: email,
    error: null,
    revalidated: revalidates(options),
    now: Date.now(),
  })
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId') as string

  const { data, options } = await request.json()
  const { authorized } = await authorize(userId)

  if (!authorized) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  const supabase = createClient()
  const { data: email, error } = await supabase
    .from('emails')
    .delete()
    .eq('user_id', userId)
    .eq('email', data?.email)
    .select('*')
    .single()

  if (error) {
    return NextResponse.json({ data: null, error }, { status: 400 })
  }

  return NextResponse.json({
    data: email,
    error: null,
    revalidated: revalidates(options),
    now: Date.now(),
  })
}

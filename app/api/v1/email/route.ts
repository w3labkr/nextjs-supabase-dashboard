import { NextResponse, type NextRequest } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { ApiError } from '@/lib/utils'
import { authorize } from '@/hooks/async'

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const uid = searchParams.get('uid') as string

  const { formData, options } = await request.json()
  const { user } = await authorize(uid)

  if (!user) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  const supabaseAdmin = createAdminClient()
  const result = await supabaseAdmin.updateUserById(uid, {
    email: formData?.email,
    user_metadata: { email: formData?.email },
  })

  if (result?.error) {
    return NextResponse.json(
      { data: null, error: result?.error },
      { status: 400 }
    )
  }

  const pathname = options?.revalidatePath

  if (pathname && typeof pathname === 'string') {
    revalidatePath(pathname)
  } else if (pathname && Array.isArray(pathname)) {
    pathname.forEach((path: string) => revalidatePath(path))
  }

  return pathname
    ? NextResponse.json({ data: null, error: null, revalidated: true })
    : NextResponse.json({ data: null, error: null })
}

export async function PUT(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const uid = searchParams.get('uid') as string

  const { formData, options } = await request.json()
  const { user } = await authorize(uid)

  if (!user) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  const supabase = createClient()
  const result = await supabase
    .from('emails')
    .insert({ email: formData?.email, user_id: uid })
    .select()
    .single()

  if (result?.error) {
    return NextResponse.json(
      { data: null, error: result?.error },
      { status: 400 }
    )
  }

  const pathname = options?.revalidatePath

  if (pathname && typeof pathname === 'string') {
    revalidatePath(pathname)
  } else if (pathname && Array.isArray(pathname)) {
    pathname.forEach((path: string) => revalidatePath(path))
  }

  return pathname
    ? NextResponse.json({ data: result?.data, error: null, revalidated: true })
    : NextResponse.json({ data: result?.data, error: null })
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const uid = searchParams.get('uid') as string

  const { formData, options } = await request.json()
  const { user } = await authorize(uid)

  if (!user) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  const supabase = createClient()
  const result = await supabase
    .from('emails')
    .delete()
    .eq('user_id', uid)
    .eq('email', formData?.email)
    .select()
    .single()

  if (result?.error) {
    return NextResponse.json(
      { data: null, error: result?.error },
      { status: 400 }
    )
  }

  const pathname = options?.revalidatePath

  if (pathname && typeof pathname === 'string') {
    revalidatePath(pathname)
  } else if (pathname && Array.isArray(pathname)) {
    pathname.forEach((path: string) => revalidatePath(path))
  }

  return pathname
    ? NextResponse.json({ data: result?.data, error: null, revalidated: true })
    : NextResponse.json({ data: result?.data, error: null })
}

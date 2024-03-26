import { NextResponse, type NextRequest } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { authorize } from '@/lib/supabase/auth'

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

  if (!data?.email) {
    return NextResponse.json(
      { data: null, error: { message: 'Required field is not defined.' } },
      { status: 400 }
    )
  }

  try {
    const supabaseAdmin = createAdminClient()
    const updated = await supabaseAdmin.updateUserById(id, {
      email: data?.email,
      user_metadata: { email: data?.email },
    })

    if (updated?.error) throw new Error(updated?.error?.message)

    return NextResponse.json({ data: null, error: null })
  } catch (e: unknown) {
    return NextResponse.json(
      { data: null, error: { message: (e as Error)?.message } },
      { status: 400 }
    )
  }
}

export async function PUT(
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

  if (!data?.email) {
    return NextResponse.json(
      { data: null, error: { message: 'Required field is not defined.' } },
      { status: 400 }
    )
  }

  try {
    const supabase = createClient()
    const inserted = await supabase
      .from('emails')
      .insert({ ...data, user_id: id })

    if (inserted?.error) throw new Error(inserted?.error?.message)

    return NextResponse.json({ data: null, error: null })
  } catch (e: unknown) {
    return NextResponse.json(
      { data: null, error: { message: (e as Error)?.message } },
      { status: 400 }
    )
  }
}

export async function DELETE(
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

  if (!data?.email) {
    return NextResponse.json(
      { data: null, error: { message: 'Required field is not defined.' } },
      { status: 400 }
    )
  }

  try {
    const supabase = createClient()
    const deleted = await supabase
      .from('emails')
      .delete()
      .eq('user_id', id)
      .eq('email', data?.email)

    if (deleted?.error) throw new Error(deleted?.error?.message)

    return NextResponse.json({ data: null, error: null })
  } catch (e: unknown) {
    return NextResponse.json(
      { data: null, error: { message: (e as Error)?.message } },
      { status: 400 }
    )
  }
}

function NextResponseJson(body: unknown, init?: ResponseInit | undefined) {
  return NextResponse.json(body, init)
}

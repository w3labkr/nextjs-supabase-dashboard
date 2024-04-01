import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { responseJson } from '@/lib/utils'
import { authorize } from '@/hooks/async/user'

export async function GET(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const { user } = await authorize(id)
  if (!user) return responseJson(401)

  const supabase = createClient()
  const { data, error } = await supabase
    .from('user_roles')
    .select()
    .eq('user_id', id)
    .limit(1)
    .single()

  if (error) return responseJson(400, { error: error?.message })

  return responseJson(200, { data })
}

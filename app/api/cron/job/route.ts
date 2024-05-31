import { NextResponse, type NextRequest } from 'next/server'
import { createClient, createAdminClient } from '@/supabase/server'
import { ApiError, revalidatePaths } from '@/lib/utils'
import { authorize } from '@/queries/server/auth'

export async function GET(request: NextRequest) {
  // const supabase = createClient()
  // const { data, error } = await supabase.rpc('cron_job')

  // if (error) {
  //   return new Response(error?.message, { status: 400 })
  // }

  return new Response('success', { status: 200 })
}

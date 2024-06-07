import { type NextRequest } from 'next/server'
import { createClient } from '@/supabase/server'
import { generateRecentPosts } from '@/lib/utils'

/**
 * Managing Cron Jobs
 * https://vercel.com/docs/cron-jobs/manage-cron-jobs
 */

export async function GET(request: NextRequest) {
  const authorization = request.headers.get('authorization')

  // Securing cron jobs
  if (authorization !== `Bearer ${process.env.CRON_SECRET!}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const supabase = createClient()
  const truncated = await supabase.rpc('truncate_posts')

  if (truncated?.error) {
    return new Response(truncated?.error?.message, { status: 400 })
  }

  const { data: users } = await supabase.rpc('get_users', {
    userrole: 'superadmin',
  })

  if (Array.isArray(users) && users?.length > 0) {
    for (let i = 0; i < users?.length; i++) {
      const { error } = await supabase.rpc('create_new_posts', {
        data: generateRecentPosts(users[i]?.id, 3),
      })
      if (error) continue
    }
  } else {
    return new Response('User does not exist.', { status: 400 })
  }

  return new Response('success', { status: 200 })
}

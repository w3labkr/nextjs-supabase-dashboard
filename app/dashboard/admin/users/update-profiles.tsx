import * as React from 'react'
import { v4 as uuidv4 } from 'uuid'
import { createAdminClient } from '@/lib/supabase/server'

export async function updateProfiles() {
  const supabase = createAdminClient()
  const {
    data: { users },
    error,
  } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 50,
  })

  if (users) {
    const values = users.map((user) => {
      const email = user?.email ?? ''
      const username = email.split('@')[0]
      return {
        id: uuidv4(),
        user_id: user?.id,
        avatar_url: user?.user_metadata?.avatar_url ?? null,
        email,
        full_name: user?.user_metadata?.full_name ?? username,
        name: user?.user_metadata?.name ?? username,
        picture: user?.user_metadata?.picture ?? null,
      }
    })
    const updated = await supabase.from('profiles').upsert(values)
  }

  return { data: null, error: null }
}

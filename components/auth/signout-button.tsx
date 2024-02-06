'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function SignOutButton() {
  const router = useRouter()

  const onClick = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.log(error)
    }

    router.push('/')
  }

  return (
    <button onClick={onClick} className="flex w-full cursor-pointer">
      Signout
    </button>
  )
}

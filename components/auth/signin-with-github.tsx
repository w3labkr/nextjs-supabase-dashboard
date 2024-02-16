'use client'

import * as React from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { createClient } from '@/lib/supabase/client'

import { toast } from 'sonner'
import { FaGithub } from 'react-icons/fa'
import { Button } from '@/components/ui/button'

export function SignInWithGithub() {
  const { t } = useTranslation()

  async function onSubmit() {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        // A URL to send the user to after they are confirmed.
        redirectTo:
          process.env.NEXT_PUBLIC_SITE_URL +
          '/api/auth/v1/callback?next=/dashboard/dashboard',
      },
    })

    if (error) toast.error(`${error?.name}: ${error?.message}`)
  }

  return (
    <Button variant="outline" onClick={onSubmit}>
      <FaGithub className="mr-2 h-4 w-4" />
      <Trans>Sign in with Github</Trans>
    </Button>
  )
}

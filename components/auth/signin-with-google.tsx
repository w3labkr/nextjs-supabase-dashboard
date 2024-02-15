'use client'

import * as React from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { createClient } from '@/lib/supabase/client'

import { toast } from 'sonner'
import { FcGoogle } from 'react-icons/fc'
import { Button } from '@/components/ui/button'

export function SignInWithGoogle() {
  const { t } = useTranslation()

  async function onSubmit() {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // A URL to send the user to after they are confirmed.
        redirectTo:
          process.env.NEXT_PUBLIC_SITE_URL +
          '/api/auth/v1/callback?next=/dashboard/dashboard',
        // Google does not send out a refresh token by default,
        // so you will need to pass parameters like these to signInWithOAuth() in order to extract the provider_refresh_token:
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) toast.error(`${error?.name}: ${error?.message}`)
  }

  return (
    <Button variant="outline" onClick={onSubmit}>
      <FcGoogle className="mr-2 h-4 w-4" />
      <Trans t={t}>Sign in with Google</Trans>
    </Button>
  )
}

'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { toast } from 'sonner'
import { FcGoogle } from 'react-icons/fc'
import { Button, ButtonProps } from '@/components/ui/button'

import { createClient } from '@/lib/supabase/client'

interface SignInWithGoogleProps
  extends ButtonProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {}

export function SignInWithGoogle({
  variant = 'outline',
  ...props
}: SignInWithGoogleProps) {
  const { t } = useTranslation()

  async function onSubmit() {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // A URL to send the user to after they are confirmed.
        redirectTo:
          process.env.NEXT_PUBLIC_SITE_URL +
          '/api/v1/auth/callback?next=/dashboard/dashboard',
        // Google does not send out a refresh token by default,
        // so you will need to pass parameters like these to signInWithOAuth() in order to extract the provider_refresh_token:
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      toast.error(error?.message)
      return false
    }

    toast.success(t('FormMessage.you_have_successfully_logged_in'))
  }

  return (
    <Button variant={variant} onClick={onSubmit} {...props}>
      <FcGoogle className="mr-2 h-4 w-4" />
      {t('SignInWithGoogle.label')}
    </Button>
  )
}

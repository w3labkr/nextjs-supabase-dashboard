'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { toast } from 'sonner'
import { FaGithub } from 'react-icons/fa'
import { Button, ButtonProps } from '@/components/ui/button'

import { createClient } from '@/lib/supabase/client'

interface SignInWithGithubProps
  extends ButtonProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {}

export function SignInWithGithub({
  variant = 'outline',
  ...props
}: SignInWithGithubProps) {
  const { t } = useTranslation()

  const onSubmit = async () => {
    try {
      const supabase = createClient()
      const signedIn = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          // A URL to send the user to after they are confirmed.
          redirectTo:
            process.env.NEXT_PUBLIC_SITE_URL +
            '/api/v1/auth/callback?next=/dashboard/dashboard',
        },
      })

      if (signedIn?.error) throw new Error(signedIn?.error?.message)
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    }
  }

  return (
    <Button variant={variant} onClick={onSubmit} {...props}>
      <FaGithub className="mr-2 h-4 w-4" />
      {t('SignInWithGithub.label')}
    </Button>
  )
}

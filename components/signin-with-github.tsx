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

  const handleClick = async () => {
    try {
      const supabase = createClient()
      const signed = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          // A URL to send the user to after they are confirmed.
          // Don't forget to change the URL in supabase's email template.
          redirectTo:
            process.env.NEXT_PUBLIC_SITE_URL +
            '/api/auth/callback?next=/dashboard',
        },
      })

      if (signed?.error) throw new Error(signed?.error?.message)
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    }
  }

  return (
    <Button variant={variant} onClick={handleClick} {...props}>
      <FaGithub className="mr-2 h-4 w-4" />
      {t('SignInWithGithub.label')}
    </Button>
  )
}

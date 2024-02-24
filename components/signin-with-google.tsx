'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { toast } from 'sonner'
import { FcGoogle } from 'react-icons/fc'
import { Button, ButtonProps } from '@/components/ui/button'

import { AuthApi } from '@/types/api'
import { fetcher } from '@/lib/fetch'

interface SignInWithGoogleProps
  extends ButtonProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {}

export function SignInWithGoogle({
  variant = 'outline',
  ...props
}: SignInWithGoogleProps) {
  const { t } = useTranslation()

  async function onSubmit() {
    const { error } = await fetcher<AuthApi>('/api/v1/auth/signin-with-google')

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

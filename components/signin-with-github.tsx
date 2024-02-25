'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { toast } from 'sonner'
import { FaGithub } from 'react-icons/fa'
import { Button, ButtonProps } from '@/components/ui/button'

import { AuthApi } from '@/types/api'
import { fetcher } from '@/lib/utils'

interface SignInWithGithubProps
  extends ButtonProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {}

export function SignInWithGithub({
  variant = 'outline',
  ...props
}: SignInWithGithubProps) {
  const { t } = useTranslation()

  async function onSubmit() {
    const { error } = await fetcher<AuthApi>('/api/v1/auth/signin-with-github')

    if (error) {
      toast.error(error?.message)
      return false
    }

    toast.success(t('FormMessage.you_have_successfully_logged_in'))
  }

  return (
    <Button variant={variant} onClick={onSubmit} {...props}>
      <FaGithub className="mr-2 h-4 w-4" />
      {t('SignInWithGithub.label')}
    </Button>
  )
}

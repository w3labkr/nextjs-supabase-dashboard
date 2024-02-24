'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

import { toast } from 'sonner'
import { Button, ButtonProps } from '@/components/ui/button'

import { AuthApi } from '@/types/api'
import { fetcher } from '@/lib/fetch'
import { useAuth } from '@/hooks/use-auth'

interface SignOutButtonProps
  extends ButtonProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {}

export function SignOutButton(props: SignOutButtonProps) {
  const router = useRouter()
  const auth = useAuth()
  const { t } = useTranslation()

  async function onSubmit() {
    const { error } = await fetcher<AuthApi>('/api/v1/auth/signout')

    if (error) {
      toast.error(error?.message)
      return false
    }

    toast.success(t('FormMessage.you_have_been_logged_out_successfully'))

    auth.signOut()

    router.replace('/')
  }

  return (
    <Button onClick={onSubmit} {...props}>
      {t('SignOutButton.label')}
    </Button>
  )
}

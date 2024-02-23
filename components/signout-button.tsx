'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

import { toast } from 'sonner'
import { Button, ButtonProps } from '@/components/ui/button'

import { SignOut } from '@/types/supabase'
import { fetcher } from '@/lib/fetch'
import { useAuth } from '@/hooks/use-auth'

interface SignOutButtonProps
  extends ButtonProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string | undefined
}

export function SignOutButton({
  children,
  translate,
  text = 'sign_out',
  ...props
}: SignOutButtonProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const { setSession, setUser } = useAuth()

  async function onSubmit() {
    const { error } = await fetcher<SignOut>('/api/v1/auth/signout')

    if (error) {
      toast.error(error?.message)
      return false
    }

    setSession(null)
    setUser(null)

    toast.success(t('you_have_been_logged_out_successfully'))

    router.replace('/')
  }

  return (
    <Button onClick={onSubmit} {...props}>
      {text && translate === 'yes' ? t(text) : text}
      {children}
    </Button>
  )
}

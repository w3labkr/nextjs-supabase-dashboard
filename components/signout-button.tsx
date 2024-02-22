'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

import { toast } from 'sonner'
import { Button, ButtonProps } from '@/components/ui/button'

import { fetcher } from '@/lib/fetch'

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

  async function onSubmit() {
    const { error } = await fetcher('/api/v1/auth/signout')

    if (error) {
      toast.error(error?.message)
      return false
    }

    router.replace('/')
  }

  return (
    <Button onClick={onSubmit} {...props}>
      {text && translate === 'yes' ? t(text) : text}
      {children}
    </Button>
  )
}

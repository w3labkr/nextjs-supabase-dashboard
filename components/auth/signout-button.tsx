'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { createClient } from '@/lib/supabase/client'

import { toast } from 'sonner'
import { Button, ButtonProps } from '@/components/ui/button'

interface SignOutButtonProps
  extends ButtonProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string
}

export function SignOutButton({
  children,
  title = 'Signout',
  ...props
}: SignOutButtonProps) {
  const router = useRouter()
  const { t } = useTranslation()

  const onClick = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()

    if (error) toast.error(`${error?.name}: ${error?.message}`)
    if (error) return false

    router.push('/')
  }

  return (
    <Button onClick={onClick} {...props}>
      {title ? t(title) : children}
    </Button>
  )
}

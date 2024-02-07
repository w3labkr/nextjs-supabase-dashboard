'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation, Trans } from 'react-i18next'

import { createClient } from '@/lib/supabase/client'
import { cn } from '@/utils/tailwind'

interface SignOutButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function SignOutButton({ className, ...props }: SignOutButtonProps) {
  const router = useRouter()
  const { t } = useTranslation()

  const onClick = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.log(error)
    }

    router.push('/')
  }

  return (
    <button
      onClick={onClick}
      className={cn('flex w-full cursor-pointer', className)}
      {...props}
    >
      <Trans t={t}>Signout</Trans>
    </button>
  )
}

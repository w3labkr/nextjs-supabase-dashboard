'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

import { toast } from 'sonner'
import { Button, ButtonProps } from '@/components/ui/button'

import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'

interface SignOutButtonProps
  extends ButtonProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {}

export function SignOutButton(props: SignOutButtonProps) {
  const router = useRouter()
  const auth = useAuth()
  const { t } = useTranslation()

  async function onSubmit() {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()

      if (error) throw new Error(error?.message)

      toast.success(t('FormMessage.you_have_been_logged_out_successfully'))

      auth.setSession(null)
      auth.setUser(null)

      router.replace('/')
      router.refresh()
    } catch (e: unknown) {
      const error = e as Error
      toast.error(error?.message)
    }
  }

  return (
    <Button onClick={onSubmit} {...props}>
      {t('SignOutButton.label')}
    </Button>
  )
}

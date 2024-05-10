'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

import { toast } from 'sonner'
import { Logo } from '@/components/logo'
import { Title } from '@/components/title'
import { LanguageToggleButton } from '@/components/language-toggle-button'

import { createClient } from '@/supabase/client'
import { useAuth } from '@/hooks/use-auth'

export default function BlockedPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const { setSession, setUser } = useAuth()

  const handleClick = async () => {
    try {
      const supabase = createClient()
      const unsigned = await supabase.auth.signOut()

      if (unsigned?.error) throw new Error(unsigned?.error?.message)

      setSession(null)
      setUser(null)

      router.refresh()
      router.replace('/auth/signin')
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    }
  }

  return (
    <div className="container flex min-h-screen w-screen flex-col items-center justify-center py-8">
      <div className="mx-auto flex w-full max-w-[320px] flex-col justify-center space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <Logo />
          <Title text="BlockedPage.title" translate="yes" />
        </div>
        <div className="grid gap-4">
          <p>{t('BlockedPage.description')}</p>
          <p>{t('BlockedPage.message')}</p>
          <button
            onClick={handleClick}
            className="text-left text-blue-700 hover:underline"
          >
            {t('BlockedPage.button')}
          </button>
        </div>
        <div className="flex justify-between text-center text-sm">
          <div></div>
          <LanguageToggleButton />
        </div>
      </div>
    </div>
  )
}

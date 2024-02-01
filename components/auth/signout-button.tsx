'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'

export function SignOutButton() {
  const { t } = useTranslation()

  async function signOut() {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()

    console.log(error)
  }

  return <Button onClick={signOut}>{t('Sign Out')}</Button>
}

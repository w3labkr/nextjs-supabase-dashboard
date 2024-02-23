'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { toast } from 'sonner'
import { FaGithub } from 'react-icons/fa'
import { Button } from '@/components/ui/button'

import { SignInWithOAuth } from '@/types/supabase'
import { fetcher } from '@/lib/fetch'

export function SignInWithGithub() {
  const { t } = useTranslation()

  async function onSubmit() {
    const { data, error } = await fetcher<SignInWithOAuth>(
      '/api/v1/auth/signin-with-google'
    )

    if (error) {
      toast.error(error?.message)
      return false
    }

    toast.success(t('you_have_successfully_logged_in'))
  }

  return (
    <Button variant="outline" onClick={onSubmit}>
      <FaGithub className="mr-2 h-4 w-4" />
      {t('sign_in_with_google')}
    </Button>
  )
}

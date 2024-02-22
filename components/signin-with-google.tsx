'use client'

import * as React from 'react'
import { Trans } from 'react-i18next'

import { toast } from 'sonner'
import { FcGoogle } from 'react-icons/fc'
import { Button } from '@/components/ui/button'

import { fetcher } from '@/lib/fetch'

export function SignInWithGoogle() {
  async function onSubmit() {
    const { data, error } = await fetcher('/api/v1/auth/signin-with-google')

    if (error) {
      toast.error(error?.message)
      return false
    }

    // if (data?.user) {}
  }

  return (
    <Button variant="outline" onClick={onSubmit}>
      <FcGoogle className="mr-2 h-4 w-4" />
      <Trans>sign_in_with_google</Trans>
    </Button>
  )
}

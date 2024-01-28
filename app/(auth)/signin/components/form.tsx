'use client'

import * as React from 'react'
import { LuLoader2 } from 'react-icons/lu'
import { useTranslation } from 'react-i18next'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { schema } from './schema'

import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { ForgotPasswordLink } from '@/components/auth/related-link'

type FormData = z.infer<typeof schema>

export function SignInForm() {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })
  const disabled = isLoading || isSubmitting

  function onSubmit(data: FormData) {
    console.log(data)

    // if (!res?.ok) {
    //   return toast({
    //     title: 'Something went wrong.',
    //     description: 'Your sign in request failed. Please try again.',
    //     variant: 'destructive',
    //   });
    // }

    // return toast({
    //   title: 'Check your email',
    //   description: 'We sent you a login link. Be sure to check your spam too.',
    // });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-2">
        <div className="grid gap-1">
          <label>
            <Input
              type="email"
              placeholder="name@example.com"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={disabled}
              {...register('email')}
            />
          </label>
          {errors?.email && (
            <p className="px-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>
        <div className="grid gap-1">
          <label>
            <Input
              type="password"
              placeholder="Password"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              disabled={disabled}
              {...register('password')}
            />
          </label>
          <p className="px-1 text-xs">
            <ForgotPasswordLink />
          </p>
          {errors?.password && (
            <p className="px-1 text-xs text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>
        <Button disabled={disabled}>
          {disabled && <LuLoader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t('Sign In')}
        </Button>
      </div>
    </form>
  )
}

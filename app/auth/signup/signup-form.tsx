'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'

import { useTranslation, Trans } from 'react-i18next'
import { i18nKey } from '@/utils/string'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { toast } from 'sonner'
import { LucideIcon } from '@/lib/lucide-icon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { createClient } from '@/lib/supabase/client'

const signUpFormSchema = z
  .object({
    email: z.string().trim().email(),
    // If the password is larger than 72 chars, it will be truncated to the first 72 chars.
    password: z.string().trim().min(6).max(72),
    confirmPassword: z.string().trim().min(6).max(72),
  })
  .refine((val) => val.password === val.confirmPassword, {
    path: ['confirmPassword'],
    params: { i18n: 'invalid_confirm_password' },
  })

type SignUpFormValues = z.infer<typeof signUpFormSchema>

const defaultValues = {
  email: '',
  password: '',
  confirmPassword: '',
}

export function SignUpForm() {
  const router = useRouter()
  const { t } = useTranslation(['translation', 'zod', 'zod-custom', 'supabase'])

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: defaultValues,
  })
  const { errors, isSubmitting } = form.formState

  async function onSubmit(values: SignUpFormValues) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    })

    if (error) {
      const { status, name, message } = error
      const i18nMessage = `${name}.${i18nKey(message)}`

      switch (name) {
        case 'AuthApiError':
          form.setError('root.serverError', {
            type: status?.toString(),
            message: t(i18nMessage, { ns: 'supabase' }),
          })
          break
        case 'AuthRetryableFetchError':
          toast.error(t(i18nMessage, { ns: 'supabase' }))
          break
        default:
          toast.error(`${name}: ${message}`)
          break
      }

      return false
    }

    toast.success(t('You have successfully registered as a member'))

    router.push('/dashboard/dashboard')
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        <div className="space-y-1">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Email')}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    placeholder="name@example.com"
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription></FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormMessage>{errors?.root?.serverError?.message}</FormMessage>
        </div>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Password')}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect="off"
                  placeholder={t('Password')}
                  {...field}
                />
              </FormControl>
              {/* <FormDescription></FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Confirm Password')}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect="off"
                  placeholder={t('Confirm Password')}
                  {...field}
                />
              </FormControl>
              {/* <FormDescription></FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && (
            <LucideIcon name="Loader2" className="mr-2 size-4 animate-spin" />
          )}
          <Trans>Sign Up</Trans>
        </Button>
      </form>
    </Form>
  )
}

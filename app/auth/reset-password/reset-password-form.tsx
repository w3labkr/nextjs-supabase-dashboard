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
    newPassword: z.string().trim().min(6).max(72),
    confirmNewPassword: z.string().trim().min(6).max(72),
  })
  .refine((val) => val.newPassword === val.confirmNewPassword, {
    path: ['confirmNewPassword'],
    params: { i18n: 'invalid_confirm_password' },
  })

type SignUpFormValues = z.infer<typeof signUpFormSchema>

const defaultValues = {
  newPassword: '',
  confirmNewPassword: '',
}

export function ResetPasswordForm() {
  const router = useRouter()
  const { t } = useTranslation(['translation', 'zod', 'zod-custom', 'supabase'])

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: defaultValues,
  })
  const { errors, isSubmitting } = form.formState

  async function onSubmit(values: SignUpFormValues) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.updateUser({
      password: values.newPassword,
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

    toast.success(t('Your password has been successfully changed'))

    if (data?.user) {
      const { error } = await supabase.auth.signOut()
      if (error) toast.error(`${error?.name}: ${error?.message}`)
      if (error) return false
    }

    router.push('/auth/signin')
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('New Password')}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect="off"
                  placeholder={t('New Password')}
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
          name="confirmNewPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Confirm New Password')}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect="off"
                  placeholder={t('Confirm New Password')}
                  {...field}
                />
              </FormControl>
              {/* <FormDescription></FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormMessage>{errors?.root?.serverError?.message}</FormMessage>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && (
            <LucideIcon name="Loader2" className="mr-2 size-4 animate-spin" />
          )}
          <Trans t={t}>Change password</Trans>
        </Button>
      </form>
    </Form>
  )
}

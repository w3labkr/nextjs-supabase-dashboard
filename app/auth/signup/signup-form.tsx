'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'

import { useTranslation } from 'react-i18next'
import { i18nKey } from '@/utils/string'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { toast } from 'sonner'
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
import { SubmitButton } from '@/components/submit-button'

import { createClient } from '@/lib/supabase/client'

const formSchema = z
  .object({
    email: z.string().trim().email(),
    // If the password is larger than 72 chars, it will be truncated to the first 72 chars.
    newPassword: z.string().trim().min(6).max(72),
    confirmNewPassword: z.string().trim().min(6).max(72),
  })
  .refine((val) => val.newPassword === val.confirmNewPassword, {
    path: ['confirmNewPassword'],
    params: { i18n: 'invalid_confirm_password' },
  })

type FormValues = z.infer<typeof formSchema>

const defaultValues: Partial<FormValues> = {
  email: '',
  newPassword: '',
  confirmNewPassword: '',
}

export function SignUpForm() {
  const router = useRouter()
  const { t } = useTranslation(['translation', 'zod', 'zod-custom'])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  async function onSubmit(values: FormValues) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.newPassword,
    })

    if (error) {
      const message = i18nKey(error?.message)

      // in staging, we don't verify primary emails
      // Supabase returns a nice error
      switch (message) {
        case 'user_already_registered':
          form.setError('email', { message: t(message) })
          break
        case 'failed_to_fetch':
          toast.error(t(message))
          break
        default:
          toast.error(error?.message)
          break
      }

      return false
    }

    // in production, we verify primary emails
    // supabase returns a user object with no identities if the user exists
    // if (data?.user?.identities?.length === 0) {
    //   form.setError('email', { message: t('user_already_registered') })
    //   return false
    // }

    toast.success(t('you_have_successfully_registered_as_a_member'))

    if (data?.user) {
      const { error } = await supabase.auth.signOut()
      if (error) {
        toast.error(error?.message)
        return false
      }
    }

    form.reset()

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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('email')}</FormLabel>
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
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('password')}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoCapitalize="none"
                  autoComplete="new-password"
                  autoCorrect="off"
                  placeholder={t('password')}
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
              <FormLabel>{t('confirm_password')}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoCapitalize="none"
                  autoComplete="new-password"
                  autoCorrect="off"
                  placeholder={t('confirm_password')}
                  {...field}
                />
              </FormControl>
              {/* <FormDescription></FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton
          isSubmitting={form?.formState?.isSubmitting}
          text="sign_up"
          translate="yes"
          className="w-full"
        />
      </form>
    </Form>
  )
}

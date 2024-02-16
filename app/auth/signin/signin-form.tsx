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
import { RelatedLink } from '@/components/auth/related-link'

import { createClient } from '@/lib/supabase/client'

const signInFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(72),
})

type SignInFormValues = z.infer<typeof signInFormSchema>

const defaultValues: Partial<SignInFormValues> = {
  email: '',
  password: '',
}

export function SignInForm() {
  const router = useRouter()
  const { t } = useTranslation(['translation', 'zod', 'zod-custom', 'supabase'])

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: defaultValues,
  })
  const { errors, isSubmitting } = form.formState

  async function onSubmit(values: SignInFormValues) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
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

    toast.success(t('You have successfully logged in'))

    router.push('/dashboard/dashboard')
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
              <FormMessage className="font-normal" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>{t('Password')}</FormLabel>
                <RelatedLink
                  href="/auth/forgot-password"
                  className="text-sm"
                  text="Forgot your password?"
                  translate="yes"
                />
              </div>
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
              <FormMessage className="font-normal" />
            </FormItem>
          )}
        />
        <FormMessage>{errors?.root?.serverError?.message}</FormMessage>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && (
            <LucideIcon name="Loader2" className="mr-2 size-4 animate-spin" />
          )}
          <Trans>Sign In</Trans>
        </Button>
      </form>
    </Form>
  )
}

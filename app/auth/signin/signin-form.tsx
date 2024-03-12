'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

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
import { RelatedLink } from '@/components/related-link'

import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'

const formSchema = z.object({
  email: z.string().trim().max(255).email(),
  password: z.string().trim().min(6).max(72),
})

type FormValues = z.infer<typeof formSchema>

const defaultValues: Partial<FormValues> = {
  email: '',
  password: '',
}

export function SignInForm() {
  const router = useRouter()
  const auth = useAuth()
  const { t } = useTranslation()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onSubmit = async (formValues: FormValues) => {
    setIsSubmitting(true)
    try {
      const supabase = createClient()
      const signed = await supabase.auth.signInWithPassword({
        email: formValues.email,
        password: formValues.password,
      })

      if (signed?.error) throw new Error(signed?.error?.message)
      if (!signed?.data?.user) throw new Error('User data is invalid.')

      toast.success(t('FormMessage.you_have_successfully_logged_in'))

      auth.setSession(signed?.data?.session)
      auth.setUser(signed?.data?.user)

      router.replace('/dashboard/dashboard')
      router.refresh()
    } catch (e: unknown) {
      switch ((e as Error)?.message) {
        case 'Invalid login credentials':
          form.setError('email', {
            message: t('FormMessage.invalid_login_credentials'),
          })
          form.setError('password', {
            message: t('FormMessage.invalid_login_credentials'),
          })
          break
        default:
          toast.error((e as Error)?.message)
          break
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('FormLabel.email')}</FormLabel>
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
                <FormLabel>{t('FormLabel.password')}</FormLabel>
                <RelatedLink
                  href="/auth/forgot-password"
                  className="text-sm"
                  text="RelatedLink.forgot_password"
                  translate="yes"
                />
              </div>
              <FormControl>
                <Input
                  type="password"
                  autoCapitalize="none"
                  autoComplete="current-password"
                  autoCorrect="off"
                  placeholder={t('FormLabel.password')}
                  {...field}
                />
              </FormControl>
              {/* <FormDescription></FormDescription> */}
              <FormMessage className="font-normal" />
            </FormItem>
          )}
        />
        <SubmitButton
          isSubmitting={isSubmitting}
          text="SignInForm.submit"
          translate="yes"
          className="w-full"
        />
      </form>
    </Form>
  )
}

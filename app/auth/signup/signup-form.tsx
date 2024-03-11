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

import { SignInWithGoogleUserMetadata } from '@/types/api'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'

const formSchema = z
  .object({
    email: z.string().trim().max(255).email(),
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
      const email = formValues.email
      const username = email.split('@')[0]
      const user_metadata: SignInWithGoogleUserMetadata = {
        avatar_url: null,
        email,
        email_verified: false,
        full_name: username,
        iss: null,
        name: username,
        phone_verified: false,
        picture: null,
        provider_id: null,
        sub: null,
      }

      const supabase = createClient()
      const signedIn = await supabase.auth.signUp({
        email,
        password: formValues.newPassword,
        options: { data: user_metadata },
      })

      if (signedIn?.error) throw new Error(signedIn?.error?.message)
      if (!signedIn?.data?.user) throw new Error('User data is invalid.')

      const signedOut = await supabase.auth.signOut()

      if (signedOut?.error) throw new Error(signedOut?.error?.message)

      auth.setSession(null)
      auth.setUser(null)

      toast.success(
        t('FormMessage.you_have_successfully_registered_as_a_member')
      )

      router.replace('/auth/signin')
      router.refresh()
    } catch (e: unknown) {
      const error = e as Error
      switch (error?.message) {
        case 'User already registered':
          form.setError('email', {
            message: t('FormMessage.user_already_registered'),
          })
          break
        default:
          toast.error(error?.message)
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
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('FormLabel.password')}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoCapitalize="none"
                  autoComplete="new-password"
                  autoCorrect="off"
                  placeholder={t('FormLabel.password')}
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
              <FormLabel>{t('FormLabel.confirm_password')}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoCapitalize="none"
                  autoComplete="new-password"
                  autoCorrect="off"
                  placeholder={t('FormLabel.confirm_password')}
                  {...field}
                />
              </FormControl>
              {/* <FormDescription></FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton
          isSubmitting={isSubmitting}
          text="SignUpForm.submit"
          translate="yes"
          className="w-full"
        />
      </form>
    </Form>
  )
}

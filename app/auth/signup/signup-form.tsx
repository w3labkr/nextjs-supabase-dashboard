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

import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'

const FormSchema = z
  .object({
    email: z.string().nonempty().max(255).email(),
    // If the password is larger than 72 chars, it will be truncated to the first 72 chars.
    newPassword: z.string().nonempty().min(6).max(72),
    confirmNewPassword: z.string().nonempty().min(6).max(72),
  })
  .refine((val) => val.newPassword === val.confirmNewPassword, {
    path: ['confirmNewPassword'],
    params: { i18n: 'invalid_confirm_password' },
  })

type FormValues = z.infer<typeof FormSchema>

const defaultValues: Partial<FormValues> = {
  email: '',
  newPassword: '',
  confirmNewPassword: '',
}

export function SignUpForm() {
  const router = useRouter()
  const { t } = useTranslation()

  const { setSession, setUser } = useAuth()
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    defaultValues,
  })
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onSubmit = async (formValues: FormValues) => {
    try {
      setIsSubmitting(true)

      const supabase = createClient()
      const signed = await supabase.auth.signUp({
        email: formValues?.email,
        password: formValues?.newPassword,
      })
      if (signed?.error) throw new Error(signed?.error?.message)
      if (!signed?.data?.user) throw new Error('User data is invalid.')

      const unsigned = await supabase.auth.signOut()
      if (unsigned?.error) throw new Error(unsigned?.error?.message)

      setSession(null)
      setUser(null)

      toast.success(
        t('FormMessage.you_have_successfully_registered_as_a_member')
      )

      router.replace('/auth/signin')
      router.refresh()
    } catch (e: unknown) {
      console.log(e)
      const err = (e as Error)?.message
      if (err.startsWith('User already registered')) {
        form.setError('email', {
          message: t('FormMessage.user_already_registered'),
        })
      } else {
        toast.error(err)
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

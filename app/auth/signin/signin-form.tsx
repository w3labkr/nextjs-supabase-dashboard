'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'

import { useForm, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { TextLink } from '@/components/text-link'

import { createClient } from '@/supabase/client'
import { useAuth } from '@/hooks/use-auth'

const FormSchema = z.object({
  email: z.string().nonempty().max(255).email(),
  password: z.string().nonempty().min(6).max(72),
})

type FormValues = z.infer<typeof FormSchema>

const defaultValues: Partial<FormValues> = {
  email: '',
  password: '',
}

const SignInForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    defaultValues,
  })

  return (
    <Form {...form}>
      <form method="POST" noValidate className="space-y-4">
        <EmailField form={form} />
        <PasswordField form={form} />
        <SubmitButton form={form} />
      </form>
    </Form>
  )
}

const EmailField = ({ form }: { form: UseFormReturn<FormValues> }) => {
  const { t } = useTranslation()

  return (
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
          <FormMessage className="font-normal" />
        </FormItem>
      )}
    />
  )
}

const PasswordField = ({ form }: { form: UseFormReturn<FormValues> }) => {
  const { t } = useTranslation()

  return (
    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between">
            <FormLabel>{t('FormLabel.password')}</FormLabel>
            <TextLink
              href="/auth/forgot-password"
              className="text-sm underline hover:decoration-muted"
              text="AuthLink.forgot_password"
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
          <FormMessage className="font-normal" />
        </FormItem>
      )}
    />
  )
}

const SubmitButton = ({ form }: { form: UseFormReturn<FormValues> }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useTranslation()
  const { setSession, setUser } = useAuth()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onSubmit = async (formValues: FormValues) => {
    try {
      setIsSubmitting(true)

      const next = (searchParams.get('next') as string) ?? '/dashboard'

      const supabase = createClient()
      const signed = await supabase.auth.signInWithPassword({
        email: formValues?.email,
        password: formValues?.password,
      })
      if (signed?.error) throw new Error(signed?.error?.message)

      setSession(signed?.data?.session)
      setUser(signed?.data?.user)

      toast.success(t('FormMessage.you_have_successfully_logged_in'))

      router.refresh()
      router.replace(next)
    } catch (e: unknown) {
      const err = (e as Error)?.message
      if (err.startsWith('Invalid login credentials')) {
        form.setError('email', {
          message: t('FormMessage.invalid_login_credentials'),
        })
        form.setError('password', {
          message: t('FormMessage.invalid_login_credentials'),
        })
      } else {
        toast.error(err)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Button
      type="submit"
      onClick={form.handleSubmit(onSubmit)}
      disabled={isSubmitting}
      className="w-full"
    >
      {t('FormSubmit.signin')}
    </Button>
  )
}

export { SignInForm }

'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
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

import { createClient } from '@/supabase/client'
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

const SignUpForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    defaultValues,
  })

  return (
    <Form {...form}>
      <form method="POST" noValidate className="space-y-4">
        <EmailField form={form} />
        <NewPasswordField form={form} />
        <ConfirmNewPasswordField form={form} />
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
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const NewPasswordField = ({ form }: { form: UseFormReturn<FormValues> }) => {
  const { t } = useTranslation()

  return (
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
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const ConfirmNewPasswordField = ({
  form,
}: {
  form: UseFormReturn<FormValues>
}) => {
  const { t } = useTranslation()

  return (
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
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const SubmitButton = ({ form }: { form: UseFormReturn<FormValues> }) => {
  const router = useRouter()
  const { t } = useTranslation()
  const { setSession, setUser } = useAuth()

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

      const unsigned = await supabase.auth.signOut()
      if (unsigned?.error) throw new Error(unsigned?.error?.message)

      setSession(null)
      setUser(null)

      toast.success(
        t('FormMessage.you_have_successfully_registered_as_a_member')
      )

      router.refresh()
      router.replace('/auth/signin')
    } catch (e: unknown) {
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
    <Button
      type="submit"
      onClick={form.handleSubmit(onSubmit)}
      disabled={isSubmitting}
      className="w-full"
    >
      {t('FormSubmit.signup')}
    </Button>
  )
}

export { SignUpForm }

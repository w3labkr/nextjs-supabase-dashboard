'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

import { useForm, useFormContext } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { toast } from 'sonner'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { useSWRConfig } from 'swr'
import { createClient } from '@/supabase/client'
import { User } from '@/types/database'
import { useUserAPI } from '@/queries/client/users'

const FormSchema = z
  .object({
    // If the password is larger than 72 chars, it will be truncated to the first 72 chars.
    oldPassword: z.string().nonempty().min(6).max(72).optional(),
    newPassword: z.string().nonempty().min(6).max(72),
    confirmNewPassword: z.string().nonempty().min(6).max(72),
  })
  .refine((val) => val.newPassword === val.confirmNewPassword, {
    path: ['confirmNewPassword'],
    params: { i18n: 'invalid_confirm_password' },
  })

type FormValues = z.infer<typeof FormSchema>

const defaultValues: Partial<FormValues> = {
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: '',
}

interface ChangePasswordFormProps {
  user: User
}

const ChangePasswordForm = ({ user }: ChangePasswordFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    defaultValues,
    shouldUnregister: true,
  })
  const { register, unregister } = form
  const has_set_password = user?.has_set_password

  React.useEffect(() => {
    has_set_password ? register('oldPassword') : unregister('oldPassword')
  }, [register, unregister, has_set_password])

  return (
    <Form {...form}>
      <form method="POST" noValidate className="space-y-4">
        {has_set_password ? <OldPasswordField /> : null}
        <NewPasswordField />
        <ConfirmNewPasswordField />
        <SubmitButton />
      </form>
    </Form>
  )
}

const OldPasswordField = () => {
  const { t } = useTranslation()
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name="oldPassword"
      render={({ field }) => (
        <FormItem className="max-w-80">
          <FormLabel>{t('old_password')}</FormLabel>
          <FormControl>
            <Input
              type="password"
              autoCapitalize="none"
              autoComplete="current-password"
              autoCorrect="off"
              placeholder={t('old_password')}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const NewPasswordField = () => {
  const { t } = useTranslation()
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name="newPassword"
      render={({ field }) => (
        <FormItem className="max-w-80">
          <FormLabel>{t('new_password')}</FormLabel>
          <FormControl>
            <Input
              type="password"
              autoCapitalize="none"
              autoComplete="new-password"
              autoCorrect="off"
              placeholder={t('new_password')}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const ConfirmNewPasswordField = () => {
  const { t } = useTranslation()
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name="confirmNewPassword"
      render={({ field }) => (
        <FormItem className="max-w-80">
          <FormLabel>{t('confirm_new_password')}</FormLabel>
          <FormControl>
            <Input
              type="password"
              autoCapitalize="none"
              autoComplete="new-password"
              autoCorrect="off"
              placeholder={t('confirm_new_password')}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const SubmitButton = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { handleSubmit, reset, setError, getValues } = useFormContext()
  const { user } = useUserAPI()
  const { mutate } = useSWRConfig()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onSubmit = async () => {
    try {
      setIsSubmitting(true)

      if (!user) throw new Error('Require is not defined.')

      const formValues = getValues()
      const supabase = createClient()

      if (user?.has_set_password) {
        if (!formValues?.oldPassword) throw new Error('Require is not defined.')
        const verified = await supabase.rpc('verify_user_password', {
          userid: user?.id,
          password: formValues?.oldPassword,
        })
        if (verified?.error) throw new Error(verified?.error?.message)
        if (verified?.data === false) {
          throw new Error('Old password does not match.')
        }
      }

      const updated = await supabase.auth.updateUser({
        password: formValues?.newPassword,
      })
      if (updated?.error) throw new Error(updated?.error?.message)

      mutate(`/api/v1/user?id=${user?.id}`)

      reset()
      router.refresh()

      toast.success(t('changed_successfully'))
    } catch (e: unknown) {
      const err = (e as Error)?.message
      if (err.startsWith('Old password does not match')) {
        setError('oldPassword', {
          message: t('old_password_does_not_match'),
        })
      } else if (
        err.startsWith('New password should be different from the old password')
      ) {
        setError('newPassword', {
          message: t('new_password_should_be_different_from_the_old_password'),
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
      onClick={handleSubmit(onSubmit)}
      disabled={isSubmitting}
    >
      {t('change_password')}
    </Button>
  )
}

export { ChangePasswordForm, type ChangePasswordFormProps }

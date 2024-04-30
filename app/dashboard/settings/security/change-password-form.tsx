'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

import { useForm } from 'react-hook-form'
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
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { useUserAPI } from '@/queries/sync'

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

export function ChangePasswordForm() {
  const router = useRouter()
  const { t } = useTranslation()

  const { session } = useAuth()
  const { user } = useUserAPI(session?.user?.id ?? null)
  const { mutate } = useSWRConfig()

  const hasSetPassword = user?.user?.has_set_password ?? false

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    defaultValues,
    shouldUnregister: true,
  })
  const { register, unregister } = form
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  React.useEffect(() => {
    hasSetPassword ? register('oldPassword') : unregister('oldPassword')
  }, [register, unregister, hasSetPassword])

  const onSubmit = async (formValues: FormValues) => {
    try {
      setIsSubmitting(true)

      const supabase = createClient()
      const uid = user?.id

      if (!uid) throw new Error('Require is not defined.')

      if (hasSetPassword) {
        if (!formValues?.oldPassword) throw new Error('Require is not defined.')
        const verified = await supabase.rpc('verify_user_password', {
          uid,
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

      mutate(`/api/v1/user?id=${uid}`)

      form.reset()
      router.refresh()

      toast.success(t('FormMessage.changed_successfully'))
    } catch (e: unknown) {
      const err = (e as Error)?.message
      if (err.startsWith('Old password does not match')) {
        form.setError('oldPassword', {
          message: t('FormMessage.old_password_does_not_match'),
        })
      } else if (
        err.startsWith('New password should be different from the old password')
      ) {
        form.setError('newPassword', {
          message: t(
            'FormMessage.new_password_should_be_different_from_the_old_password'
          ),
        })
      } else {
        toast.error(err)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) return <div>Loading...</div>

  return (
    <Form {...form}>
      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        {hasSetPassword ? (
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem className="max-w-80">
                <FormLabel>{t('FormLabel.old_password')}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoCapitalize="none"
                    autoComplete="current-password"
                    autoCorrect="off"
                    placeholder={t('FormLabel.old_password')}
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription></FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem className="max-w-80">
              <FormLabel>{t('FormLabel.new_password')}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoCapitalize="none"
                  autoComplete="new-password"
                  autoCorrect="off"
                  placeholder={t('FormLabel.new_password')}
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
            <FormItem className="max-w-80">
              <FormLabel>{t('FormLabel.confirm_new_password')}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoCapitalize="none"
                  autoComplete="new-password"
                  autoCorrect="off"
                  placeholder={t('FormLabel.confirm_new_password')}
                  {...field}
                />
              </FormControl>
              {/* <FormDescription></FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isSubmitting}>
          {t('FormSubmit.change_password')}
        </Button>
      </form>
    </Form>
  )
}

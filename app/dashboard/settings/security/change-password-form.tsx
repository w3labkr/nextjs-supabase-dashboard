'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'
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
import { SubmitButton } from '@/components/submit-button'
import { Title } from '@/components/title'
import { Description } from '@/components/description'

import { useSWRConfig } from 'swr'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { useAccount } from '@/hooks/api/use-account'

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

export function ChangePasswordForm({ user }: { user: User | null }) {
  const { t } = useTranslation()

  const { mutate } = useSWRConfig()
  const { account } = useAccount(user?.id ?? null)

  const hasSetPassword = React.useMemo(
    () => account?.has_set_password,
    [account?.has_set_password]
  )

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    shouldUnregister: true,
    defaultValues,
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

      if (hasSetPassword) {
        const verified = await supabase.rpc('verify_user_password', {
          password: formValues?.oldPassword as string,
        })
        if (verified?.error) throw new Error(verified?.error?.message)
        if (verified?.data === false) {
          throw new Error('Old password does not match.')
        }
      }

      const updated = await supabase.auth.updateUser({
        password: formValues?.newPassword as string,
      })

      if (updated?.error) throw new Error(updated?.error?.message)

      mutate(`/api/v1/account/${user?.id}`)

      form.reset()
      toast.success(t('FormMessage.password_has_been_successfully_changed'))
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

  return (
    <div className="space-y-4">
      <Title text="ChangePasswordForm.title" translate="yes" />
      <Separator />
      <Description text="ChangePasswordForm.description" translate="yes" />
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
          <SubmitButton
            isSubmitting={isSubmitting}
            text="ChangePasswordForm.submit"
            translate="yes"
          />
        </form>
      </Form>
    </div>
  )
}

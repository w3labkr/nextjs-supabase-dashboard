'use client'

import * as React from 'react'
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
import { fetcher } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { useProfileAPI } from '@/hooks/api'
import { ProfileAPI } from '@/types/api'

const FormSchema = z.object({
  username: z.string().nonempty().min(2).max(30),
})

type FormValues = z.infer<typeof FormSchema>

export function ChangeUsernameForm() {
  const { t } = useTranslation()

  const { user } = useAuth()
  const { profile } = useProfileAPI(user?.id ?? null)
  const { mutate } = useSWRConfig()

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    values: {
      username: profile?.username ?? '',
    },
  })

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onSubmit = async (formValues: FormValues) => {
    if (formValues?.username === profile?.username) {
      toast(t('FormMessage.nothing_has_changed'))
      return false
    }

    try {
      setIsSubmitting(true)

      if (!user?.id) throw new Error('Require is not defined.')

      const result = await fetcher<ProfileAPI>(
        `/api/v1/profile?id=${user?.id}`,
        {
          method: 'POST',
          body: JSON.stringify(formValues),
        }
      )

      if (result?.error) throw new Error(result?.error?.message)

      mutate(`/api/v1/profile?id=${user?.id}`)

      toast.success(t('FormMessage.changed_successfully'))
    } catch (e: unknown) {
      const err = (e as Error)?.message
      if (err.startsWith('duplicate key value violates unique constraint')) {
        form.setError('username', {
          message: t('FormMessage.duplicate_username'),
        })
      } else if (err.startsWith('You can change it after')) {
        const count = err?.replace(/[^0-9]/g, '') ?? '0'
        toast.error(
          t('FormMessage.you_can_change_it_in_a_few_days', { count: +count })
        )
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
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('FormLabel.username')}</FormLabel>
              <FormControl className="max-w-60">
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormDescription>
                {t('FormMessage.you_can_change_it_only_once_every_few_days', {
                  count: 30,
                })}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isSubmitting}>
          {t('FormSubmit.change_username')}
        </Button>
      </form>
    </Form>
  )
}

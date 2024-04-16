'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { fetcher } from '@/lib/utils'
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
import { SubmitButton } from '@/components/submit-button'

import useSWRMutation from 'swr/mutation'
import { useAuth } from '@/hooks/use-auth'
import { useProfile } from '@/hooks/api'

const FormSchema = z.object({
  username: z.string().nonempty().min(2).max(30),
})

type FormValues = z.infer<typeof FormSchema>

async function sendRequest(url: string, { arg }: { arg: FormValues }) {
  return await fetcher(url, {
    method: 'POST',
    body: JSON.stringify(arg),
  })
}

export function ChangeUsernameForm() {
  const { t } = useTranslation()

  const { session } = useAuth()
  const { profile } = useProfile(session?.user?.id ?? null)
  const { trigger } = useSWRMutation(
    profile?.id ? `/api/v1/profile/${profile?.id}` : null,
    sendRequest
  )

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

      if (!profile?.username) throw new Error('Require is not defined.')

      const result = await trigger(formValues)
      if (result?.error) throw new Error(result?.error?.message)

      toast.success(t('FormMessage.changed_successfully'))
    } catch (e: unknown) {
      const err = (e as Error)?.message
      if (err.startsWith('duplicate key value violates unique constraint')) {
        form.setError('username', {
          message: t('FormMessage.username_already_registered'),
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
        <SubmitButton
          isSubmitting={isSubmitting}
          text="FormSubmit.change_username"
          translate="yes"
        />
      </form>
    </Form>
  )
}

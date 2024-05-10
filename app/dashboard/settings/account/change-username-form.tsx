'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { useForm, UseFormReturn } from 'react-hook-form'
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
import { fetcher, getUserPath } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { useProfileAPI } from '@/queries/client'
import { ProfileAPI } from '@/types/api'

const FormSchema = z.object({
  username: z.string().nonempty().min(2).max(30),
})

type FormValues = z.infer<typeof FormSchema>

const ChangeUsernameForm = () => {
  const { user } = useAuth()
  const { profile } = useProfileAPI(user?.id ?? null)

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    values: {
      username: profile?.username ?? '',
    },
  })

  return (
    <Form {...form}>
      <form method="POST" noValidate className="space-y-4">
        <UsernameField form={form} />
        <SubmitButton form={form} />
      </form>
    </Form>
  )
}

interface FormFieldProps {
  form: UseFormReturn<FormValues>
}

const UsernameField = (props: FormFieldProps) => {
  const { form } = props
  const { t } = useTranslation()

  return (
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
  )
}

const SubmitButton = (props: FormFieldProps) => {
  const { form } = props
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const { t } = useTranslation()
  const { user } = useAuth()
  const { profile } = useProfileAPI(user?.id ?? null)
  const { mutate } = useSWRConfig()

  const onSubmit = async (formValues: FormValues) => {
    try {
      setIsSubmitting(true)

      if (!user) throw new Error('Require is not defined.')
      if (!profile) throw new Error('Require is not defined.')
      if (formValues?.username === profile?.username) {
        throw new Error('Nothing has changed.')
      }

      const fetchUrl = `/api/v1/profile?id=${user?.id}`
      const result = await fetcher<ProfileAPI>(fetchUrl, {
        method: 'POST',
        body: JSON.stringify({
          formData: { username: formValues?.username },
          options: { revalidatePaths: getUserPath(profile?.username) },
        }),
      })

      if (result?.error) throw new Error(result?.error?.message)

      mutate(fetchUrl)

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
      } else if (err.startsWith('Nothing has changed')) {
        toast(t('FormMessage.nothing_has_changed'))
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
    >
      {t('FormSubmit.change_username')}
    </Button>
  )
}

export { ChangeUsernameForm }

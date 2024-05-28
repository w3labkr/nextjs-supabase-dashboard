'use client'

import * as React from 'react'
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
import { fetcher, getUserPath } from '@/lib/utils'
import { useUserAPI } from '@/queries/client/users'
import { UserAPI } from '@/types/api'

const FormSchema = z.object({
  username: z.string().nonempty().min(2).max(30),
})

type FormValues = z.infer<typeof FormSchema>

const ChangeUsernameForm = () => {
  const { user } = useUserAPI()

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    values: {
      username: user?.username ?? '',
    },
  })

  return (
    <Form {...form}>
      <form method="POST" noValidate className="space-y-4">
        <UsernameField />
        <SubmitButton />
      </form>
    </Form>
  )
}

const UsernameField = () => {
  const { t } = useTranslation()
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
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

const SubmitButton = () => {
  const { t } = useTranslation()
  const { handleSubmit, setError, getValues } = useFormContext()
  const { user } = useUserAPI()
  const { mutate } = useSWRConfig()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onSubmit = async () => {
    try {
      setIsSubmitting(true)

      const formValues = getValues()
      const username = user?.username

      if (!user) throw new Error('Require is not defined.')
      if (!username) throw new Error('Require is not defined.')
      if (formValues?.username === username) {
        throw new Error('Nothing has changed.')
      }

      const fetchUrl = `/api/v1/user?id=${user?.id}`
      const result = await fetcher<UserAPI>(fetchUrl, {
        method: 'POST',
        body: JSON.stringify({
          data: { username: formValues?.username },
          options: { revalidatePaths: getUserPath(username) },
        }),
      })

      if (result?.error) throw new Error(result?.error?.message)

      mutate(fetchUrl)

      toast.success(t('FormMessage.changed_successfully'))
    } catch (e: unknown) {
      const err = (e as Error)?.message
      if (err.startsWith('duplicate key value violates unique constraint')) {
        setError('username', {
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
      onClick={handleSubmit(onSubmit)}
      disabled={isSubmitting}
    >
      {t('FormSubmit.change_username')}
    </Button>
  )
}

export { ChangeUsernameForm }

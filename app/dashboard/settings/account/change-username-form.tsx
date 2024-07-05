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
import { fetcher, getFavoritesPath, getProfilePath } from '@/lib/utils'
import { slugify } from '@/lib/slugify'
import { useUserAPI } from '@/queries/client/users'
import { UserAPI } from '@/types/api'

const FormSchema = z.object({
  username: z
    .string()
    .nonempty()
    .min(2)
    .max(30)
    .refine((val: string) => !/[^A-Za-z0-9-_]/g.test(val), {
      params: { i18n: 'invalid_username' },
    }),
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
          <FormLabel>{t('username')}</FormLabel>
          <FormControl className="max-w-60">
            <Input placeholder="Username" {...field} />
          </FormControl>
          <FormDescription>
            {t('you_can_change_it_only_once_every_%d_days', { count: 30 })}
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

      if (!user) throw new Error('Require is not defined.')
      if (formValues?.username === user?.username) {
        throw new Error('Nothing has changed.')
      }

      const revalidatePaths = [getProfilePath(user), getFavoritesPath(user)]

      const result = await fetcher<UserAPI>(`/api/v1/user?id=${user?.id}`, {
        method: 'POST',
        body: JSON.stringify({
          data: { username: slugify(formValues?.username) },
          options: { revalidatePaths },
        }),
      })

      if (result?.error) throw new Error(result?.error?.message)

      mutate(`/api/v1/user?id=${user?.id}`)

      toast.success(t('changed_successfully'))
    } catch (e: unknown) {
      const err = (e as Error)?.message
      if (err.startsWith('duplicate key value violates unique constraint')) {
        setError('username', {
          message: t('duplicate_username'),
        })
      } else if (err.startsWith('You can change it after')) {
        const count = err?.replace(/[^0-9]/g, '') ?? '0'
        toast.error(t('you_can_change_it_after_%d_days', { count: +count }))
      } else if (err.startsWith('Nothing has changed')) {
        toast(t('nothing_has_changed'))
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
      {t('change_username')}
    </Button>
  )
}

export { ChangeUsernameForm }

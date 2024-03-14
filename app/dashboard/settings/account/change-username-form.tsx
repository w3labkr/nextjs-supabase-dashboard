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

import useSWRMutation from 'swr/mutation'
import { User } from '@supabase/supabase-js'
import { fetcher } from '@/lib/utils'
import { useAccount } from '@/hooks/api/use-account'

const FormSchema = z.object({
  username: z.string().nonempty().min(2).max(30),
})

type FormValues = z.infer<typeof FormSchema>

async function updateAccount(url: string, { arg }: { arg: FormValues }) {
  return await fetcher(url, {
    method: 'POST',
    body: JSON.stringify(arg),
  })
}

export function ChangeUsernameForm({ user }: { user: User }) {
  const { t } = useTranslation()

  const fetchAccount = useAccount(user?.id ?? null)
  const { data: account } = fetchAccount

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    values: {
      username: account?.username ?? '',
    },
  })
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const { trigger } = useSWRMutation(
    user?.id ? `/api/v1/account/${user?.id}` : null,
    updateAccount
  )

  const onSubmit = async (formValues: FormValues) => {
    try {
      setIsSubmitting(true)
      if (account?.username === formValues?.username) {
        throw new Error('Nothing has changed.')
      }
      const response = await trigger(formValues)
      if (response?.error) throw new Error(response?.error?.message)
      toast.success(t('FormMessage.username_has_been_successfully_changed'))
    } catch (e: unknown) {
      switch ((e as Error)?.message) {
        case 'duplicate key value violates unique constraint "profiles_username_key"':
          form.setError('username', {
            message: t('FormMessage.username_already_registered'),
          })
          break
        default:
          toast.error((e as Error)?.message)
          break
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (fetchAccount?.isLoading) return null

  return (
    <div className="space-y-4">
      <Title text="ChangeUsernameForm.title" translate="yes" />
      <Separator />
      <Description text="ChangeUsernameForm.description" translate="yes" />
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
                {/* <FormDescription></FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <SubmitButton
            isSubmitting={isSubmitting}
            text="ChangeUsernameForm.submit"
            translate="yes"
          />
        </form>
      </Form>
    </div>
  )
}

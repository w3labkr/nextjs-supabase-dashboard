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
import { fetcher } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { useUser } from '@/hooks/sync/use-user'

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

  const { user: _user } = useAuth()
  const { user } = useUser(_user?.id ?? null)
  const { trigger } = useSWRMutation(
    user?.id ? `/api/v1/user/${user?.id}` : null,
    sendRequest
  )

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    values: {
      username: user?.user?.username ?? '',
    },
  })

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onSubmit = async (formValues: FormValues) => {
    if (formValues?.username === user?.user?.username) {
      toast(t('FormMessage.nothing_has_changed'))
      return false
    }

    try {
      setIsSubmitting(true)

      const result = await trigger(formValues)
      if (result?.error) throw new Error(result?.error?.message)

      toast.success(t('FormMessage.username_has_been_successfully_changed'))
    } catch (e: unknown) {
      const err = (e as Error)?.message
      if (err.startsWith('duplicate key value violates unique constraint')) {
        form.setError('username', {
          message: t('FormMessage.username_already_registered'),
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

'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { useForm, useFormContext } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { useSWRConfig } from 'swr'
import { fetcher } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { useEmailsAPI } from '@/queries/client/emails'
import { EmailsAPI } from '@/types/api'

const FormSchema = z.object({
  email: z.string().nonempty().max(255).email(),
})

type FormValues = z.infer<typeof FormSchema>

const defaultValues: Partial<FormValues> = {
  email: '',
}

const AddEmail = () => {
  const { t } = useTranslation()
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    defaultValues,
  })

  return (
    <div className="space-y-2">
      <div>
        <span className="text-sm font-semibold">{t('AddEmail.title')}</span>
        {/* <p className="text-xs">{t('AddEmail.description')}</p> */}
      </div>
      <Form {...form}>
        <form
          method="POST"
          noValidate
          className="flex w-full max-w-sm space-x-2"
        >
          <EmailField />
          <SubmitButton />
        </form>
      </Form>
    </div>
  )
}

const EmailField = () => {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormControl className="w-[180px]">
            <Input
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              placeholder="name@example.com"
              {...field}
            />
          </FormControl>
          <FormMessage className="font-normal" />
        </FormItem>
      )}
    />
  )
}

const SubmitButton = () => {
  const { t } = useTranslation()
  const { handleSubmit, reset, getValues } = useFormContext()
  const { user } = useAuth()
  const { emails } = useEmailsAPI(user?.id ?? null)
  const { mutate } = useSWRConfig()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onSubmit = async () => {
    try {
      setIsSubmitting(true)

      const formValues = getValues()

      if (emails?.find((value) => value?.email === formValues?.email)) {
        throw new Error('This email has already been added.')
      }

      if (!user) throw new Error('Require is not defined.')

      const fetchUrl = `/api/v1/email?userId=${user?.id}`
      const result = await fetcher<EmailsAPI>(fetchUrl, {
        method: 'PUT',
        body: JSON.stringify({
          data: { email: formValues?.email },
        }),
      })

      if (result?.error) throw new Error(result?.error?.message)

      mutate(`/api/v1/email/list?userId=${user?.id}`)

      const sendUrl = `/api/v1/email/verify?userId=${user?.id}`
      const sent = await fetcher(sendUrl, {
        method: 'POST',
        body: JSON.stringify({
          data: { email: formValues?.email },
        }),
      })

      if (sent?.error) throw new Error(sent?.error?.message)

      mutate(sendUrl)

      reset()

      toast.success(t('FormMessage.added_successfully'))
    } catch (e: unknown) {
      const err = (e as Error)?.message
      if (err.startsWith('This email has already been added')) {
        toast(t('FormMessage.email_has_already_been_added'))
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
      {t('FormSubmit.add')}
    </Button>
  )
}

export { AddEmail }

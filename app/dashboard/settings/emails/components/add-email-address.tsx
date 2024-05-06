'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { useForm, UseFormReturn } from 'react-hook-form'
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
import { useEmailsAPI } from '@/queries/sync'
import { EmailsAPI } from '@/types/api'

const FormSchema = z.object({
  email: z.string().nonempty().max(255).email(),
})

type FormValues = z.infer<typeof FormSchema>

const defaultValues: Partial<FormValues> = {
  email: '',
}

const AddEmailAddress = () => {
  const { t } = useTranslation()
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    defaultValues,
  })

  return (
    <div className="space-y-2">
      <div>
        <span className="text-sm font-semibold">
          {t('AddEmailAddress.title')}
        </span>
        {/* <p className="text-xs">{t('AddEmailAddress.description')}</p> */}
      </div>
      <Form {...form}>
        <form
          method="POST"
          noValidate
          className="flex w-full max-w-sm space-x-2"
        >
          <EmailField form={form} />
          <SubmitButton form={form} />
        </form>
      </Form>
    </div>
  )
}

interface FormFieldProps {
  form: UseFormReturn<FormValues>
}

const EmailField = (props: FormFieldProps) => {
  const { form } = props

  return (
    <FormField
      control={form.control}
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

const SubmitButton = (props: FormFieldProps) => {
  const { form } = props
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const { t } = useTranslation()
  const { user } = useAuth()
  const { emails } = useEmailsAPI(user?.id ?? null)
  const { mutate } = useSWRConfig()

  const onSubmit = async (formValues: FormValues) => {
    if (emails?.find((value) => value?.email === formValues?.email)) {
      toast(t('FormMessage.email_has_already_been_added'))
      return false
    }

    try {
      setIsSubmitting(true)

      if (!user) throw new Error('Require is not defined.')

      const result = await fetcher<EmailsAPI>(`/api/v1/email?uid=${user?.id}`, {
        method: 'PUT',
        body: JSON.stringify({ formData: { email: formValues?.email } }),
      })

      if (result?.error) throw new Error(result?.error?.message)

      mutate(`/api/v1/email/list?uid=${user?.id}`)

      const sentUrl = `/api/v1/email/verify?uid=${user?.id}`
      const sent = await fetcher(sentUrl, {
        method: 'POST',
        body: JSON.stringify({ formData: { email: formValues?.email } }),
      })

      if (sent?.error) throw new Error(sent?.error?.message)

      mutate(sentUrl)

      form.reset()

      toast.success(t('FormMessage.added_successfully'))
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
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
      {t('FormSubmit.add')}
    </Button>
  )
}

export { AddEmailAddress }

'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

import { useSWRConfig } from 'swr'
import { fetcher } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { useEmailsAPI } from '@/queries/sync'
import { EmailAPI } from '@/types/api'
import { Email } from '@/types/database'

const FormSchema = z.object({
  email: z.string().max(255),
})

type FormValues = z.infer<typeof FormSchema>

export function PrimaryEmailAddress() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { emails } = useEmailsAPI(user?.id ?? null)

  const primaryEmail = React.useMemo(() => {
    return (
      emails?.find((x) => x.email === user?.email && x.email_confirmed_at) ??
      null
    )
  }, [emails, user?.email])

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    values: { email: primaryEmail?.email ?? 'unassigned' },
  })

  return (
    <div className="space-y-2">
      <div>
        <span className="text-sm font-semibold">
          {t('PrimaryEmailAddress.title')}
        </span>
        <p className="text-xs">{t('PrimaryEmailAddress.description')}</p>
      </div>
      <Form {...form}>
        <form
          method="POST"
          noValidate
          className="flex w-full max-w-sm space-x-2"
        >
          <EmailField form={form} primaryEmail={primaryEmail} />
          <SubmitButton form={form} />
        </form>
      </Form>
    </div>
  )
}

function EmailField({
  form,
  primaryEmail,
}: {
  form: UseFormReturn<FormValues>
  primaryEmail: Email | null
}) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { emails } = useEmailsAPI(user?.id ?? null)

  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          {/* <FormLabel></FormLabel> */}
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  placeholder={t(
                    'SelectValue.select_a_verified_email_to_display'
                  )}
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                {!primaryEmail ? (
                  <SelectItem value="unassigned">
                    {t('SelectValue.select_a_verified_email_to_display')}
                  </SelectItem>
                ) : null}
                {emails?.map(({ id, email, email_confirmed_at }) => {
                  return email_confirmed_at ? (
                    <SelectItem key={id} value={email ?? ''}>
                      {email}
                    </SelectItem>
                  ) : null
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
          {/* <FormDescription></FormDescription> */}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function SubmitButton({ form }: { form: UseFormReturn<FormValues> }) {
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const router = useRouter()
  const { t } = useTranslation()
  const { user } = useAuth()
  const { mutate } = useSWRConfig()

  const onSubmit = async (formValues: FormValues) => {
    try {
      setIsSubmitting(true)

      if (!user) throw new Error('Require is not defined.')
      if (formValues?.email === user?.email) {
        throw new Error('Nothing has changed.')
      }

      const fetchUrl = `/api/v1/email?uid=${user?.id}`
      const result = await fetcher<EmailAPI>(fetchUrl, {
        method: 'POST',
        body: JSON.stringify({ formData: { email: formValues?.email } }),
      })

      if (result?.error) throw new Error(result?.error?.message)

      mutate(fetchUrl)

      toast.success(t('FormMessage.changed_successfully'))

      router.refresh()
    } catch (e: unknown) {
      const err = (e as Error)?.message
      if (err.startsWith('Nothing has changed')) {
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
      {t('FormSubmit.save')}
    </Button>
  )
}

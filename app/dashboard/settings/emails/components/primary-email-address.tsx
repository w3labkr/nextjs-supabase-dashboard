'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { cn, fetcher } from '@/lib/utils'
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
import { useAuth } from '@/hooks/use-auth'
import { useEmailsAPI } from '@/queries/sync'
import { EmailAPI } from '@/types/api'

const FormSchema = z.object({
  email: z.string().max(255),
})

type FormValues = z.infer<typeof FormSchema>

export function PrimaryEmailAddress() {
  const router = useRouter()
  const { t } = useTranslation()

  const { user } = useAuth()
  const { emails } = useEmailsAPI(user?.id ?? null)
  const { mutate } = useSWRConfig()

  const primaryEmail = React.useMemo(
    () => emails?.find((x) => x.email === user?.email && x.email_confirmed_at),
    [emails, user?.email]
  )

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    values: { email: primaryEmail?.email ?? 'unassigned' },
  })
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onSubmit = async (formValues: FormValues) => {
    if (formValues?.email === user?.email) {
      toast(t('FormMessage.nothing_has_changed'))
      return false
    }

    try {
      setIsSubmitting(true)

      const uid = user?.id

      if (!uid) throw new Error('Require is not defined.')

      const fetchUrl = `/api/v1/email?uid=${uid}`
      const result = await fetcher<EmailAPI>(fetchUrl, {
        method: 'POST',
        body: JSON.stringify({ formData: formValues }),
      })

      if (result?.error) throw new Error(result?.error?.message)

      mutate(fetchUrl)

      toast.success(t('FormMessage.changed_successfully'))

      router.refresh()
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

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
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="flex w-full max-w-sm space-x-2"
        >
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
          <Button disabled={isSubmitting}>{t('FormSubmit.save')}</Button>
        </form>
      </Form>
    </div>
  )
}

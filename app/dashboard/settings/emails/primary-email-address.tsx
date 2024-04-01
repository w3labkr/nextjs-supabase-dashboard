'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

import { useForm } from 'react-hook-form'
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
import { SubmitButton } from '@/components/submit-button'

import { fetcher } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { useEmails } from '@/hooks/sync/use-emails'

const FormSchema = z.object({
  email: z.string().max(255),
})

type FormValues = z.infer<typeof FormSchema>

export function PrimaryEmailAddress() {
  const router = useRouter()
  const { t } = useTranslation()

  const { user } = useAuth()
  const { emails } = useEmails(user?.id ?? null)
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

      const result = await fetcher(`/api/v1/email/${user?.id}`, {
        method: 'POST',
        body: JSON.stringify(formValues),
      })

      if (result?.error) throw new Error(result?.error?.message)

      toast.success(t('FormMessage.email_has_been_successfully_changed'))
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
          <SubmitButton
            isSubmitting={isSubmitting}
            text="FormSubmit.save"
            translate="yes"
          />
        </form>
      </Form>
    </div>
  )
}

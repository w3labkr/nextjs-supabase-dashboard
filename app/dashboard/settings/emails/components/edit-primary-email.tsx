'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
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
import { useEmailsAPI } from '@/queries/client/emails'
import { type EmailAPI } from '@/types/api'

const FormSchema = z.object({
  email: z.string().max(255),
})

type FormValues = z.infer<typeof FormSchema>

const EditPrimaryEmail = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { emails } = useEmailsAPI(user?.id ?? null)

  const primary = React.useMemo(() => {
    return (
      emails?.find((x) => x.email === user?.email && x.email_confirmed_at) ??
      null
    )
  }, [emails, user?.email])

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    values: { email: primary?.email ?? 'unassigned' },
  })

  return (
    <div className="space-y-2">
      <div>
        <span className="text-sm font-semibold">
          {t('primary_email_address')}
        </span>
        <p className="text-xs">
          {t(
            'your_primary_email_address_may_be_used_to_receive_account_related_notifications_and_reset_your_password'
          )}
        </p>
      </div>
      <Form {...form}>
        <form
          method="POST"
          noValidate
          className="flex w-full max-w-sm space-x-2"
        >
          <EmailField hasPrimary={!!primary} />
          <SubmitButton />
        </form>
      </Form>
    </div>
  )
}

const EmailField = ({ hasPrimary }: { hasPrimary: boolean }) => {
  const { t } = useTranslation()
  const { control } = useFormContext()
  const { user } = useAuth()
  const { emails } = useEmailsAPI(user?.id ?? null)

  return (
    <FormField
      control={control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  placeholder={t('select_a_verified_email_to_display')}
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                {!hasPrimary ? (
                  <SelectItem value="unassigned">
                    {t('select_a_verified_email_to_display')}
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
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const SubmitButton = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { handleSubmit, getValues } = useFormContext()
  const { user } = useAuth()
  const { mutate } = useSWRConfig()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onSubmit = async () => {
    try {
      setIsSubmitting(true)

      const formValues = getValues()

      if (!user) throw new Error('Require is not defined.')
      if (
        formValues?.email === user?.email ||
        formValues?.email === 'unassigned'
      ) {
        throw new Error('Nothing has changed.')
      }

      const result = await fetcher<EmailAPI>(
        `/api/v1/email?userId=${user?.id}`,
        {
          method: 'POST',
          body: JSON.stringify({
            data: { email: formValues?.email },
          }),
        }
      )

      if (result?.error) throw new Error(result?.error?.message)

      mutate(`/api/v1/email?userId=${user?.id}`)

      toast.success(t('changed_successfully'))

      router.refresh()
    } catch (e: unknown) {
      const err = (e as Error)?.message
      if (err.startsWith('Nothing has changed')) {
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
      {t('save')}
    </Button>
  )
}

export { EditPrimaryEmail }

'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { languageItems } from '@/i18next.config'

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
import { Separator } from '@/components/ui/separator'
import { Title } from '@/components/title'
import { Description } from '@/components/description'

import useSWRMutation from 'swr/mutation'
import { fetcher } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { useAppearance } from '@/hooks/sync/use-appearance'

import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks'
import { setResolvedLanguage } from '@/store/features/i18n-slice'

const FormSchema = z.object({
  language: z.string(),
})

type FormValues = z.infer<typeof FormSchema>

async function sendRequest(url: string, { arg }: { arg: FormValues }) {
  return await fetcher(url, {
    method: 'POST',
    body: JSON.stringify(arg),
  })
}

export function ChangeLanguageForm() {
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const resolvedLanguage = useAppSelector(
    (state) => state?.i18n?.resolvedLanguage
  )

  const { user } = useAuth()
  const { appearance } = useAppearance(user?.id ?? null)
  const { trigger } = useSWRMutation(
    user?.id ? `/api/v1/appearance/${user?.id}` : null,
    sendRequest
  )

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    values: { language: appearance?.language ?? resolvedLanguage },
  })

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onSubmit = async (formValues: FormValues) => {
    const language: string = formValues?.language

    if (language === appearance?.language) {
      toast(t('FormMessage.nothing_has_changed'))
      return false
    }

    try {
      setIsSubmitting(true)

      i18n.changeLanguage(language)
      document.documentElement.lang = language
      dispatch(setResolvedLanguage(language))

      const result = await trigger({ ...appearance, language })
      if (result?.error) throw new Error(result?.error?.message)

      toast.success(t('FormMessage.language_has_been_changed_successfully'))
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <Title text="ChangeLanguageForm.title" translate="yes" />
      <Separator />
      <Description text="ChangeLanguageForm.description" translate="yes" />
      <Form {...form}>
        <form
          method="POST"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="flex w-full max-w-sm space-x-2"
        >
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel></FormLabel> */}
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="min-w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {languageItems?.map((item) => (
                        <SelectItem key={item?.value} value={item?.value}>
                          {item?.label}
                        </SelectItem>
                      ))}
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

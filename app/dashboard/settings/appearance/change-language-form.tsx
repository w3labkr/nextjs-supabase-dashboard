'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { languageItems } from '@/i18next.config'

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

import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks'
import { setResolvedLanguage } from '@/store/features/i18n-slice'

const FormSchema = z.object({
  language: z.string(),
})

type FormValues = z.infer<typeof FormSchema>

const ChangeLanguageForm = () => {
  const resolvedLanguage = useAppSelector(
    (state) => state?.i18n?.resolvedLanguage
  )

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    values: { language: resolvedLanguage },
  })

  return (
    <Form {...form}>
      <form method="POST" noValidate className="flex w-full max-w-sm space-x-2">
        <LanguageField form={form} />
        <SubmitButton form={form} />
      </form>
    </Form>
  )
}

interface FormFieldProps {
  form: UseFormReturn<FormValues>
}

const LanguageField = (props: FormFieldProps) => {
  const { form } = props

  return (
    <FormField
      control={form.control}
      name="language"
      render={({ field }) => (
        <FormItem>
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
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const SubmitButton = (props: FormFieldProps) => {
  const { form } = props
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const resolvedLanguage = useAppSelector(
    (state) => state?.i18n?.resolvedLanguage
  )

  const onSubmit = async (formValues: FormValues) => {
    try {
      setIsSubmitting(true)

      if (formValues?.language === resolvedLanguage) {
        throw new Error('Nothing has changed.')
      }

      i18n.changeLanguage(formValues?.language)
      document.documentElement.lang = formValues?.language
      dispatch(setResolvedLanguage(formValues?.language))

      toast.success(t('FormMessage.changed_successfully'))
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

export { ChangeLanguageForm }

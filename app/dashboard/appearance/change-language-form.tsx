'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { languages, Language } from '@/i18next.config'

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

import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks'
import { setResolvedLanguage } from '@/store/features/i18n-slice'

const FormSchema = z.object({
  language: z.string(),
})

type FormValues = z.infer<typeof FormSchema>

const ChangeLanguageForm = () => {
  const { resolvedLanguage } = useAppSelector(({ i18n }) => i18n)
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    values: { language: resolvedLanguage },
  })

  return (
    <Form {...form}>
      <form method="POST" noValidate className="flex w-full max-w-sm space-x-2">
        <LanguageField />
        <SubmitButton />
      </form>
    </Form>
  )
}

const LanguageField = () => {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
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
                {languages?.map((language: Language) => (
                  <SelectItem key={language?.value} value={language?.value}>
                    {language?.native}
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

const SubmitButton = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { resolvedLanguage } = useAppSelector(({ i18n }) => i18n)
  const { t, i18n } = useTranslation()
  const { handleSubmit, getValues } = useFormContext()
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onSubmit = async () => {
    try {
      setIsSubmitting(true)

      const formValues = getValues()

      if (formValues?.language === resolvedLanguage) {
        throw new Error('Nothing has changed.')
      }

      i18n.changeLanguage(formValues?.language)
      document.documentElement.lang = formValues?.language
      dispatch(setResolvedLanguage(formValues?.language))

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

export { ChangeLanguageForm }

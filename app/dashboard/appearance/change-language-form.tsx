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
import { setAppLanguage } from '@/store/reducers/app-reducer'

const FormSchema = z.object({
  language: z.string(),
})

type FormValues = z.infer<typeof FormSchema>

const ChangeLanguageForm = () => {
  const { language } = useAppSelector(({ app }) => app)
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    values: { language },
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

  const { t, i18n } = useTranslation()
  const { handleSubmit, getValues } = useFormContext()
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onSubmit = async () => {
    try {
      setIsSubmitting(true)

      const formValues = getValues()

      i18n.changeLanguage(formValues?.language)
      dispatch(setAppLanguage(formValues?.language))

      toast.success(t('changed_successfully'))

      router.refresh()
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
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

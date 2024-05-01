'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'next-themes'

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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Button } from '@/components/ui/button'

const FormSchema = z.object({
  theme: z.string(),
})

type FormValues = z.infer<typeof FormSchema>

export function ChangeThemeForm() {
  const { theme } = useTheme()

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    values: { theme: theme ?? 'light' },
  })

  return (
    <Form {...form}>
      <form method="POST" noValidate className="space-y-4">
        <ThemeField form={form} />
        <SubmitButton form={form} />
      </form>
    </Form>
  )
}

function ThemeField({ form }: { form: UseFormReturn<FormValues> }) {
  return (
    <FormField
      control={form.control}
      name="theme"
      render={({ field }) => (
        <FormItem className="space-y-1">
          <FormLabel className="mb-4 text-lg font-medium"></FormLabel>
          <FormDescription></FormDescription>
          <FormMessage />
          <RadioGroup
            onValueChange={field.onChange}
            defaultValue={field.value}
            className="grid max-w-md grid-cols-2 gap-8 pt-2"
          >
            <FormItem>
              <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                <FormControl>
                  <RadioGroupItem value="light" className="sr-only" />
                </FormControl>
                <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                  <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                    <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                      <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                      <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                    </div>
                    <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                      <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                      <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                    </div>
                    <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                      <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                      <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                    </div>
                  </div>
                </div>
                <span className="block w-full p-2 text-center font-normal">
                  Light
                </span>
              </FormLabel>
            </FormItem>
            <FormItem>
              <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                <FormControl>
                  <RadioGroupItem value="dark" className="sr-only" />
                </FormControl>
                <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
                  <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                    <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                      <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                      <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                    </div>
                    <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                      <div className="h-4 w-4 rounded-full bg-slate-400" />
                      <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                    </div>
                    <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                      <div className="h-4 w-4 rounded-full bg-slate-400" />
                      <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                    </div>
                  </div>
                </div>
                <span className="block w-full p-2 text-center font-normal">
                  Dark
                </span>
              </FormLabel>
            </FormItem>
          </RadioGroup>
        </FormItem>
      )}
    />
  )
}

function SubmitButton({ form }: { form: UseFormReturn<FormValues> }) {
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()

  const onSubmit = async (formValues: FormValues) => {
    try {
      setIsSubmitting(true)

      if (!theme) throw new Error('Require is not defined.')
      if (formValues?.theme === theme) {
        throw new Error('Nothing has changed.')
      }

      setTheme(formValues?.theme)

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
      {t('FormSubmit.update_theme')}
    </Button>
  )
}

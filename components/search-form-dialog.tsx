'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Input } from '@/components/ui/input'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { cn } from '@/lib/utils'
import { LucideIcon } from '@/lib/lucide-icon'
import { useQueryString } from '@/hooks/url'

const FormSchema = z.object({
  q: z.string(),
})

type FormValues = z.infer<typeof FormSchema>

interface SearchFormDialogProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const SearchFormDialog = ({ className, ...props }: SearchFormDialogProps) => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { t } = useTranslation()

  const [open, setOpen] = React.useState<boolean>(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'w-10 sm:w-auto',
          className
        )}
        {...props}
      >
        <LucideIcon
          name="Search"
          className="size-5 min-w-5 text-muted-foreground"
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-left">{t('search_for')} :</DialogTitle>
        </DialogHeader>
        <SearchForm
          path="/search"
          placeholder="search_text"
          translate="yes"
          values={{
            q: pathname?.startsWith('/search')
              ? ((searchParams.get('q') as string) ?? '')
              : '',
          }}
          open={open}
          onOpenChange={setOpen}
        />
      </DialogContent>
    </Dialog>
  )
}

interface SearchFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  path: string
  placeholder?: string
  translate?: 'yes' | 'no'
  values: { q: string }
  open: boolean
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
}

const SearchForm = ({
  path,
  className,
  placeholder = 'Search Text',
  translate,
  values,
  open,
  onOpenChange,
  ...props
}: SearchFormProps) => {
  const { t } = useTranslation()
  const { qs } = useQueryString()
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    values,
  })
  const { control, handleSubmit } = form

  const onSubmit = (formValues: FormValues) => {
    const query = qs({ q: formValues?.q, page: 1 })
    const url = [path, query].filter(Boolean).join('?')

    onOpenChange(false)

    router.push(url)
  }

  return (
    <Form {...form}>
      <form
        method="GET"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className={cn('relative flex w-full items-center', className)}
        {...props}
      >
        <FormField
          control={control}
          name="q"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder={
                    placeholder && translate === 'yes'
                      ? t(placeholder)
                      : placeholder
                  }
                  className="rounded-none border-r-0 pr-16"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          variant="default"
          type="submit"
          className="absolute right-0 top-0 rounded-none"
        >
          <LucideIcon name="Search" className="size-5 min-w-5" />
        </Button>
      </form>
    </Form>
  )
}

export { SearchFormDialog }

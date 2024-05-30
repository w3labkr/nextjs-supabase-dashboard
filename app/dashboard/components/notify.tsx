'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { LucideIcon } from '@/lib/lucide-icon'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import useSWR from 'swr'

const Notify = () => {
  const { t } = useTranslation()
  const { data } = useSWR<{ data: any[]; count: number }>(
    process.env.NEXT_PUBLIC_SITE_URL + '/api/v1/notify'
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="ghost" className="h-8 w-8" size="icon">
          <LucideIcon name="Bell" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Card className="w-[360px] border-0">
          <CardHeader>
            <CardTitle>{t('Notify.title')}</CardTitle>
            <CardDescription>
              {t('Notify.description', { count: data?.count })}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Separator className="mb-2" />
            {data?.data?.map((item) => (
              <NotifyItem key={item.id} item={item} />
            ))}
          </CardContent>
          <CardFooter>
            <Button type="button" className="w-full">
              <LucideIcon name="Check" className="mr-2 size-4 min-w-4" />
              {t('Notify.submit')}
            </Button>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  )
}

interface NotifyItemProps {
  id: number
  title: string
  description: string
}

const NotifyItem = ({ item }: { item: NotifyItemProps }) => {
  return (
    <div className="grid grid-cols-[25px_1fr] items-start">
      <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500"></span>
      <div className="space-y-1">
        <p className="text-sm font-medium leading-none">{item.title}</p>
        <p className="text-sm text-muted-foreground">{item.description}</p>
      </div>
    </div>
  )
}

export { Notify }

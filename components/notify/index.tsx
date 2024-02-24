'use client'

import * as React from 'react'
import { Trans } from 'react-i18next'

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
import { NotifyItems } from './notify-items'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function Notify() {
  const fetchUrl = process.env.NEXT_PUBLIC_SITE_URL + '/api/v1/notify'
  const { data } = useSWR<{ data: any[]; count: number }>(fetchUrl, fetcher)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-8 w-8" size="icon" variant="ghost">
          <LucideIcon name="Bell" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Card className="w-[360px] border-0">
          <CardHeader>
            <CardTitle>
              <Trans>Notify.title</Trans>
            </CardTitle>
            <CardDescription>
              <Trans values={{ count: data?.count }}>Notify.description</Trans>
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Separator className="mb-2" />
            {data?.data && <NotifyItems items={data?.data} />}
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <LucideIcon name="Check" className="mr-2 size-4 min-w-4" />
              <Trans>Notify.submit</Trans>
            </Button>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  )
}

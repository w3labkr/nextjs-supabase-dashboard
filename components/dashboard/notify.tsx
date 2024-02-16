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

export interface NotifyItemProps {
  id: number
  title: string
  description: string
}

const notifyItems: NotifyItemProps[] = [
  {
    id: 1,
    title: 'Your call has been confirmed.',
    description: '1 hour ago',
  },
  {
    id: 2,
    title: 'You have a new message!',
    description: '1 hour ago',
  },
  {
    id: 3,
    title: 'Your subscription is expiring soon!',
    description: '2 hours ago',
  },
]

export function Notify() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-8 w-8" size="icon" variant="ghost">
          <LucideIcon name="Bell" />
          <span className="sr-only">
            <Trans>Toggle notifications</Trans>
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Card className="w-[360px] border-0">
          <CardHeader>
            <CardTitle>
              <Trans>Notifications</Trans>
            </CardTitle>
            <CardDescription>
              <Trans values={{ count: 2 }}>You have unread messages</Trans>
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Separator className="mb-2" />
            <NotifyItems items={notifyItems} />
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <LucideIcon name="Check" className="mr-2 size-4" />
              <Trans>Mark all as read</Trans>
            </Button>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  )
}

function NotifyItems({ items }: { items: NotifyItemProps[] }) {
  return items.map((item) => (
    <div key={item.id} className="grid grid-cols-[25px_1fr] items-start">
      <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
      <div className="space-y-1">
        <p className="text-sm font-medium leading-none">{item.title}</p>
        <p className="text-sm text-muted-foreground">{item.description}</p>
      </div>
    </div>
  ))
}

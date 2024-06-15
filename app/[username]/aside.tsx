import * as React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User } from '@/types/database'
import { LucideIcon, LucideIconName } from '@/lib/lucide-icon'

interface AsideProps extends React.HTMLAttributes<HTMLDivElement> {
  user: User
}

const Aside = ({ user, ...props }: AsideProps) => {
  return (
    <div className="flex flex-col gap-2" {...props}>
      <Avatar className="size-12 min-w-12">
        <AvatarImage
          src={user?.avatar_url ?? undefined}
          alt={`@${user?.username}`}
        />
        <AvatarFallback>{user?.username?.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-4xl font-semibold leading-none tracking-tight">
          {user?.full_name}
        </h1>
        <p className="text-sm text-gray-600">@{user?.username}</p>
      </div>
      <div className="mt-4">
        <ul>
          {user?.email ? <ListItem iconName="Mail" text={user?.email} /> : null}
        </ul>
        {user?.bio ? <Bio user={user} /> : null}
      </div>
    </div>
  )
}

interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  iconName: LucideIconName
  text: string
}

const ListItem = ({ iconName, text, ...props }: ListItemProps) => {
  return (
    <li className="flex items-center text-sm text-gray-600" {...props}>
      <LucideIcon name={iconName} className="mr-1 size-4 min-w-4" />
      {text}
    </li>
  )
}

interface BioProps extends React.HTMLAttributes<HTMLParagraphElement> {
  user: User
}

const Bio = ({ user, ...props }: BioProps) => {
  return (
    <p className="text-sm text-gray-600" {...props}>
      {user?.bio}
    </p>
  )
}

export { Aside, type AsideProps }

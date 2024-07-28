import * as React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { type User } from '@/types/database'
import { LucideIcon, type LucideIconName } from '@/lib/lucide-icon'

interface AsideProps extends React.HTMLAttributes<HTMLDivElement> {
  user: User
}

const Aside = ({ user, ...props }: AsideProps) => {
  return (
    <div {...props}>
      <Avatar className="size-32 lg:size-48">
        <AvatarImage
          src={user?.avatar_url ?? undefined}
          alt={`@${user?.username}`}
        />
        <AvatarFallback className="font-serif text-7xl lg:text-9xl">
          {user?.username?.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div>
        <h1 className="break-all text-4xl font-semibold leading-none tracking-tight">
          {user?.full_name}
        </h1>
        <p className="break-all text-sm text-gray-600">@{user?.username}</p>
      </div>
      {user?.email || user?.bio ? (
        <div className="mt-4">
          <ul>
            {user?.email ? (
              <ListItem iconName="Mail">{user?.email}</ListItem>
            ) : null}
          </ul>
          {user?.bio ? <Bio user={user} /> : null}
        </div>
      ) : null}
    </div>
  )
}

interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  children?: React.ReactNode
  iconName: LucideIconName
}

const ListItem = ({ children, iconName, ...props }: ListItemProps) => {
  return (
    <li className="flex items-center text-sm text-gray-600" {...props}>
      <LucideIcon name={iconName} className="mr-1 size-4 min-w-4" />
      {children}
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

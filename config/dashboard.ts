import { type LucideIconName } from '@/lib/lucide-icon'

export interface DashboardNavSubItem {
  id: number
  href: string
  text: string
  translate?: 'yes' | 'no'
  iconName?: LucideIconName
  disabled?: boolean
  separator?: boolean
  roles?: string[]
}

export interface DashboardNavItem extends DashboardNavSubItem {
  sub?: DashboardNavSubItem[]
}

export interface DashboardConfig {
  nav: DashboardNavItem[]
}

export const dashboardConfig: DashboardConfig = {
  nav: [
    {
      id: 1,
      href: '/dashboard',
      text: 'dashboard',
      translate: 'yes',
      iconName: 'LayoutDashboard',
    },
    {
      id: 2,
      href: '/dashboard/posts',
      text: 'posts',
      translate: 'yes',
      iconName: 'StickyNote',
    },
    {
      id: 3,
      href: '/dashboard/tags',
      text: 'tags',
      translate: 'yes',
      iconName: 'Tag',
      disabled: true,
    },
    {
      id: 4,
      href: '/dashboard/settings',
      text: 'settings',
      translate: 'yes',
      iconName: 'Settings',
      sub: [
        {
          id: 1,
          href: '/dashboard/settings/profile',
          text: 'profile',
          translate: 'yes',
          iconName: 'User',
        },
        {
          id: 2,
          href: '/dashboard/settings/account',
          text: 'account',
          translate: 'yes',
          iconName: 'UserCog',
        },
        {
          id: 3,
          href: '/dashboard/settings/appearance',
          text: 'appearance',
          translate: 'yes',
          iconName: 'Paintbrush',
        },
        {
          id: 4,
          href: '/dashboard/settings/notifications',
          text: 'notifications',
          translate: 'yes',
          iconName: 'Bell',
        },
        {
          id: 5,
          href: '/dashboard/settings/emails',
          text: 'emails',
          translate: 'yes',
          iconName: 'Mail',
        },
        {
          id: 6,
          href: '/dashboard/settings/security',
          text: 'security',
          translate: 'yes',
          iconName: 'ShieldAlert',
        },
        {
          id: 7,
          href: '/dashboard/settings/sessions',
          text: 'sessions',
          translate: 'yes',
          iconName: 'RadioTower',
          disabled: true,
        },
      ],
    },
    {
      id: 5,
      href: '/dashboard/admin',
      text: 'admin',
      translate: 'yes',
      iconName: 'FolderLock',
      separator: true,
      roles: ['admin', 'superadmin'],
    },
  ],
}

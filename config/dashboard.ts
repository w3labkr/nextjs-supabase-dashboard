import { DashboardConfig, DashboardPageConfig } from '@/types/config'

export const dashboardConfig: DashboardConfig = {
  nav: [
    {
      id: 1,
      separator: false,
      // roles: ['user'],
      items: [
        {
          id: 1,
          href: '/dashboard/dashboard',
          iconName: 'LayoutDashboard',
          title: 'dashboard',
          badge: 1,
          translate: 'yes',
          disabled: false,
          // roles: ['user'],
        },
        {
          id: 2,
          href: '/dashboard/posts',
          iconName: 'StickyNote',
          title: 'posts',
          badge: 0,
          translate: 'yes',
          disabled: false,
          // roles: ['user'],
        },
      ],
    },
    {
      id: 2,
      separator: true,
      // roles: ['user'],
      items: [
        {
          id: 1,
          href: '/dashboard/settings',
          iconName: 'Settings',
          title: 'settings',
          badge: 0,
          translate: 'yes',
          disabled: false,
          // roles: ['user'],
        },
        {
          id: 2,
          href: '/dashboard/admin',
          iconName: 'FolderLock',
          title: 'admin',
          badge: 0,
          translate: 'yes',
          disabled: false,
          roles: ['admin', 'superadmin'],
        },
      ],
    },
  ],
}

export const settingsConfig: DashboardPageConfig = {
  nav: [
    {
      id: 1,
      label: '',
      separator: false,
      translate: 'no',
      // roles: ['user'],
      items: [
        {
          id: 1,
          title: 'profile',
          href: '/dashboard/settings/profile',
          iconName: 'UserRound',
          translate: 'yes',
          disabled: false,
          // roles: ['user'],
        },
        {
          id: 2,
          title: 'account',
          href: '/dashboard/settings/account',
          iconName: 'Settings',
          translate: 'yes',
          disabled: false,
          // roles: ['user'],
        },
        {
          id: 3,
          title: 'appearance',
          href: '/dashboard/settings/appearance',
          iconName: 'Paintbrush',
          translate: 'yes',
          disabled: false,
          // roles: ['user'],
        },
        {
          id: 4,
          title: 'notifications',
          href: '/dashboard/settings/notifications',
          iconName: 'Bell',
          translate: 'yes',
          disabled: false,
          // roles: ['user'],
        },
      ],
    },
    {
      id: 2,
      label: 'access',
      separator: true,
      translate: 'yes',
      // roles: ['user'],
      items: [
        {
          id: 1,
          title: 'emails',
          href: '/dashboard/settings/emails',
          iconName: 'Mail',
          translate: 'yes',
          disabled: false,
          // roles: ['user'],
        },
        {
          id: 2,
          title: 'security',
          href: '/dashboard/settings/security',
          iconName: 'ShieldAlert',
          translate: 'yes',
          disabled: false,
          // roles: ['user'],
        },
        {
          id: 3,
          title: 'sessions',
          href: '/dashboard/settings/sessions',
          iconName: 'RadioTower',
          translate: 'yes',
          disabled: true,
          // roles: ['user'],
        },
      ],
    },
  ],
}

export const adminConfig: DashboardPageConfig = {
  nav: [
    {
      id: 1,
      label: '',
      separator: false,
      translate: 'no',
      // roles: ['user'],
      items: [
        {
          id: 1,
          title: 'users',
          href: '/dashboard/admin/users',
          // iconName: '',
          translate: 'yes',
          disabled: false,
          // roles: ['user'],
        },
      ],
    },
  ],
}

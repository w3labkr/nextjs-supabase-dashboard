import {
  DashboardConfig,
  MediaConfig,
  PostsConfig,
  SettingsConfig,
} from '@/types/dashboard'

export const dashboardConfig: DashboardConfig = {
  miniDrawerGroupItems: [
    {
      id: 1,
      separator: false,
      items: [
        {
          id: 1,
          href: '/dashboard/dashboard',
          iconName: 'LayoutDashboard',
          title: 'Dashboard',
          badge: 1,
        },
        {
          id: 2,
          href: '/dashboard/media',
          iconName: 'Image',
          title: 'Media',
          badge: 0,
        },
        {
          id: 3,
          href: '/dashboard/posts',
          iconName: 'StickyNote',
          title: 'Posts',
          badge: 0,
        },
      ],
    },
    {
      id: 2,
      separator: true,
      items: [
        {
          id: 1,
          href: '/dashboard/settings',
          iconName: 'Settings',
          title: 'Settings',
          badge: 0,
        },
      ],
    },
  ],
}

export const mediaConfig: MediaConfig = {
  drawerGroupItems: [
    {
      id: 1,
      label: '',
      separator: false,
      translate: 'no',
      items: [
        {
          id: 1,
          title: 'New Media',
          href: '/dashboard/media/new',
          // iconName: '',
          translate: 'yes',
        },
        {
          id: 2,
          title: 'Edit Media',
          href: '/dashboard/media/edit',
          // iconName: '',
          translate: 'yes',
        },
      ],
    },
  ],
}

export const postsConfig: PostsConfig = {
  drawerGroupItems: [
    {
      id: 1,
      label: '',
      separator: false,
      translate: 'no',
      items: [
        {
          id: 1,
          title: 'New Post',
          href: '/dashboard/posts/new',
          // iconName: '',
          translate: 'yes',
        },
        {
          id: 2,
          title: 'Edit Post',
          href: '/dashboard/posts/edit',
          // iconName: '',
          translate: 'yes',
        },
      ],
    },
  ],
}

export const settingsConfig: SettingsConfig = {
  drawerGroupItems: [
    {
      id: 1,
      label: '',
      separator: false,
      translate: 'no',
      items: [
        {
          id: 1,
          title: 'Profile',
          href: '/dashboard/settings/profile',
          iconName: 'UserRound',
          translate: 'yes',
        },
        {
          id: 2,
          title: 'Account',
          href: '/dashboard/settings/account',
          iconName: 'Settings',
          translate: 'yes',
        },
        {
          id: 3,
          title: 'Appearance',
          href: '/dashboard/settings/appearance',
          iconName: 'Paintbrush',
          translate: 'yes',
        },
        {
          id: 4,
          title: 'Notifications',
          href: '/dashboard/settings/notifications',
          iconName: 'Bell',
          translate: 'yes',
        },
      ],
    },
    {
      id: 2,
      label: 'Access',
      separator: true,
      translate: 'yes',
      items: [
        {
          id: 1,
          title: 'Emails',
          href: '/dashboard/settings/emails',
          iconName: 'Mail',
          translate: 'yes',
        },
        {
          id: 2,
          title: 'Security',
          href: '/dashboard/settings/security',
          iconName: 'ShieldAlert',
          translate: 'yes',
        },
        {
          id: 3,
          title: 'Sessions',
          href: '/dashboard/settings/sessions',
          iconName: 'RadioTower',
          translate: 'yes',
        },
      ],
    },
  ],
}

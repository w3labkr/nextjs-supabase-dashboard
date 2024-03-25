import {
  DashboardConfig,
  MediaConfig,
  PostsConfig,
  SettingsConfig,
  AdminConfig,
} from '@/types/dashboard'

export const dashboardConfig: DashboardConfig = {
  groups: [
    {
      id: 1,
      separator: false,
      items: [
        {
          id: 1,
          href: '/dashboard/dashboard',
          iconName: 'LayoutDashboard',
          title: 'dashboard',
          badge: 1,
          translate: 'yes',
          disabled: false,
        },
        {
          id: 2,
          href: '/dashboard/media',
          iconName: 'Image',
          title: 'media',
          badge: 0,
          translate: 'yes',
          disabled: true,
        },
        {
          id: 3,
          href: '/dashboard/posts',
          iconName: 'StickyNote',
          title: 'posts',
          badge: 0,
          translate: 'yes',
          disabled: false,
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
          title: 'settings',
          badge: 0,
          translate: 'yes',
          disabled: false,
        },
        {
          id: 2,
          href: '/dashboard/admin',
          iconName: 'FolderLock',
          title: 'admin',
          badge: 0,
          translate: 'yes',
          disabled: false,
        },
      ],
    },
  ],
}

export const mediaConfig: MediaConfig = {
  groups: [
    {
      id: 1,
      label: '',
      separator: false,
      translate: 'no',
      items: [
        {
          id: 1,
          title: 'new_media',
          href: '/dashboard/media/new-media',
          // iconName: '',
          translate: 'yes',
          disabled: false,
        },
        {
          id: 2,
          title: 'edit_media',
          href: '/dashboard/media/edit-media',
          // iconName: '',
          translate: 'yes',
          disabled: false,
        },
      ],
    },
  ],
}

export const postsConfig: PostsConfig = {
  groups: [
    {
      id: 1,
      label: '',
      separator: false,
      translate: 'no',
      items: [
        {
          id: 1,
          title: 'new_post',
          href: '/dashboard/posts/new-post',
          // iconName: '',
          translate: 'yes',
          disabled: false,
        },
        {
          id: 2,
          title: 'edit_post',
          href: '/dashboard/posts/edit-post',
          // iconName: '',
          translate: 'yes',
          disabled: false,
        },
      ],
    },
  ],
}

export const settingsConfig: SettingsConfig = {
  groups: [
    {
      id: 1,
      label: '',
      separator: false,
      translate: 'no',
      items: [
        {
          id: 1,
          title: 'profile',
          href: '/dashboard/settings/profile',
          iconName: 'UserRound',
          translate: 'yes',
          disabled: false,
        },
        {
          id: 2,
          title: 'account',
          href: '/dashboard/settings/account',
          iconName: 'Settings',
          translate: 'yes',
          disabled: false,
        },
        {
          id: 3,
          title: 'appearance',
          href: '/dashboard/settings/appearance',
          iconName: 'Paintbrush',
          translate: 'yes',
          disabled: false,
        },
        {
          id: 4,
          title: 'notifications',
          href: '/dashboard/settings/notifications',
          iconName: 'Bell',
          translate: 'yes',
          disabled: false,
        },
      ],
    },
    {
      id: 2,
      label: 'access',
      separator: true,
      translate: 'yes',
      items: [
        {
          id: 1,
          title: 'emails',
          href: '/dashboard/settings/emails',
          iconName: 'Mail',
          translate: 'yes',
          disabled: false,
        },
        {
          id: 2,
          title: 'security',
          href: '/dashboard/settings/security',
          iconName: 'ShieldAlert',
          translate: 'yes',
          disabled: false,
        },
        {
          id: 3,
          title: 'sessions',
          href: '/dashboard/settings/sessions',
          iconName: 'RadioTower',
          translate: 'yes',
          disabled: true,
        },
      ],
    },
  ],
}

export const adminConfig: AdminConfig = {
  groups: [
    {
      id: 1,
      label: '',
      separator: false,
      translate: 'no',
      items: [
        {
          id: 1,
          title: 'users',
          href: '/dashboard/admin/users',
          // iconName: '',
          translate: 'yes',
          disabled: false,
        },
      ],
    },
  ],
}

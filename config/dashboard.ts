import { DashboardConfig } from '@/types'

export const dashboardConfig: DashboardConfig = {
  miniDrawer: [
    {
      id: 1,
      title: 'Dashboard',
      href: '/dashboard/dashboard',
      icon: 'LayoutDashboard',
      badge: 1,
      separator: false,
    },
    {
      id: 2,
      title: 'Media',
      href: '/dashboard/media',
      icon: 'Image',
      badge: 0,
      separator: false,
    },
    {
      id: 3,
      title: 'Posts',
      href: '/dashboard/posts',
      icon: 'StickyNote',
      badge: 0,
      separator: false,
    },
    {
      id: 4,
      title: 'Settings',
      href: '/dashboard/settings',
      icon: 'Settings',
      badge: 0,
      separator: true,
    },
  ],
  media: {
    drawerItems: [
      { id: 1, title: 'New Media', href: '/dashboard/media/new' },
      { id: 2, title: 'Edit Media', href: '/dashboard/media/edit' },
    ],
  },
  posts: {
    drawerItems: [
      { id: 1, title: 'New Post', href: '/dashboard/posts/new' },
      { id: 2, title: 'Edit Post', href: '/dashboard/posts/edit' },
    ],
  },
  settings: {
    drawerItems: [
      { id: 1, title: 'Profile', href: '/dashboard/settings/profile' },
      { id: 2, title: 'Account', href: '/dashboard/settings/account' },
      { id: 3, title: 'Appearance', href: '/dashboard/settings/appearance' },
      {
        id: 4,
        title: 'Notifications',
        href: '/dashboard/settings/notifications',
      },
    ],
  },
}

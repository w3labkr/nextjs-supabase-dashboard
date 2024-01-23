import { LuFileText, LuCreditCard, LuSettings } from 'react-icons/lu';
import { DashboardConfig } from 'types';

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    { title: 'Documentation', href: '/docs' },
    { title: 'Support', href: '/support', disabled: true },
  ],
  sidebarNav: [
    { title: 'Posts', href: '/dashboard', icon: <LuFileText /> },
    { title: 'Billing', href: '/dashboard/billing', icon: <LuCreditCard /> },
    { title: 'Settings', href: '/dashboard/settings', icon: <LuSettings /> },
  ],
};

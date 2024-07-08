'use client'

import * as React from 'react'
import Link, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'

import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui-custom/accordion'

import { cn } from '@/lib/utils'
import { LucideIcon, type LucideIconName } from '@/lib/lucide-icon'
import { useAppSelector } from '@/lib/redux/hooks'
import {
  dashboardConfig,
  type DashboardNavItem,
  type DashboardNavSubItem,
} from '@/config/dashboard'
import { useUserAPI } from '@/queries/client/users'

const Navigation = () => {
  const { user } = useUserAPI()
  const pathname = usePathname()
  const defaultValue = pathname.split('/').slice(0, 3).join('/')

  return (
    <Accordion type="multiple" defaultValue={[defaultValue]} className="py-2">
      {dashboardConfig?.nav?.map((item: DashboardNavItem) => {
        const denied =
          Array.isArray(item?.roles) &&
          user?.role &&
          !item?.roles?.includes(user?.role)
        return denied ? null : (
          <React.Fragment key={item?.id}>
            {item?.separator ? <Separator className="my-2" /> : null}
            <NavItem item={item} />
          </React.Fragment>
        )
      })}
    </Accordion>
  )
}

const NavItem = ({ item }: { item: DashboardNavItem }) => {
  const { t } = useTranslation()
  const { collapsed } = useAppSelector(({ app }) => app)

  return (
    <AccordionItem value={item?.href} className="border-none">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <AccordionTrigger
              className={cn(
                'px-4 py-1 hover:no-underline',
                Array.isArray(item?.sub) ? '' : 'hover:cursor-default'
              )}
            >
              <NavLink
                collapsed={collapsed}
                href={item?.href}
                translate={item?.translate}
                iconName={item?.iconName}
                iconClassName="mr-2"
                disabled={item?.disabled}
              >
                {item?.text}
              </NavLink>
              {!collapsed && Array.isArray(item?.sub) ? (
                <LucideIcon
                  name="ChevronDown"
                  className="size-4 min-w-4 shrink-0 transition-transform duration-200"
                />
              ) : null}
            </AccordionTrigger>
          </TooltipTrigger>
          {collapsed && item?.text ? (
            <TooltipContent side="right" align="center">
              {item?.translate === 'yes' ? t(item?.text) : item?.text}
            </TooltipContent>
          ) : null}
        </Tooltip>
      </TooltipProvider>
      {!collapsed ? <NavSub item={item} /> : null}
    </AccordionItem>
  )
}

const NavSub = ({ item }: { item: DashboardNavItem }) => {
  const { user } = useUserAPI()
  const { collapsed } = useAppSelector(({ app }) => app)

  return (
    <AccordionContent
      className={cn(
        'pb-0',
        Array.isArray(item?.sub) && item?.sub?.length > 0
          ? 'mb-2 ml-6 space-y-1 border-l px-4 pt-1'
          : ''
      )}
    >
      {item?.sub?.map((sub: DashboardNavSubItem) => {
        const denied =
          Array.isArray(sub?.roles) &&
          user?.role &&
          !sub?.roles?.includes(user?.role)
        return denied ? null : (
          <React.Fragment key={sub?.id}>
            {sub?.separator ? <Separator className="my-1" /> : null}
            <NavLink
              collapsed={collapsed}
              href={sub?.href}
              translate={sub?.translate}
              iconName={sub?.iconName}
              iconClassName="mr-1 size-3.5 min-w-3.5"
              disabled={sub?.disabled}
            >
              {sub?.text}
            </NavLink>
          </React.Fragment>
        )
      })}
    </AccordionContent>
  )
}

interface NavLinkProps
  extends LinkProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  collapsed: boolean
  iconName?: LucideIconName
  iconClassName?: string
  text?: string
  ns?: string
  disabled?: boolean
}

const NavLink = ({
  children,
  className,
  href,
  collapsed,
  iconName,
  iconClassName,
  text,
  ns,
  translate,
  disabled = false,
  ...props
}: NavLinkProps) => {
  const { t } = useTranslation()
  const pathname = usePathname()
  const parent = pathname.split('/').slice(0, 3).join('/')

  return (
    <div className={cn(disabled ? 'cursor-not-allowed' : '')}>
      <Link
        href={href}
        className={cn(
          'flex items-start break-all text-left text-sm',
          disabled ? 'pointer-events-none opacity-50' : 'hover:underline',
          [pathname, parent].includes(href as string)
            ? ''
            : 'text-muted-foreground',
          className
        )}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
        {...props}
      >
        {iconName ? (
          <LucideIcon
            name={iconName}
            className={cn(`mr-2 mt-[3px] size-4 min-w-4`, iconClassName)}
          />
        ) : null}
        <span className={cn(collapsed ? 'hidden' : '')}>
          {text && translate === 'yes' ? t(text, { ns }) : text}
          {children && typeof children === 'string' && translate === 'yes'
            ? t(children, { ns })
            : children}
        </span>
      </Link>
    </div>
  )
}

export { Navigation }

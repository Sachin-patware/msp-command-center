'use client'

import {
  LayoutDashboard,
  Users,
  Banknote,
  Computer,
  Clock,
  Target,
  FileText,
  Settings,
  History,
  Lightbulb,
} from 'lucide-react'
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/financials', label: 'Financials', icon: Banknote },
  { href: '/software', label: 'Software', icon: Computer },
  { href: '/utilization', label: 'Utilization', icon: Clock },
  { href: '/leads', label: 'Leads', icon: Target },
  { href: '/quote-generator', label: 'Quote Generator', icon: Lightbulb },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/activity', label: 'Activity', icon: History },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function Nav() {
  const pathname = usePathname()

  return (
    <SidebarMenu>
      {links.map((link) => (
        <SidebarMenuItem key={link.href}>
          <SidebarMenuButton
            asChild
            isActive={
              link.href === '/dashboard' 
                ? pathname === link.href 
                : pathname.startsWith(link.href)
            }
            tooltip={link.label}
          >
            <Link href={link.href}>
              <link.icon />
              <span>{link.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}

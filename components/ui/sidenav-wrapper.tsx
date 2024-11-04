'use client'

import { usePathname } from 'next/navigation'
import { Sidenav } from './sidenav'

export function SidenavWrapper() {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/sign-in')

  if (isAuthPage) {
    return null
  }

  return <Sidenav />
} 
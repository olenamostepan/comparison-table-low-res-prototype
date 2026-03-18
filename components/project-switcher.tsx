'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Home } from 'lucide-react'

export function ProjectSwitcher() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const isSolar =
    pathname.startsWith('/supplier-comparison') &&
    !pathname.startsWith('/supplier-comparison/led')
  const isLedBerlin =
    pathname.startsWith('/supplier-comparison/led') &&
    !pathname.startsWith('/supplier-comparison/led-rostock')
  const isLedRostock = pathname.startsWith('/supplier-comparison/led-rostock')

  return (
    <div className="border-b border-cq-border bg-white">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-4 flex-wrap">
        <Link
          href="/"
          className={cn(
            'inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors',
            isHome
              ? 'bg-cq-bg text-cq-text border border-cq-border'
              : 'text-cq-text-secondary hover:text-cq-text hover:bg-cq-bg'
          )}
        >
          <Home className="h-4 w-4" />
          Home
        </Link>
        <div className="inline-flex rounded-lg border border-cq-border bg-cq-bg p-1">
          <Link
            href="/supplier-comparison"
            className={cn(
              'px-4 py-2 rounded-md text-sm font-semibold transition-colors',
              isSolar
                ? 'bg-white text-cq-text shadow-sm border border-cq-border'
                : 'text-cq-text-secondary hover:text-cq-text'
            )}
          >
            Solar project
          </Link>
          <Link
            href="/supplier-comparison/led"
            className={cn(
              'px-4 py-2 rounded-md text-sm font-semibold transition-colors',
              isLedBerlin
                ? 'bg-white text-cq-text shadow-sm border border-cq-border'
                : 'text-cq-text-secondary hover:text-cq-text'
            )}
          >
            LED (Berlin)
          </Link>
          <Link
            href="/supplier-comparison/led-rostock"
            className={cn(
              'px-4 py-2 rounded-md text-sm font-semibold transition-colors',
              isLedRostock
                ? 'bg-white text-cq-text shadow-sm border border-cq-border'
                : 'text-cq-text-secondary hover:text-cq-text'
            )}
          >
            LED (Rostock)
          </Link>
        </div>
      </div>
    </div>
  )
}

"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { siteNavigation } from '@/config/navigation'
import { cn } from '@/lib/utils'

function generateBreadcrumbs(pathname: string) {
  const paths = pathname.split('/').filter(Boolean)
  const breadcrumbs = paths.map((path, index) => {
    const href = `/${paths.slice(0, index + 1).join('/')}`
    
    // Get title from navigation structure
    let title = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ')
    
    // Check main navigation for better titles
    const navItem = siteNavigation.mainNav
      .flatMap(item => 'items' in item ? item.items : [item])
      .find(item => item.href === href)
    
    if (navItem) {
      title = navItem.title
    }

    return { href, title }
  })

  return breadcrumbs
}

interface BreadcrumbProps {
  className?: string
}

export function Breadcrumb({ className }: BreadcrumbProps) {
  const pathname = usePathname()
  const breadcrumbs = generateBreadcrumbs(pathname)

  return (
    <nav 
      aria-label="Breadcrumb"
      className={cn("py-3 flex items-center space-x-1 text-sm", className)}
    >
      <Link 
        href="/"
        className="text-gray-500 hover:text-gray-900 transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>

      {breadcrumbs.map(({ href, title }, index) => (
        <div key={href} className="flex items-center">
          <ChevronRight className="h-4 w-4 text-gray-400" />
          {index === breadcrumbs.length - 1 ? (
            <span className="ml-1 font-medium text-gray-900">
              {title}
            </span>
          ) : (
            <Link
              href={href}
              className="ml-1 text-gray-500 hover:text-gray-900 transition-colors"
            >
              {title}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}

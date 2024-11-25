"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { siteNavigation, NavItem, NavItemWithChildren } from '@/config/navigation'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { NavigationSearch } from '@/components/navigation/InteractiveNav'

export function MainNav() {
  const pathname = usePathname()
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const handleDropdownToggle = (title: string) => {
    setOpenDropdown(openDropdown === title ? null : title)
  }

  const isNavItemWithChildren = (
    item: NavItem | NavItemWithChildren
  ): item is NavItemWithChildren => {
    return 'items' in item
  }

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 max-w-7xl mx-auto">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold">Disaster Recovery QLD</span>
          </Link>
        </div>
        <div className="flex items-center space-x-6 ml-6 flex-1">
          {siteNavigation.mainNav.map((item) => (
            <div key={item.title} className="relative">
              {isNavItemWithChildren(item) ? (
                <div>
                  <button
                    onClick={() => handleDropdownToggle(item.title)}
                    className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 text-muted-foreground"
                  >
                    {item.title}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  {openDropdown === item.title && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 z-50">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setOpenDropdown(null)}
                        >
                          <div className="font-medium">{subItem.title}</div>
                          {subItem.description && (
                            <div className="text-xs text-gray-500">{subItem.description}</div>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname?.includes(item.href) ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {item.title}
                </Link>
              )}
            </div>
          ))}
          {/* Additional static links */}
          <Link 
            href="/inspection"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname?.includes('/inspection') ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            Inspection Report
          </Link>
          
          {/* Navigation Search */}
          <div className="ml-auto max-w-sm w-full">
            <NavigationSearch />
          </div>
        </div>
      </div>
    </nav>
  )
}

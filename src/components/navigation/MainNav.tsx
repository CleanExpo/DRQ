"use client"

import * as React from "react"
import Link from "next/link"
import { siteConfig } from "@/config/site"
import { MobileNav } from "./MobileNav"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

export function MainNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold">{siteConfig.name}</span>
        </Link>
        <MobileNav />
        <nav className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {/* Desktop Navigation */}
          <div className="hidden md:flex">
            <NavigationMenu>
              <NavigationMenuList>
                {siteConfig.mainNav.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                        {item.items.map((subItem) => (
                          <li key={subItem.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={subItem.href}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="text-sm font-medium leading-none">
                                  {subItem.title}
                                </div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  {subItem.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          {/* Emergency Contact */}
          <div className="flex items-center space-x-4">
            <Link
              href={`tel:${siteConfig.contact.phone}`}
              className="text-sm font-medium text-red-600 hover:text-red-700"
            >
              {siteConfig.contact.phone}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}

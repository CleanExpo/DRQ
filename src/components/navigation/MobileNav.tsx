"use client"

import * as React from "react"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <button className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10">
          <div className="flex flex-col space-y-4">
            {siteConfig.mainNav.map((item) => (
              <div key={item.title} className="flex flex-col space-y-3">
                <h4 className="font-medium">{item.title}</h4>
                <div className="flex flex-col space-y-2">
                  {item.items.map((subItem) => (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => setOpen(false)}
                    >
                      {subItem.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

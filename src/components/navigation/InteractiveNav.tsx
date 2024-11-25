"use client"

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { 
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Search, Loader2 } from "lucide-react"
import { siteNavigation } from '@/config/navigation'

export function NavigationSearch() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Handle keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  // Flatten navigation items for search
  const searchItems = siteNavigation.mainNav.flatMap(item => 
    'items' in item 
      ? item.items
      : [{ title: item.title, href: item.href }]
  )

  return (
    <>
      <Button
        variant="outline"
        className="w-full justify-start text-sm text-muted-foreground hidden md:flex"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        Quick navigation...
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type to search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            {searchItems.map((item, index) => (
              <CommandItem
                key={index}
                onSelect={() => {
                  setOpen(false)
                  router.push(item.href)
                }}
              >
                <Search className="mr-2 h-4 w-4" />
                {item.title}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}

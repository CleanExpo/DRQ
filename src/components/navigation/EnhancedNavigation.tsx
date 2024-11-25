"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { 
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import { 
  Search,
  Menu,
  ArrowLeft,
  ArrowRight,
  History,
  Star,
  Home,
  X
} from "lucide-react"

interface NavigationHistory {
  path: string
  title: string
  timestamp: number
}

export function EnhancedNavigation() {
  const [history, setHistory] = useState<NavigationHistory[]>([])
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('navigationFavorites')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const [searchOpen, setSearchOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Track navigation history
  useEffect(() => {
    const newHistory: NavigationHistory = {
      path: pathname,
      title: document.title,
      timestamp: Date.now()
    }
    setHistory(prev => {
      const filtered = prev.filter(item => item.path !== pathname)
      return [newHistory, ...filtered].slice(0, 10)
    })
  }, [pathname])

  // Save favorites to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('navigationFavorites', JSON.stringify(favorites))
    }
  }, [favorites])

  // Navigation shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault()
        router.back()
      }
      if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault()
        router.forward()
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [router])

  const toggleFavorite = (path: string) => {
    setFavorites(prev => 
      prev.includes(path)
        ? prev.filter(p => p !== path)
        : [...prev, path]
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="default" size="sm" className="rounded-full shadow-lg">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                title="Go back (Alt + ←)"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.forward()}
                title="Go forward (Alt + →)"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/')}
                title="Home"
              >
                <Home className="h-4 w-4" />
              </Button>
            </div>

            {/* History */}
            <div>
              <h3 className="text-sm font-medium mb-2">Recent Pages</h3>
              <div className="space-y-1">
                {history.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 justify-start text-sm"
                      onClick={() => router.push(item.path)}
                    >
                      <History className="h-4 w-4 mr-2" />
                      {item.title || item.path}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleFavorite(item.path)}
                      className={favorites.includes(item.path) ? 'text-yellow-500' : ''}
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Favorites */}
            {favorites.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Favorites</h3>
                <div className="space-y-1">
                  {favorites.map((path, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 justify-start text-sm"
                        onClick={() => router.push(path)}
                      >
                        <Star className="h-4 w-4 mr-2 text-yellow-500" />
                        {path}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleFavorite(path)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

"use client"

import { Phone, MapPin, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function EmergencyNav() {
  const router = useRouter()

  const handleLocationCheck = () => {
    router.push('/locations#coverage')
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {/* Emergency Call Button */}
      <a 
        href="tel:1300309361"
        className="inline-block"
      >
        <Button 
          size="lg" 
          variant="destructive"
          className="rounded-full shadow-lg gap-2 w-full"
        >
          <Phone className="h-4 w-4" />
          <span className="hidden sm:inline">1300 309 361</span>
        </Button>
      </a>

      {/* Quick Location Check */}
      <Button
        variant="outline"
        className="rounded-full shadow-lg gap-2"
        onClick={handleLocationCheck}
      >
        <MapPin className="h-4 w-4" />
        <span className="hidden sm:inline">Check Coverage</span>
      </Button>
    </div>
  )
}

export function MobileMenu() {
  const criticalLinks = [
    { href: '/services/water-damage', label: 'Water Damage' },
    { href: '/services/sewage-cleanup', label: 'Sewage Cleanup' },
    { href: '/services/mould-remediation', label: 'Mould Remediation' },
    { href: '/locations', label: 'Service Areas' },
    { href: '/contact', label: 'Contact' }
  ]

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Emergency Services</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          {criticalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 hover:text-blue-600 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <a href="tel:1300309361" className="block">
            <Button className="w-full gap-2 mt-4">
              <Phone className="h-4 w-4" />
              1300 309 361
            </Button>
          </a>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function EmergencyHeader() {
  return (
    <div className="bg-red-50 py-2 px-4 text-center">
      <p className="text-sm text-red-800">
        <span className="font-medium">24/7 Emergency Service:</span>
        {" "}
        <a 
          href="tel:1300309361" 
          className="underline hover:text-red-600 font-semibold"
        >
          1300 309 361
        </a>
      </p>
    </div>
  )
}

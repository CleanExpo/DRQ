"use client"

import Link from 'next/link'
import { siteNavigation } from '@/config/navigation'

export function Footer() {
  return (
    <footer className="border-t">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-3">Disaster Recovery QLD</h3>
            <p className="text-sm text-muted-foreground">
              24/7 Emergency restoration services across South East Queensland
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-3">Services</h4>
            <ul className="space-y-2">
              {siteNavigation.footerNav.services.map((service) => (
                <li key={service.href}>
                  <Link 
                    href={service.href} 
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3">Locations</h4>
            <ul className="space-y-2">
              {siteNavigation.footerNav.locations.map((location) => (
                <li key={location.href}>
                  <Link 
                    href={location.href} 
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {location.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3">Company</h4>
            <ul className="space-y-2">
              {siteNavigation.footerNav.company.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href} 
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3">Emergency Contact</h4>
            <Link 
              href="tel:1300309361" 
              className="text-sm font-semibold text-primary hover:text-primary/90"
            >
              1300 309 361
            </Link>
            <p className="text-sm text-muted-foreground mt-2">
              Available 24/7 for emergencies
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Disaster Recovery QLD. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

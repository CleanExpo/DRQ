"use client"

import Link from "next/link"
import { siteConfig } from "@/config/site"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
        </div>
        <div className="flex gap-4">
          {Object.entries(siteConfig.links).map(([platform, url]) => (
            <Link
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {platform.charAt(0).toUpperCase() + platform.slice(1)}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}

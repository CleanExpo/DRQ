"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Phone } from 'lucide-react'

const Header = () => {
  return (
    <header className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">Disaster Recovery QLD</h1>
          </div>
          <Button variant="destructive" size="sm">
            <Phone className="mr-2 h-4 w-4" />
            1300 309 361
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header
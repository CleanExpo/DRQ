"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Phone, ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800">
        <div 
          className="absolute inset-0 bg-black/50"
          style={{
            backgroundImage: `url('/images/hero-bg.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mixBlendMode: 'overlay'
          }}
        />
      </div>
      
      <div className="relative container mx-auto px-4">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            24/7 Emergency
            <span className="block text-red-500">Disaster Recovery</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-200 mb-8">
            Professional restoration services for water damage, fire damage, and mould remediation. 
            Fast response times across Brisbane and Gold Coast.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="bg-red-600 hover:bg-red-700 text-white gap-2 transform transition-all duration-300 hover:scale-105"
            >
              <Phone className="h-5 w-5" />
              Call 1300 309 361
            </Button>
            
            <Link href="/contact">
              <Button 
                variant="outline" 
                size="lg"
                className="bg-white/10 hover:bg-white/20 text-white gap-2 w-full sm:w-auto transform transition-all duration-300 hover:scale-105"
              >
                Request Service
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-white/10">
            <div className="transform transition-all duration-300 hover:translate-y-[-4px]">
              <div className="text-3xl font-bold text-white">15-30</div>
              <div className="text-sm text-gray-300">Minute Response</div>
            </div>
            <div className="transform transition-all duration-300 hover:translate-y-[-4px]">
              <div className="text-3xl font-bold text-white">24/7</div>
              <div className="text-sm text-gray-300">Emergency Service</div>
            </div>
            <div className="transform transition-all duration-300 hover:translate-y-[-4px]">
              <div className="text-3xl font-bold text-white">100%</div>
              <div className="text-sm text-gray-300">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

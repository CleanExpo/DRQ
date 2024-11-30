import React from 'react'
import Link from 'next/link'

interface HeroProps {
  title: string
  description: string
  primaryButton: {
    text: string
    href: string
  }
  secondaryButton?: {
    text: string
    href: string
  }
}

export const Hero = ({ title, description, primaryButton, secondaryButton }: HeroProps) => {
  return (
    <section className="bg-blue-900 text-white px-4 py-16 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          {title}
        </h1>
        <p className="text-xl mb-8">
          {description}
        </p>
        <div className="flex justify-center gap-4">
          <Link 
            href={primaryButton.href}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            {primaryButton.text}
          </Link>
          {secondaryButton && (
            <Link 
              href={secondaryButton.href}
              className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              {secondaryButton.text}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

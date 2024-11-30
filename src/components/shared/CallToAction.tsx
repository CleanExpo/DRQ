import React from 'react'
import Link from 'next/link'

interface CallToActionProps {
  title: string
  description: string
  buttonText: string
  buttonHref: string
  showPhoneNumber?: boolean
  isDark?: boolean
}

export const CallToAction = ({ 
  title, 
  description, 
  buttonText, 
  buttonHref,
  showPhoneNumber = true,
  isDark = false 
}: CallToActionProps) => {
  return (
    <section className={`${isDark ? 'bg-blue-900 text-white' : 'bg-gray-100'} px-4 py-16`}>
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">
          {title}
        </h2>
        <p className={`text-xl ${isDark ? '' : 'text-gray-600'} mb-8`}>
          {description}
        </p>
        <div className={`${showPhoneNumber ? 'flex justify-center gap-4' : ''}`}>
          <Link
            href={buttonHref}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
          >
            {buttonText}
          </Link>
          {showPhoneNumber && (
            <div className={`${isDark ? 'bg-white text-blue-900' : 'bg-blue-900 text-white'} px-8 py-4 rounded-lg font-semibold text-lg`}>
              Call: 1300 XXX XXX
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

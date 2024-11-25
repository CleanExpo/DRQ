"use client"

import { Breadcrumb } from "@/components/navigation/Breadcrumb"

interface PageTemplateProps {
  params: {
    locale: string
  }
  heading: string
  subheading?: string
  breadcrumbs?: Array<{
    label: string
    href: string
  }>
  children: React.ReactNode
}

export function PageTemplate({
  params,
  heading,
  subheading,
  breadcrumbs,
  children
}: PageTemplateProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{heading}</h1>
        {subheading && (
          <p className="text-xl text-gray-600">{subheading}</p>
        )}
      </div>
      {children}
    </div>
  )
}

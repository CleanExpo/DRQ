import { Breadcrumb } from '@/components/navigation/Breadcrumb'

interface PageTemplateProps {
  params: {
    locale: string
  }
  breadcrumbs: {
    label: string
    href: string
  }[]
  heading: string
  subheading?: string
  children: React.ReactNode
}

export function PageTemplate({
  params,
  breadcrumbs,
  heading,
  subheading,
  children
}: PageTemplateProps) {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4">
        <Breadcrumb items={breadcrumbs} />
        
        <header className="py-8 md:py-12">
          <h1 className="text-4xl font-bold mb-4">{heading}</h1>
          {subheading && (
            <p className="text-xl text-gray-600">{subheading}</p>
          )}
        </header>

        <main className="pb-16">
          {children}
        </main>
      </div>
    </div>
  )
}

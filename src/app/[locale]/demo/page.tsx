import Link from 'next/link';

export default function DemoPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  return (
    <div className="p-8 space-y-4">
      <div className="mb-8">
        <Link href={`/${locale}`} className="text-blue-600 hover:text-blue-800 underline">
          ← Back to Home
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Demo Components</h1>

      <div className="grid gap-4">
        <Link 
          href={`/${locale}/demo/toast`} 
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Toast Demo
        </Link>
      </div>
    </div>
  );
}

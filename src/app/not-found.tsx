import { translate } from '@/utils/i18n';
import { trackEmergencyContact } from '@/utils/analytics';

export default function NotFound() {
  // Default to English for the 404 page
  const locale = 'en-AU';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {translate('error.404.title', locale)}
        </h1>
        <p className="text-gray-600 mb-8">
          {translate('error.404.description', locale)}
        </p>
        
        {/* Emergency Services Box */}
        <div className="bg-red-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-red-900 mb-2">
            {translate('emergency.need-help', locale)}
          </h2>
          <p className="text-red-800 mb-4">
            {translate('emergency.available', locale)}
          </p>
          <a
            href="tel:1300309361"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            onClick={() => trackEmergencyContact('form', '404-page-call')}
          >
            {translate('emergency.call', locale)}: 1300 309 361
          </a>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            {translate('error.404.quick-links', locale)}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="/services/water-damage"
              className="block p-4 bg-blue-50 rounded-lg text-blue-700 hover:bg-blue-100"
            >
              {translate('service.water-damage', locale)}
            </a>
            <a
              href="/services/fire-damage"
              className="block p-4 bg-red-50 rounded-lg text-red-700 hover:bg-red-100"
            >
              {translate('service.fire-damage', locale)}
            </a>
            <a
              href="/services/mould-remediation"
              className="block p-4 bg-green-50 rounded-lg text-green-700 hover:bg-green-100"
            >
              {translate('service.mould-remediation', locale)}
            </a>
            <a
              href="/service-areas"
              className="block p-4 bg-gray-50 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              {translate('navigation.service-areas', locale)}
            </a>
          </div>
        </div>

        {/* Return Home */}
        <div className="mt-8">
          <a
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {translate('error.home', locale)}
          </a>
        </div>
      </div>
    </div>
  );
}

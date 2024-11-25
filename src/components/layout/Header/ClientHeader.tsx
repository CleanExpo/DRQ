'use client';

import { useClient } from '@/components/providers/ClientProvider';
import { EmergencyButton } from '@/components/common/EmergencyButton';
import { NavigationMenu } from './NavigationMenu';
import { Locale } from '@/config/i18n.config';

interface EmergencyContact {
  phone: string;
  available: boolean;
}

interface LocaleInfo {
  code: Locale;
  name: string;
  direction: 'rtl' | 'ltr';
}

interface ClientHeaderProps {
  currentLanguage: Locale;
  availableLanguages: LocaleInfo[];
  emergency: EmergencyContact;
}

export const ClientHeader: React.FC<ClientHeaderProps> = ({
  currentLanguage,
  availableLanguages,
  emergency
}) => {
  const { navigate } = useClient();

  return (
    <header className="bg-white shadow-md relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/')}
              className="text-xl font-bold text-gray-900 bg-transparent border-none cursor-pointer"
            >
              Disaster Recovery QLD
            </button>
          </div>

          <NavigationMenu />

          <div className="flex items-center">
            {emergency.available && (
              <EmergencyButton phone={emergency.phone} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

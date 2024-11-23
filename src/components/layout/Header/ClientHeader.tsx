'use client';

import { Header } from './Header';
import { Locale } from '../../../config/i18n.config';

interface ClientHeaderProps {
  currentLanguage: Locale;
  availableLanguages: readonly Locale[];
  emergency: {
    phone: string;
    available: boolean;
  };
}

export const ClientHeader = (props: ClientHeaderProps) => {
  return <Header {...props} />;
};

export default ClientHeader;

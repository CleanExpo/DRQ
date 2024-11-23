import { redirect } from 'next/navigation';
import { i18nConfig } from '../config/i18n.config';

export default function RootPage() {
  // Redirect root to default locale
  redirect(`/${i18nConfig.defaultLocale}`);
}

// Create the actual home page in the default locale directory
export const runtime = 'edge';

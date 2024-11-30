'use client';

import { useEffect } from 'react';
import { initializeMonitoring } from '../../config/monitoring';

export function MonitoringProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Initialize monitoring only on the client side
    if (typeof window !== 'undefined') {
      initializeMonitoring();
    }
  }, []);

  return <>{children}</>;
}

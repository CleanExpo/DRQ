'use client';

import { ReactNode, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';

interface ClientContextType {
  navigate: (path: string) => void;
  handleCall: (phone: string) => void;
}

const ClientContext = createContext<ClientContextType>({
  navigate: () => {},
  handleCall: () => {},
});

export const useClient = () => useContext(ClientContext);

interface ClientProviderProps {
  children: ReactNode;
}

export const ClientProvider: React.FC<ClientProviderProps> = ({ children }) => {
  const router = useRouter();

  const navigate = (path: string) => {
    router.push(path);
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <ClientContext.Provider value={{ navigate, handleCall }}>
      {children}
    </ClientContext.Provider>
  );
};

/**
 * Contexto para el modo Mock
 * Permite a los componentes saber si están en modo mock
 */
import React, { createContext, useContext, ReactNode } from 'react';

interface MockContextType {
  useMock: boolean;
}

const MockContext = createContext<MockContextType>({ useMock: false });

interface MockProviderProps {
  useMock: boolean;
  children: ReactNode;
}

export const MockProvider: React.FC<MockProviderProps> = ({ useMock, children }) => {
  return (
    <MockContext.Provider value={{ useMock }}>
      {children}
    </MockContext.Provider>
  );
};

/**
 * Hook para usar el contexto de mock
 * @returns El contexto de mock con useMock boolean
 */
export const useMockContext = (): MockContextType => {
  const context = useContext(MockContext);
  return context;
};

export default MockContext;

'use client';

import { ReactNode, useMemo } from 'react';
import { initializeFirebase } from '.';
import { FirebaseProvider } from './provider';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const firebaseApp = useMemo(() => {
    if (typeof window !== 'undefined') {
      return initializeFirebase();
    }
    return null;
  }, []);

  if (!firebaseApp) {
    // Return a loading state or null on the server
    return null; 
  }

  return <FirebaseProvider {...firebaseApp}>{children}</FirebaseProvider>;
}

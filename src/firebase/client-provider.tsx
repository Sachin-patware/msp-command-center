'use client';

import { ReactNode, useEffect, useState } from 'react';
import { initializeFirebase } from '.';
import { FirebaseProvider } from './provider';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

type FirebaseInstances = {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
};

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const [firebase, setFirebase] = useState<FirebaseInstances | null>(null);

  useEffect(() => {
    // Firebase should only be initialized on the client.
    if (typeof window !== 'undefined') {
      setFirebase(initializeFirebase());
    }
  }, []);

  if (!firebase) {
    // You can return a loader here if you'd like.
    return null;
  }

  return <FirebaseProvider {...firebase}>{children}</FirebaseProvider>;
}

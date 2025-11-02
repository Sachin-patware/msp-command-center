'use client';

import { createContext, useContext, ReactNode, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { ErrorBoundary } from 'react-error-boundary';
import { errorEmitter } from './error-emitter';

interface FirebaseContextType {
  app: FirebaseApp | null;
  auth: Auth | null;
  db: Firestore | null;
}

const FirebaseContext = createContext<FirebaseContextType>({ app: null, auth: null, db: null });

function FirebaseErrorListener({ children }: { children: ReactNode }) {
  useEffect(() => {
    const handlePermissionError = (error: any) => {
      // This will be caught by the ErrorBoundary and displayed in the dev overlay
      throw error;
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, []);

  return <>{children}</>;
}


export const FirebaseProvider = ({
  children,
  app,
  auth,
  db,
}: {
  children: ReactNode;
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
}) => {
  return (
    <FirebaseContext.Provider value={{ app, auth, db }}>
       <ErrorBoundary
        fallbackRender={({ error }) => (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-lg border border-destructive bg-card p-6 shadow-2xl">
              <h2 className="text-lg font-semibold text-destructive">Firestore Permission Error</h2>
              <pre className="mt-4 whitespace-pre-wrap rounded-md bg-muted p-4 text-sm text-destructive-foreground">
                <code>{error.toString()}</code>
              </pre>
            </div>
          </div>
        )}
      >
        <FirebaseErrorListener>
          {children}
        </FirebaseErrorListener>
      </ErrorBoundary>
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);

export const useFirebaseApp = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebaseApp must be used within a FirebaseProvider');
  }
  return context.app;
};

export const useAuth = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a FirebaseProvider');
  }
  return { auth: context.auth };
};

export const useFirestore = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirestore must be used within a FirebaseProvider');
  }
  return { db: context.db };
};

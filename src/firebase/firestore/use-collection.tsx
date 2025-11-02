'use client';

import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  Query,
  DocumentData,
  query,
  where,
  QueryConstraint,
} from 'firebase/firestore';
import { useFirestore } from '../provider';

interface UseCollectionOptions {
  constraints?: QueryConstraint[];
}

export function useCollection<T = DocumentData>(
  collectionName: string,
  options?: UseCollectionOptions
) {
  const { db } = useFirestore();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    let q: Query<DocumentData>;
    if (options?.constraints) {
      q = query(collection(db, collectionName), ...options.constraints);
    } else {
      q = query(collection(db, collectionName));
    }
    
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const documents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        setData(documents);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db, collectionName, options?.constraints]);

  return { data, loading, error };
}

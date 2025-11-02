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
  collectionNameOrPath: string | undefined,
  options?: UseCollectionOptions
) {
  const { db } = useFirestore();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!db || !collectionNameOrPath) {
      setLoading(false);
      // It's not an error if the path is not ready yet, so we just return an empty array.
      setData([]);
      return;
    }

    let q: Query<DocumentData>;
    if (options?.constraints) {
      q = query(collection(db, collectionNameOrPath), ...options.constraints);
    } else {
      q = query(collection(db, collectionNameOrPath));
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
        console.error(`Error fetching collection ${collectionNameOrPath}:`, err)
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db, collectionNameOrPath, options?.constraints]);

  return { data, loading, error };
}

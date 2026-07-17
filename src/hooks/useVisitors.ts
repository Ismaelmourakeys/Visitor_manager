import { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Visitor } from '../types/visitor';

export function useVisitors(churchId: string | undefined) {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Se não tem churchId (usuário não logado), não faz nada
    if (!churchId) {
      setLoading(false);
      return;
    }

    const visitorsRef = collection(db, 'churches', churchId, 'visitors');
    const q = query(visitorsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Visitor[];

      setVisitors(data);
      setLoading(false);
    });

    return unsubscribe;
  }, [churchId]); // roda de novo quando churchId mudar

  async function addVisitor(visitor: Omit<Visitor, 'id'>) {
    if (!churchId) return;

    const visitorsRef = collection(db, 'churches', churchId, 'visitors');
    await addDoc(visitorsRef, {
      ...visitor,
      createdAt: serverTimestamp(),
    });
  }

  return { visitors, loading, addVisitor };
}